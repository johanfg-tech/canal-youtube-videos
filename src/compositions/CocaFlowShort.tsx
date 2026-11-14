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
import guion from "../../guiones/s16/cocacola.json";

// Historia de la Coca-Cola de 5 centavos con escenas generadas en Google Flow
// (24 imágenes Nano Banana + 1 clip Veo 3.1 Lite). Archivos en public/flow-coca/.

const COLA = 1.6;
const FIN_VOZ = 83.6;
export const duracionCocaFlow = Math.ceil((FIN_VOZ + COLA) * FPS);

const ruta = (n: string) => staticFile(`flow-coca/${n}`);

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
  { ini: 0, fin: 4.0, src: "v01-moneda.mp4", video: true, desde: 0 },
  { ini: 4.0, fin: 8.3, src: "c02-pueblo.jpg", zoom: [1.0, 1.07], foco: [50, 50, 55, 50] },
  { ini: 8.3, fin: 10.3, src: "c03-soldados.jpg", zoom: [1.06, 1.0] },
  { ini: 10.3, fin: 12.3, src: "c04-depresion.jpg", zoom: [1.0, 1.06], foco: [50, 55, 50, 55] },
  { ini: 12.3, fin: 13.4, src: "c05-confuso.jpg", zoom: [1.0, 1.04], foco: [45, 40, 45, 40] },
  { ini: 13.4, fin: 17.8, src: "c06-atlanta.jpg", zoom: [1.0, 1.08], foco: [50, 40, 50, 55] },
  { ini: 17.8, fin: 22.3, src: "c07-pemberton.jpg", zoom: [1.08, 1.0], foco: [50, 40, 50, 40] },
  { ini: 22.3, fin: 25.0, src: "c08-abogados.jpg", zoom: [1.0, 1.06], foco: [50, 45, 50, 45] },
  { ini: 25.0, fin: 28.0, src: "c09-apreton.jpg", zoom: [1.06, 1.0], foco: [55, 45, 55, 45] },
  { ini: 28.0, fin: 31.6, src: "c10-candler.jpg", zoom: [1.0, 1.07], foco: [55, 40, 55, 38] },
  { ini: 31.6, fin: 35.7, src: "c11-firma.jpg", zoom: [1.07, 1.0], foco: [50, 55, 50, 55] },
  { ini: 35.7, fin: 38.8, src: "c12-dolar.jpg", zoom: [1.0, 1.06], foco: [50, 50, 50, 50] },
  { ini: 38.8, fin: 42.9, src: "c13-candado.jpg", zoom: [1.07, 1.0], foco: [50, 50, 50, 50] },
  { ini: 42.9, fin: 46.0, src: "c14-pared.jpg", zoom: [1.0, 1.07], foco: [55, 35, 55, 30] },
  { ini: 46.0, fin: 49.2, src: "c15-carretera.jpg", zoom: [1.06, 1.0], foco: [50, 55, 50, 55] },
  { ini: 49.2, fin: 52.0, src: "c16-maquina.jpg", zoom: [1.0, 1.06], foco: [40, 55, 40, 55] },
  { ini: 52.0, fin: 54.6, src: "c17-ranura.jpg", zoom: [1.06, 1.0], foco: [45, 45, 45, 45] },
  { ini: 54.6, fin: 57.0, src: "c18-cambio.jpg", zoom: [1.0, 1.06], foco: [45, 55, 45, 55] },
  { ini: 57.0, fin: 59.5, src: "c19-diez.jpg", zoom: [1.06, 1.0], foco: [45, 45, 45, 45] },
  { ini: 59.5, fin: 63.5, src: "c20-woodruff.jpg", zoom: [1.0, 1.07], foco: [55, 45, 55, 42] },
  { ini: 63.5, fin: 66.0, src: "c21-casablanca.jpg", zoom: [1.06, 1.0], foco: [50, 45, 50, 45] },
  { ini: 66.0, fin: 68.4, src: "c22-presidente.jpg", zoom: [1.0, 1.06], foco: [50, 45, 50, 45] },
  { ini: 68.4, fin: 69.9, src: "c23-denegado.jpg", zoom: [1.0, 1.04], foco: [60, 45, 60, 45] },
  // 69.9 - 76.5: gráfico 5 centavos contra la inflación (componente Grafico)
  { ini: 76.5, fin: 81.2, src: "c24-aula.jpg", zoom: [1.0, 1.07], foco: [55, 40, 55, 40] },
  { ini: 81.2, fin: FIN_VOZ + COLA, src: "c01-botella.jpg", zoom: [1.0, 1.05] },
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

