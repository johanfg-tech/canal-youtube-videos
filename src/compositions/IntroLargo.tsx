import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { theme } from "../theme";
import { AMARILLO, f, texto } from "../components/historia/kit";
import { DatosShort, datosShortSchema } from "./DatosShort";

// Intro animada (16:9) para vídeos largos: imágenes del tema que entran en órbita,
// título con palabra resaltada, subtítulo y marca del canal. Luego sigue el vídeo.

export const INTRO_SEG = 3.5;

export type IntroDatos = { lineas: string[]; resaltar: string; sub: string; imgs: string[] };

const Orbita: React.FC<{ src: string; i: number; n: number }> = ({ src, i, n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ang = (i / n) * Math.PI * 2 - Math.PI / 2 + frame * 0.004;
  const e = spring({ frame: frame - 2 - i * 2, fps, config: { damping: 13, mass: 0.7 } });
  const R = 560 * e + 900 * (1 - e);
  const rx = R * 1.38, ry = R * 0.68;
  const x = 960 + Math.cos(ang) * rx;
  const y = 540 + Math.sin(ang) * ry;
  const flot = Math.sin(frame / 18 + i) * 10;
  const size = 220;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute", left: x - size / 2, top: y - size / 2 + flot, width: size, height: size, objectFit: "contain",
        opacity: e, transform: `rotate(${(1 - e) * (i % 2 ? 40 : -40) + Math.sin(frame / 25 + i) * 4}deg)`,
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))",
      }}
    />
  );
};

export const IntroLargo: React.FC<IntroDatos> = ({ lineas, resaltar, sub, imgs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = f(INTRO_SEG);
  const tit = spring({ frame: frame - f(0.3), fps, config: { damping: 12, mass: 0.8 } });
  const caja = interpolate(frame, [f(0.8), f(1.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subO = interpolate(frame, [f(1.2), f(1.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const marca = spring({ frame: frame - f(1.7), fps, config: { damping: 14 } });
  const salida = interpolate(frame, [total - 18, total], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const brillo = interpolate(frame, [0, 40], [0.4, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: brillo, background: "radial-gradient(circle at 30% 30%, rgba(255,77,109,0.35), transparent 45%), radial-gradient(circle at 75% 75%, rgba(60,90,255,0.35), transparent 45%)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + salida * 0.35})`, opacity: 1 - salida }}>
        {imgs.map((s, i) => <Orbita key={i} src={s} i={i} n={imgs.length} />)}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <div style={{ transform: `scale(${0.6 + tit * 0.4})`, opacity: tit, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {lineas.map((l, i) => {
              const partes = l.split(resaltar);
              return (
                <div key={i} style={{ ...texto(118), textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
                  {partes.length > 1 ? (
                    <>
                      {partes[0]}
                      <span style={{ position: "relative", display: "inline-block", isolation: "isolate", padding: "0 18px" }}>
                        <span style={{ position: "absolute", inset: "6px 0", background: AMARILLO, borderRadius: 14, transform: `scaleX(${caja})`, transformOrigin: "left", zIndex: -1 }} />
                        <span style={{ color: caja > 0.5 ? "#111" : theme.text }}>{resaltar}</span>
                      </span>
                      {partes[1]}
                    </>
                  ) : l}
                </div>
              );
            })}
          </div>
          <div style={{ ...texto(44, "#d8dbe2"), fontWeight: 700, letterSpacing: 0, marginTop: 34, opacity: subO, transform: `translateY(${(1 - subO) * 20}px)` }}>{sub}</div>
          <div style={{ marginTop: 46, padding: "12px 30px", borderRadius: 999, background: theme.accent, ...texto(30, "#fff"), letterSpacing: 6, transform: `scale(${marca})`, opacity: marca }}>
            CUENTAS CLARAS
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      <Sequence from={f(0.8)}><Audio src={staticFile("sfx/ding.wav")} volume={0.3} /></Sequence>
      <Sequence from={f(1.7)}><Audio src={staticFile("sfx/pop.wav")} volume={0.3} /></Sequence>
      <Sequence from={f(2.3)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.18} /></Sequence>
      <Sequence from={total - 18}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};

export const largoConIntroSchema = z.object({ intro: z.any(), video: datosShortSchema });

export const LargoConIntro: React.FC<{ intro: IntroDatos; video: z.infer<typeof datosShortSchema> }> = ({ intro, video }) => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <Sequence durationInFrames={f(INTRO_SEG)}><IntroLargo {...intro} /></Sequence>
    <Sequence from={f(INTRO_SEG)}><DatosShort {...video} /></Sequence>
  </AbsoluteFill>
);
