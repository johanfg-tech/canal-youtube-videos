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
| `IntroVideo` | 16:9, 1920x1080 | `title`, `subtitle`, `narracion?` |
| `ShortVideo` | 9:16, 1080x1920 | `hook`, `points[]`, `cta`, `narracion?`, `subtitulos?` |

Colores y fuente en `src/theme.ts`.

## Narración con ElevenLabs

1. Escribe un guion en `guiones/` (mira `guiones/ejemplo-short.json`). `locucion` es opcional y sirve para que la voz diga algo más largo que el texto en pantalla.
2. Genera la voz y los tiempos de cada palabra:

   ```bash
   npm run narrar -- guiones/ejemplo-short.json
   npx remotion render ShortVideo out/ejemplo-short.mp4 --props=out/ejemplo-short.props.json
   ```

   Cada punto del Short aparece cuando la voz empieza a decirlo y la duración se ajusta al audio. Con `"subtitulos": true` salen subtítulos palabra a palabra, y siempre se genera `out/<nombre>.srt` para subirlo a YouTube.
3. `--borrador` hace lo mismo sin llamar a la API (audio en silencio, tiempos estimados) para probar el diseño sin gastar créditos. `npm run narrar -- --listar-voces` muestra las voces de tu cuenta.

Variables de entorno (nunca en el repo; en local puedes usar un archivo `.env`, que está en .gitignore):

| Variable | Uso |
|---|---|
| `ELEVENLABS_API_KEY` | Obligatoria para la voz real |
| `ELEVENLABS_VOICE_ID` | Voz por defecto (o `--voz <id>`, o `"voz"` en el guion) |
| `ELEVENLABS_MODEL` | Opcional, por defecto `eleven_multilingual_v2` |

Los audios (`public/narracion/`) y los props generados (`out/`) no se suben: se regeneran desde el guion.

Licencia de Remotion: gratis para particulares y equipos de hasta 3 personas ([detalles](https://www.remotion.pro/license)).
