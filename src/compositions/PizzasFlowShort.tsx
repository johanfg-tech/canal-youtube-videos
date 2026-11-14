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
  whoosh?: boolean;
};

// Lista de planos ajustada a la voz (ningún plano fijo pasa de ~4 s).
const PLANOS: Plano[] = [
  { ini: 0, fin: 3.7, src: "i01-pizzas.jpg", zoom: [1.25, 1.05], foco: [50, 55, 50, 50] },
  { ini: 3.7, fin: 5.5, src: "i11-montana.jpg", zoom: [1.0, 1.18], foco: [50, 30, 50, 20], whoosh: true },
  { ini: 5.5, fin: 7.7, src: "i02-florida.jpg", zoom: [1.0, 1.12], foco: [50, 30, 50, 50], whoosh: true },
  { ini: 7.7, fin: 8.6, src: "i02-florida.jpg", zoom: [1.5, 1.7], foco: [45, 65, 45, 65] },
  { ini: 8.6, fin: 12.6, src: "v03-pc.mp4", video: true, desde: 0 },
  { ini: 12.6, fin: 14.8, src: "i03-pc.jpg", zoom: [1.6, 1.8], foco: [60, 35, 60, 32] },
  { ini: 14.8, fin: 17.0, src: "i03-pc.jpg", zoom: [1.15, 1.0], foco: [35, 50, 40, 50] },
  { ini: 17.0, fin: 20.0, src: "i04-foro.jpg", zoom: [1.0, 1.2], foco: [50, 45, 50, 42], whoosh: true },
  { ini: 20.0, fin: 23.1, src: "i04-foro.jpg", zoom: [1.9, 2.2], foco: [52, 40, 52, 40] },
  { ini: 23.1, fin: 24.7, src: "i05-espera.jpg", zoom: [1.5, 1.6], foco: [68, 12, 68, 15], whoosh: true },
  { ini: 24.7, fin: 26.0, src: "i05-espera.jpg", zoom: [1.6, 1.8], foco: [55, 40, 55, 40] },
  { ini: 26.0, fin: 28.2, src: "i05-espera.jpg", zoom: [1.0, 1.1], foco: [50, 50, 55, 50] },
  { ini: 28.2, fin: 31.3, src: "i06-california.jpg", zoom: [1.0, 1.15], foco: [50, 40, 55, 35], whoosh: true },
  { ini: 31.3, fin: 34.5, src: "i06-california.jpg", zoom: [1.7, 1.9], foco: [60, 35, 60, 35] },
  { ini: 34.5, fin: 37.5, src: "i07-telefono.jpg", zoom: [1.05, 1.25], foco: [45, 40, 50, 45], whoosh: true },
  { ini: 37.5, fin: 41.4, src: "v08-repartidor.mp4", video: true, desde: 0.5 },
  { ini: 41.4, fin: 46.4, src: "v09-entrega.mp4", video: true, desde: 0 },
  { ini: 46.4, fin: 49.4, src: "i10-foto.jpg", zoom: [1.0, 1.2], foco: [45, 35, 40, 40], whoosh: true },
  { ini: 49.4, fin: 51.4, src: "i09-entrega.jpg", zoom: [1.3, 1.45], foco: [60, 40, 60, 45] },
  { ini: 51.4, fin: 53.2, src: "i08-repartidor.jpg", zoom: [1.1, 1.3], foco: [45, 55, 45, 60] },
  { ini: 53.2, fin: 56.2, src: "i01-pizzas.jpg", zoom: [1.0, 1.3], foco: [30, 60, 30, 60], whoosh: true },
  { ini: 56.2, fin: 64.1, src: "v11-montana.mp4", video: true, desde: 0 },
  { ini: 64.1, fin: 68.5, src: "i11-montana.jpg", zoom: [1.35, 1.0], foco: [50, 15, 50, 40] },
  { ini: 68.5, fin: 71.3, src: "i11-montana.jpg", zoom: [1.0, 1.15], foco: [40, 85, 40, 85] },
  { ini: 71.3, fin: 72.6, src: "i01-pizzas.jpg", zoom: [1.8, 2.0], foco: [70, 45, 70, 45], whoosh: true },
  { ini: 72.6, fin: 76.8, src: "i12-laszlo.jpg", zoom: [1.0, 1.2], foco: [50, 40, 50, 35], whoosh: true },
  { ini: 76.8, fin: 78.9, src: "i12-laszlo.jpg", zoom: [1.8, 2.0], foco: [55, 55, 55, 55] },
  { ini: 78.9, fin: 81.4, src: "i12-laszlo.jpg", zoom: [1.9, 2.3], foco: [50, 28, 50, 28] },
  { ini: 81.4, fin: 83.7, src: "i09-entrega.jpg", zoom: [1.0, 1.15], foco: [50, 50, 55, 45], whoosh: true },
  { ini: 83.7, fin: 86.0, src: "i10-foto.jpg", zoom: [1.6, 1.8], foco: [45, 80, 45, 80] },
  { ini: 86.0, fin: 89.9, src: "i01-pizzas.jpg", zoom: [1.1, 1.3], foco: [50, 50, 50, 45], whoosh: true },
  { ini: 89.9, fin: FIN_VOZ + COLA, src: "i12-laszlo.jpg", zoom: [1.3, 1.5], foco: [50, 30, 50, 30] },
];

