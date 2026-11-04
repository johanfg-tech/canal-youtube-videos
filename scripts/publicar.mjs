#!/usr/bin/env node
// Publica un vídeo ya renderizado en YouTube y/o TikTok a partir de una ficha JSON.
//
//   npm run publicar -- publicaciones/ejemplo-short.json              -> YouTube y TikTok (según la ficha)
//   npm run publicar -- publicaciones/ejemplo-short.json --solo youtube
//   npm run publicar -- publicaciones/ejemplo-short.json --solo tiktok
//   npm run publicar -- publicaciones/ejemplo-short.json --simular    -> valida la ficha y muestra lo que
//                                                                        se enviaría, sin conectarse
//
// La ficha se explica en docs/PUBLICAR.md. Una plataforma se publica si la ficha tiene su sección
// ("youtube" o "tiktok"). Credenciales: variables de entorno (docs/PUBLICAR.md), nunca en el repo.

import { existsSync, statSync } from "node:fs";
import { ErrorPublicacion, cargarEnv, leerArgs, leerFicha, rutaAbsoluta, tamanoLegible } from "./lib/comun.mjs";
import { publicarEnYouTube, recursoVideo } from "./lib/youtube.mjs";
import { opcionesTikTok, planTrozos, publicarEnTikTok, rutaTokens } from "./lib/tiktok.mjs";

const main = async () => {
  cargarEnv();
  const { posicionales, opciones } = leerArgs(process.argv.slice(2));
  const ficha = leerFicha(posicionales[0]);
  const solo = opciones.solo;
  if (solo && !["youtube", "tiktok"].includes(solo)) throw new ErrorPublicacion("--solo debe ser youtube o tiktok.");
  const destinos = ["youtube", "tiktok"].filter((d) => ficha[d] && (!solo || solo === d));
  if (destinos.length === 0) throw new ErrorPublicacion('La ficha no tiene sección "youtube" ni "tiktok" (o --solo la excluye).');

  if (opciones.simular) {
    const ruta = rutaAbsoluta(ficha.video);
    console.log(`\nVídeo: ${ficha.video} ${existsSync(ruta) ? `(${tamanoLegible(statSync(ruta).size)})` : "(⚠ aún no existe)"}`);
    if (destinos.includes("youtube")) console.log("\nYouTube enviaría:\n" + JSON.stringify(recursoVideo(ficha), null, 2));
    if (destinos.includes("tiktok")) {
      const { modo, texto, privacidad } = opcionesTikTok(ficha);
      const trozos = existsSync(ruta) ? planTrozos(statSync(ruta).size) : null;
      console.log(`\nTikTok: modo ${modo}${modo === "directo" ? `, privacidad ${privacidad}` : ""}`);
      if (modo === "directo") console.log(`  texto: ${texto}`);
      else console.log("  (en modo borrador el texto y la privacidad se ponen en la app al publicar)");
      if (trozos) console.log(`  trozos: ${trozos.total_chunk_count} de ${tamanoLegible(trozos.chunk_size)}`);
      console.log(`  tokens en: ${rutaTokens()}`);
    }
    console.log("\n✔ Ficha válida (simulación, no se subió nada).\n");
    return;
  }

  let errores = 0;
  for (const destino of destinos) {
    try {
      const r = destino === "youtube" ? await publicarEnYouTube(ficha) : await publicarEnTikTok(ficha);
      if (destino === "youtube") {
        console.log(`✔ YouTube: ${r.url}${r.extras.length ? ` (+ ${r.extras.join(", ")})` : ""}`);
      } else {
        console.log(`✔ TikTok: ${r.estado}${r.url ? ` ${r.url}` : ""}`);
      }
    } catch (e) {
      errores++;
      console.error(`\n✖ ${destino === "youtube" ? "YouTube" : "TikTok"}: ${e instanceof ErrorPublicacion ? e.message : e.stack}\n`);
    }
  }
  if (errores) process.exit(1);
};

main().catch((e) => {
  console.error(`\n✖ ${e instanceof ErrorPublicacion ? e.message : e.stack}\n`);
  process.exit(1);
});
