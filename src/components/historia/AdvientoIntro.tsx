import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { AMARILLO, f } from "./kit";

// Intro del calendario de adviento (diciembre 2026). Se superpone a los primeros
// segundos de cada historia: el tablero con 24 puertas, la cámara se acerca a la
// puerta del día, la puerta se abre y aparece la fecha. Todo con useCurrentFrame.

const ROJO_PUERTA = "#b3202f";
const VERDE_PUERTA = "#1f6b45";
const ORO = "#f2c14e";
const MADERA = "#4a2c1a";

const COLS = 4;
const FILAS = 6;
const TAB_W = 900;
const TAB_H = 1320;
const TAB_X = (1080 - TAB_W) / 2;
const TAB_Y = 420;
const GAP = 22;
const PUERTA_W = (TAB_W - 80 - GAP * (COLS - 1)) / COLS;
const PUERTA_H = (TAB_H - 80 - GAP * (FILAS - 1)) / FILAS;

const colorPuerta = (n: number) => (n % 2 === 0 ? VERDE_PUERTA : ROJO_PUERTA);

// Orden mezclado de los números, como en un calendario de adviento real.
const ORDEN = [7, 19, 2, 13, 22, 5, 16, 10, 1, 24, 18, 8, 12, 3, 21, 15, 9, 23, 6, 17, 4, 14, 11, 20];

const posPuerta = (n: number) => {
  const i = ORDEN.indexOf(n);
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const x = TAB_X + 40 + c * (PUERTA_W + GAP);
  const y = TAB_Y + 40 + r * (PUERTA_H + GAP);
  return { x, y, cx: x + PUERTA_W / 2, cy: y + PUERTA_H / 2 };
};

