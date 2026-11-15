import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { f } from "./kit";

// Intro del calendario de adviento. Un solo plano continuo:
// salón (imagen de Flow) con un calendario de 24 puertas numeradas encima, las de días
// anteriores ya abiertas con su imagen; la cámara se acerca de forma natural a la puerta
// del día (que tiene colgada una plaquita con la fecha), la puerta se abre y la cámara
// entra por ella hasta que la primera imagen de la historia llena la pantalla.

const { fontFamily: CINZEL } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });

const FONDO = "flow-adviento-intro/i03.jpg";
const MIN = 4.4;

// Imagen de fondo 768x1376 escalada a "cover" en 1080x1920.
// Tablero del calendario (cubre el que viene pintado en la imagen).
const BX = 268;
const BY = 498;
const BW = 544;
const BH = 724;
const CAB = 74; // cabecera "DICIEMBRE"
const PAD = 24;
const GAP = 10;
const COLS = 4;
const FILAS = 6;
const DW = (BW - PAD * 2 - GAP * (COLS - 1)) / COLS;
const DH = (BH - CAB - PAD * 2 - GAP * (FILAS - 1)) / FILAS;

const ORO = "#e9bf5c";
const ORO_OSC = "#8a6420";
const ROJO = "#9e2128";
const VERDE = "#1d5a3b";

// Orden mezclado de los números, como en un calendario real.
const ORDEN = [7, 19, 2, 13, 22, 5, 16, 10, 1, 24, 18, 8, 12, 3, 21, 15, 9, 23, 6, 17, 4, 14, 11, 20];

const celda = (n: number) => {
  const i = ORDEN.indexOf(n);
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const x = BX + PAD + c * (DW + GAP);
  const y = BY + CAB + PAD + r * (DH + GAP);
  return { x, y, cx: x + DW / 2, cy: y + DH / 2 };
};

export const finIntroAdviento = (tFin: number) => Math.max(tFin + 0.25, MIN);

const textoOro: React.CSSProperties = {
  fontFamily: CINZEL,
  fontWeight: 900,
  background: `linear-gradient(180deg, #fff3c2 0%, ${ORO} 45%, ${ORO_OSC} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 1.5px 0 rgba(40,15,0,0.85))",
};

const madera = (claro: string, oscuro: string) =>
  `repeating-linear-gradient(92deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0) 3px, rgba(255,255,255,0.03) 6px, rgba(0,0,0,0.05) 9px), linear-gradient(180deg, ${claro}, ${oscuro})`;

// Cara de una puertecita.
const Hoja: React.FC<{ n: number; brillo?: number }> = ({ n, brillo = 0 }) => {
  const color = n % 2 === 0 ? VERDE : ROJO;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 6,
        background: `radial-gradient(120% 90% at 35% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%), linear-gradient(160deg, ${color}, ${color} 60%, rgba(0,0,0,0.45) 140%)`,
        border: `2.5px solid ${ORO}`,
        boxShadow: `inset 0 0 0 4px rgba(0,0,0,0.18), inset 0 0 0 5.5px ${ORO_OSC}, 0 2px 4px rgba(0,0,0,0.5), 0 0 ${18 * brillo}px ${5 * brillo}px rgba(255,205,90,${0.85 * brillo})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
      }}
    >
      <div style={{ ...textoOro, fontSize: 44, lineHeight: 1, marginTop: -4 }}>{n}</div>
      <div
        style={{
          position: "absolute",
          right: 7,
          top: DH / 2 - 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #fff6cf, ${ORO} 50%, ${ORO_OSC})`,
          boxShadow: "0 1px 1px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
};

// Hueco de una puerta abierta: la imagen del día y la hoja girada.
const Abierta: React.FC<{ n: number; src: string; giro: number; luz?: number }> = ({ n, src, giro, luz = 0 }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.85)",
        background: "#1a0d05",
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(255,236,170,${0.75 * luz}), rgba(255,190,70,${0.35 * luz}) 60%, rgba(0,0,0,0.25))`,
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.7)",
        }}
      />
    </div>
    <div style={{ position: "absolute", inset: 0, perspective: 500 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `rotateY(${giro}deg)`, transformStyle: "preserve-3d" }}>
        <Hoja n={n} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 6,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            background: madera("#6b4426", "#3e2412"),
            border: `2px solid ${ORO_OSC}`,
          }}
        />
      </div>
    </div>
  </>
);

// Plaquita con la fecha, colgada del pomo de la puerta del día.
const Plaquita: React.FC<{ fecha: string; anio?: string; vaiven: number }> = ({ fecha, anio, vaiven }) => (
  <div
    style={{
      position: "absolute",
      left: DW - 11,
      top: DH / 2,
      transformOrigin: "top center",
      transform: `rotate(${vaiven}deg)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div style={{ width: 1.5, height: 10, background: "#d8c7a0" }} />
    <div
      style={{
        background: "linear-gradient(180deg, #f6ead0, #e2cfa6)",
        border: `1.5px solid ${ORO_OSC}`,
        borderRadius: 4,
        padding: "3px 7px 4px",
        boxShadow: "0 3px 5px rgba(0,0,0,0.45)",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 9.5, color: "#5a1414", letterSpacing: 0.4 }}>{fecha}</div>
      {anio ? <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 17, color: "#3a1606", lineHeight: 1.05 }}>{anio}</div> : null}
    </div>
  </div>
);

const ease = Easing.bezier(0.45, 0, 0.25, 1);

