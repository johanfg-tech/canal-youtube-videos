import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { f, useEntrada } from "./kit";

// Tarjeta de comentario de un seguidor (estilo red social) que abre el vídeo:
// "Este vídeo existe gracias a un comentario". Entra con muelle y sale con fundido.
export const ComentarioRed: React.FC<{ autor: string; texto: string; dur: number; likes?: number }> = ({
  autor,
  texto,
  dur,
  likes = 1,
}) => {
  const frame = useCurrentFrame();
  const e = useEntrada(0.1);
  const salida = interpolate(frame, [f(dur) - 10, f(dur)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // El corazón late una vez cuando se ha leído el comentario.
  const latido = interpolate(frame, [f(1.6), f(1.8), f(2.0)], [1, 1.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iniciales = autor
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: salida }}>
      <div
        style={{
          width: 900,
          padding: "40px 44px",
          borderRadius: 36,
          background: "#ffffff",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          transform: `translateY(${(1 - e) * 120}px) scale(${0.9 + 0.1 * e})`,
          opacity: e,
          fontFamily: theme.font,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            flexShrink: 0,
            borderRadius: 55,
            background: "linear-gradient(135deg, #3a7bd5, #00d2ff)",
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iniciales}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#8a8a8a" }}>{autor}</div>
          <div style={{ fontSize: 46, fontWeight: 600, color: "#161616", lineHeight: 1.22, marginTop: 10 }}>{texto}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 32, color: "#8a8a8a", fontWeight: 600 }}>
            <span>Responder</span>
            <span>
              <span style={{ display: "inline-block", transform: `scale(${latido})`, color: "#fe2c55" }}>♥</span> {likes}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
