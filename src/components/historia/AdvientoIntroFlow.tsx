import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { f } from "./kit";

// Intro del calendario de adviento. Un solo plano continuo:
// salón (imagen de Flow) con un calendario de madera de 24 puertas en orden; las de días
// anteriores ya abiertas con su imagen y su año encima. La cámara se acerca de forma natural
// a la puerta del día, la puerta se abre y la cámara entra por ella. Al terminar, la imagen de
// dentro ocupa la pantalla exactamente igual que el primer plano de la historia (zoom ZOOM_ENTRADA),
// que luego se va alejando despacio: no hay cambio de tamaño ni corte.

const { fontFamily: CINZEL } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });

const FONDO = "flow-adviento-intro/i03.jpg";
const MIN = 4.4;
export const ZOOM_ENTRADA = 1.08;

// Tablero (cubre el calendario que viene pintado en la imagen de fondo).
const BX = 262;
const BY = 452;
const BW = 556;
const BH = 806;
const CAB = 70; // cabecera "DICIEMBRE"
const PAD = 22;
const ROT = 18; // espacio para el año encima de cada puerta
const GX = 10;
const GY = 28;
const COLS = 4;
const FILAS = 6;
const DW = (BW - PAD * 2 - GX * (COLS - 1)) / COLS;
const DH = (BH - CAB - PAD * 2 - ROT - GY * (FILAS - 1)) / FILAS;

const ORO = "#e9bf5c";
const ORO_OSC = "#8a6420";

const celda = (n: number) => {
  const i = n - 1;
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const x = BX + PAD + c * (DW + GX);
  const y = BY + CAB + PAD + ROT + r * (DH + GY);
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
  filter: "drop-shadow(0 1.5px 0 rgba(30,12,0,0.9))",
};

const veta = "repeating-linear-gradient(88deg, rgba(60,30,10,0.10) 0px, rgba(60,30,10,0) 2px, rgba(255,230,190,0.05) 5px, rgba(60,30,10,0.08) 8px, rgba(60,30,10,0) 11px)";
const nudos = "radial-gradient(ellipse 18% 9% at 70% 30%, rgba(60,30,10,0.18), rgba(0,0,0,0) 70%), radial-gradient(ellipse 14% 7% at 25% 75%, rgba(60,30,10,0.14), rgba(0,0,0,0) 70%)";
const madera = (claro: string, oscuro: string) => `${veta}, ${nudos}, linear-gradient(170deg, ${claro}, ${oscuro})`;
const TONOS: [string, string][] = [
  ["#b8834d", "#865427"], // roble
  ["#93603a", "#5f3b1e"], // nogal
];

// Cara de una puertecita de madera tallada.
const Hoja: React.FC<{ n: number; brillo?: number }> = ({ n, brillo = 0 }) => {
  const [claro, oscuro] = TONOS[(n + Math.floor((n - 1) / COLS)) % 2];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 5,
        background: madera(claro, oscuro),
        boxShadow: `inset 0 1px 0 rgba(255,230,190,0.35), inset 0 -2px 3px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.55), 0 0 ${20 * brillo}px ${6 * brillo}px rgba(255,205,110,${0.8 * brillo})`,
        backfaceVisibility: "hidden",
      }}
    >
      {/* Panel tallado */}
      <div
        style={{
          position: "absolute",
          inset: 7,
          borderRadius: 4,
          boxShadow: "inset 1.5px 1.5px 2px rgba(0,0,0,0.45), inset -1px -1px 1px rgba(255,225,180,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: CINZEL,
            fontWeight: 900,
            fontSize: 42,
            lineHeight: 1,
            marginTop: -3,
            color: "#3a200d",
            textShadow: "0 1px 0 rgba(255,228,185,0.45), 0 -1px 0 rgba(0,0,0,0.35)",
          }}
        >
          {n}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 4,
          top: DH / 2 - 4,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #fff6cf, ${ORO} 50%, ${ORO_OSC})`,
          boxShadow: "0 1px 1px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
};

