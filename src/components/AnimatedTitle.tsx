import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const AnimatedTitle: React.FC<{ text: string; size: number; delay?: number }> = ({
  text,
  size,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delay * fps;

  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.1,
        color: theme.text,
        textAlign: "center",
        opacity: interpolate(frame, [start, start + 0.6 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [start, start + 0.8 * fps], ["0px 60px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {text}
    </div>
  );
};
