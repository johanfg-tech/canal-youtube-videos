// Subida a YouTube con la YouTube Data API v3 (subida reanudable + miniatura + subtítulos).
//
// Variables de entorno:
//   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET   cliente OAuth de Google Cloud
//   YOUTUBE_REFRESH_TOKEN                      token de larga duración de tu canal (OAuth Playground)
//
// Dominios que el entorno debe permitir: oauth2.googleapis.com, www.googleapis.com

import { open, readFile, stat } from "node:fs/promises";
import { extname } from "node:path";
import { conectar, env, esperar, fallar, rutaAbsoluta, tamanoLegible } from "./comun.mjs";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const UPLOAD = "https://www.googleapis.com/upload/youtube/v3";
const TROZO = 8 * 1024 * 1024; // múltiplo de 256 KB, como pide la API
const PRIVACIDADES = { privado: "private", oculto: "unlisted", publico: "public", private: "private", unlisted: "unlisted", public: "public" };

const tokenAcceso = async () => {
  const ayuda = "Mira docs/PUBLICAR.md, sección YouTube.";
  const res = await conectar(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("YOUTUBE_CLIENT_ID", ayuda),
      client_secret: env("YOUTUBE_CLIENT_SECRET", ayuda),
      refresh_token: env("YOUTUBE_REFRESH_TOKEN", ayuda),
      grant_type: "refresh_token",
    }),
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (datos.error === "invalid_grant") {
      fallar(
        "Google rechazó YOUTUBE_REFRESH_TOKEN (invalid_grant). Suele pasar si la app de OAuth sigue en modo " +
          '"Testing" (los tokens caducan a los 7 días) o si revocaste el acceso. Genera uno nuevo (docs/PUBLICAR.md).',
      );
    }
    fallar(`Google no dio un token de acceso (${res.status}): ${JSON.stringify(datos)}`);
  }
  return datos.access_token;
};

const errorApi = async (res, que) => {
  const texto = await res.text();
  let motivo = "";
  try {
    motivo = JSON.parse(texto).error?.errors?.[0]?.reason ?? "";
  } catch {}
  if (motivo === "quotaExceeded" || motivo === "uploadLimitExceeded") {
    fallar(`YouTube: cuota diaria agotada al ${que} (${motivo}). Se renueva a medianoche, hora del Pacífico.`);
  }
  if (motivo === "youtubeSignupRequired") fallar("La cuenta de Google autorizada no tiene canal de YouTube.");
  fallar(`YouTube respondió ${res.status} al ${que}: ${texto}`);
};

// Construye el recurso "video" a partir de la ficha. Se exporta para el modo --simular.
export const recursoVideo = (ficha) => {
  const yt = ficha.youtube ?? {};
  const titulo = (yt.titulo ?? ficha.titulo ?? "").trim();
  if (!titulo) fallar('La ficha necesita "titulo" (o youtube.titulo).');
  if (titulo.length > 100) fallar(`El título de YouTube tiene ${titulo.length} caracteres (máximo 100).`);
  if (/[<>]/.test(titulo)) fallar("El título de YouTube no puede contener < ni >.");
  const descripcion = yt.descripcion ?? ficha.descripcion ?? "";
  if (Buffer.byteLength(descripcion) > 5000) fallar("La descripción de YouTube supera los 5000 bytes.");
  const etiquetas = yt.etiquetas ?? ficha.etiquetas ?? [];
  if (etiquetas.join(",").length > 500) fallar("Las etiquetas de YouTube suman más de 500 caracteres.");

  const privacidad = PRIVACIDADES[yt.privacidad ?? "privado"] ?? fallar(`youtube.privacidad no válida: ${yt.privacidad} (usa privado, oculto o publico).`);
  const status = {
    privacyStatus: privacidad,
    selfDeclaredMadeForKids: Boolean(yt.infantil),
  };
  if (yt.programar) {
    const fecha = new Date(yt.programar);
    if (Number.isNaN(fecha.getTime())) fallar(`youtube.programar no es una fecha válida: ${yt.programar}`);
    if (fecha <= new Date()) fallar(`youtube.programar (${yt.programar}) ya pasó.`);
    status.privacyStatus = "private"; // YouTube exige "private" para programar
    status.publishAt = fecha.toISOString();
  }
  if (yt.ia !== undefined) status.containsSyntheticMedia = Boolean(yt.ia);

  return {
    snippet: {
      title: titulo,
      description: descripcion,
      tags: etiquetas,
      categoryId: String(yt.categoria ?? "22"), // 22 = Gente y blogs; 27 = Educación; 24 = Entretenimiento
      defaultLanguage: yt.idioma ?? "es",
      defaultAudioLanguage: yt.idioma ?? "es",
    },
    status,
  };
};