// La hoja girada (abierta), con su cara trasera de madera.
const HojaGirada: React.FC<{ n: number; giro: number; brillo?: number }> = ({ n, giro, brillo }) => (
  <div style={{ position: "absolute", inset: 0, perspective: 520 }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `rotateY(${giro}deg)`, transformStyle: "preserve-3d" }}>
      <Hoja n={n} brillo={brillo} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 5,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          background: madera("#7a5130", "#4a2c15"),
        }}
      />
    </div>
  </div>
);

// Hueco de una puerta ya abierta (días anteriores).
const Hueco: React.FC<{ src: string }> = ({ src }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 3, overflow: "hidden", background: "#1a0d05" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 10px 2px rgba(0,0,0,0.75)" }} />
  </div>
);

const Anio: React.FC<{ anio: string; x: number; y: number; opacidad?: number; brillo?: number }> = ({ anio, x, y, opacidad = 1, brillo = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - ROT - 6,
      width: DW,
      height: ROT + 4,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: opacidad,
    }}
  >
    <div style={{ ...textoOro, fontSize: 17, letterSpacing: 1.5, filter: `drop-shadow(0 1.5px 0 rgba(30,12,0,0.9)) drop-shadow(0 0 ${6 * brillo}px rgba(255,214,120,${brillo}))` }}>
      {anio}
    </div>
  </div>
);

const ease = Easing.bezier(0.45, 0, 0.25, 1);

