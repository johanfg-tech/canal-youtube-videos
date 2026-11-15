import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../../theme";
import { f } from "./kit";

// Intro del calendario de adviento hecha con clips de Google Flow (public/flow-adviento-intro):
// 1) la cámara avanza por el salón hacia el calendario, 2) la puertecita se abre y sale luz dorada,
// 3) sobre la luz aparecen "PUERTA N", la fecha y el año. Dura como mínimo INTRO_MIN segundos.

const CARPETA = "flow-adviento-intro";
const INTRO_MIN = 5.8;
const A_FIN = 2.4; // fin del clip del salón (s)
const B_INI = 2.2; // empieza la puerta (fundido de 0,2 s)
const B_DUR = 2.8; // segundos del clip de la puerta que usamos (luego se vuelve a cerrar)
const B_DESDE = 0.8; // saltamos el principio, con la puerta quieta
const TEXTO = 3.7; // aparece el texto cuando la puerta ya está abierta

export const finIntroAdviento = (tFin: number) => Math.max(tFin, INTRO_MIN);

const Texto: React.FC<{ puerta: number; fecha: string; anio?: string }> = ({ puerta, fecha, anio }) => {
  const frame = useCurrentFrame();
  const entra = (d: number) =>
    interpolate(frame, [d, d + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.5)),
    });
  const a = entra(0);
  const b = entra(5);
  const c = entra(10);
  const sombra = "0 0 30px rgba(255,236,170,0.95), 0 0 60px rgba(255,214,10,0.6)";
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            opacity: a,
            transform: `scale(${0.7 + 0.3 * a})`,
            fontFamily: theme.font,
            fontWeight: 900,
            fontSize: 70,
            letterSpacing: 8,
            color: "#fff",
            background: "rgba(122,22,22,0.92)",
            border: "5px solid #f2c14e",
            borderRadius: 22,
            padding: "6px 38px",
            boxShadow: "0 10px 30px rgba(60,20,0,0.45)",
          }}
        >
          PUERTA {puerta}
        </div>
        <div
          style={{
            opacity: b,
            transform: `translateY(${(1 - b) * 30}px)`,
            fontFamily: theme.font,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1,
            color: "#3a1606",
            textAlign: "center",
            padding: "0 60px",
            textShadow: sombra,
          }}
        >
          {fecha}
        </div>
        {anio ? (
          <div
            style={{
              opacity: c,
              transform: `scale(${0.6 + 0.4 * c})`,
              fontFamily: theme.font,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 1,
              color: "#3a1606",
              background: "rgba(255,250,235,0.9)",
              borderRadius: 28,
              padding: "6px 46px",
              boxShadow: "0 10px 30px rgba(60,20,0,0.35)",
            }}
          >
            {anio}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const AdvientoIntroFlow: React.FC<{
  puerta: number;
  fecha: string;
  anio?: string;
  tFin: number; // fin de la frase con la fecha (s)
}> = ({ puerta, fecha, anio, tFin }) => {
  const frame = useCurrentFrame();
  const fin = f(finIntroAdviento(tFin));
  if (frame > fin + 8) return null;
  const salida = interpolate(frame, [fin - 2, fin + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opB = interpolate(frame, [f(B_INI), f(A_FIN)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finB = f(B_INI + B_DUR);
  const opHold = interpolate(frame, [finB - 8, finB], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoomHold = interpolate(frame, [finB - 8, fin + 8], [1, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cubre = { width: "100%", height: "100%", objectFit: "cover" as const };

  return (
    <AbsoluteFill style={{ opacity: salida, background: "#1a0b04" }}>
      <Sequence durationInFrames={f(A_FIN)}>
        <OffthreadVideo src={staticFile(`${CARPETA}/v_salon_dolly.mp4`)} muted playbackRate={1.5} style={cubre} />
      </Sequence>
      <Sequence from={f(B_INI)} durationInFrames={f(B_DUR)}>
        <AbsoluteFill style={{ opacity: opB }}>
          <OffthreadVideo src={staticFile(`${CARPETA}/v_puerta_abre.mp4`)} muted startFrom={f(B_DESDE)} style={cubre} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ opacity: opHold, transform: `scale(${zoomHold})` }}>
        <Img src={staticFile(`${CARPETA}/i02.jpg`)} style={cubre} />
      </AbsoluteFill>
      <Sequence from={f(TEXTO)}>
        <Texto puerta={puerta} fecha={fecha} anio={anio} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Vista previa sola de la intro (sin voz), para revisarla.
export const AdvientoIntroPreview: React.FC<{ puerta: number; fecha: string; anio?: string }> = (p) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AdvientoIntroFlow {...p} tFin={3} />
  </AbsoluteFill>
);
