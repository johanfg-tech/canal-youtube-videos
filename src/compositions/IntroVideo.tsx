import { z } from "zod";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { AccentBar } from "../components/AccentBar";
import { PistaNarracion } from "../components/Narracion";
import { colocarSegmentos, finDeNarracion, narracionSchema, type Narracion } from "../narracion";
import { theme } from "../theme";

// Intro 16:9 para vídeos largos: título + subtítulo animados.
// Con `narracion` (2 segmentos: título y subtítulo) el subtítulo entra cuando la voz lo dice
// y la intro dura lo que dure el audio (mínimo 5 s).
export const introVideoSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  narracion: narracionSchema.optional(),
});

type Props = z.infer<typeof introVideoSchema>;

const INICIO_VOZ_S = 0.3;
const SUBTITULO_S = 1.2;

export const tiemposIntro = (props: Props, fps: number) => {
  const minimo = 5 * fps;
  if (props.narracion && props.narracion.segmentos.length === 2) {
    const tramos = colocarSegmentos(props.narracion as Narracion, fps, Math.round(INICIO_VOZ_S * fps));
    return {
      tramos,
      subtituloStart: tramos[1].from,
      duracion: Math.max(minimo, finDeNarracion(tramos) + fps),
    };
  }
  return { tramos: [], subtituloStart: SUBTITULO_S * fps, duracion: minimo };
};

const Subtitle: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 48,
        color: theme.muted,
        textAlign: "center",
        opacity: interpolate(frame, [start, start + 0.6 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

export const IntroVideo: React.FC<Props> = (props) => {
  const { title, subtitle } = props;
  const { fps } = useVideoConfig();
  const { tramos, subtituloStart } = tiemposIntro(props, fps);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${theme.bgAlt}, ${theme.bg})`,
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        padding: 120,
      }}
    >
      <AnimatedTitle text={title} size={110} />
      <AccentBar width={240} delay={0.6} />
      <Subtitle text={subtitle} start={subtituloStart} />
      <PistaNarracion tramos={tramos} subtitulos={false} />
    </AbsoluteFill>
  );
};