export const AdvientoIntroFlow: React.FC<{
  puerta: number;
  anio?: string;
  tFin: number; // fin de la frase con la fecha (s)
  entrada: string; // primera imagen de la historia (se ve al entrar por la puerta)
  abiertas: { puerta: number; src: string; anio: string }[];
}> = ({ puerta, anio, tFin, entrada, abiertas }) => {
  const frame = useCurrentFrame();
  const T = finIntroAdviento(tFin);
  const fin = f(T);
  if (frame >= fin) return null;

  const t1 = f(T * 0.52); // llega frente a la puerta
  const tAbre0 = t1 - 3;
  const tAbre1 = tAbre0 + f(0.7);
  const tEntra0 = tAbre0 + f(0.3);

  const d = celda(puerta);
  // La imagen de dentro es un "fotograma" de 1080x1920 reducido al ancho de la puerta.
  const k = Math.max(DW / 1080, DH / 1920);
  const iw = 1080 * k;
  const ih = 1920 * k;
  // Cámara: (x, y) es el punto del mundo en el centro de la pantalla; s la escala.
  const s0 = 1;
  const s1 = 430 / DW;
  const s2 = ZOOM_ENTRADA / k;
  const c0 = { x: 540, y: 960 };
  const c1 = { x: d.cx, y: d.cy - 14 };
  const c2 = { x: d.cx, y: d.cy };

  const tramo = (a: number, b: number, e = ease) =>
    interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  // Zoom hacia un punto: escala en espacio logarítmico y centro ligado a 1/s.
  const zoom = (u: number, sa: number, sb: number, ca: { x: number; y: number }, cb: { x: number; y: number }) => {
    const s = Math.exp(Math.log(sa) + (Math.log(sb) - Math.log(sa)) * u);
    const w = (1 - sa / s) / (1 - sa / sb);
    return { s, x: ca.x + (cb.x - ca.x) * w, y: ca.y + (cb.y - ca.y) * w };
  };
  const u1 = tramo(f(0.1), t1);
  const u2 = tramo(tEntra0, fin - 1, Easing.bezier(0.5, 0, 0.3, 1));
  const cam = frame < tEntra0 ? zoom(u1, s0, s1, c0, c1) : zoom(u2, s1, s2, c1, c2);

  const giro = interpolate(frame, [tAbre0, tAbre1], [0, -118], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const brillo = interpolate(frame, [0, f(0.8), tAbre0, tAbre0 + 6], [0, 0.9, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const luz = interpolate(frame, [tAbre0, tAbre0 + 6, tAbre1 + 4, fin - 4], [0, 0.85, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anioHoy = interpolate(frame, [f(T * 0.25), f(T * 0.42)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Al cruzar la puerta, el recorte del hueco se abre hasta el fotograma completo.
  // Termina bastante antes del final para que los últimos fotogramas sean solo la imagen.
  const tAbierto = Math.round(tEntra0 + (fin - 1 - tEntra0) * 0.72);
  const recorte = ((ih - DH) / 2) * (1 - tramo(tEntra0 + f(0.35), tAbierto, Easing.bezier(0.4, 0, 0.2, 1)));
  const parpadeo = 0.96 + 0.04 * Math.sin(frame / 3.1) * Math.sin(frame / 7.3);
  const mapa = new Map(abiertas.map((a) => [a.puerta, a]));

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a0b04" }}>
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
        <Img src={staticFile(FONDO)} style={{ position: "absolute", left: 0, top: -8, width: 1080, height: 1936, filter: `brightness(${parpadeo})` }} />
        {/* Tablero */}
        <div
          style={{
            position: "absolute",
            left: BX,
            top: BY,
            width: BW,
            height: BH,
            borderRadius: "24px 24px 10px 10px",
            background: madera("#5a361c", "#2e190b"),
            boxShadow: "inset 0 0 0 5px #3a2110, inset 0 0 0 7px rgba(255,220,170,0.18), inset 0 0 40px rgba(0,0,0,0.55), 0 16px 34px rgba(0,0,0,0.65)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 16,
              height: CAB - 24,
              borderRadius: 8,
              background: madera("#4a2a14", "#2a170a"),
              boxShadow: "inset 1.5px 2px 4px rgba(0,0,0,0.7), inset -1px -1px 1px rgba(255,220,170,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ ...textoOro, fontSize: 28, letterSpacing: 5 }}>DICIEMBRE</div>
          </div>
        </div>
        {/* Puertas */}
        {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => {
          const q = celda(n);
          const a = mapa.get(n);
          if (n === puerta) return null;
          return (
            <React.Fragment key={n}>
              <div style={{ position: "absolute", left: q.x, top: q.y, width: DW, height: DH }}>
                {a ? (
                  <>
                    <Hueco src={a.src} />
                    <HojaGirada n={n} giro={-108} />
                  </>
                ) : (
                  <Hoja n={n} />
                )}
              </div>
              {a ? <Anio anio={a.anio} x={q.x} y={q.y} /> : null}
            </React.Fragment>
          );
        })}
        {/* Puerta del día (encima de todo) */}
        {anio ? <Anio anio={anio} x={d.x} y={d.y} opacidad={anioHoy} brillo={anioHoy} /> : null}
        <div
          style={{
            position: "absolute",
            left: d.cx - iw / 2,
            top: d.cy - ih / 2,
            width: iw,
            height: ih,
            clipPath: `inset(${recorte}px 0px ${recorte}px 0px round ${3 * (recorte / ((ih - DH) / 2 || 1))}px)`,
            background: "#1a0d05",
          }}
        >
          <Img src={staticFile(entrada)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, rgba(255,236,170,${0.8 * luz}), rgba(255,190,70,${0.35 * luz}) 55%, rgba(0,0,0,0) 80%)`,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: d.x, top: d.y, width: DW, height: DH }}>
          <HojaGirada n={puerta} giro={giro} brillo={brillo} />
        </div>
      </div>
      {/* Viñeta cálida, desaparece al entrar */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,6,0,0.5) 100%)", opacity: 1 - u2 }} />
    </AbsoluteFill>
  );
};

// Vista previa sola de la intro (sin voz): al acabar sigue la primera imagen alejándose.
export const AdvientoIntroPreview: React.FC<{
  puerta: number;
  anio?: string;
  entrada: string;
  abiertas: { puerta: number; src: string; anio: string }[];
}> = (p) => {
  const frame = useCurrentFrame();
  const fin = f(finIntroAdviento(3.4));
  const z = interpolate(frame, [fin, fin + f(4)], [ZOOM_ENTRADA, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.67, 1) });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(p.entrada)} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${z})` }} />
      </AbsoluteFill>
      <AdvientoIntroFlow {...p} tFin={3.4} />
    </AbsoluteFill>
  );
};
