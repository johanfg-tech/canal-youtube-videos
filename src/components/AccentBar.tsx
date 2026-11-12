import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const AccentBar: React.FC<{ width: number; delay?: number }> = ({
  width,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delay * fps;
  return (
    <div
      style={{
        height: 10,
        borderRadius: 5,
        background: theme.accent,
        width: interpolate(frame, [start, start + 0.7 * fps], [0, width], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    />
  );
};
