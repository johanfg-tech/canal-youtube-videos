import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

// Fondo vivo: manchas de color que se mueven, cuadrícula que sube y símbolos flotando.
const SIMBOLOS = ["$", "€", "%", "72", "×2", "÷"];

export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const mancha = (x: number, y: number, color: string, size: number) => (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.35,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      {mancha(
        width * (0.25 + 0.15 * Math.sin(t * 0.5)),
        height * (0.25 + 0.08 * Math.cos(t * 0.4)),
        theme.accent,
        1100,
      )}
      {mancha(
        width * (0.8 + 0.12 * Math.cos(t * 0.35)),
        height * (0.7 + 0.1 * Math.sin(t * 0.45)),
        "#3b6cff",
        1200,
      )}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.text}0d 2px, transparent 2px), linear-gradient(90deg, ${theme.text}0d 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0px ${-(frame * 1.5) % 120}px`,
        }}
      />
      {new Array(14).fill(0).map((_, i) => {
        const speed = 0.6 + random(`v${i}`) * 1.2;
        const y =
          height +
          200 -
          ((frame * speed + random(`y${i}`) * (height + 400)) % (height + 400));
        const x = random(`x${i}`) * width + 40 * Math.sin(t + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: theme.font,
              fontWeight: 900,
              fontSize: 60 + random(`s${i}`) * 90,
              color: theme.text,
              opacity: 0.06 + random(`o${i}`) * 0.06,
              rotate: `${interpolate(Math.sin(t * 0.8 + i), [-1, 1], [-20, 20])}deg`,
            }}
          >
            {SIMBOLOS[i % SIMBOLOS.length]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
