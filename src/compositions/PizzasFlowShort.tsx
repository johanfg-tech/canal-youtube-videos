import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";
import { Subtitulos, Palabra } from "../components/datos/Subtitulos";
import { AMARILLO, FPS, NARANJA, ROJO, RemateFinal, VERDE, f, texto, useEntrada } from "../components/historia/kit";
import guion from "../../guiones/s16/pizzas.json";

// Historia de las pizzas de bitcoin con escenas generadas en Google Flow
// (imágenes Nano Banana + 4 clips Veo 3.1 Lite). Archivos en public/flow-pizzas/.

const COLA = 1.6;
const FIN_VOZ = 98.2;
export const duracionPizzasFlow = Math.ceil((FIN_VOZ + COLA) * FPS);

const ruta = (n: string) => staticFile(`flow-pizzas/${n}`);

type Plano = {
  ini: number;
  fin: number;
  src: string;
  video?: boolean;
  desde?: number; // segundo del clip donde empieza
  zoom?: [number, number];
  foco?: [number, number, number, number]; // origen x0,y0 -> x1,y1 en %
};

// Lista de planos ajustada a la voz. Cada imagen sale una sola vez, con un movimiento
// de cámara suave (zoom de 1,00 a ~1,08) y fundido corto entre planos.
const PLANOS: Plano[] = [
  { ini: 0, fin: 3.7, src: "i01-pizzas.jpg", zoom: [1.08, 1.0] },
  { ini: 3.7, fin: 5.5, src: "i11-montana.jpg", zoom: [1.0, 1.06], foco: [50, 30, 50, 30] },
  { ini: 5.5, fin: 7.7, src: "i02-florida.jpg", zoom: [1.0, 1.07], foco: [50, 40, 50, 50] },
  { ini: 7.7, fin: 8.6, src: "n01-mapa.jpg", zoom: [1.0, 1.05], foco: [75, 62, 75, 62] },
  { ini: 8.6, fin: 12.1, src: "v03-pc.mp4", video: true, desde: 0 },
  { ini: 12.1, fin: 14.5, src: "n02-cartera.jpg", zoom: [1.0, 1.07], foco: [50, 40, 50, 40] },
  { ini: 14.5, fin: 17.0, src: "n03-tendero.jpg", zoom: [1.07, 1.0], foco: [55, 50, 50, 50] },
  { ini: 17.0, fin: 20.0, src: "i04-foro.jpg", zoom: [1.0, 1.08], foco: [50, 45, 50, 42] },
  { ini: 20.0, fin: 23.1, src: "n04-esperanza.jpg", zoom: [1.0, 1.07], foco: [50, 35, 50, 35] },
  { ini: 23.1, fin: 24.7, src: "n05-calendario.jpg", zoom: [1.0, 1.05], foco: [50, 60, 50, 65] },
  { ini: 24.7, fin: 26.0, src: "n06-decepcion.jpg", zoom: [1.05, 1.0] },
  { ini: 26.0, fin: 28.2, src: "i05-espera.jpg", zoom: [1.0, 1.06], foco: [50, 45, 50, 45] },
  { ini: 28.2, fin: 31.3, src: "i06-california.jpg", zoom: [1.0, 1.07], foco: [50, 45, 52, 40] },
  { ini: 31.3, fin: 34.5, src: "n07-joven.jpg", zoom: [1.07, 1.0], foco: [45, 40, 45, 40] },
  { ini: 34.5, fin: 36.0, src: "i07-telefono.jpg", zoom: [1.0, 1.05], foco: [45, 40, 45, 40] },
  { ini: 36.0, fin: 37.8, src: "n08-pizzeria.jpg", zoom: [1.06, 1.0], foco: [50, 45, 50, 45] },
  { ini: 37.8, fin: 41.4, src: "v08-repartidor.mp4", video: true, desde: 0.3 },
  { ini: 41.4, fin: 46.4, src: "v09-entrega.mp4", video: true, desde: 0 },
  { ini: 46.4, fin: 49.4, src: "i10-foto.jpg", zoom: [1.0, 1.07], foco: [45, 40, 45, 40] },
  { ini: 49.4, fin: 51.4, src: "i09-entrega.jpg", zoom: [1.06, 1.0], foco: [55, 45, 55, 45] },
  { ini: 51.4, fin: 53.2, src: "i08-repartidor.jpg", zoom: [1.0, 1.05], foco: [45, 55, 45, 55] },
  { ini: 53.2, fin: 57.0, src: "v11-montana.mp4", video: true, desde: 0 },
  // 57.0 - 71.3: gráfico animado (componente Grafico)
  { ini: 71.3, fin: 72.6, src: "n10-balanza.jpg", zoom: [1.0, 1.04] },
  { ini: 72.6, fin: 76.8, src: "n11-torre.jpg", zoom: [1.0, 1.07], foco: [50, 45, 55, 40] },
  { ini: 76.8, fin: 78.9, src: "i12-laszlo.jpg", zoom: [1.06, 1.0], foco: [50, 40, 50, 40] },
  { ini: 78.9, fin: 81.4, src: "n12-niega.jpg", zoom: [1.0, 1.06], foco: [50, 35, 50, 35] },
  { ini: 81.4, fin: 86.0, src: "n13-bombilla.jpg", zoom: [1.0, 1.08], foco: [55, 50, 60, 50] },
  { ini: 86.0, fin: 89.9, src: "n14-fiesta.jpg", zoom: [1.07, 1.0], foco: [50, 45, 50, 45] },
  { ini: 89.9, fin: FIN_VOZ + COLA, src: "i01-pizzas.jpg", zoom: [1.0, 1.06] },
];

