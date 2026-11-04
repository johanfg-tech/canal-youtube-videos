// Subida a TikTok con la Content Posting API.
//
// Dos modos:
//   directo   publica en el perfil (scope video.publish). Mientras la app no pase la auditoría de TikTok,
//             solo se permite "privado" (SELF_ONLY).
//   borrador  manda el vídeo a la bandeja de TikTok (scope video.upload); tú lo terminas y publicas
//             desde la app del móvil con la privacidad que quieras.
//
// Variables de entorno:
//   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET   de tu app en developers.tiktok.com
//   TIKTOK_REDIRECT_URI                       la misma URL registrada en la app (solo para autorizar)
//   TIKTOK_REFRESH_TOKEN                      opcional: si no hay archivo de tokens, se usa este
//   TIKTOK_TOKEN_FILE                         opcional: dónde guardar los tokens (ver rutaTokens)
//
// Dominios que el entorno debe permitir: open.tiktokapis.com, open-upload.tiktokapis.com y el regional que devuelva TikTok (p. ej. open-upload-sg.tiktokapis.com)

import { existsSync, readFileSync } from "node:fs";
import { open, stat } from "node:fs/promises";
import { conectar, env, esperar, fallar, guardarPrivado, rutaAbsoluta, tamanoLegible } from "./comun.mjs";

const API = "https://open.tiktokapis.com/v2";
const MB = 1024 * 1024;
const PRIVACIDADES = {
  publico: "PUBLIC_TO_EVERYONE",
  amigos: "MUTUAL_FOLLOW_FRIENDS",
  seguidores: "FOLLOWER_OF_CREATOR",
  privado: "SELF_ONLY",
};
const AYUDA = "Mira docs/PUBLICAR.md, sección TikTok.";

// Los tokens de TikTok se renuevan solos (el de acceso dura 24 h y el de refresco 1 año y puede cambiar),
// así que se guardan en un archivo privado. En la nube, la carpeta de archivos del proyecto persiste
// entre sesiones; en local se usa .credenciales/ (ignorada por git).
export const rutaTokens = () =>
  process.env.TIKTOK_TOKEN_FILE ||
  (existsSync("/mnt/project-files") ? "/mnt/project-files/.credenciales/tiktok.json" : rutaAbsoluta(".credenciales/tiktok.json"));

const leerTokens = () => {
  const ruta = rutaTokens();
  if (existsSync(ruta)) return JSON.parse(readFileSync(ruta, "utf8"));
  if (process.env.TIKTOK_REFRESH_TOKEN) return { refresh_token: process.env.TIKTOK_REFRESH_TOKEN };
  return fallar(`No hay tokens de TikTok. Autoriza primero con: npm run tiktok:autorizar. ${AYUDA}`);
};

export const guardarTokens = (datos) => {
  const ahora = Date.now();
  const tokens = {
    open_id: datos.open_id,
    scope: datos.scope,
    access_token: datos.access_token,
    access_caduca: new Date(ahora + datos.expires_in * 1000).toISOString(),
    refresh_token: datos.refresh_token,
    refresh_caduca: new Date(ahora + datos.refresh_expires_in * 1000).toISOString(),
  };
  guardarPrivado(rutaTokens(), tokens);
  return tokens;
};

export const pedirToken = async (parametros) => {
  const res = await conectar(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY", AYUDA),
      client_secret: env("TIKTOK_CLIENT_SECRET", AYUDA),
      ...parametros,
    }),
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok || datos.error || !datos.access_token) {
    fallar(`TikTok no dio un token (${res.status}): ${datos.error_description ?? datos.error ?? JSON.stringify(datos)}`);
  }
  return guardarTokens(datos);
};

