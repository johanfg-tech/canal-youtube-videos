import { z } from "zod";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { AccentBar } from "../components/AccentBar";
import { PistaNarracion } from "../components/Narracion";
import { colocarSegmentos, finDeNarracion, narracionSchema, type Narracion } from "../narracion";
import { theme } from "../theme";

// Short 9:16: gancho arriba y una lista de puntos que van apareciendo.
// Con `narracion` (generada con `npm run narrar`), cada punto aparece cuando la voz empieza a decirlo
// y la duración del vídeo se ajusta al audio. Segmentos: gancho, un segmento por punto y CTA.
export const shortVideoSchema = z.object({
  hook: z.string(),
  points: z.array(z.string()),
  cta: z.string(),
  narracion: narracionSchema.optional(),
  subtitulos: z.boolean().optional(),
});

type Props = z.infer<typeof shortVideoSchema>;

export const SECONDS_PER_POINT = 3;
const INICIO_VOZ_S = 0.3;
const COLA_S = 1.5;

// Frame en el que empieza el gancho, cada punto y el CTA; lo usan el componente y calculateMetadata.
export const tiemposShort = (props: Props, fps: number) => {
  const { narracion, points } = props;
  if (narracion && narracion.segmentos.length === points.length + 2) {
    const tramos = colocarSegmentos(narracion as Narracion, fps, Math.round(INICIO_VOZ_S * fps));
    return {
      tramos,
      pointStarts: tramos.slice(1, -1).map((t) => t.from),
      ctaStart: tramos[tramos.length - 1].from,
      duracion: finDeNarracion(tramos) + Math.round(COLA_S * fps),
    };
  }
  const pointsStart = 2 * fps;
  const ctaStart = pointsStart + points.length * SECONDS_PER_POINT * fps;
  return {
    tramos: [],
    pointStarts: points.map((_, i) => pointsStart + i * SECONDS_PER_POINT * fps),
    ctaStart,
    duracion: ctaStart + 3 * fps,
  };
};

const Point: React.FC<{ index: number; text: string }> = ({ index, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        gap: 32,
        alignItems: "center",
        fontFamily: theme.font,
        fontSize: 64,
        fontWeight: 700,
        color: theme.text,
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 0.5 * fps], ["-80px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span style={{ color: theme.accent, fontSize: 96, fontWeight: 900, minWidth: 70, textAlign: "center" }}>{index + 1}</span>
      <span>{text}</span>
    </div>
  );
};

export const ShortVideo: React.FC<Props> = (props) => {
  const { hook, points, cta } = props;
  const { fps } = useVideoConfig();
  const { tramos, pointStarts, ctaStart } = tiemposShort(props, fps);
  const subtitulos = Boolean(props.subtitulos) && tramos.length > 0;

  return (
    <AbsoluteFill style={{ background: theme.bg, padding: 90, paddingTop: 260 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <AnimatedTitle text={hook} size={96} />
        <AccentBar width={200} delay={0.5} />
      </div>
      {points.map((p, i) => (
        <Sequence key={i} from={pointStarts[i]} layout="none" name={`Punto ${i + 1}`}>
          <div style={{ position: "absolute", left: 90, right: 90, top: 760 + i * 200 }}>
            <Point index={i} text={p} />
          </div>
        </Sequence>
      ))}
      <Sequence from={ctaStart} name="CTA">
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: subtitulos ? 520 : 260 }}>
          <AnimatedTitle text={cta} size={72} />
        </AbsoluteFill>
      </Sequence>
      <PistaNarracion tramos={tramos} subtitulos={subtitulos} bottom={200} />
    </AbsoluteFill>
  );
};
