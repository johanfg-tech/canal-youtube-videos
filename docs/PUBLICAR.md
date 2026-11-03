# Publicar en YouTube y TikTok

Claude sube los vídeos con `npm run publicar -- publicaciones/<ficha>.json`. Esta guía explica cómo crear
las credenciales una sola vez. **Las claves nunca se pegan en el chat ni se suben al repo**: van como
variables de entorno del entorno en la nube de Claude (o en un `.env` local si lo usas en tu ordenador).

---

## 0. Entorno en la nube (una vez, sirve también para ElevenLabs)

1. Abre **Project settings → Cloud environment → Add cloud environment**.
2. En **Network access** elige **Limited** (deja marcada la casilla de gestores de paquetes) y en
   **Allowed domains** añade:
   ```
   oauth2.googleapis.com
   www.googleapis.com
   open.tiktokapis.com
   open-upload.tiktokapis.com
   api.elevenlabs.io
   ```
3. En **Environment variables** irás pegando las variables de los pasos siguientes:
   ```
   YOUTUBE_CLIENT_ID=...
   YOUTUBE_CLIENT_SECRET=...
   YOUTUBE_REFRESH_TOKEN=...
   TIKTOK_CLIENT_KEY=...
   TIKTOK_CLIENT_SECRET=...
   TIKTOK_REDIRECT_URI=...
   ELEVENLABS_API_KEY=...
   ELEVENLABS_VOICE_ID=...
   ```
4. Guarda. Las sesiones nuevas de Claude ya arrancan con ese entorno (las que estaban abiertas no).

---

## 1. YouTube (unos 15 minutos)

### 1.1 Proyecto en Google Cloud
1. Entra en <https://console.cloud.google.com> con la cuenta de Google **dueña del canal**.
2. Arriba, selector de proyectos → **Proyecto nuevo** → nombre `Canal YouTube` → Crear.
3. Menú → **APIs y servicios → Biblioteca** → busca **YouTube Data API v3** → **Habilitar**.

### 1.2 Pantalla de consentimiento (Google Auth Platform)
1. Menú → **APIs y servicios → Pantalla de consentimiento de OAuth** → Comenzar.
2. Nombre de la app: `Publicador del canal`; correo de asistencia: el tuyo. Público: **Externo**.
3. En **Acceso a los datos → Añadir o quitar permisos**, añade a mano estos dos y guarda:
   ```
   https://www.googleapis.com/auth/youtube.upload
   https://www.googleapis.com/auth/youtube.force-ssl
   ```
   (el segundo hace falta para subir subtítulos).
4. En **Público**, pulsa **Publicar app → Confirmar** para pasarla a *En producción*.
   Importante: si se queda en *Prueba*, el token caduca a los 7 días y habría que repetir el paso 1.4.
   No hace falta que Google la verifique: es una app solo para ti.

### 1.3 Cliente OAuth
1. **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**.
2. Tipo: **Aplicación web**. Nombre: `Claude`.
3. En **URIs de redireccionamiento autorizados** añade exactamente:
   `https://developers.google.com/oauthplayground`
4. Crear. Copia el **ID de cliente** y el **Secreto** directamente a las variables
   `YOUTUBE_CLIENT_ID` y `YOUTUBE_CLIENT_SECRET` del entorno.

### 1.4 Token del canal (OAuth Playground)
1. Abre <https://developers.google.com/oauthplayground>.
2. Rueda dentada (arriba a la derecha) → marca **Use your own OAuth credentials** → pega el ID y el
   secreto del paso anterior.
3. A la izquierda, en *Input your own scopes*, pega:
   `https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl`
   → **Authorize APIs**.
4. Entra con la cuenta del canal. Si el canal es una *cuenta de marca*, elige el canal, no tu perfil
   personal. Saldrá "Google no ha verificado esta app": **Configuración avanzada → Ir a Publicador del
   canal** (es tu propia app) → Continuar.
5. Pulsa **Exchange authorization code for tokens** y copia el **Refresh token** a la variable
   `YOUTUBE_REFRESH_TOKEN`.

### Límites de YouTube
- La API tiene una cuota diaria gratuita (se renueva a medianoche, hora del Pacífico). Según la
  documentación actual, las subidas van en un cupo propio de unas 100 al día; poner subtítulos gasta
  400 unidades de las 10.000 diarias y la miniatura 50. Para un canal es más que suficiente.
