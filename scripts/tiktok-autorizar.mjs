#!/usr/bin/env node
// Autoriza tu cuenta de TikTok una sola vez (dura 1 año y se renueva sola al publicar).
//
//   npm run tiktok:autorizar                 -> imprime el enlace para dar permiso a la app
//   npm run tiktok:autorizar -- "<URL>"      -> canjea el código de la URL a la que te mandó TikTok
//                                               (también vale pegar solo el valor de code=...)
//
// El código de la URL caduca en unos minutos y solo sirve una vez, junto con el secreto de la app.
// Los tokens se guardan en un archivo privado (ver rutaTokens en scripts/lib/tiktok.mjs), no se imprimen.

import { randomBytes } from "node:crypto";
import { ErrorPublicacion, cargarEnv, env } from "./lib/comun.mjs";
import { pedirToken, rutaTokens } from "./lib/tiktok.mjs";

const SCOPES = process.env.TIKTOK_SCOPES || "user.info.basic,video.upload,video.publish";
const AYUDA = "Mira docs/PUBLICAR.md, sección TikTok.";

const main = async () => {
  cargarEnv();
  const entrada = process.argv[2];
  const redirect = env("TIKTOK_REDIRECT_URI", AYUDA);

  if (!entrada) {
    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
    url.search = new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY", AYUDA),
      scope: SCOPES,
      response_type: "code",
      redirect_uri: redirect,
      state: randomBytes(8).toString("hex"),
    }).toString();
    console.log(`\n1. Abre este enlace con la cuenta de TikTok del canal y acepta:\n\n${url}\n`);
    console.log(`2. TikTok te llevará a ${redirect}?code=...  (si esa página da error, no pasa nada).`);
    console.log("3. Copia la URL completa de la barra del navegador y canjéala con:");
    console.log('   npm run tiktok:autorizar -- "<URL>"\n');
    return;
  }

  let codigo = decodeURIComponent(entrada);
  if (entrada.includes("code=")) {
    const params = new URL(entrada, "https://x.invalid").searchParams;
    if (params.get("error")) throw new ErrorPublicacion(`TikTok devolvió un error: ${params.get("error")} ${params.get("error_description") ?? ""}`);
    codigo = params.get("code");
  }
  if (!codigo) throw new ErrorPublicacion("No encontré el código en lo que pegaste.");

  const tokens = await pedirToken({ grant_type: "authorization_code", code: codigo, redirect_uri: redirect });
  console.log(`\n✔ TikTok autorizado. Permisos: ${tokens.scope}`);
  console.log(`  Tokens guardados en ${rutaTokens()} (válidos hasta ${tokens.refresh_caduca.slice(0, 10)}).\n`);
};

main().catch((e) => {
  console.error(`\n✖ ${e instanceof ErrorPublicacion ? e.message : e.stack}\n`);
  process.exit(1);
});
