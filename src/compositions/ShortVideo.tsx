import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { AccentBar } from "../components/AccentBar";
import { theme } from "../theme";

// Short 9:16: gancho arriba y una lista de puntos que van apareciendo.
export const shortVideoSchema = z.object({
  hook: z.string(),
  points: z.array(z.string()),
  cta: z.string(),
});

export const SECONDS_PER_POINT = 3;

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
        translate: interpolate(
          frame,
          [0, 0.5 * fps],
          ["-80px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      }}
    >
      <span
        style={{
          color: theme.accent,
          fontSize: 96,
          fontWeight: 900,
          minWidth: 70,
          textAlign: "center",
        }}
      >
        {index + 1}
      </span>
      <span>{text}</span>
    </div>
  );
};

export const ShortVideo: React.FC<z.infer<typeof shortVideoSchema>> = ({
  hook,
  points,
  cta,
}) => {
  const { fps } = useVideoConfig();
  const pointsStart = 2 * fps;
  const ctaStart = pointsStart + points.length * SECONDS_PER_POINT * fps;

  return (
    <AbsoluteFill
      style={{ background: theme.bg, padding: 90, paddingTop: 260 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <AnimatedTitle text={hook} size={96} />
        <AccentBar width={200} delay={0.5} />
      </div>
      {points.map((p, i) => (
        <Sequence
          key={i}
          from={pointsStart + i * SECONDS_PER_POINT * fps}
          layout="none"
          name={`Punto ${i + 1}`}
        >
          <div
            style={{
              position: "absolute",
              left: 90,
              right: 90,
              top: 760 + i * 200,
            }}
          >
            <Point index={i} text={p} />
          </div>
        </Sequence>
      ))}
      <Sequence from={ctaStart} name="CTA">
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 260,
          }}
        >
          <AnimatedTitle text={cta} size={72} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