const Nieve: React.FC<{ cantidad?: number }> = ({ cantidad = 70 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(cantidad).fill(0).map((_, i) => {
        const x0 = random(`nx${i}`) * 1080;
        const vel = 1.2 + random(`nv${i}`) * 2.4;
        const tam = 4 + random(`ns${i}`) * 9;
        const y = ((random(`ny${i}`) * 2100 + frame * vel * 2) % 2100) - 100;
        const x = x0 + Math.sin((frame + i * 13) / 22) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: tam,
              height: tam,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const CaraPuerta: React.FC<{ n: number; w: number; h: number; numSize: number; brillo?: number }> = ({ n, w, h, numSize, brillo = 0 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: w * 0.08,
      background: `linear-gradient(160deg, ${colorPuerta(n)} 0%, ${colorPuerta(n)} 55%, rgba(0,0,0,0.35) 140%)`,
      border: `${Math.max(3, w * 0.025)}px solid ${ORO}`,
      boxShadow: `0 0 ${40 * brillo}px ${12 * brillo}px rgba(255,214,10,${0.75 * brillo}), inset 0 0 ${w * 0.12}px rgba(0,0,0,0.35)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.font,
      fontWeight: 900,
      fontSize: numSize,
      color: ORO,
      textShadow: "0 4px 0 rgba(0,0,0,0.35)",
      position: "relative",
    }}
  >
    {n}
    <div
      style={{
        position: "absolute",
        right: w * 0.06,
        top: h / 2 - w * 0.03,
        width: w * 0.06,
        height: w * 0.06,
        borderRadius: "50%",
        background: ORO,
      }}
    />
  </div>
);

export const AdvientoIntro: React.FC<{
  puerta: number;
  fecha: string; // "1 de diciembre"
  anio?: string; // "1913"
  tPuerta: number; // fin de la frase "Puerta N." (s)
  tFin: number; // fin de la frase con la fecha (s)
}> = ({ puerta, fecha, anio, tPuerta, tFin }) => {
  const frame = useCurrentFrame();
  const fin = f(tFin);
  const zoomFin = f(Math.min(1.1, Math.max(0.7, tPuerta - 0.15)));
  const abre0 = zoomFin;
  const abre1 = abre0 + 16;
  const p = posPuerta(puerta);

  // Fase A: tablero completo y acercamiento a la puerta del día.
  const z = interpolate(frame, [6, zoomFin], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const escala = 1 + z * (1080 / PUERTA_W - 1);
  const tx = (540 - p.cx) * z;
  const ty = (960 - p.cy) * z;
  const brillo = interpolate(frame, [0, 10, zoomFin], [0, 1, 1], { extrapolateRight: "clamp" });
  const opA = interpolate(frame, [zoomFin - 3, zoomFin + 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fase B: puerta a pantalla completa que se abre.
  const giro = interpolate(frame, [abre0, abre1], [0, -112], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const luz = interpolate(frame, [abre0 + 4, abre1 + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fechaIn = interpolate(frame, [abre1 - 2, abre1 + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  const salida = interpolate(frame, [fin - 2, fin + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame > fin + 8) return null;

  return (
    <AbsoluteFill style={{ opacity: salida }}>
      {/* Fase B (debajo): interior iluminado + puerta grande */}
      <AbsoluteFill
        style={{
          background: MADERA,
          opacity: frame >= zoomFin - 3 ? 1 : 0,
        }}
      >
        <AbsoluteFill
          style={{
            opacity: luz,
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at 50% 45%, #fff3c4 0%, ${AMARILLO} 22%, #c47a12 55%, #3a1606 100%)`,
          }}
        >
          <div
            style={{
              transform: `scale(${0.6 + 0.4 * fechaIn})`,
              opacity: fechaIn,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ fontFamily: theme.font, fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 6, textShadow: "0 4px 0 rgba(58,22,6,0.6)" }}>
              PUERTA {puerta}
            </div>
            <div
              style={{
                fontFamily: theme.font,
                fontWeight: 900,
                fontSize: 104,
                color: "#2a1004",
                textAlign: "center",
                lineHeight: 1.0,
                padding: "0 60px",
              }}
            >
              {fecha}
            </div>
            {anio ? (
              <div
                style={{
                  marginTop: 10,
                  fontFamily: theme.font,
                  fontWeight: 900,
                  fontSize: 150,
                  color: "#3a1606",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 28,
                  padding: "4px 44px",
                }}
              >
                {anio}
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ perspective: 1800 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 960 - (PUERTA_H * 1080) / PUERTA_W / 2,
              transformOrigin: "left center",
              transform: `rotateY(${giro}deg)`,
              opacity: interpolate(giro, [-112, -95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <CaraPuerta n={puerta} w={1080} h={(PUERTA_H * 1080) / PUERTA_W} numSize={520} />
          </div>
        </AbsoluteFill>
        <Nieve cantidad={40} />
      </AbsoluteFill>

      {/* Fase A (encima): tablero */}
      <AbsoluteFill
        style={{
          opacity: opA,
          background: "radial-gradient(circle at 50% 30%, #23324a 0%, #0c1220 70%)",
        }}
      >
        <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${escala})`, transformOrigin: `${p.cx}px ${p.cy}px` }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 170,
              textAlign: "center",
              fontFamily: theme.font,
              fontWeight: 900,
              color: "#fff",
              fontSize: 78,
              lineHeight: 1.05,
              textShadow: "0 5px 0 rgba(0,0,0,0.4)",
            }}
          >
            CALENDARIO
            <br />
            <span style={{ color: ORO }}>DE ADVIENTO</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: TAB_X,
              top: TAB_Y,
              width: TAB_W,
              height: TAB_H,
              borderRadius: 36,
              background: `linear-gradient(180deg, ${MADERA}, #2b180d)`,
              border: `8px solid ${ORO}`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          />
          {ORDEN.map((n) => {
            const q = posPuerta(n);
            return (
              <div key={n} style={{ position: "absolute", left: q.x, top: q.y }}>
                <CaraPuerta n={n} w={PUERTA_W} h={PUERTA_H} numSize={80} brillo={n === puerta ? brillo : 0} />
              </div>
            );
          })}
        </AbsoluteFill>
        <Nieve />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