const subirArchivo = async (token, sesion, ruta, total) => {
  const archivo = await open(ruta, "r");
  try {
    let enviado = 0;
    let fallos = 0;
    while (true) {
      const fin = Math.min(enviado + TROZO, total);
      const buf = Buffer.alloc(fin - enviado);
      await archivo.read(buf, 0, buf.length, enviado);
      let res;
      try {
        res = await fetch(sesion, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Length": String(buf.length), "Content-Range": `bytes ${enviado}-${fin - 1}/${total}` },
          body: buf,
        });
      } catch {
        res = null;
      }
      if (res && (res.status === 200 || res.status === 201)) return res.json();
      if (res && res.status === 308) {
        const rango = res.headers.get("range");
        enviado = rango ? Number(rango.split("-")[1]) + 1 : 0;
        fallos = 0;
        process.stdout.write(`\r  Subiendo a YouTube: ${Math.round((enviado / total) * 100)}%   `);
        continue;
      }
      if (res && res.status < 500 && res.status !== 429) await errorApi(res, "subir el vídeo");
      // Error de red o 5xx: preguntar hasta dónde llegó y reanudar.
      if (++fallos > 6) fallar("La subida a YouTube falló varias veces seguidas. Vuelve a intentarlo más tarde.");
      await esperar(2000 * 2 ** (fallos - 1));
      const estado = await fetch(sesion, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Range": `bytes */${total}` } }).catch(() => null);
      if (estado && (estado.status === 200 || estado.status === 201)) return estado.json();
      if (estado?.status === 308) {
        const rango = estado.headers.get("range");
        enviado = rango ? Number(rango.split("-")[1]) + 1 : 0;
      }
    }
  } finally {
    await archivo.close();
  }
};

const subirMiniatura = async (token, videoId, ruta) => {
  const tipo = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" }[extname(ruta).toLowerCase()];
  if (!tipo) fallar("La miniatura debe ser PNG o JPG.");
  const datos = await readFile(rutaAbsoluta(ruta));
  if (datos.length > 2 * 1024 * 1024) fallar("La miniatura supera 2 MB (límite de YouTube).");
  const res = await conectar(`${UPLOAD}/thumbnails/set?videoId=${videoId}&uploadType=media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": tipo },
    body: datos,
  });
  if (res.status === 403) {
    console.warn("  ⚠ YouTube no aceptó la miniatura (403). Para miniaturas personalizadas el canal debe estar verificado por teléfono.");
    return false;
  }
  if (!res.ok) await errorApi(res, "poner la miniatura");
  return true;
};

const subirSubtitulos = async (token, videoId, ruta, idioma) => {
  const limite = "limite" + Math.random().toString(36).slice(2);
  const meta = JSON.stringify({ snippet: { videoId, language: idioma, name: "" } });
  const srt = await readFile(rutaAbsoluta(ruta));
  const cuerpo = Buffer.concat([
    Buffer.from(`--${limite}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${limite}\r\nContent-Type: application/octet-stream\r\n\r\n`),
    srt,
    Buffer.from(`\r\n--${limite}--`),
  ]);
  const res = await conectar(`${UPLOAD}/captions?uploadType=multipart&part=snippet`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${limite}` },
    body: cuerpo,
  });
  if (!res.ok) await errorApi(res, "subir los subtítulos");
};

export const publicarEnYouTube = async (ficha) => {
  const recurso = recursoVideo(ficha);
  const ruta = rutaAbsoluta(ficha.video);
  const { size } = await stat(ruta).catch(() => fallar(`No existe el vídeo ${ficha.video}. ¿Lo renderizaste?`));
  const token = await tokenAcceso();

  console.log(`  YouTube: "${recurso.snippet.title}" (${tamanoLegible(size)}, ${recurso.status.publishAt ? `programado ${recurso.status.publishAt}` : recurso.status.privacyStatus})`);
  const inicio = await conectar(`${UPLOAD}/videos?uploadType=resumable&part=snippet,status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(size),
      "X-Upload-Content-Type": "video/mp4",
    },
    body: JSON.stringify(recurso),
  });
  if (!inicio.ok) await errorApi(inicio, "crear la subida");
  const sesion = inicio.headers.get("location");
  const video = await subirArchivo(token, sesion, ruta, size);
  process.stdout.write("\n");

  const yt = ficha.youtube ?? {};
  const extras = [];
  if (yt.miniatura && (await subirMiniatura(token, video.id, yt.miniatura))) extras.push("miniatura");
  if (yt.subtitulos) {
    await subirSubtitulos(token, video.id, yt.subtitulos, yt.idioma ?? "es");
    extras.push("subtítulos");
  }
  return { id: video.id, url: `https://youtu.be/${video.id}`, estado: video.status?.uploadStatus, extras };
};
