import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Fondo } from "../components/datos/Fondo";
import { theme } from "../theme";

// Remate: toma un Short ya renderizado, le pone un gancho arriba al principio
// y sustituye el final por una pregunta para comentar + llamada a seguir.
export const remateSchema = z.object({
  video: z.string(), // ruta en public/ del Short original
  corte: z.number(), // segundo donde se corta el original (antes de su "Sígueme")
  gancho: z.string(), // texto del gancho de los primeros segundos
  pregunta: z.string(), // pregunta en pantalla del final
  voz: z.string(), // mp3 en public/ con la frase final
  vozDur: z.number(),
  cierre: z.string(), // texto del botón final
  subcierre: z.string(),
});

type Props = z.infer<typeof remateSchema>;

const AMARILLO = "#ffd60a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const texto = (
  size: number,
  color = theme.text,
  weight = 900,
): React.CSSProperties => ({
  fontFamily: theme.font,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.08,
  textAlign: "center",
});

export const duracionRemate = (p: Props) => p.corte + p.vozDur + 0.8;

const Gancho: React.FC<{ txt: string }> = ({ txt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame, fps, config: { damping: 10, mass: 0.6 } });
  const sale = interpolate(frame, [3.4 * fps, 3.8 * fps], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: sale,
      }}
    >
      <div
        style={{
          ...texto(46, "#111"),
          background: AMARILLO,
          borderRadius: 22,
          padding: "16px 34px",
          maxWidth: 960,
          rotate: "-2deg",
          scale: String(entra),
          boxShadow: "0 12px 0 rgba(0,0,0,0.35)",
          textTransform: "uppercase",
        }}
      >
        {txt}
      </div>
    </div>
  );
};

const Burbuja: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = 10 * Math.sin((frame / fps) * Math.PI * 2);
  return (
    <svg width={150} height={130} viewBox="0 0 150 130" style={{ translate: `0 ${y}px` }}>
      <path
        d="M20 10 h110 a15 15 0 0 1 15 15 v55 a15 15 0 0 1 -15 15 h-65 l-30 28 v-28 h-15 a15 15 0 0 1 -15 -15 v-55 a15 15 0 0 1 15 -15z"
        fill={AMARILLO}
      />
      <circle cx="48" cy="52" r="9" fill="#111" />
      <circle cx="75" cy="52" r="9" fill="#111" />
      <circle cx="102" cy="52" r="9" fill="#111" />
    </svg>
  );
};

const Final: React.FC<Props> = ({ pregunta, cierre, subcierre }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (d: number) =>
    spring({ frame: frame - Math.round(d * fps), fps, config: { damping: 10, mass: 0.6 } });
  const pulso = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 3);
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 56,
          padding: 80,
        }}
      >
        <div
          style={{
            ...texto(230, theme.accent),
            letterSpacing: -8,
            scale: String(pop(0)),
            textShadow: `0 0 60px ${theme.accent}aa, 0 14px 0 rgba(0,0,0,0.4)`,
          }}
        >
          ¿Y TÚ?
        </div>
        <div
          style={{
            ...texto(84),
            opacity: pop(0.35),
            translate: `0 ${(1 - pop(0.35)) * 80}px`,
            textShadow: "0 10px 0 rgba(0,0,0,0.35)",
          }}
        >
          {pregunta}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            scale: String(pop(1.2)),
          }}
        >
          <Burbuja />
          <div style={texto(70, AMARILLO)}>COMENTA</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            scale: String(pop(2.2)),
          }}
        >
          <div
            style={{
              ...texto(66),
              background: theme.accent,
              borderRadius: 999,
              padding: "26px 70px",
              scale: String(pulso),
              boxShadow: `0 0 0 ${8 + 8 * Math.sin((frame / fps) * Math.PI * 3)}px ${theme.accent}55`,
            }}
          >
            {cierre}
          </div>
          <div style={texto(44, theme.muted, 700)}>{subcierre}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Remate: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const corte = Math.round(props.corte * fps);
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence durationInFrames={corte}>
        <OffthreadVideo src={staticFile(props.video)} />
      </Sequence>
      <Sequence durationInFrames={Math.round(3.8 * fps)} layout="none">
        <Gancho txt={props.gancho} />
      </Sequence>
      <Sequence from={corte}>
        <Final {...props} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
        <Sequence from={Math.round(0.25 * fps)} layout="none">
          <Audio src={staticFile(props.voz)} />
        </Sequence>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 14,
            background: `linear-gradient(90deg, ${theme.accent}, ${AMARILLO})`,
            width: `${interpolate(frame, [0, durationInFrames], [0, 100], clamp)}%`,
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
