// Utilidades compartidas por los scripts de publicación.

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Carga un archivo .env local (solo para uso en tu ordenador; en la nube se usan las variables del entorno).
export const cargarEnv = () => {
  if (!existsSync(".env")) return;
  for (const linea of readFileSync(".env", "utf8").split("\n")) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};

export class ErrorPublicacion extends Error {}

export const fallar = (msg) => {
  throw new ErrorPublicacion(msg);
};

export const env = (nombre, ayuda) =>
  process.env[nombre] || fallar(`Falta la variable de entorno ${nombre}. ${ayuda ?? "Mira docs/PUBLICAR.md."}`);

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch con mensaje claro cuando la red del entorno bloquea el dominio.
export const conectar = async (url, opciones) => {
  try {
    return await fetch(url, opciones);
  } catch (e) {
    const host = new URL(url).host;
    fallar(
      `No se pudo conectar con ${host} (${e.cause?.code ?? e.message}). ` +
        `¿Está ese dominio en "Allowed domains" del entorno en la nube?`,
    );
  }
};

// Lee la ficha de publicación (JSON) y resuelve las rutas relativas a la raíz del repo.
export const leerFicha = (ruta) => {
  if (!ruta) fallar("Indica la ficha de publicación, por ejemplo: npm run publicar -- publicaciones/ejemplo-short.json");
  if (!existsSync(ruta)) fallar(`No existe la ficha ${ruta}.`);
  let ficha;
  try {
    ficha = JSON.parse(readFileSync(ruta, "utf8"));
  } catch (e) {
    fallar(`La ficha ${ruta} no es un JSON válido: ${e.message}`);
  }
  if (!ficha.video) fallar(`La ficha ${ruta} no tiene "video" (ruta al MP4).`);
  return ficha;
};

export const rutaAbsoluta = (ruta) => resolve(process.cwd(), ruta);

export const tamanoLegible = (bytes) =>
  bytes > 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${(bytes / 1e6).toFixed(1)} MB`;

// Guarda JSON con permisos solo para el dueño (para tokens).
export const guardarPrivado = (ruta, datos) => {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(datos, null, 2) + "\n", { mode: 0o600 });
  chmodSync(ruta, 0o600);
};

// Lee "--clave valor" y "--bandera" de la línea de comandos.
export const leerArgs = (argv) => {
  const posicionales = [];
  const opciones = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const clave = a.slice(2);
      const sig = argv[i + 1];
      if (sig !== undefined && !sig.startsWith("--")) {
        opciones[clave] = sig;
        i++;
      } else {
        opciones[clave] = true;
      }
    } else {
      posicionales.push(a);
    }
  }
  return { posicionales, opciones };
};
