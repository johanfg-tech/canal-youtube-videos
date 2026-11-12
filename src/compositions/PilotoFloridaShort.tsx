import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";
import { Subtitulos, Palabra } from "../components/datos/Subtitulos";
import { AMARILLO, NARANJA, f, texto, useEntrada } from "../components/historia/kit";
import guion from "../../guiones/pizzas-bitcoin.json";

// Piloto del estudio de animación: "Florida, mayo de 2010" (17 s).
// Planos renderizados en Blender (mapa real, barrio, habitación con personaje de Mixamo);
// aquí solo se montan, con transiciones, rótulos y subtítulos (los textos van en post).

const VOZ_DESDE = 6.6; // segundo del audio completo donde empieza el piloto
const A = 133; // mapa EE. UU. -> Florida
const B = 127; // barrio -> casa -> ventana
const C = 252; // habitación: órbita, manos, sobre el hombro
const SOLAPE = 10;
// La habitación va al 90 % de velocidad para cubrir la última frase de la voz.
const RITMO_C = 0.9;
const C_DUR = Math.ceil(C / RITMO_C);
export const duracionPiloto = A + B + C_DUR - 2 * SOLAPE;

const palabras = (guion.palabras as Palabra[])
  .filter((p) => p.inicio >= VOZ_DESDE - 0.05 && p.fin <= VOZ_DESDE + 17.2)
  .map((p) => ({ ...p, inicio: p.inicio - VOZ_DESDE, fin: p.fin - VOZ_DESDE }));

const Rotulo: React.FC<{ arriba: string; abajo?: string; top: number; color?: string }> = ({
  arriba,
  abajo,
  top,
  color = AMARILLO,
}) => {
  const e = useEntrada(0.1, 16);
  const frame = useCurrentFrame();
  const linea = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          ...texto(76),
          letterSpacing: 6,
          textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          opacity: e,
          transform: `translateY(${(1 - e) * 30}px)`,
        }}
      >
        {arriba}
      </div>
      <div style={{ width: 360 * linea, height: 6, background: color, borderRadius: 3, margin: "14px 0" }} />
      {abajo ? (
        <div style={{ ...texto(40, "#e8e8ee"), fontWeight: 700, letterSpacing: 3, opacity: e, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          {abajo}
        </div>
      ) : null}
    </div>
  );
};

const Fundido: React.FC<{ color: string; dur: number }> = ({ color, dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, dur / 2, dur], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: o }} />;
};

const Clip: React.FC<{ src: string; entrada?: number; ritmo?: number }> = ({ src, entrada = 0, ritmo = 1 }) => {
  const frame = useCurrentFrame();
  const o = entrada ? interpolate(frame, [0, entrada], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={ritmo} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};

// Viñeta y degradados para que los rótulos se lean sobre la imagen.
const Vineta: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);

export const PilotoFloridaShort: React.FC = () => {
  const inicioB = A - SOLAPE;
  const inicioC = inicioB + B - SOLAPE;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile("narraciones/pizzas-bitcoin.mp3")} startFrom={f(VOZ_DESDE)} />
      <Sequence durationInFrames={A}>
        <Clip src="piloto/A_mapa.mp4" />
      </Sequence>
      <Sequence from={inicioB} durationInFrames={B}>
        <Clip src="piloto/B_barrio.mp4" entrada={SOLAPE} />
      </Sequence>
      <Sequence from={inicioC} durationInFrames={C_DUR}>
        <Clip src="piloto/C_cuarto.mp4" entrada={SOLAPE} ritmo={RITMO_C} />
      </Sequence>
      {/* Transiciones motivadas: nubes blancas al bajar del mapa; luz cálida de la ventana al entrar. */}
      <Sequence from={inicioB - 8} durationInFrames={SOLAPE + 16}>
        <Fundido color="#f4f1ec" dur={SOLAPE + 16} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={inicioC - 8} durationInFrames={SOLAPE + 16}>
        <Fundido color={NARANJA} dur={SOLAPE + 16} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} />
      </Sequence>
      <Vineta />
      <Sequence from={4} durationInFrames={50}>
        <Rotulo arriba="MAYO 2010" top={250} />
      </Sequence>
      <Sequence from={56} durationInFrames={inicioB - 60}>
        <Rotulo arriba="FLORIDA" abajo="ESTADOS UNIDOS" top={250} color={NARANJA} />
      </Sequence>
      <Sequence from={inicioC + 20} durationInFrames={70}>
        <Rotulo arriba="LASZLO HANYECZ" abajo="PROGRAMADOR" top={250} />
      </Sequence>
      <Subtitulos palabras={palabras} top={1500} tamano={76} />
    </AbsoluteFill>
  );
};
