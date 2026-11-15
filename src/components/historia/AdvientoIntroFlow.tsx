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
// Colores navideños de las puertas: papel de regalo rojo, verde y crema con su lazo.
const ESTILOS: { fondo: [string, string]; cinta: [string, string]; dibujo: string }[] = [
  { fondo: ["#d23a32", "#8e1a17"], cinta: ["#ffe6a0", "#c9962e"], dibujo: "repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0 6px, rgba(255,255,255,0) 6px 12px)" },
  { fondo: ["#2f8a4c", "#14532b"], cinta: ["#e8473d", "#9d1d18"], dibujo: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.16) 1.4px, rgba(0,0,0,0) 2px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.16) 1.4px, rgba(0,0,0,0) 2px)" },
  { fondo: ["#f3e6cc", "#cdb48a"], cinta: ["#d23a32", "#8e1a17"], dibujo: "repeating-linear-gradient(-45deg, rgba(200,40,40,0.16) 0 5px, rgba(0,0,0,0) 5px 13px)" },
  { fondo: ["#a8262a", "#5e0f12"], cinta: ["#3c9a5a", "#1d5a31"], dibujo: "radial-gradient(circle at 50% 50%, rgba(255,230,170,0.14) 1.4px, rgba(0,0,0,0) 2px)" },
];
const estilo = (n: number) => ESTILOS[(n * 7 + Math.floor((n - 1) / COLS)) % ESTILOS.length];

// Cara de una puertecita: un regalo con cinta, lazo y etiqueta con el número.
const Hoja: React.FC<{ n: number; brillo?: number }> = ({ n, brillo = 0 }) => {
  const e = estilo(n);
  const cinta = `linear-gradient(90deg, ${e.cinta[1]}, ${e.cinta[0]} 45%, ${e.cinta[1]})`;
  const cintaH = `linear-gradient(180deg, ${e.cinta[1]}, ${e.cinta[0]} 45%, ${e.cinta[1]})`;
  const lazo = (lado: 1 | -1): React.CSSProperties => ({
    position: "absolute",
    left: DW / 2 - 13 + lado * 8,
    top: 3,
    width: 18,
    height: 12,
    borderRadius: "50%",
    border: `3px solid ${e.cinta[0]}`,
    boxShadow: `0 1px 1px rgba(0,0,0,0.4), inset 0 0 0 1px ${e.cinta[1]}`,
    transform: `rotate(${lado * 22}deg)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 5,
        overflow: "hidden",
        background: `${e.dibujo}, linear-gradient(165deg, ${e.fondo[0]}, ${e.fondo[1]})`,
        backgroundSize: "auto, auto",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 3px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.55), 0 0 ${20 * brillo}px ${6 * brillo}px rgba(255,205,110,${0.8 * brillo})`,
        backfaceVisibility: "hidden",
      }}
    >
      {/* Cinta en cruz */}
      <div style={{ position: "absolute", left: DW / 2 - 6, top: 0, width: 12, height: "100%", background: cinta }} />
      <div style={{ position: "absolute", top: DH / 2 - 6, left: 0, height: 12, width: "100%", background: cintaH }} />
      {/* Lazo */}
      <div style={lazo(-1)} />
      <div style={lazo(1)} />
      <div style={{ position: "absolute", left: DW / 2 - 5, top: 7, width: 10, height: 9, borderRadius: 4, background: e.cinta[0], boxShadow: "0 1px 1px rgba(0,0,0,0.5)" }} />
      {/* Etiqueta con el número */}
      <div
        style={{
          position: "absolute",
          left: DW / 2 - 23,
          top: DH / 2 - 21,
          width: 46,
          height: 42,
          borderRadius: 10,
          background: "radial-gradient(circle at 40% 30%, #fffaf0, #efe1c2)",
          boxShadow: "0 2px 3px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(201,150,46,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 28, lineHeight: 1, marginTop: -1, color: "#a3201c" }}>{n}</div>
      </div>
      {/* Brillo del papel */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%)" }} />
    </div>
  );
};

// Guirnalda de luces que rodea el tablero.
const COLORES_LUZ = ["#ff4d4d", "#ffd75e", "#4dd97a", "#5eb6ff", "#ff9a3c"];
const Luces: React.FC<{ frame: number }> = ({ frame }) => {
  const puntos: { x: number; y: number }[] = [];
  const paso = 34;
  const borde = 4;
  const nx = Math.round(BW / paso);
  const ny = Math.round(BH / paso);
  for (let i = 0; i <= nx; i++) puntos.push({ x: BX + (BW * i) / nx, y: BY - borde });
  for (let i = 1; i <= ny; i++) puntos.push({ x: BX + BW + borde, y: BY + (BH * i) / ny });
  for (let i = nx - 1; i >= 0; i--) puntos.push({ x: BX + (BW * i) / nx, y: BY + BH + borde });
  for (let i = ny - 1; i >= 1; i--) puntos.push({ x: BX - borde, y: BY + (BH * i) / ny });
  // Cable con caída suave entre bombillas.
  let dCable = `M ${puntos[0].x} ${puntos[0].y}`;
  for (let i = 1; i <= puntos.length; i++) {
    const p0 = puntos[i - 1];
    const p1 = puntos[i % puntos.length];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const L = Math.hypot(dx, dy) || 1;
    // la curva se hunde hacia fuera del tablero
    const ox = (dy / L) * 7;
    const oy = (-dx / L) * 7;
    dCable += ` Q ${mx - ox} ${my - oy} ${p1.x} ${p1.y}`;
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible", pointerEvents: "none" }}>
      <path d={dCable} fill="none" stroke="#1c2a14" strokeWidth={2.2} />
      {puntos.map((p, i) => {
        const c = COLORES_LUZ[i % COLORES_LUZ.length];
        const on = 0.55 + 0.45 * Math.max(0, Math.sin(frame / 9 + i * 1.7));
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={11} fill={c} opacity={0.28 * on} />
            <ellipse cx={p.x} cy={p.y} rx={4.2} ry={5.6} fill={c} opacity={0.55 + 0.45 * on} />
            <circle cx={p.x - 1.3} cy={p.y - 1.8} r={1.4} fill="#fff" opacity={0.8 * on} />
          </g>
        );
      })}
    </svg>
  );
};

