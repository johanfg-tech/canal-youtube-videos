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

// Plantilla de historia hecha con imágenes de Google Flow (misma metodología que
// PizzasFlow/CocaFlow): cada imagen una sola vez, zoom suave 1,00-1,08 con fundidos,
// clips Veo sin sonido, un gráfico animado para los datos, solo la narración.
// Los tiempos salen de las frases de la voz (guiones/flow/<id>.json, scripts/tiempos2.py).

export const COLORES = { AMARILLO, VERDE, ROJO, NARANJA, BLANCO: "#ffffff" };
type Color = keyof typeof COLORES;

export type PlanoCfg = {
  src: string;
  frase: number; // índice de frase (desde 0) en la que empieza
  parte?: number; // 0-1: punto de la frase en el que empieza
  video?: boolean;
  desde?: number;
  zoom?: [number, number];
  foco?: [number, number, number, number];
};

export type EtiquetaCfg = { frase: number; texto: string; color?: Color; size?: number; parte?: number; hasta?: number };

export type GraficoCfg = {
  desde: number; // frase inicial
  hasta: number; // frase final (incluida)
  fondo: string;
  titulo: string;
  tipo: "barras" | "linea";
  log?: boolean;
  puntos: { etiqueta: string; v: number; texto: string }[];
  nota?: string;
  colorFinal?: Color;
};

export type HistoriaFlow = {
  id: string;
  carpeta: string;
  guion: { palabras: Palabra[]; frases: { texto: string; inicio: number; fin: number }[]; duracion: number };
  planos: PlanoCfg[];
  etiquetas: EtiquetaCfg[];
  grafico?: GraficoCfg;
  remate: { frase: number; pregunta: string; fondo: string };
};

const COLA = 1.6;
const FUNDIDO = 8;

export const duracionFlow = (h: HistoriaFlow) => Math.ceil((h.guion.duracion + COLA) * FPS);

const inicioDe = (h: HistoriaFlow, frase: number, parte = 0) => {
  const fr = h.guion.frases[frase];
  return fr.inicio + parte * (fr.fin - fr.inicio);
};

type Plano = PlanoCfg & { ini: number; fin: number };

