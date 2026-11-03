#!/usr/bin/env node
// Genera la narración (voz en off) de un guion con ElevenLabs y deja todo listo para Remotion.
//
//   npm run narrar -- guiones/ejemplo-short.json            -> voz real (necesita ELEVENLABS_API_KEY)
//   npm run narrar -- guiones/ejemplo-short.json --borrador -> sin API: audio en silencio y tiempos
//                                                              estimados, solo para probar el diseño
//   npm run narrar -- --listar-voces                        -> voces de tu cuenta con su ID
//
// Salida (no se sube al repo):
//   public/narracion/<nombre>/NN.mp3   un audio por segmento (gancho, cada punto, CTA...)
//   out/<nombre>.props.json            props para `npx remotion render ... --props=out/<nombre>.props.json`
//   out/<nombre>.srt                   subtítulos para subir a YouTube
//
// Variables de entorno (en el entorno de Claude o en un archivo .env local, nunca en el repo):
//   ELEVENLABS_API_KEY   obligatoria para la voz real
//   ELEVENLABS_VOICE_ID  voz a usar (también con --voz <id> o "voz" en el guion)
//   ELEVENLABS_MODEL     opcional, por defecto eleven_multilingual_v2

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const API = "https://api.elevenlabs.io/v1";
const FORMATO = "mp3_44100_128"; // 128 kbps CBR: la duración sale del tamaño del archivo
const INICIO_VOZ_MS = 300; // igual que INICIO_VOZ_S en las plantillas
const PAUSA_MS = 350;

const cargarEnv = () => {
  if (!existsSync(".env")) return;
  for (const linea of readFileSync(".env", "utf8").split("\n")) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};

const salir = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

const clave = () => process.env.ELEVENLABS_API_KEY || salir("Falta ELEVENLABS_API_KEY (mira el README, sección Narración).");

const pedir = async (ruta, opciones = {}, intentos = 4) => {
  for (let i = 1; ; i++) {
    let res;
    try {
      res = await fetch(`${API}${ruta}`, {
        ...opciones,
        headers: { "xi-api-key": clave(), "Content-Type": "application/json", ...opciones.headers },
      });
    } catch (e) {
      salir(`No se pudo conectar con api.elevenlabs.io (${e.cause?.code ?? e.message}). ¿Está permitido ese dominio en la red del entorno?`);
    }
    if (res.ok) return res.json();
    const cuerpo = await res.text();
    if ((res.status === 429 || res.status >= 500) && i < intentos) {
      await new Promise((r) => setTimeout(r, 2000 * i));
      continue;
    }
    if (res.status === 401) salir(`ElevenLabs rechazó la clave (401). ${cuerpo}`);
    salir(`ElevenLabs respondió ${res.status}: ${cuerpo}`);
  }
};

// Segmentos que narra cada plantilla, en el orden en que aparecen en pantalla.
// "locucion" en el guion permite decir algo distinto (más largo) de lo que se lee en pantalla.
const segmentosDe = (guion) => {
  const l = guion.locucion ?? {};
  switch (guion.composicion) {
    case "ShortVideo":
      return [l.hook ?? guion.hook, ...guion.points.map((p, i) => l.points?.[i] ?? p), l.cta ?? guion.cta];
    case "IntroVideo":
      return [l.title ?? guion.title, l.subtitle ?? guion.subtitle];
    default:
      return salir(`Composición desconocida: ${guion.composicion}. Usa "ShortVideo" o "IntroVideo".`);
  }
};

// ElevenLabs devuelve el tiempo de cada carácter; aquí se agrupan en palabras con el formato
// Caption de @remotion/captions (texto con el espacio delante, como espera createTikTokStyleCaptions).
const palabrasDesdeAlineacion = ({ characters, character_start_times_seconds: ini, character_end_times_seconds: fin }) => {
  const palabras = [];
  let actual = null;
  characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      actual = null;
      return;
    }
    if (!actual) {
      actual = { text: (palabras.length ? " " : "") + c, startMs: ini[i] * 1000, endMs: fin[i] * 1000 };
      palabras.push(actual);
    } else {
      actual.text += c;
      actual.endMs = fin[i] * 1000;
    }
  });
  return palabras.map((p) => ({
    text: p.text,
    startMs: Math.round(p.startMs),
    endMs: Math.round(p.endMs),
    timestampMs: Math.round((p.startMs + p.endMs) / 2),
    confidence: null,
  }));
};

const narrarConElevenLabs = async (texto, anterior, siguiente, voz, modelo, ajustes) => {
  const r = await pedir(`/text-to-speech/${voz}/with-timestamps?output_format=${FORMATO}`, {
    method: "POST",
    body: JSON.stringify({
      text: texto,
      model_id: modelo,
      previous_text: anterior || undefined, // da continuidad a la entonación entre segmentos
      next_text: siguiente || undefined,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true, ...ajustes },
    }),
  });
  const audio = Buffer.from(r.audio_base64, "base64");
  const subtitulos = palabrasDesdeAlineacion(r.alignment);
  const porTamano = (audio.length * 8) / 128; // ms
  const ultimo = subtitulos.at(-1)?.endMs ?? 0;
  return { audio, ext: "mp3", duracionMs: Math.ceil(Math.max(porTamano, ultimo + 80)), subtitulos };
};

