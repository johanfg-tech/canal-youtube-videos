import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Subtitulos, Palabra } from "../components/datos/Subtitulos";
import { AMARILLO, NARANJA, RemateFinal, f, texto, useEntrada } from "../components/historia/kit";

// Historia animada (estilo piloto): planos renderizados en Blender, montados sobre la voz.
// Los tiempos salen de scripts/historia_build.py (frases de la voz -> planos y rótulos).

export type Plano = { src: string; inicio: number; fin: number; desde: number; ritmo: number };
export type RotuloD = { inicio: number; dur: number; arriba: string; abajo?: string; color?: string; top?: number };
export type DatosHistoria = {
  voz: string;
  palabras: Palabra[];
  duracion: number;
  planos: Plano[];
  rotulos: RotuloD[];
  remate: { inicio: number; pregunta: string };
  grafico?: GraficoD;
};
export type BarraD = { etiqueta: string; valor: number; texto: string; en: number; color?: string };
export type GraficoD = { inicio: number; fin: number; titulo: string; barras: BarraD[] };

const COLA = 2.6;
export const duracionHistoria = (d: DatosHistoria) => Math.ceil((d.duracion + COLA) * 30);
const SOLAPE = 8;

const Rotulo: React.FC<Omit<RotuloD, "inicio" | "dur">> = ({ arriba, abajo, color = AMARILLO, top = 250 }) => {
  const e = useEntrada(0.08, 16);
  const frame = useCurrentFrame();
  const linea = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...texto(arriba.length > 14 ? 62 : 80), letterSpacing: 5, textShadow: "0 6px 30px rgba(0,0,0,0.65)", opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
        {arriba}
      </div>
      <div style={{ width: 360 * linea, height: 6, background: color, borderRadius: 3, margin: "14px 0" }} />
      {abajo ? (
        <div style={{ ...texto(42, "#ececf2"), fontWeight: 700, letterSpacing: 3, opacity: e, textShadow: "0 4px 20px rgba(0,0,0,0.65)" }}>{abajo}</div>
      ) : null}
    </div>
  );
};

const Clip: React.FC<{ p: Plano; primero: boolean }> = ({ p, primero }) => {
  const frame = useCurrentFrame();
  const o = primero ? 1 : interpolate(frame, [0, SOLAPE], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={staticFile(p.src)} muted startFrom={p.desde} playbackRate={p.ritmo} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};

// Gráfica de barras sobre el plano (los valores y textos van siempre en post).
const Grafico: React.FC<{ g: GraficoD }> = ({ g }) => {
  const frame = useCurrentFrame();
  const dur = f(g.fin - g.inicio);
  const fondo = interpolate(frame, [0, 12, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const max = Math.max(...g.barras.map((b) => b.valor));
  const ALTO = 640;
  const ancho = 900 / g.barras.length;
  return (
    <AbsoluteFill style={{ opacity: fondo }}>
      <AbsoluteFill style={{ background: "rgba(8,8,14,0.72)" }} />
      <div style={{ position: "absolute", top: 300, left: 40, right: 40, ...texto(64), letterSpacing: 2 }}>{g.titulo}</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1240, height: 4, background: "#ffffff40", borderRadius: 2 }} />
      {g.barras.map((b, i) => {
        const t = interpolate(frame, [f(b.en), f(b.en) + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const h = Math.max(8, (b.valor / max) * ALTO) * t;
        const x = 90 + i * ancho;
        const col = b.color ?? NARANJA;
        return (
          <div key={i} style={{ opacity: t }}>
            <div style={{ position: "absolute", left: x + ancho * 0.15, width: ancho * 0.7, top: 1240 - h, height: h, background: col, borderRadius: "14px 14px 0 0", boxShadow: `0 0 40px ${col}55` }} />
            <div style={{ position: "absolute", left: x - 10, width: ancho + 20, top: 1240 - h - 70, ...texto(b.texto.length > 6 ? 38 : 46, col), whiteSpace: "nowrap" }}>{b.texto}</div>
            <div style={{ position: "absolute", left: x - 10, width: ancho + 20, top: 1262, ...texto(36, "#ececf2"), fontWeight: 700 }}>{b.etiqueta}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Vineta: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)" }} />
);

const Oscurecer: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: theme.bg, opacity: interpolate(frame, [0, 12], [0, 0.82], { extrapolateRight: "clamp" }) }} />;
};

export const HistoriaCineShort: React.FC<{ datos: DatosHistoria }> = ({ datos }) => {
  const { planos, rotulos, remate } = datos;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile(datos.voz)} />
      {planos.map((p, i) => {
        const desde = Math.max(0, f(p.inicio) - (i ? SOLAPE : 0));
        const hasta = i === planos.length - 1 ? duracionHistoria(datos) : f(p.fin);
        return (
          <Sequence key={i} from={desde} durationInFrames={hasta - desde}>
            <Clip p={p} primero={i === 0} />
            {i ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.18} /> : null}
          </Sequence>
        );
      })}
      <Vineta />
      {rotulos.map((r, i) => (
        <Sequence key={i} from={f(r.inicio)} durationInFrames={f(r.dur)}>
          <Rotulo arriba={r.arriba} abajo={r.abajo} color={r.color} top={r.top} />
        </Sequence>
      ))}
      {datos.grafico ? (
        <Sequence from={f(datos.grafico.inicio)} durationInFrames={f(datos.grafico.fin - datos.grafico.inicio)}>
          <Grafico g={datos.grafico} />
        </Sequence>
      ) : null}
      <Sequence from={f(remate.inicio)}>
        <Oscurecer />
        <RemateFinal pregunta={remate.pregunta} sigueme={2.2} />
      </Sequence>
      <Subtitulos palabras={datos.palabras.filter((p) => p.inicio < remate.inicio)} top={1500} tamano={74} />
    </AbsoluteFill>
  );
};