const PlanoVista: React.FC<{ p: Plano; primero: boolean; carpeta: string; idx: number }> = ({ p, primero, carpeta, idx }) => {
  const frame = useCurrentFrame();
  const dur = f(p.fin - p.ini) + FUNDIDO;
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacidad = primero ? 1 : interpolate(frame, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  const src = staticFile(`${carpeta}/${p.src}`);
  if (p.video) {
    return (
      <AbsoluteFill style={{ opacity: opacidad }}>
        <OffthreadVideo src={src} startFrom={f(p.desde ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  // Por defecto alterna acercar / alejar para que el ritmo no sea monótono.
  const [z0, z1] = p.zoom ?? (idx % 2 === 0 ? [1.0, 1.07] : [1.07, 1.0]);
  const [x0, y0, x1, y1] = p.foco ?? [50, 45, 50, 45];
  const e = Easing.bezier(0.33, 0, 0.67, 1)(t);
  const z = z0 + (z1 - z0) * e;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: opacidad }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${x0 + (x1 - x0) * e}% ${y0 + (y1 - y0) * e}%`,
          transform: `scale(${z})`,
        }}
      />
    </AbsoluteFill>
  );
};

const Etiqueta: React.FC<{ dur: number; children: React.ReactNode; color: string; size: number }> = ({ dur, children, color, size }) => {
  const frame = useCurrentFrame();
  const e = useEntrada(0, 11);
  const salida = interpolate(frame, [f(dur) - 6, f(dur)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 250, left: 40, right: 40, display: "flex", justifyContent: "center", opacity: salida }}>
      <div
        style={{
          ...texto(size, theme.bg),
          background: color,
          borderRadius: 26,
          padding: "10px 40px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          transform: `scale(${e}) rotate(-2deg)`,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Grafico: React.FC<{ g: GraficoCfg; carpeta: string; dur: number }> = ({ g, carpeta, dur }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  const n = g.puntos.length;
  const final = COLORES[g.colorFinal ?? "VERDE"];
  // Los puntos van apareciendo entre el 8 % y el 80 % del tramo.
  const k = interpolate(frame, [f(dur * 0.08), f(dur * 0.8)], [0, n - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const escala = (v: number) => (g.log ? Math.log10(Math.max(v, 1)) : v);
  const maxV = Math.max(...g.puntos.map((p) => escala(p.v)));
  const minV = g.log ? Math.min(...g.puntos.map((p) => escala(p.v))) - 0.6 : 0;
  const W = 840;
  const X0 = 120;
  const YB = 1240; // base
  const H = 640;
  const alto = (v: number) => ((escala(v) - minV) / (maxV - minV)) * H;
  const actual = Math.min(Math.round(k), n - 1);
  const deriva = interpolate(frame, [0, f(dur)], [1.12, 1.18]);
  const notaO = interpolate(frame, [f(dur * 0.82), f(dur * 0.82) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let cuerpo: React.ReactNode;
  if (g.tipo === "barras") {
    const ancho = W / n;
    cuerpo = g.puntos.map((p, i) => {
      const crece = interpolate(k, [i - 0.6, i + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const h = alto(p.v) * Easing.out(Easing.cubic)(crece);
      const x = X0 + i * ancho + ancho * 0.16;
      const w = ancho * 0.68;
      const color = i === n - 1 ? final : AMARILLO;
      return (
        <g key={i} opacity={crece > 0 ? 1 : 0}>
          <rect x={x} y={YB - h} width={w} height={h} rx={14} fill={color} opacity={0.95} />
          <text x={x + w / 2} y={YB - h - 22} fill="#fff" fontFamily={theme.font} fontWeight={900} fontSize={n > 5 ? 30 : 36} textAnchor="middle" opacity={crece}>
            {p.texto}
          </text>
          <text x={x + w / 2} y={YB + 50} fill="rgba(255,255,255,0.8)" fontFamily={theme.font} fontWeight={800} fontSize={n > 5 ? 26 : 30} textAnchor="middle">
            {p.etiqueta}
          </text>
        </g>
      );
    });
  } else {
    const px = (i: number) => X0 + (i / (n - 1)) * W;
    const py = (v: number) => YB - alto(v);
    const i0 = Math.min(Math.floor(k), n - 1);
    const fr = k - i0;
    const pts = g.puntos.slice(0, i0 + 1).map((p, i) => [px(i), py(p.v)] as const);
    if (i0 < n - 1) {
      const a = escala(g.puntos[i0].v);
      const b = escala(g.puntos[i0 + 1].v);
      const vv = a + (b - a) * fr;
      pts.push([px(i0) + (px(i0 + 1) - px(i0)) * fr, YB - ((vv - minV) / (maxV - minV)) * H]);
    }
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
    const [cx, cy] = pts[pts.length - 1];
    cuerpo = (
      <>
        <path d={d} stroke={AMARILLO} strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.3} filter="url(#brilloFlow)" />
        <path d={d} stroke={AMARILLO} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {g.puntos.map((p, i) =>
          i <= i0 ? (
            <g key={i}>
              <circle cx={px(i)} cy={py(p.v)} r={9} fill="#fff" />
              <text x={px(i)} y={YB + 50} fill="rgba(255,255,255,0.75)" fontFamily={theme.font} fontWeight={800} fontSize={28} textAnchor="middle">
                {p.etiqueta}
              </text>
            </g>
          ) : null,
        )}
        <circle cx={cx} cy={cy} r={16} fill={actual === n - 1 ? final : AMARILLO} stroke="#fff" strokeWidth={4} />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: entrada }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(`${carpeta}/${g.fondo}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.4) saturate(1.2)", transform: `scale(${deriva})` }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(255,214,10,0.12), rgba(0,0,0,0.55) 70%)" }} />
      <div style={{ position: "absolute", top: 190, left: 60, right: 60, ...texto(50, "rgba(255,255,255,0.85)") }}>{g.titulo}</div>
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 20,
          right: 20,
          ...texto(110, actual === n - 1 ? final : AMARILLO),
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        {g.puntos[actual].texto}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 480,
          height: 880,
          borderRadius: 40,
          background: "rgba(15,17,21,0.55)",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      />
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="brilloFlow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <line x1={X0} x2={X0 + W} y1={YB} y2={YB} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
        {cuerpo}
      </svg>
      {g.nota ? (
        <div style={{ position: "absolute", top: 1380, left: 60, right: 60, ...texto(34, "rgba(255,255,255,0.75)"), opacity: notaO }}>{g.nota}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const FlowHistoria: React.FC<{ h: HistoriaFlow }> = ({ h }) => {
  const total = h.guion.duracion + COLA;
  const tRemate = inicioDe(h, h.remate.frase);
  const cortes = h.planos.map((p, i) => (i === 0 ? 0 : inicioDe(h, p.frase, p.parte)));
  const planos: Plano[] = h.planos.map((p, i) => ({ ...p, ini: cortes[i], fin: i + 1 < cortes.length ? cortes[i + 1] : total }));
  const g = h.grafico;
  const g0 = g ? inicioDe(h, g.desde) : 0;
  const g1 = g ? h.guion.frases[g.hasta].fin : 0;
  const palabras = h.guion.palabras.filter((p) => p.inicio < tRemate - 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {planos.map((p, i) => (
        <Sequence key={i} from={f(p.ini)} durationInFrames={Math.max(1, f(p.fin) - f(p.ini) + FUNDIDO)}>
          <PlanoVista p={p} primero={i === 0} carpeta={h.carpeta} idx={i} />
        </Sequence>
      ))}
      {g ? (
        <Sequence from={f(g0)} durationInFrames={f(g1) - f(g0) + FUNDIDO}>
          <Grafico g={g} carpeta={h.carpeta} dur={g1 - g0} />
        </Sequence>
      ) : null}

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {h.etiquetas.map((e, i) => {
        const ini = inicioDe(h, e.frase, e.parte ?? 0) + (e.parte ? 0 : 0.3);
        const fin = h.guion.frases[e.hasta ?? e.frase].fin;
        return (
          <Sequence key={`e${i}`} from={f(ini)} durationInFrames={Math.max(1, f(fin) - f(ini))}>
            <Etiqueta dur={fin - ini} color={COLORES[e.color ?? "AMARILLO"]} size={e.size ?? 96}>
              {e.texto}
            </Etiqueta>
          </Sequence>
        );
      })}

      <Subtitulos palabras={palabras} top={1450} tamano={64} />

      <Sequence from={f(tRemate)}>
        <AbsoluteFill style={{ background: "rgba(10,12,16,0.55)" }} />
        <RemateFinal pregunta={h.remate.pregunta} sigueme={Math.max(1.2, h.guion.frases[h.remate.frase].fin - tRemate + 0.2)} />
      </Sequence>

      <Audio src={staticFile(`${h.carpeta}/voz.mp3`)} />
    </AbsoluteFill>
  );
};