const PlanoVista: React.FC<{ p: Plano }> = ({ p }) => {
  const frame = useCurrentFrame();
  const dur = f(p.fin - p.ini);
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Pequeño golpe de escala en cada corte para que se note el cambio.
  const golpe = interpolate(frame, [0, 6], [1.06, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  if (p.video) {
    return (
      <AbsoluteFill style={{ transform: `scale(${golpe * interpolate(t, [0, 1], [1, 1.06])})` }}>
        <OffthreadVideo
          src={ruta(p.src)}
          startFrom={f(p.desde ?? 0)}
          volume={0.18}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }
  const [z0, z1] = p.zoom ?? [1, 1.1];
  const [x0, y0, x1, y1] = p.foco ?? [50, 50, 50, 50];
  const e = Easing.inOut(Easing.sin)(t);
  const z = (z0 + (z1 - z0) * e) * golpe;
  const ox = x0 + (x1 - x0) * e;
  const oy = y0 + (y1 - y0) * e;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={ruta(p.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${ox}% ${oy}%`,
          transform: `scale(${z})`,
        }}
      />
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

// Cifra que cuenta hasta su valor (millones de dólares).
const Cifra: React.FC<{ ini: number; fin: number; anio: string; de: number; a: number; color?: string }> = ({ ini, fin, anio, de, a, color = VERDE }) => {
  const frame = useCurrentFrame();
  const e = useEntrada(0, 12);
  const p = interpolate(frame, [0, f(Math.min(1.4, fin - ini))], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const valor = Math.round(de + (a - de) * p).toLocaleString("es-ES");
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${e})` }}>
      <div style={{ ...texto(64, theme.bg), background: AMARILLO, borderRadius: 18, padding: "4px 30px" }}>{anio}</div>
      <div style={{ ...texto(150, color), marginTop: 14, textShadow: "0 8px 30px rgba(0,0,0,0.85)", fontVariantNumeric: "tabular-nums" }}>
        {valor} M$
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
  { ini: 56.2, fin: 59.6, el: <Cifra ini={56.2} fin={59.6} anio="2013" de={0} a={10} /> },
  { ini: 59.6, fin: 62.5, el: <Cifra ini={59.6} fin={62.5} anio="2017" de={10} a={200} /> },
  { ini: 62.5, fin: 65.2, el: <Cifra ini={62.5} fin={65.2} anio="2021" de={200} a={700} /> },
  { ini: 65.2, fin: 68.5, el: <Cifra ini={65.2} fin={68.5} anio="MÁXIMO" de={700} a={1200} color={AMARILLO} /> },
  { ini: 68.5, fin: 71.3, el: <Cifra ini={68.5} fin={71.3} anio="HOY" de={1200} a={750} /> },
  { ini: 71.3, fin: 72.6, el: <Etiqueta ini={71.3} fin={72.6} color={ROJO} size={110}>POR 2 PIZZAS</Etiqueta> },
  { ini: 76.8, fin: 78.9, el: <Etiqueta ini={76.8} fin={78.9} color={NARANJA}>100.000 ₿ EN PIZZAS</Etiqueta> },
  { ini: 86.0, fin: 89.9, el: <Etiqueta ini={86.0} fin={89.9} size={80}>22 DE MAYO · PIZZA DAY</Etiqueta> },
];

export const PizzasFlowShort: React.FC = () => {
  const palabras = (guion.palabras as Palabra[]).filter((p) => p.inicio < 89.9);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {PLANOS.map((p, i) => (
        <Sequence key={i} from={f(p.ini)} durationInFrames={f(p.fin) - f(p.ini)}>
          <PlanoVista p={p} />
          {p.whoosh ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} /> : null}
        </Sequence>
      ))}

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
          <Audio src={staticFile("sfx/pop.wav")} volume={0.3} />
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