- Las **miniaturas personalizadas** exigen que el canal esté verificado por teléfono
  (<https://www.youtube.com/verify>).
- Un vídeo vertical o cuadrado de hasta 3 minutos se publica como **Short** automáticamente.
- Por defecto se sube como **privado**, para que lo revises. Puedes poner `"privacidad": "publico"`
  u `"oculto"`, o `"programar"` con fecha y hora.
- Si alguna vez YouTube bloqueara los vídeos subidos por API como privados, la solución es pedir la
  auditoría gratuita de la API (formulario "YouTube API Services - Audit and Quota Extension").

---

## 2. TikTok (30 minutos + espera de TikTok)

TikTok es más restrictivo: una app nueva necesita **sandbox** (para probar con tu cuenta) o pasar su
**revisión**, y mientras no supere la **auditoría** de la Content Posting API **no puede publicar
vídeos públicos directamente**. Por eso el modo por defecto es **borrador**: Claude sube el vídeo a la
bandeja de tu TikTok y tú, desde el móvil, abres la notificación, revisas y pulsas Publicar con la
privacidad que quieras. Son dos toques.

### 2.1 App de desarrollador
1. Entra en <https://developers.tiktok.com> con la cuenta del canal → **Manage apps → Connect an app**.
2. Rellena icono, nombre (`Publicador del canal`), categoría y descripción. Plataforma: **Web**.
   Te pedirá URL de web, términos y política de privacidad: si no tienes, dímelo y te preparo unas
   páginas sencillas.
3. **Add products**:
   - **Login Kit**: en *Redirect URI* pon una URL https tuya (por ejemplo la de tu web). Es solo adonde
     TikTok te devuelve tras aceptar; no hace falta que la página haga nada. Copia esa URL exacta a la
     variable `TIKTOK_REDIRECT_URI`.
   - **Content Posting API**: actívalo. Si quieres probar el modo directo, activa también *Direct Post*.
4. Permisos (scopes): `user.info.basic`, `video.upload` y `video.publish`.
5. Copia **Client key** y **Client secret** a `TIKTOK_CLIENT_KEY` y `TIKTOK_CLIENT_SECRET`.
6. Para probar ya: pestaña **Sandbox → Create sandbox** y añade tu cuenta de TikTok como *Target user*.
   Para usarlo sin sandbox, envía la app a revisión (*Submit for review*); TikTok tarda unos días.

### 2.2 Autorizar tu cuenta (una vez al año)
1. En una sesión nueva de Claude (con el entorno ya configurado), dile: *"autoriza TikTok"*.
2. Claude te da un enlace. Ábrelo, acepta, y TikTok te mandará a tu Redirect URI con `?code=...` en la
   barra de direcciones (aunque la página dé error).
3. Pega esa URL a Claude en los siguientes minutos. Ese código caduca enseguida, solo sirve una vez y no
   vale nada sin el secreto de la app, así que no es una contraseña.
4. Claude la canjea y guarda los tokens en la carpeta privada de archivos del proyecto
   (`.credenciales/tiktok.json`), no en el repo ni en el chat. Se renuevan solos durante un año.

### Límites de TikTok
- **Sin auditoría**: en modo directo solo se puede publicar como "privado" (solo tú) y la cuenta tiene que
  estar en privado. Con modo borrador no hay ese problema, pero la publicación final la haces tú.
- Máximo 5 borradores pendientes en 24 horas y 6 peticiones por minuto.
- Para publicar en público sin tocar el móvil hay que pasar la auditoría
  (<https://developers.tiktok.com/application/content-posting-api>). TikTok pide que la app cumpla sus
  normas de interfaz, así que no es seguro que la aprueben para un uso personal.
- Vídeos de hasta 4 GB. TikTok pide marcar el contenido generado con IA (`"ia": true`).

---

## 3. La ficha de publicación

Un JSON en `publicaciones/` por vídeo. Ejemplos: `publicaciones/ejemplo-short.json` y
`publicaciones/ejemplo-largo.json`.

| Campo | Qué es |
|---|---|
| `video` | Ruta al MP4 renderizado (por ejemplo `out/mi-short.mp4`) |
| `titulo`, `descripcion`, `etiquetas` | Comunes a las dos plataformas |
| `youtube.privacidad` | `privado` (por defecto), `oculto` o `publico` |
| `youtube.programar` | Fecha ISO, por ejemplo `2026-11-10T18:00:00+01:00` (se publica sola a esa hora) |
| `youtube.categoria` | `22` Gente y blogs (por defecto), `27` Educación, `24` Entretenimiento, `28` Ciencia y tecnología |
| `youtube.miniatura` | PNG o JPG de hasta 2 MB |
| `youtube.subtitulos` | Archivo `.srt` (lo genera `npm run narrar`) |
| `youtube.ia` | `true` si el vídeo tiene contenido realista alterado o sintético |
| `youtube.titulo` / `youtube.descripcion` / `youtube.etiquetas` | Sustituyen a los comunes solo en YouTube |
| `tiktok.modo` | `borrador` (por defecto) o `directo` |
| `tiktok.texto` | Texto con hashtags (si falta: título + etiquetas como hashtags). Solo en modo directo |
| `tiktok.privacidad` | Modo directo: `privado` (por defecto), `seguidores`, `amigos`, `publico` |
| `tiktok.comentarios`, `tiktok.duo`, `tiktok.stitch` | `false` para desactivarlos |
| `tiktok.portada_ms` | Milisegundo del vídeo que se usa como portada |
| `tiktok.ia` | `true` para la etiqueta de contenido generado con IA |

Si la ficha no tiene sección `youtube` o `tiktok`, no se publica en esa plataforma.

```bash
npm run publicar -- publicaciones/mi-short.json --simular      # comprueba sin subir nada
npm run publicar -- publicaciones/mi-short.json                # YouTube y TikTok
npm run publicar -- publicaciones/mi-short.json --solo youtube
```