export const AdvientoIntroFlow: React.FC<{
  puerta: number;
  fecha: string;
  anio?: string;
  tFin: number; // fin de la frase con la fecha (s)
  entrada: string; // imagen con la que empieza la historia (se ve al entrar por la puerta)
  abiertas: { puerta: number; src: string }[];
}> = ({ puerta, fecha, anio, tFin, entrada, abiertas }) => {
  const frame = useCurrentFrame();
  const T = finIntroAdviento(tFin);
  const fin = f(T);
  if (frame > fin + 10) return null;

  const t1 = f(T * 0.56); // llega frente a la puerta
  const tAbre0 = t1 - 4;
  const tAbre1 = tAbre0 + f(0.75);
  const tEntra0 = tAbre1 - 6;

  const d = celda(puerta);
  // Cámara: (cx, cy) es el punto del mundo en el centro de la pantalla; s la escala.
  const s0 = 1;
  const s1 = 470 / DW;
  const s2 = Math.max(1080 / DW, 1920 / DH) * 1.04;
  const c0 = { x: 540, y: 960 };
  const c1 = { x: d.cx, y: d.cy + DH * 0.18 };
  const c2 = { x: d.cx, y: d.cy };

  const tramo = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  // Zoom hacia un punto: escala en espacio logarítmico y centro ligado a 1/s para que
  // el punto de destino no "patine" en pantalla.
  const zoom = (u: number, sa: number, sb: number, ca: { x: number; y: number }, cb: { x: number; y: number }) => {
    const s = Math.exp(Math.log(sa) + (Math.log(sb) - Math.log(sa)) * u);
    const w = sb === sa ? u : (1 - sa / s) / (1 - sa / sb);
    return { s, x: ca.x + (cb.x - ca.x) * w, y: ca.y + (cb.y - ca.y) * w };
  };
  const u1 = tramo(f(0.15), t1);
  const u2 = interpolate(frame, [tEntra0, fin], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const cam = frame < tEntra0 ? zoom(u1, s0, s1, c0, c1) : zoom(u2, s1, s2, c1, c2);

  const giro = interpolate(frame, [tAbre0, tAbre1], [0, -118], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const brillo = interpolate(frame, [0, f(0.8), tAbre0, tAbre0 + 6], [0, 0.9, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const luz = interpolate(frame, [tAbre0, tAbre0 + 8, fin - 6, fin], [0, 1, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vaiven = Math.sin(frame / 9) * 4 * interpolate(frame, [tAbre0, tAbre0 + 6], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plaquita = interpolate(frame, [tAbre0, tAbre0 + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parpadeo = 0.96 + 0.04 * Math.sin(frame / 3.1) * Math.sin(frame / 7.3);
  const salida = interpolate(frame, [fin, fin + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imgAbiertas = new Map(abiertas.map((a) => [a.puerta, a.src]));

  return (
    <AbsoluteFill style={{ opacity: salida, overflow: "hidden", background: "#1a0b04" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${540 - cam.x * cam.s}px, ${960 - cam.y * cam.s}px) scale(${cam.s})`,
        }}
      >
        <Img
          src={staticFile(FONDO)}
          style={{ position: "absolute", left: 0, top: -8, width: 1080, height: 1936, filter: `brightness(${parpadeo})` }}
        />
        {/* Tablero */}
        <div
          style={{
            position: "absolute",
            left: BX,
            top: BY,
            width: BW,
            height: BH,
            borderRadius: "26px 26px 10px 10px",
            background: madera("#5c371d", "#331c0d"),
            border: `4px solid ${ORO_OSC}`,
            boxShadow: `inset 0 0 0 3px ${ORO}, inset 0 0 30px rgba(0,0,0,0.6), 0 14px 30px rgba(0,0,0,0.6)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 16,
              height: CAB - 26,
              borderRadius: 10,
              background: madera("#4a2a14", "#2a170a"),
              boxShadow: `inset 0 2px 6px rgba(0,0,0,0.7), 0 0 0 2px ${ORO_OSC}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ ...textoOro, fontSize: 30, letterSpacing: 5 }}>DICIEMBRE</div>
          </div>
        </div>
        {/* Puertas */}
        {ORDEN.map((n) => {
          const q = celda(n);
          const esHoy = n === puerta;
          const src = imgAbiertas.get(n);
          return (
            <div key={n} style={{ position: "absolute", left: q.x, top: q.y, width: DW, height: DH }}>
              {esHoy ? (
                <>
                  <Abierta n={n} src={entrada} giro={giro} luz={luz} />
                  {giro === 0 ? (
                    <div style={{ position: "absolute", inset: 0 }}>
                      <Hoja n={n} brillo={brillo} />
                    </div>
                  ) : null}
                </>
              ) : src ? (
                <Abierta n={n} src={src} giro={-105} />
              ) : (
                <Hoja n={n} />
              )}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: d.x, top: d.y, width: DW, height: DH, opacity: plaquita, zIndex: 5 }}>
          <Plaquita fecha={fecha} anio={anio} vaiven={vaiven} />
        </div>
      </div>
      {/* Viñeta cálida */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,6,0,0.55) 100%)", opacity: 1 - u2 }} />
    </AbsoluteFill>
  );
};

// Vista previa sola de la intro (sin voz), para revisarla.
export const AdvientoIntroPreview: React.FC<{
  puerta: number;
  fecha: string;
  anio?: string;
  entrada: string;
  abiertas: { puerta: number; src: string }[];
}> = (p) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill>
      <Img src={staticFile(p.entrada)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AdvientoIntroFlow {...p} tFin={3.4} />
  </AbsoluteFill>
);
