import {
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

// Presentador 3D del canal: clip en bucle de 150 fotogramas (5 s a 30 fps) con fondo transparente.
// Se genera con Blender (scripts/mascota3d/build.py) y se guarda como WebM con alfa en public/mascota3d/.
const BUCLE = 150;

export const PresentadorTresD: React.FC<{
  texto?: string;
  desdeFrame: number;
  alto?: number;
}> = ({ texto: dicho, desdeFrame, alto = 640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 12 } });
  const salto = spring({
    frame: frame - desdeFrame,
    fps,
    config: { damping: 8, mass: 0.5 },
  });
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <div
      style={{
        position: "absolute",
        right: -90,
        bottom: -30,
        translate: `${(1 - entrada) * 400}px 0px`,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {dicho ? (
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 46,
            fontWeight: 900,
            lineHeight: 1.05,
            color: theme.bg,
            textAlign: "center",
            background: "#f3ead8",
            borderRadius: 30,
            padding: "16px 26px",
            scale: String(interpolate(salto, [0, 1], [0.3, 1], clamp)),
            transformOrigin: "100% 100%",
            marginRight: -30,
            marginBottom: 70,
            boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
          }}
        >
          {dicho}
        </div>
      ) : null}
      <Loop durationInFrames={BUCLE} layout="none">
        <OffthreadVideo
          src={staticFile("mascota3d/presentador.webm")}
          transparent
          style={{ width: alto, height: alto }}
        />
      </Loop>
    </div>
  );
};