const FUNDIDO = 8; // fotogramas de fundido entre planos

const PlanoVista: React.FC<{ p: Plano; primero: boolean }> = ({ p, primero }) => {
  const frame = useCurrentFrame();
  const dur = f(p.fin - p.ini) + FUNDIDO;
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacidad = primero ? 1 : interpolate(frame, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  if (p.video) {
    return (
      <AbsoluteFill style={{ opacity: opacidad }}>
        <OffthreadVideo src={ruta(p.src)} startFrom={f(p.desde ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  const [z0, z1] = p.zoom ?? [1, 1.06];
  const [x0, y0, x1, y1] = p.foco ?? [50, 50, 50, 50];
  // Movimiento casi lineal: velocidad constante, como una cámara real.
  const e = Easing.bezier(0.33, 0, 0.67, 1)(t);
  const z = z0 + (z1 - z0) * e;
  const ox = x0 + (x1 - x0) * e;
  const oy = y0 + (y1 - y0) * e;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: opacidad }}>
      <Img
        src={ruta(p.src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox}% ${oy}%`, transform: `scale(${z})` }}
      />
    </AbsoluteFill>
  );
};

// Gráfico del valor de los 10.000 bitcoins, sobre la montaña de monedas desenfocada.
const PUNTOS = [
  { anio: "2010", v: 41, en: 57.0 },
  { anio: "2013", v: 10e6, en: 57.6 },
  { anio: "2017", v: 200e6, en: 60.0 },
  { anio: "2021", v: 690e6, en: 62.9 },
  { anio: "Máximo", v: 1260e6, en: 65.6 },
  { anio: "Hoy", v: 750e6, en: 68.9 },
];
const G0 = 57.0;
const G1 = 71.3;

const millones = (v: number) =>
  v < 1e6 ? `${Math.round(v)} $` : `${String(Math.round(v / 1e6)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} millones $`;

const Grafico: React.FC = () => {
  const frame = useCurrentFrame();
  const t = G0 + frame / FPS;
  const entrada = interpolate(frame, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  const W = 820;
  const H = 620;
  const X0 = 130;
  const Y0 = 560;
  const MAX = 1300e6;
  const px = (i: number) => X0 + (i / (PUNTOS.length - 1)) * W;
  const py = (v: number) => Y0 + H - (v / MAX) * H;
  let k = 0;
  for (let i = 1; i < PUNTOS.length; i++) {
    k += interpolate(t, [PUNTOS[i].en - 0.2, PUNTOS[i].en + 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  }
  const i0 = Math.min(Math.floor(k), PUNTOS.length - 1);
  const fr = k - i0;
  const pts = PUNTOS.slice(0, i0 + 1).map((p, i) => [px(i), py(p.v)] as const);
  if (i0 < PUNTOS.length - 1) {
    const A = PUNTOS[i0];
    const B = PUNTOS[i0 + 1];
    pts.push([px(i0) + (px(i0 + 1) - px(i0)) * fr, py(A.v + (B.v - A.v) * fr)]);
  }
  const actual = i0 < PUNTOS.length - 1 ? PUNTOS[i0].v + (PUNTOS[i0 + 1].v - PUNTOS[i0].v) * fr : PUNTOS[PUNTOS.length - 1].v;
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const area = `${d} L ${pts[pts.length - 1][0]} ${Y0 + H} L ${X0} ${Y0 + H} Z`;
  const [cx, cy] = pts[pts.length - 1];
  const deriva = interpolate(frame, [0, f(G1 - G0)], [1.12, 1.18]);
  return (
    <AbsoluteFill style={{ opacity: entrada }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={ruta("i11-montana.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.45) saturate(1.2)", transform: `scale(${deriva})` }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(247,147,26,0.18), rgba(0,0,0,0.55) 70%)" }} />
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, ...texto(50, "rgba(255,255,255,0.8)") }}>
        Lo que valen esos 10.000 ₿
      </div>
      <div style={{ position: "absolute", top: 270, left: 20, right: 20, ...texto(112, AMARILLO), fontVariantNumeric: "tabular-nums", textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
        {millones(actual)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 470,
          height: 820,
          borderRadius: 40,
          background: "rgba(15,17,21,0.55)",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      />
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="rellenoFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NARANJA} stopOpacity={0.55} />
            <stop offset="100%" stopColor={NARANJA} stopOpacity={0} />
          </linearGradient>
          <filter id="brillo">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={X0} x2={X0 + W} y1={Y0 + H - g * H} y2={Y0 + H - g * H} stroke="rgba(255,255,255,0.1)" strokeWidth={2} strokeDasharray="8 10" />
        ))}
        <path d={area} fill="url(#rellenoFlow)" />
        <path d={d} stroke={NARANJA} strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.35} filter="url(#brillo)" />
        <path d={d} stroke={NARANJA} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {PUNTOS.map((p, i) =>
          i <= i0 ? (
            <g key={p.anio}>
              <circle cx={px(i)} cy={py(p.v)} r={12} fill={theme.text} stroke={NARANJA} strokeWidth={5} />
              <text x={px(i)} y={Y0 + H + 62} fill={i === PUNTOS.length - 1 ? AMARILLO : "rgba(255,255,255,0.75)"} fontFamily={theme.font} fontWeight={800} fontSize={32} textAnchor="middle">
                {p.anio}
              </text>
            </g>
          ) : null,
        )}
        <circle cx={cx} cy={cy} r={30} fill={NARANJA} stroke="#fff" strokeWidth={4} />
        <text x={cx} y={cy + 12} fill="#fff" fontFamily={theme.font} fontWeight={900} fontSize={34} textAnchor="middle">
          ₿
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// Etiqueta grande que entra con muelle (poco texto, solo cifras y datos clave).
const Etiqueta: React.FC<{ ini: number; fin: number; children: React.ReactNode; color?: string; size?: number; top?: number }> = ({
  ini,
  fin,
  children,
  color = AMARILLO,
  size = 96,
  top = 250,
}) => {
  const frame = useCurrentFrame();
  const e = useEntrada(0, 11);
  const salida = interpolate(frame, [f(fin - ini) - 6, f(fin - ini)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", justifyContent: "center", opacity: salida }}>
      <div
        style={{
          ...texto(size, theme.bg),
          background: color,
          borderRadius: 26,
          padding: "10px 40px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          transform: `scale(${e}) rotate(-2deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const ETIQUETAS: { ini: number; fin: number; el: React.ReactNode }[] = [
  { ini: 1.6, fin: 5.5, el: <Etiqueta ini={1.6} fin={5.5} color={VERDE} size={110}>750 MILLONES $</Etiqueta> },
  { ini: 5.5, fin: 7.7, el: <Etiqueta ini={5.5} fin={7.7}>MAYO 2010</Etiqueta> },
  { ini: 7.7, fin: 8.6, el: <Etiqueta ini={7.7} fin={8.6} color={NARANJA}>FLORIDA</Etiqueta> },
  { ini: 19.2, fin: 23.1, el: <Etiqueta ini={19.2} fin={23.1} color={NARANJA} size={84}>10.000 ₿ = 2 PIZZAS</Etiqueta> },
  { ini: 23.1, fin: 24.7, el: <Etiqueta ini={23.1} fin={24.7}>4 DÍAS DESPUÉS…</Etiqueta> },
  { ini: 28.2, fin: 31.3, el: <Etiqueta ini={28.2} fin={31.3} color={NARANJA}>CALIFORNIA · 19 AÑOS</Etiqueta> },
  { ini: 36.0, fin: 37.5, el: <Etiqueta ini={36.0} fin={37.5} color={VERDE} size={120}>25 $</Etiqueta> },
  { ini: 41.4, fin: 43.6, el: <Etiqueta ini={41.4} fin={43.6} color={NARANJA}>+10.000 ₿</Etiqueta> },
  { ini: 43.6, fin: 46.4, el: <Etiqueta ini={43.6} fin={46.4} color={VERDE} size={110}>≈ 41 $</Etiqueta> },
  { ini: 49.4, fin: 53.2, el: <Etiqueta ini={49.4} fin={53.2} size={78}>1.ª COMPRA CON BITCOIN</Etiqueta> },
  { ini: 71.3, fin: 72.6, el: <Etiqueta ini={71.3} fin={72.6} color={ROJO} size={110}>POR 2 PIZZAS</Etiqueta> },
  { ini: 76.8, fin: 78.9, el: <Etiqueta ini={76.8} fin={78.9} color={NARANJA}>100.000 ₿ EN PIZZAS</Etiqueta> },
  { ini: 86.0, fin: 89.9, el: <Etiqueta ini={86.0} fin={89.9} size={76}>BITCOIN PIZZA DAY</Etiqueta> },
];

export const PizzasFlowShort: React.FC = () => {
  const palabras = (guion.palabras as Palabra[]).filter((p) => p.inicio < 89.9);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {PLANOS.map((p, i) => (
        <Sequence key={i} from={f(p.ini)} durationInFrames={f(p.fin) - f(p.ini) + FUNDIDO}>
          <PlanoVista p={p} primero={i === 0} />
        </Sequence>
      ))}
      <Sequence from={f(G0)} durationInFrames={f(G1) - f(G0) + FUNDIDO}>
        <Grafico />
      </Sequence>

      {/* Degradados para leer texto arriba y subtítulos abajo */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {ETIQUETAS.map((e, i) => (
        <Sequence key={`e${i}`} from={f(e.ini)} durationInFrames={f(e.fin) - f(e.ini)}>
          {e.el}
        </Sequence>
      ))}

      <Subtitulos palabras={palabras} top={1450} tamano={64} />

      <Sequence from={f(89.9)}>
        <AbsoluteFill style={{ background: "rgba(10,12,16,0.55)" }} />
        <RemateFinal pregunta="¿Habrías cambiado 10.000 bitcoins por dos pizzas?" sigueme={5.4} />
      </Sequence>

      <Audio src={ruta("voz.mp3")} />
    </AbsoluteFill>
  );
};
