import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";
import { Fondo } from "../components/datos/Fondo";
import { Subtitulos, Palabra } from "../components/datos/Subtitulos";
import { AMARILLO, BORDE, Escena, FPS, NARANJA, ROJO, RemateFinal, TARJETA, VERDE, f, texto, useEntrada } from "../components/historia/kit";

// Short explicativo con escenas descritas en datos (estilo Big Mac): cada escena tiene un tipo
// (titulo, cifra, comparar, barras, lista, tarjeta, imagen, donut, remate), imágenes de IA
// animadas y empieza en una frase de la narración.

export type Img_ = { src: string; size?: number; x?: number; y?: number; desde?: number; giro?: number };
export type EscenaDatos =
  | { tipo: "titulo"; frase: number; lineas: string[]; resaltar?: string; color?: string; img?: Img_; sub?: string }
  | { tipo: "cifra"; frase: number; antes?: string; valor: number; desdeValor?: number; decimales?: number; prefijo?: string; sufijo?: string; etiqueta?: string; color?: string; img?: Img_; dur?: number }
  | { tipo: "comparar"; frase: number; titulo?: string; a: Lado; b: Lado; pie?: string }
  | { tipo: "barras"; frase: number; titulo?: string; items: { etiqueta: string; valor: number; texto: string; color?: string; img?: string }[]; pie?: string }
  | { tipo: "lista"; frase: number; titulo?: string; items: { texto: string; img?: string; emoji?: string; color?: string; en?: number }[] }
  | { tipo: "tarjeta"; frase: number; cabecera?: string; titulo: string; lineas?: string[]; img?: Img_; color?: string }
  | { tipo: "imagen"; frase: number; img: Img_; texto?: string; sub?: string; color?: string }
  | { tipo: "donut"; frase: number; titulo?: string; partes: { etiqueta: string; valor: number; color: string }[]; centro?: string }
  | { tipo: "remate"; frase: number; pregunta: string };

type Lado = { etiqueta: string; valor?: string; img?: string; color?: string; altura?: number };

export type DatosExplica = {
  voz: string;
  palabras: Palabra[];
  frases: { texto: string; inicio: number; fin: number }[];
  duracion: number;
  escenas: EscenaDatos[];
};

const COLA = 1.8;
export const duracionExplica = (d: DatosExplica) => Math.ceil((d.duracion + COLA) * FPS);

const formato = (v: number, dec = 0) => {
  const [ent, frac] = v.toFixed(dec).split(".");
  const conPuntos = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return frac ? `${conPuntos},${frac}` : conPuntos;
};

// Imagen de IA: entra con muelle, flota y respira.
const Imagen: React.FC<Img_ & { base?: number }> = ({ src, size = 620, x = 540, y = 900, desde = 0.15, giro = 3 }) => {
  const frame = useCurrentFrame();
  const e = useEntrada(desde, 11);
  const t = frame / FPS;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: size,
        left: x - size / 2,
        top: y - size / 2 + 16 * Math.sin(t * 1.8),
        transform: `scale(${e * (1 + 0.025 * Math.sin(t * 1.1))}) rotate(${giro * Math.sin(t * 1.3)}deg)`,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
      }}
    />
  );
};

const Pastilla: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = AMARILLO, size = 96 }) => (
  <span style={{ ...texto(size, theme.bg), background: color, borderRadius: 22, padding: "0 22px", display: "inline-block" }}>{children}</span>
);

const Titulo: React.FC<Extract<EscenaDatos, { tipo: "titulo" }>> = ({ lineas, resaltar, color = AMARILLO, img, sub }) => {
  const largo = Math.max(...lineas.map((l) => l.length));
  const size = largo > 19 ? 70 : largo > 16 ? 82 : largo > 11 ? 100 : 120;
  return (
    <>
      <div style={{ position: "absolute", top: img ? 200 : 520, left: 50, right: 50 }}>
        {lineas.map((l, i) => {
          const e = useEntrada(0.08 + i * 0.22); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ ...texto(size), marginBottom: 14, transform: `scale(${0.6 + 0.4 * e})`, opacity: Math.min(1, e * 1.5) }}>
              {resaltar && l.includes(resaltar) ? (
                <>
                  {l.split(resaltar)[0]}
                  <Pastilla color={color} size={size}>{resaltar}</Pastilla>
                  {l.split(resaltar)[1]}
                </>
              ) : (
                l
              )}
            </div>
          );
        })}
      </div>
      {img ? <Imagen y={980} {...img} /> : null}
      {sub ? <SubTexto top={1300} texto_={sub} desde={0.9} /> : null}
    </>
  );
};