// Ramito de acebo para las esquinas de la cabecera.
const Acebo: React.FC<{ x: number; y: number; espejo?: boolean }> = ({ x, y, espejo }) => (
  <svg style={{ position: "absolute", left: x - 40, top: y - 30, width: 80, height: 60, overflow: "visible", transform: espejo ? "scaleX(-1)" : undefined }}>
    <path d="M40 30 C 26 14, 8 18, 2 10 C 10 24, 6 34, 14 40 C 20 32, 30 36, 40 30 Z" fill="#2f7d3f" stroke="#164a22" strokeWidth={1.5} />
    <path d="M40 30 C 46 12, 64 8, 72 2 C 66 16, 74 26, 68 34 C 60 28, 50 34, 40 30 Z" fill="#3a9150" stroke="#164a22" strokeWidth={1.5} />
    <path d="M40 30 L 12 22 M40 30 L 64 12" stroke="#164a22" strokeWidth={1.2} />
    <circle cx={36} cy={32} r={6} fill="#d8262c" stroke="#7d0f12" strokeWidth={1} />
    <circle cx={45} cy={34} r={6} fill="#e3333a" stroke="#7d0f12" strokeWidth={1} />
    <circle cx={40} cy={25} r={6} fill="#c91f25" stroke="#7d0f12" strokeWidth={1} />
    <circle cx={34} cy={30} r={1.6} fill="#fff" opacity={0.8} />
    <circle cx={43} cy={32} r={1.6} fill="#fff" opacity={0.8} />
    <circle cx={38} cy={23} r={1.6} fill="#fff" opacity={0.8} />
  </svg>
);

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
          background: "linear-gradient(170deg, #f1e4c8, #c9b088)",
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
        <Acebo x={BX + 78} y={BY + 40} />
        <Acebo x={BX + BW - 78} y={BY + 40} espejo />
        <Luces frame={frame} />
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