// Gráfico: el precio de la Coca-Cola (5 ¢, plano) contra lo que costaría si hubiera
// seguido la inflación (IPC histórico de EE. UU., aproximado, base 1886).
const PUNTOS = [
  { anio: "1886", v: 5.0 },
  { anio: "1900", v: 4.7 },
  { anio: "1913", v: 5.6 },
  { anio: "1920", v: 11.2 },
  { anio: "1933", v: 7.3 },
  { anio: "1945", v: 10.1 },
  { anio: "1959", v: 16.4 },
];
const G0 = 69.9;
const G1 = 76.5;
const T_TRAZO = [70.3, 74.6]; // la línea se dibuja en este intervalo

const Grafico: React.FC = () => {
  const frame = useCurrentFrame();
  const t = G0 + frame / FPS;
  const entrada = interpolate(frame, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  const W = 820;
  const H = 600;
  const X0 = 130;
  const Y0 = 600;
  const MAX = 18;
  const n = PUNTOS.length - 1;
  const px = (i: number) => X0 + (i / n) * W;
  const py = (v: number) => Y0 + H - (v / MAX) * H;
  const k = interpolate(t, T_TRAZO, [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const i0 = Math.min(Math.floor(k), n);
  const fr = k - i0;
  const pts = PUNTOS.slice(0, i0 + 1).map((p, i) => [px(i), py(p.v)] as const);
  if (i0 < n) pts.push([px(i0) + (px(i0 + 1) - px(i0)) * fr, py(PUNTOS[i0].v + (PUNTOS[i0 + 1].v - PUNTOS[i0].v) * fr)]);
  const actual = i0 < n ? PUNTOS[i0].v + (PUNTOS[i0 + 1].v - PUNTOS[i0].v) * fr : PUNTOS[n].v;
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const [cx, cy] = pts[pts.length - 1];
  const xPlano = X0 + (k / n) * W;
  const deriva = interpolate(frame, [0, f(G1 - G0)], [1.12, 1.18]);
  const etiquetaFinal = interpolate(t, [74.6, 75.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: entrada }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={ruta("c16-maquina.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.4) saturate(1.2)", transform: `scale(${deriva})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(220,30,40,0.2), rgba(0,0,0,0.55) 70%)" }} />
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, ...texto(50, "rgba(255,255,255,0.8)") }}>Lo que costaría con la inflación</div>
      <div style={{ position: "absolute", top: 270, left: 20, right: 20, ...texto(120, AMARILLO), fontVariantNumeric: "tabular-nums", textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
        ≈ {actual.toFixed(1).replace(".", ",")} ¢
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 490, height: 840, borderRadius: 40, background: "rgba(15,17,21,0.55)", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="brilloCoca"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
        {[5, 10, 15].map((g) => (
          <g key={g}>
            <line x1={X0} x2={X0 + W} y1={py(g)} y2={py(g)} stroke="rgba(255,255,255,0.1)" strokeWidth={2} strokeDasharray="8 10" />
            <text x={X0 - 18} y={py(g) + 10} fill="rgba(255,255,255,0.55)" fontFamily={theme.font} fontWeight={700} fontSize={28} textAnchor="end">{g}¢</text>
          </g>
        ))}
        {/* Precio de la Coca-Cola: plano en 5 ¢ */}
        <line x1={X0} x2={xPlano} y1={py(5)} y2={py(5)} stroke={ROJO} strokeWidth={12} strokeLinecap="round" />
        {/* Inflación */}
        <path d={d} stroke={AMARILLO} strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.3} filter="url(#brilloCoca)" />
        <path d={d} stroke={AMARILLO} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {PUNTOS.map((p, i) =>
          i <= i0 ? (
            <text key={p.anio} x={px(i)} y={Y0 + H + 62} fill="rgba(255,255,255,0.75)" fontFamily={theme.font} fontWeight={800} fontSize={30} textAnchor="middle">{p.anio}</text>
          ) : null,
        )}
        <circle cx={cx} cy={cy} r={16} fill={AMARILLO} stroke="#fff" strokeWidth={4} />
        <circle cx={xPlano} cy={py(5)} r={16} fill={ROJO} stroke="#fff" strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", top: 1360, left: 60, right: 60, display: "flex", justifyContent: "center", gap: 40, ...texto(36) }}>
        <span><span style={{ color: ROJO }}>●</span> Coca-Cola: 5 ¢</span>
        <span><span style={{ color: AMARILLO }}>●</span> Inflación</span>
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: etiquetaFinal, transform: `scale(${0.8 + 0.2 * etiquetaFinal})` }}>
        <div style={{ ...texto(60, "#fff"), background: ROJO, borderRadius: 20, padding: "6px 30px" }}>1959: ADIÓS A LOS 5 ¢</div>
      </div>
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
  { ini: 1.0, fin: 4.0, el: <Etiqueta ini={1.0} fin={4.0} color={VERDE} size={130}>5 ¢</Etiqueta> },
  { ini: 4.6, fin: 8.3, el: <Etiqueta ini={4.6} fin={8.3}>1886 → 1959</Etiqueta> },
  { ini: 13.4, fin: 17.8, el: <Etiqueta ini={13.4} fin={17.8} color={NARANJA}>ATLANTA · 1886</Etiqueta> },
  { ini: 22.3, fin: 25.0, el: <Etiqueta ini={22.3} fin={25.0}>1899</Etiqueta> },
  { ini: 31.6, fin: 35.7, el: <Etiqueta ini={31.6} fin={35.7} color={ROJO} size={78}>CONTRATO PARA SIEMPRE</Etiqueta> },
  { ini: 36.2, fin: 38.8, el: <Etiqueta ini={36.2} fin={38.8} color={VERDE} size={130}>1 $</Etiqueta> },
  { ini: 39.6, fin: 42.9, el: <Etiqueta ini={39.6} fin={42.9} size={84}>+20 AÑOS SIN SUBIR</Etiqueta> },
  { ini: 52.0, fin: 54.6, el: <Etiqueta ini={52.0} fin={54.6} color={VERDE}>SOLO 5 ¢</Etiqueta> },
  { ini: 55.2, fin: 57.0, el: <Etiqueta ini={55.2} fin={57.0} color={NARANJA}>6 ¢ = DAR CAMBIO</Etiqueta> },
  { ini: 57.4, fin: 59.5, el: <Etiqueta ini={57.4} fin={59.5} color={ROJO} size={120}>×2</Etiqueta> },
  { ini: 59.5, fin: 63.5, el: <Etiqueta ini={59.5} fin={63.5}>1953</Etiqueta> },
  { ini: 66.0, fin: 68.4, el: <Etiqueta ini={66.0} fin={68.4} color={VERDE} size={110}>¿7,5 ¢?</Etiqueta> },
];

export const CocaFlowShort: React.FC = () => {
  const palabras = (guion.palabras as Palabra[]).filter((p) => p.inicio < 81.2);
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

      <Sequence from={f(81.2)}>
        <AbsoluteFill style={{ background: "rgba(10,12,16,0.55)" }} />
        <RemateFinal pregunta="¿Cuánto pagas tú hoy por una Coca-Cola?" sigueme={1.6} />
      </Sequence>

      <Audio src={ruta("voz.mp3")} />
    </AbsoluteFill>
  );
};
