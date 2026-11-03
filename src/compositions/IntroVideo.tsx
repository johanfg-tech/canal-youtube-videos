import { z } from "zod";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { AccentBar } from "../components/AccentBar";
import { theme } from "../theme";

// Intro 16:9 para vídeos largos: título + subtítulo animados.
export const introVideoSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

const Subtitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 48,
        color: theme.muted,
        textAlign: "center",
        opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

export const IntroVideo: React.FC<z.infer<typeof introVideoSchema>> = ({ title, subtitle }) => {
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
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};
