import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Banner del canal (2560x1440). Lo importante va en la zona segura central de 1546x423,
// que es lo único que se ve en móvil.
export const Banner: React.FC<{ nombre: string; lema: string }> = ({
  nombre,
  lema,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 30% 40%, #7a1030 0%, ${theme.bg} 60%), ${theme.bg}`,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${theme.text}0d 3px, transparent 3px), linear-gradient(90deg, ${theme.text}0d 3px, transparent 3px)`,
        backgroundSize: "160px 160px",
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 70,
        width: 1546,
        height: 423,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 22,
          height: 260,
        }}
      >
        {[0.4, 0.65, 1].map((h, i) => (
          <div
            key={i}
            style={{
              width: 70,
              height: 260 * h,
              borderRadius: 16,
              background: i === 2 ? "#ffd60a" : theme.accent,
            }}
          />
        ))}
      </div>
      <div style={{ fontFamily: theme.font, color: theme.text }}>
        <div
          style={{
            fontSize: 170,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          {nombre}
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 600,
            color: theme.muted,
            marginTop: 20,
          }}
        >
          {lema}
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
