# Canal YouTube: vídeos con Remotion

Proyecto Remotion (React) para generar los vídeos del canal. Idioma del canal y de los textos: español.

- Plantillas en `src/compositions/`, registradas en `src/Root.tsx`. Identidad visual en `src/theme.ts`.
- `IntroVideo`: 1920x1080, intro de vídeo largo. `ShortVideo`: 1080x1920, Short con gancho, puntos y CTA (la duración se calcula según el número de puntos).
- Skills oficiales de Remotion en `.claude/skills/` (empieza por `remotion-best-practices`). Anima siempre con `useCurrentFrame()` + `interpolate()`, nunca con CSS transitions.
- Comprobar: `npm run lint`. Render: `npx remotion render <Id> out/<nombre>.mp4 --props='{"...":"..."}'`. En el entorno en la nube añade `--browser-executable=/opt/pw-browsers/chromium`.
- `out/` está en .gitignore; los MP4 finales se entregan en la carpeta de archivos del proyecto, no en el repo.
