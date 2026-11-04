# canal-youtube-videos

Vídeos del canal hechos con código usando [Remotion](https://www.remotion.dev).

## Uso local

```bash
npm install
npm run dev        # abre Remotion Studio para previsualizar y editar
npx remotion render ShortVideo out/short.mp4 --props='{"hook":"Mi gancho","points":["Uno","Dos"],"cta":"Suscríbete"}'
```

## Plantillas

| Id | Formato | Props |
|---|---|---|
| `IntroVideo` | 16:9, 1920x1080 | `title`, `subtitle` |
| `ShortVideo` | 9:16, 1080x1920 | `hook`, `points[]`, `cta` |

Colores y fuente en `src/theme.ts`.

## Publicar en YouTube y TikTok

```bash
npm run publicar -- publicaciones/ejemplo-short.json --simular   # valida la ficha sin subir nada
npm run publicar -- publicaciones/ejemplo-short.json             # sube a YouTube y TikTok
npm run tiktok:autorizar                                         # autoriza TikTok (una vez al año)
```

Cómo crear las credenciales, la ficha de publicación y los límites de cada plataforma: [docs/PUBLICAR.md](docs/PUBLICAR.md).

Licencia de Remotion: gratis para particulares y equipos de hasta 3 personas ([detalles](https://www.remotion.pro/license)).
