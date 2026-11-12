import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

// Piezas comunes del estilo "historia" (Shorts con escenas propias por tema).

export const FPS = 30;
export const AMARILLO = "#ffd60a";
export const VERDE = "#2ee59d";
export const ROJO = "#ff4d6d";
export const NARANJA = "#f7931a";
export const TARJETA = "#171a22";
export const BORDE = "#2a2f3a";

export const f = (s: number) => Math.round(s * FPS);

export const useEntrada = (desde: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - f(desde), fps, config: { damping, mass: 0.6 } });
};

export const texto = (size: number, color = theme.text): React.CSSProperties => ({
  fontFamily: theme.font,
  fontWeight: 900,
  fontSize: size,
  color,
  lineHeight: 1.08,
  textAlign: "center",
  letterSpacing: -1,
});

export const Escena: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const total = f(dur);
  const opacity = interpolate(frame, [0, 6, total - 8, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 10], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{ opacity, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

// Imagen de IA que entra con muelle y flota.
export const Flotante: React.FC<{
  src: string;
  size: number;
  x?: number;
  y?: number;
  desde?: number;
  giro?: number;
}> = ({ src, size, x = 540, y = 900, desde = 0, giro = 3 }) => {
  const frame = useCurrentFrame();
  const e = useEntrada(desde, 11);
  const t = frame / FPS;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: size,
        left: x - size / 2,
        top: y - size / 2 + 14 * Math.sin(t * 2),
        transform: `scale(${e}) rotate(${giro * Math.sin(t * 1.3)}deg)`,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))",
      }}
    />
  );
};

// Tarjeta tipo interfaz (foro, recibo, transacción).
export const Tarjeta: React.FC<{
  desde?: number;
  top: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ desde = 0, top, children, style }) => {
  const e = useEntrada(desde);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        background: TARJETA,
        border: `3px solid ${BORDE}`,
        borderRadius: 32,
        padding: "36px 40px",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        opacity: Math.min(1, e * 2),
        transform: `translateY(${(1 - e) * 80}px) scale(${0.94 + 0.06 * e})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Texto que se escribe letra a letra.
export const Maquina: React.FC<{ texto_: string; desde: number; cps?: number; style: React.CSSProperties }> = ({
  texto_,
  desde,
  cps = 28,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - f(desde)) / FPS) * cps));
  const cursor = n < texto_.length && Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={style}>
      {texto_.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0 }}>|</span>
    </div>
  );
};

// Formato de dinero en español: 750.000.000
export const dinero = (v: number) => Math.round(v).toLocaleString("es-ES").replace(/,/g, ".");

// Remate integrado: ¿Y TÚ? + pregunta + SÍGUEME.
export const RemateFinal: React.FC<{ pregunta: string; sigueme: number }> = ({ pregunta, sigueme }) => {
  const frame = useCurrentFrame();
  const a = useEntrada(0.05, 8);
  const b = useEntrada(0.6);
  const c = useEntrada(sigueme, 9);
  const pulso = 1 + 0.05 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(170, theme.bg), background: AMARILLO, borderRadius: 32, padding: "0 50px", transform: `scale(${a}) rotate(-4deg)` }}>
          ¿Y TÚ?
        </div>
      </div>
      <div style={{ position: "absolute", top: 520, left: 60, right: 60, ...texto(80), opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
        {pregunta}
      </div>
      <div style={{ position: "absolute", top: 860, left: 60, right: 60, ...texto(54, theme.muted), opacity: b }}>
        Cuéntamelo en los comentarios 👇
      </div>
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(100), background: ROJO, borderRadius: 999, padding: "20px 70px", transform: `scale(${c * pulso})` }}>
          SÍGUEME ▶
        </div>
      </div>
    </>
  );
};
