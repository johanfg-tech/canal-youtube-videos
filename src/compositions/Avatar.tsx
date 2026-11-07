import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Foto de perfil del canal (800x800). YouTube la recorta en círculo, así que todo va centrado.
// Una moneda dorada con una gráfica de barras que sube: dinero + datos, sin texto.
export const Avatar: React.FC = () => {
  const barras = [0.38, 0.6, 0.88];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 25%, ${theme.accent} 0%, #7a1030 45%, ${theme.bg} 80%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 560,
          height: 560,
          borderRadius: "50%",
          background:
            "linear-gradient(160deg, #fff1a8 0%, #ffd60a 40%, #c99400 100%)",
          border: "18px solid #8a6500",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 14px #ffe680",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 34,
          paddingBottom: 150,
          boxSizing: "border-box",
        }}
      >
        {barras.map((h, i) => (
          <div
            key={i}
            style={{
              width: 78,
              height: 300 * h,
              borderRadius: 18,
              background: i === 2 ? theme.accent : theme.bg,
              boxShadow: "0 8px 0 rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