const SubTexto: React.FC<{ top: number; texto_: string; desde?: number; color?: string }> = ({ top, texto_, desde = 0.6, color = theme.muted }) => {
  const e = useEntrada(desde);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, ...texto(58, color), fontWeight: 800, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
      {texto_}
    </div>
  );
};

const Cifra: React.FC<Extract<EscenaDatos, { tipo: "cifra" }>> = ({ antes, valor, desdeValor = 0, decimales = 0, prefijo = "", sufijo = "", etiqueta, color = AMARILLO, img, dur = 1.6 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f(0.25), f(0.25 + dur)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const v = desdeValor + (valor - desdeValor) * p;
  const s = `${prefijo}${formato(v, decimales)}${sufijo}`;
  const size = s.length > 11 ? 120 : s.length > 8 ? 150 : 190;
  const a = useEntrada(0.05);
  const fin = useEntrada(0.25 + dur, 8);
  return (
    <>
      {antes ? <div style={{ position: "absolute", top: 250, left: 60, right: 60, ...texto(66, theme.muted), opacity: a }}>{antes}</div> : null}
      <div style={{ position: "absolute", top: antes ? 360 : 330, left: 20, right: 20, ...texto(size, color), transform: `scale(${1 + 0.06 * fin * Math.max(0, 1 - (frame - f(0.25 + dur)) / 20)})`, textShadow: `0 0 60px ${color}55` }}>
        {s}
      </div>
      {etiqueta ? <SubTexto top={(antes ? 360 : 330) + size * 1.2 + 10} texto_={etiqueta} desde={0.5} color={theme.text} /> : null}
      {img ? <Imagen y={1080} size={560} {...img} /> : null}
    </>
  );
};

const Comparar: React.FC<Extract<EscenaDatos, { tipo: "comparar" }>> = ({ titulo, a, b, pie }) => {
  const t = useEntrada(0.05);
  const lado = (l: Lado, i: number) => {
    const e = useEntrada(0.3 + i * 0.5, 12); // eslint-disable-line react-hooks/rules-of-hooks
    const frame = useCurrentFrame(); // eslint-disable-line react-hooks/rules-of-hooks
    const h = (l.altura ?? 0) * interpolate(frame, [f(0.5 + i * 0.5), f(1.6 + i * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const c = l.color ?? (i === 0 ? VERDE : ROJO);
    return (
      <div key={i} style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - e) * 60}px)` }}>
        {l.img ? <Img src={staticFile(l.img)} style={{ width: 360, height: 360, objectFit: "contain", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))", transform: `rotate(${3 * Math.sin(frame / 20 + i)}deg) translateY(${10 * Math.sin(frame / 15 + i * 2)}px)` }} /> : null}
        {l.altura ? <div style={{ width: 150, height: 380 * h, background: c, borderRadius: 18, marginTop: 10, boxShadow: `0 0 40px ${c}66` }} /> : null}
        {l.valor ? <div style={{ ...texto(l.valor.length > 7 ? 70 : 90, c), marginTop: 16 }}>{l.valor}</div> : null}
        <div style={{ ...texto(52), fontWeight: 800, marginTop: 8 }}>{l.etiqueta}</div>
      </div>
    );
  };
  return (
    <>
      {titulo ? <div style={{ position: "absolute", top: 220, left: 50, right: 50, ...texto(84), opacity: t, transform: `scale(${0.8 + 0.2 * t})` }}>{titulo}</div> : null}
      <div style={{ position: "absolute", top: titulo ? 470 : 360, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {lado(a, 0)}
        {lado(b, 1)}
      </div>
      {pie ? <SubTexto top={1300} texto_={pie} desde={1.6} color={AMARILLO} /> : null}
    </>
  );
};

const Barras: React.FC<Extract<EscenaDatos, { tipo: "barras" }>> = ({ titulo, items, pie }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...items.map((i) => i.valor));
  const t = useEntrada(0.05);
  return (
    <>
      {titulo ? <div style={{ position: "absolute", top: 230, left: 50, right: 50, ...texto(80), opacity: t }}>{titulo}</div> : null}
      <div style={{ position: "absolute", top: titulo ? 430 : 330, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 34 }}>
        {items.map((it, i) => {
          const p = interpolate(frame, [f(0.4 + i * 0.35), f(1.4 + i * 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const c = it.color ?? [AMARILLO, VERDE, NARANJA, ROJO, "#7fd1ff"][i % 5];
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 3) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {it.img ? <Img src={staticFile(it.img)} style={{ width: 90, height: 90, objectFit: "contain" }} /> : null}
                <div style={{ ...texto(50), fontWeight: 800, textAlign: "left" }}>{it.etiqueta}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10 }}>
                <div style={{ height: 62, width: `${Math.max(4, (it.valor / max) * 72 * p)}%`, background: c, borderRadius: 14, boxShadow: `0 0 30px ${c}55` }} />
                <div style={{ ...texto(56, c) }}>{it.texto}</div>
              </div>
            </div>
          );
        })}
      </div>
      {pie ? <SubTexto top={1330} texto_={pie} desde={0.4 + items.length * 0.35 + 0.6} color={AMARILLO} /> : null}
    </>
  );
};

const Lista: React.FC<Extract<EscenaDatos, { tipo: "lista" }>> = ({ titulo, items }) => {
  const t = useEntrada(0.05);
  return (
    <>
      {titulo ? <div style={{ position: "absolute", top: 220, left: 50, right: 50, ...texto(82), opacity: t, transform: `scale(${0.8 + 0.2 * t})` }}>{titulo}</div> : null}
      <div style={{ position: "absolute", top: titulo ? 440 : 320, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 28 }}>
        {items.map((it, i) => {
          const e = useEntrada(it.en ?? 0.35 + i * 0.6, 13); // eslint-disable-line react-hooks/rules-of-hooks
          const c = it.color ?? AMARILLO;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: TARJETA, border: `3px solid ${BORDE}`, borderLeft: `12px solid ${c}`, borderRadius: 26, padding: "22px 30px", opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - e) * -120}px)` }}>
              {it.img ? <Img src={staticFile(it.img)} style={{ width: 130, height: 130, objectFit: "contain" }} /> : it.emoji ? <div style={{ fontSize: 90 }}>{it.emoji}</div> : null}
              <div style={{ ...texto(54), fontWeight: 800, textAlign: "left" }}>{it.texto}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const TarjetaE: React.FC<Extract<EscenaDatos, { tipo: "tarjeta" }>> = ({ cabecera, titulo, lineas = [], img, color = AMARILLO }) => {
  const e = useEntrada(0.1);
  return (
    <>
      {img ? <Imagen y={480} size={520} {...img} /> : null}
      <div style={{ position: "absolute", top: img ? 800 : 420, left: 70, right: 70, background: TARJETA, border: `3px solid ${BORDE}`, borderRadius: 32, padding: "40px 44px", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * 80}px)` }}>
        {cabecera ? <div style={{ ...texto(40, color), textAlign: "left", letterSpacing: 2, marginBottom: 14 }}>{cabecera}</div> : null}
        <div style={{ ...texto(66), textAlign: "left" }}>{titulo}</div>
        {lineas.map((l, i) => {
          const le = useEntrada(0.6 + i * 0.5); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ ...texto(48, theme.muted), fontWeight: 700, textAlign: "left", marginTop: 18, opacity: le, transform: `translateX(${(1 - le) * 40}px)` }}>
              {l}
            </div>
          );
        })}
      </div>
    </>
  );
};

const ImagenE: React.FC<Extract<EscenaDatos, { tipo: "imagen" }>> = ({ img, texto: tx, sub, color = AMARILLO }) => {
  const e = useEntrada(0.4);
  return (
    <>
      <Imagen size={820} y={760} {...img} />
      {tx ? <div style={{ position: "absolute", top: 1200, left: 50, right: 50, ...texto(tx.length > 18 ? 76 : 96, color), transform: `scale(${0.7 + 0.3 * e})`, opacity: e }}>{tx}</div> : null}
      {sub ? <SubTexto top={1330} texto_={sub} desde={0.9} /> : null}
    </>
  );
};

const Donut: React.FC<Extract<EscenaDatos, { tipo: "donut" }>> = ({ titulo, partes, centro }) => {
  const frame = useCurrentFrame();
  const t = useEntrada(0.05);
  const total = partes.reduce((s, p) => s + p.valor, 0);
  const R = 230;
  const C = 2 * Math.PI * R;
  let acum = 0;
  return (
    <>
      {titulo ? <div style={{ position: "absolute", top: 210, left: 50, right: 50, ...texto(80), opacity: t }}>{titulo}</div> : null}
      <svg width={620} height={620} viewBox="0 0 620 620" style={{ position: "absolute", left: 230, top: 380, transform: "rotate(-90deg)" }}>
        <circle cx={310} cy={310} r={R} fill="none" stroke="#ffffff10" strokeWidth={90} />
        {partes.map((p, i) => {
          const g = interpolate(frame, [f(0.3 + i * 0.45), f(1.0 + i * 0.45)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const len = (p.valor / total) * C;
          const el = <circle key={i} cx={310} cy={310} r={R} fill="none" stroke={p.color} strokeWidth={90} strokeDasharray={`${len * g} ${C}`} strokeDashoffset={-acum} />;
          acum += len;
          return el;
        })}
      </svg>
      {centro ? <div style={{ position: "absolute", top: 640, left: 230, width: 620, ...texto(70), opacity: t }}>{centro}</div> : null}
      <div style={{ position: "absolute", top: 1040, left: 80, right: 80, display: "flex", flexWrap: "wrap", gap: "16px 34px", justifyContent: "center" }}>
        {partes.map((p, i) => {
          const e = useEntrada(0.3 + i * 0.45); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: e }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: p.color }} />
              <div style={{ ...texto(46), fontWeight: 800 }}>
                {p.etiqueta} <span style={{ color: p.color }}>{Math.round((p.valor / total) * 100)} %</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Render: React.FC<{ e: EscenaDatos; desde: number }> = ({ e, desde }) => {
  switch (e.tipo) {
    case "titulo": return <Titulo {...e} />;
    case "cifra": return <Cifra {...e} />;
    case "comparar": return <Comparar {...e} />;
    case "barras": return <Barras {...e} />;
    case "lista": return <Lista {...e} />;
    case "tarjeta": return <TarjetaE {...e} />;
    case "imagen": return <ImagenE {...e} />;
    case "donut": return <Donut {...e} />;
    case "remate": return <RemateFinal pregunta={e.pregunta} sigueme={2.4} key={desde} />;
  }
};

export const ExplicaShort: React.FC<{ datos: DatosExplica }> = ({ datos }) => {
  const fin = datos.duracion + COLA;
  const inicios = datos.escenas.map((e, i) => (i === 0 ? 0 : Math.max(0, datos.frases[e.frase].inicio - 0.15)));
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Fondo />
      <Audio src={staticFile(datos.voz)} />
      {datos.escenas.map((e, i) => {
        const desde = inicios[i];
        const hasta = i + 1 < inicios.length ? inicios[i + 1] : fin;
        return (
          <Sequence key={i} from={f(desde)} durationInFrames={Math.max(1, f(hasta - desde))} layout="none">
            <Escena dur={hasta - desde}>
              <Render e={e} desde={desde} />
            </Escena>
            {i > 0 ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} /> : null}
          </Sequence>
        );
      })}
      <Subtitulos palabras={datos.palabras} top={1500} tamano={74} />
    </AbsoluteFill>
  );
};