const tokenAcceso = async () => {
  const tokens = leerTokens();
  if (tokens.access_token && new Date(tokens.access_caduca) - Date.now() > 5 * 60 * 1000) return tokens;
  if (tokens.refresh_caduca && new Date(tokens.refresh_caduca) < new Date()) {
    fallar("El token de refresco de TikTok caducó (dura 1 año). Vuelve a autorizar con npm run tiktok:autorizar.");
  }
  return pedirToken({ grant_type: "refresh_token", refresh_token: tokens.refresh_token });
};

const llamar = async (token, ruta, cuerpo = {}) => {
  const res = await conectar(`${API}${ruta}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(cuerpo),
  });
  const datos = await res.json().catch(() => ({}));
  const codigo = datos.error?.code;
  if (res.ok && (!codigo || codigo === "ok")) return datos.data;
  const explicaciones = {
    unaudited_client_can_only_post_to_private_accounts:
      'Tu app aún no pasó la auditoría de TikTok: en modo directo solo puede publicar con privacidad "privado" y en cuentas privadas. Usa el modo "borrador" o pide la auditoría.',
    privacy_level_option_mismatch: "Esa privacidad no está permitida para esta cuenta ahora mismo.",
    scope_not_authorized: 'El token no tiene el permiso necesario. El modo "directo" necesita video.publish y "borrador" video.upload; vuelve a autorizar.',
    spam_risk_too_many_posts: "TikTok: alcanzaste el límite diario de publicaciones de la cuenta.",
    spam_risk_too_many_pending_share: "TikTok: hay demasiados borradores pendientes en la bandeja (máximo 5 en 24 h). Publica o descarta alguno en la app.",
    reached_active_user_cap: "TikTok: la app alcanzó su cupo diario de usuarios.",
    rate_limit_exceeded: "TikTok: demasiadas peticiones; espera un minuto.",
    access_token_invalid: "El token de TikTok no es válido; vuelve a autorizar con npm run tiktok:autorizar.",
  };
  fallar(`TikTok (${res.status}, ${codigo ?? "sin código"}): ${explicaciones[codigo] ?? datos.error?.message ?? JSON.stringify(datos)}`);
};

// TikTok: trozos de 5 a 64 MB; el último absorbe el resto. Menos de 64 MB va en un solo trozo.
export const planTrozos = (total) => {
  if (total <= 64 * MB) return { chunk_size: total, total_chunk_count: 1 };
  const chunk_size = 32 * MB;
  return { chunk_size, total_chunk_count: Math.floor(total / chunk_size) };
};

const subirTrozos = async (url, ruta, total, { chunk_size, total_chunk_count }) => {
  const archivo = await open(ruta, "r");
  try {
    for (let i = 0; i < total_chunk_count; i++) {
      const inicio = i * chunk_size;
      const fin = i === total_chunk_count - 1 ? total : inicio + chunk_size;
      const buf = Buffer.alloc(fin - inicio);
      await archivo.read(buf, 0, buf.length, inicio);
      for (let intento = 1; ; intento++) {
        let motivo = "";
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "video/mp4", "Content-Length": String(buf.length), "Content-Range": `bytes ${inicio}-${fin - 1}/${total}` },
          body: new Blob([buf]), // Blob: con un Buffer, fetch tras el proxy falla (ArrayBuffer "detached")
        }).catch((e) => { motivo = e.cause?.message ?? e.message; return null; });
        if (res && (res.status === 201 || res.status === 206)) break;
        if (res && res.status < 500) fallar(`TikTok rechazó el trozo ${i + 1}/${total_chunk_count} (${res.status}): ${await res.text()}`);
        if (res) motivo = `HTTP ${res.status}`;
        if (intento >= 4) {
          const host = new URL(url).host;
          const pista = /ENOTFOUND|403|tunnel/i.test(motivo) ? ` Si estás en el entorno en la nube, añade ${host} a los dominios permitidos.` : "";
          fallar(`La subida a TikTok (${host}) falló varias veces seguidas: ${motivo}.${pista}`);
        }
        await esperar(2000 * intento);
      }
      process.stdout.write(`\r  Subiendo a TikTok: ${Math.round((fin / total) * 100)}%   `);
    }
    process.stdout.write("\n");
  } finally {
    await archivo.close();
  }
};

export const opcionesTikTok = (ficha) => {
  const tt = ficha.tiktok ?? {};
  const modo = tt.modo ?? "borrador";
  if (!["directo", "borrador"].includes(modo)) fallar(`tiktok.modo no válido: ${modo} (usa directo o borrador).`);
  const texto = (tt.texto ?? [ficha.titulo, ...(ficha.etiquetas ?? []).map((e) => `#${e.replace(/\s+/g, "")}`)].filter(Boolean).join(" ")).trim();
  if (texto.length > 2200) fallar(`El texto de TikTok tiene ${texto.length} caracteres (máximo 2200).`);
  const privacidad = PRIVACIDADES[tt.privacidad ?? "privado"] ?? fallar(`tiktok.privacidad no válida: ${tt.privacidad} (usa publico, amigos, seguidores o privado).`);
  return { modo, texto, privacidad, tt };
};

export const publicarEnTikTok = async (ficha) => {
  const { modo, texto, privacidad, tt } = opcionesTikTok(ficha);
  const ruta = rutaAbsoluta(ficha.video);
  const { size } = await stat(ruta).catch(() => fallar(`No existe el vídeo ${ficha.video}. ¿Lo renderizaste?`));
  if (size > 4 * 1024 * MB) fallar("TikTok admite vídeos de hasta 4 GB.");
  const { access_token: token } = await tokenAcceso();
  const trozos = planTrozos(size);
  const source_info = { source: "FILE_UPLOAD", video_size: size, ...trozos };

  let init;
  if (modo === "directo") {
    const creador = await llamar(token, "/post/publish/creator_info/query/");
    const permitidas = creador.privacy_level_options ?? [];
    if (!permitidas.includes(privacidad)) {
      fallar(`TikTok no permite la privacidad ${privacidad} en esta cuenta. Permitidas: ${permitidas.join(", ") || "ninguna"}.`);
    }
    console.log(`  TikTok (directo, ${privacidad}) como @${creador.creator_username} (${tamanoLegible(size)})`);
    init = await llamar(token, "/post/publish/video/init/", {
      post_info: {
        title: texto,
        privacy_level: privacidad,
        disable_comment: creador.comment_disabled || tt.comentarios === false,
        disable_duet: creador.duet_disabled || tt.duo === false,
        disable_stitch: creador.stitch_disabled || tt.stitch === false,
        video_cover_timestamp_ms: tt.portada_ms ?? 1000,
        is_aigc: Boolean(tt.ia),
        brand_content_toggle: false,
        brand_organic_toggle: Boolean(tt.marca_propia),
      },
      source_info,
    });
  } else {
    console.log(`  TikTok (borrador a la bandeja de la app, ${tamanoLegible(size)})`);
    init = await llamar(token, "/post/publish/inbox/video/init/", { source_info });
  }

  await subirTrozos(init.upload_url, ruta, size, trozos);

  // Esperar a que TikTok procese el vídeo.
  for (let i = 0; i < 40; i++) {
    await esperar(i < 5 ? 3000 : 10000);
    const estado = await llamar(token, "/post/publish/status/fetch/", { publish_id: init.publish_id });
    if (estado.status === "FAILED") fallar(`TikTok no pudo procesar el vídeo: ${estado.fail_reason}`);
    if (estado.status === "SEND_TO_USER_INBOX") {
      return { publish_id: init.publish_id, estado: "En tu bandeja de TikTok: abre la notificación en la app para terminar y publicar." };
    }
    if (estado.status === "PUBLISH_COMPLETE") {
      const id = estado.publicaly_available_post_id?.[0];
      return { publish_id: init.publish_id, estado: "Publicado", url: id ? `https://www.tiktok.com/video/${id}` : undefined };
    }
  }
  return { publish_id: init.publish_id, estado: "Sigue procesándose en TikTok; revisa la app en unos minutos." };
};