// Modo borrador: sin llamar a la API. ~14 caracteres por segundo y un WAV en silencio.
const narrarBorrador = (texto) => {
  const MS_POR_CARACTER = 70;
  let t = 0;
  const subtitulos = texto
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => {
      const dur = Math.max(180, w.length * MS_POR_CARACTER);
      const c = { text: (i ? " " : "") + w, startMs: t, endMs: t + dur, timestampMs: t + dur / 2, confidence: null };
      t += dur + 40;
      return c;
    });
  const duracionMs = t + 100;
  const muestras = Math.ceil((duracionMs / 1000) * 22050);
  const wav = Buffer.alloc(44 + muestras * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + muestras * 2, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(22050, 24);
  wav.writeUInt32LE(44100, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(muestras * 2, 40);
  return { audio: wav, ext: "wav", duracionMs, subtitulos };
};

const srtTiempo = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(Math.round(ms) % 1000, 3)}`;
};

// Líneas de subtítulo de ~7 palabras, cortando también en puntos y comas.
const generarSrt = (segmentos) => {
  const lineas = [];
  let offset = INICIO_VOZ_MS;
  for (const s of segmentos) {
    let linea = [];
    const cerrar = () => {
      if (!linea.length) return;
      lineas.push({
        ini: offset + linea[0].startMs,
        fin: offset + linea.at(-1).endMs,
        texto: linea.map((p) => p.text).join("").trim(),
      });
      linea = [];
    };
    for (const p of s.subtitulos) {
      linea.push(p);
      if (linea.length >= 7 || /[.,;:!?…]$/.test(p.text)) cerrar();
    }
    cerrar();
    offset += s.duracionMs + PAUSA_MS;
  }
  return lineas.map((l, i) => `${i + 1}\n${srtTiempo(l.ini)} --> ${srtTiempo(l.fin)}\n${l.texto}\n`).join("\n");
};

const listarVoces = async () => {
  const { voices } = await pedir("/voices");
  for (const v of voices) {
    const etiquetas = Object.values(v.labels ?? {}).join(", ");
    console.log(`${v.voice_id}  ${v.name}  [${v.category}]  ${etiquetas}`);
  }
};

const main = async () => {
  cargarEnv();
  const args = process.argv.slice(2);
  if (args.includes("--listar-voces")) return listarVoces();

  const archivo = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--voz");
  if (!archivo) salir("Uso: npm run narrar -- guiones/mi-guion.json [--borrador] [--voz <id>]");
  const guion = JSON.parse(readFileSync(archivo, "utf8"));
  const nombre = basename(archivo).replace(/\.json$/, "");
  const borrador = args.includes("--borrador");
  const voz = (args.includes("--voz") && args[args.indexOf("--voz") + 1]) || guion.voz || process.env.ELEVENLABS_VOICE_ID;
  const modelo = guion.modelo || process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
  if (!borrador && !voz) salir("Falta la voz: define ELEVENLABS_VOICE_ID, pasa --voz <id> o pon \"voz\" en el guion.");

  const textos = segmentosDe(guion).map((t) => String(t).trim());
  const carpeta = join("public", "narracion", nombre);
  rmSync(carpeta, { recursive: true, force: true });
  mkdirSync(carpeta, { recursive: true });
  mkdirSync("out", { recursive: true });

  console.log(borrador ? `Borrador sin voz para "${nombre}"…` : `Narrando "${nombre}" con ${modelo}, voz ${voz}…`);
  const segmentos = [];
  for (const [i, texto] of textos.entries()) {
    const r = borrador
      ? narrarBorrador(texto)
      : await narrarConElevenLabs(texto, textos[i - 1], textos[i + 1], voz, modelo, guion.ajustesVoz);
    const ruta = `narracion/${nombre}/${String(i + 1).padStart(2, "0")}.${r.ext}`;
    writeFileSync(join("public", ruta), r.audio);
    segmentos.push({ audio: ruta, duracionMs: r.duracionMs, subtitulos: r.subtitulos });
    console.log(`  ${i + 1}/${textos.length}  ${(r.duracionMs / 1000).toFixed(1)} s  ${texto}`);
  }

  // eslint-disable-next-line no-unused-vars
  const { composicion, locucion, voz: _v, modelo: _m, ajustesVoz, ...props } = guion;
  writeFileSync(join("out", `${nombre}.props.json`), JSON.stringify({ ...props, narracion: { pausaMs: PAUSA_MS, segmentos } }, null, 2));
  writeFileSync(join("out", `${nombre}.srt`), generarSrt(segmentos));

  const total = segmentos.reduce((s, x) => s + x.duracionMs + PAUSA_MS, INICIO_VOZ_MS) / 1000;
  console.log(`\n✔ Voz: ${total.toFixed(1)} s. Renderiza con:\n`);
  console.log(`  npx remotion render ${composicion} out/${nombre}.mp4 --props=out/${nombre}.props.json\n`);
  console.log(`  Subtítulos para YouTube: out/${nombre}.srt`);
};

main();
