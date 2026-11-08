import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Miniatura para vídeos largos (1280x720). Se exporta con `npx remotion still`.
export const Miniatura: React.FC<{
  numero: string;
  arriba: string;
  abajo: string;
  chips: string[];
}> = ({ numero, arriba, abajo, chips }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 25% 50%, #8a1236 0%, ${theme.bg} 60%), ${theme.bg}`,
      fontFamily: theme.font,
      color: theme.text,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${theme.text}0f 2px, transparent 2px), linear-gradient(90deg, ${theme.text}0f 2px, transparent 2px)`,
        backgroundSize: "80px 80px",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 70,
        display: "flex",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          fontSize: 400,
          fontWeight: 900,
          lineHeight: 0.85,
          color: "#ffd60a",
          textShadow: "0 14px 0 rgba(0,0,0,0.5)",
        }}
      >
        {numero}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            textTransform: "uppercase",
          }}
        >
          {arriba}
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.05,
            background: theme.accent,
            padding: "6px 22px",
            borderRadius: 14,
            rotate: "-2deg",
            alignSelf: "flex-start",
          }}
        >
          {abajo}
        </div>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 60,
        display: "flex",
        gap: 22,
      }}
    >
      {chips.map((c, i) => (
        <div
          key={c}
          style={{
            fontSize: 58,
            fontWeight: 900,
            padding: "10px 28px",
            borderRadius: 18,
            background: i % 2 ? theme.text : "#ffd60a",
            color: theme.bg,
            rotate: `${i % 2 ? 2 : -2}deg`,
            boxShadow: "0 10px 0 rgba(0,0,0,0.45)",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
