import { z } from "zod";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Fondo } from "../components/datos/Fondo";
import { Subtitulos } from "../components/datos/Subtitulos";

// Short 9:16 de "dinero explicado con datos": narración, subtítulos palabra a palabra
// y escenas animadas que empiezan en los segundos indicados en el guion.

const titularSchema = z.object({
  tipo: z.literal("titular"),
  inicio: z.number(),
  lineas: z.array(z.string()),
  resaltar: z.array(z.string()).optional(),
  destacado: z.string().optional(),
  final: z.boolean().optional(),
});

const ecuacionSchema = z.object({
  tipo: z.literal("ecuacion"),
  inicio: z.number(),
  a: z.string(),
  b: z.string(),
  resultado: z.number(),
  etiqueta: z.string(),
  operador: z.string().optional(), // "÷" por defecto; también "×", "−", "+"
  decimales: z.number().optional(), // decimales del resultado (se muestran con coma)
  // Segundo (desde el inicio de la escena) en que aparece el resultado, cuando la voz lo dice.
  revelar: z.number().optional(),
});

const duplicarSchema = z.object({
  tipo: z.literal("duplicar"),
  inicio: z.number(),
  monedas: z.number(),
  etiqueta: z.string(),
});

const barrasSchema = z.object({
  tipo: z.literal("barras"),
  inicio: z.number(),
  titulo: z.string(),
  barras: z.array(z.object({ etiqueta: z.string(), valor: z.number(), texto: z.string() })),
});

const encogerSchema = z.object({
  tipo: z.literal("encoger"),
  inicio: z.number(),
  titulo: z.string(),
  desde: z.number(),
  hasta: z.number(),
  pie: z.string(),
});

const escenaSchema = z.discriminatedUnion("tipo", [
  titularSchema,
  ecuacionSchema,
  duplicarSchema,
  barrasSchema,
  encogerSchema,
]);

export const datosShortSchema = z.object({
  audio: z.string().optional(),
  duracion: z.number(),
  aviso: z.string(),
  sfx: z.boolean().optional(),
  // Vídeo largo 16:9 (1920x1080): las escenas se dibujan en una zona de 1800x1240 reducida.
  horizontal: z.boolean().optional(),
  palabras: z
    .array(z.object({ texto: z.string(), inicio: z.number(), fin: z.number(), corte: z.boolean().optional() }))
    .optional(),
  escenas: z.array(escenaSchema),
});

type Escena = z.infer<typeof escenaSchema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMARILLO = "#ffd60a";
const ZONA_ALTO = 1240; // alto de la zona de escenas; debajo van los subtítulos

const useResorte = (delay = 0, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(delay * fps), fps, config: { damping, mass: 0.6 } });
};

// 11574 -> "11.574" (separador de miles español, también con 4 cifras).
const miles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const useContador = (hasta: number, delay: number, dur: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.round(
    interpolate(frame, [delay * fps, (delay + dur) * fps], [0, hasta], { ...clamp, easing: Easing.out(Easing.cubic) }),
  );
};

// Pequeño temblor a partir de un instante, que se apaga en 0.4 s.
const useTemblor = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay * fps;
  if (f < 0 || f > 0.4 * fps) return "0px 0px";
  const k = 1 - f / (0.4 * fps);
  return `${Math.sin(f * 2.1) * 14 * k}px ${Math.cos(f * 2.7) * 10 * k}px`;
};

const estiloTexto = (size: number, color = theme.text, weight = 900): React.CSSProperties => ({
  fontFamily: theme.font,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.05,
  textAlign: "center",
});

const Pop: React.FC<{ delay?: number; desde?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  desde = "0px 80px",
  children,
  style,
}) => {
  const p = useResorte(delay);
  const [dx, dy] = desde.split(" ").map((v) => parseFloat(v));
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        scale: String(interpolate(p, [0, 1], [0.4, 1])),
        translate: `${dx * (1 - p)}px ${dy * (1 - p)}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Rayos que salen del centro, para remarcar un resultado.
const Estallido: React.FC<{ delay: number; color?: string }> = ({ delay, color = AMARILLO }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [delay * fps, (delay + 0.5) * fps], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  if (p <= 0 || p >= 1) return null;
  return (
    <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: "absolute" }}>
      {new Array(14).fill(0).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r1 = 160 + 200 * p;
        const r2 = r1 + 90 * (1 - p);
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={1 - p}
          />
        );
      })}
    </svg>
  );
};

// "50 %" o "100 €" no se parten en dos líneas.
const unirSimbolos = (ws: string[]) =>
  ws.reduce<string[]>((acc, w) => {
    if (acc.length && /^[%€]/.test(w)) acc[acc.length - 1] += "\u00a0" + w;
    else acc.push(w);
    return acc;
  }, []);

const limpiar = (w: string) => w.replace(/[¿?¡!.,…:]|\u00a0[%€]/g, "");

const Titular: React.FC<z.infer<typeof titularSchema>> = ({ lineas, resaltar = [], destacado, final }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numero = useContadorSeguro(destacado ?? "");
  const pulso = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
  let n = 0;
  const base = destacado ? 0.7 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36, padding: 70 }}>
      {destacado ? (
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <svg width={620} height={620} viewBox="-310 -310 620 620" style={{ position: "absolute", rotate: `${frame * 1.5}deg` }}>
            <circle r={280} fill="none" stroke={theme.accent} strokeWidth={10} strokeDasharray="40 30" opacity={0.6} />
          </svg>
          <Pop>
            <div
              style={{
                ...estiloTexto(numero.length <= 3 ? 380 : numero.length <= 5 ? 280 : 210, theme.accent),
                letterSpacing: -12,
                scale: String(pulso),
                textShadow: `0 0 60px ${theme.accent}aa, 0 14px 0 rgba(0,0,0,0.4)`,
              }}
            >
              {numero}
            </div>
          </Pop>
        </div>
      ) : null}
      {lineas.map((l, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px" }}>
          {unirSimbolos(l.split(" ")).map((w, wi) => {
            const d = base + 0.12 * n++;
            const marcada = resaltar.includes(limpiar(w));
            return (
              <Pop key={wi} delay={d} desde={`0px ${li % 2 ? 120 : -120}px`}>
                <span
                  style={{
                    ...estiloTexto(destacado ? 88 : 120, marcada ? AMARILLO : theme.text),
                    display: "inline-block",
                    textShadow: "0 10px 0 rgba(0,0,0,0.35)",
                    rotate: marcada ? `${3 * Math.sin((frame / fps) * 4 + wi)}deg` : "0deg",
                  }}
                >
                  {w}
                </span>
              </Pop>
            );
          })}
        </div>
      ))}
      {final ? (
        <Pop delay={1.2}>
          <div
            style={{
              ...estiloTexto(64, theme.text),
              background: theme.accent,
              borderRadius: 999,
              padding: "26px 70px",
              scale: String(1 + 0.06 * Math.sin((frame / fps) * Math.PI * 3)),
              boxShadow: `0 0 0 ${8 + 8 * Math.sin((frame / fps) * Math.PI * 3)}px ${theme.accent}55`,
            }}
          >
            SUSCRÍBETE ▶
          </div>
        </Pop>
      ) : null}
    </AbsoluteFill>
  );
};

// Cuenta hasta el número si el destacado es numérico; si no, lo muestra tal cual.
const useContadorSeguro = (valor: string) => {
  const num = Number(valor);
  const c = useContador(Number.isFinite(num) ? num : 0, 0.1, 0.7);
  return Number.isFinite(num) ? miles(c) : valor;
};

const Ecuacion: React.FC<z.infer<typeof ecuacionSchema>> = ({
  a,
  b,
  resultado,
  etiqueta,
  revelar = 1.7,
  operador = "÷",
  decimales = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = Math.max(1.2, revelar);
  const factor = 10 ** decimales;
  const valor = (useContador(resultado * factor, r - 0.5, 0.5) / factor).toFixed(decimales).replace(".", ",");
  const pr = useResorte(r - 0.5, 8);
  const temblor = useTemblor(r);
  const giro = useResorte(0.25);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, translate: temblor }}>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        <Pop desde="-500px 0px">
          <div style={{ ...estiloTexto(a.length > 3 ? 140 : 210), whiteSpace: "nowrap" }}>{a}</div>
        </Pop>
        <Pop delay={0.25} desde="0px -300px">
          <div style={{ ...estiloTexto(170, AMARILLO), rotate: `${interpolate(giro, [0, 1], [-180, 0])}deg` }}>{operador}</div>
        </Pop>
        <Pop delay={0.5} desde="500px 0px">
          <div style={{ ...estiloTexto(b.length > 3 ? 140 : 210), whiteSpace: "nowrap" }}>{b}</div>
        </Pop>
      </div>
      <div
        style={{
          height: 14,
          borderRadius: 7,
          background: theme.accent,
          width: interpolate(frame, [(r - 0.9) * fps, (r - 0.5) * fps], [0, 720], { ...clamp, easing: Easing.out(Easing.cubic) }),
        }}
      />
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Estallido delay={r} />
        <div
          style={{
            ...estiloTexto(330, AMARILLO),
            opacity: pr,
            scale: String(interpolate(pr, [0, 1], [0.3, 1])),
            textShadow: `0 0 70px ${AMARILLO}88, 0 14px 0 rgba(0,0,0,0.4)`,
          }}
        >
          {valor}
        </div>
      </div>
      <Pop delay={r - 0.1}>
        <div style={estiloTexto(70, theme.text, 800)}>{etiqueta}</div>
      </Pop>
    </AbsoluteFill>
  );
};

const Moneda: React.FC<{ delay: number; y: number }> = ({ delay, y }) => {
  const p = useResorte(delay, 9);
  return (
    <div
      style={{
        position: "absolute",
        bottom: y,
        left: 0,
        width: 260,
        height: 64,
        borderRadius: "50%",
        background: `linear-gradient(180deg, #ffe680 0%, ${AMARILLO} 45%, #c99400 100%)`,
        border: "5px solid #8a6500",
        boxShadow: "0 6px 0 #8a6500",
        opacity: p > 0.01 ? 1 : 0,
        translate: `0px ${-700 * (1 - p)}px`,
      }}
    />
  );
};

const Pila: React.FC<{ n: number; delay: number }> = ({ n, delay }) => (
  <div style={{ position: "relative", width: 260, height: 70 + n * 52 }}>
    {new Array(n).fill(0).map((_, i) => (
      <Moneda key={i} delay={delay + i * 0.09} y={i * 52} />
    ))}
  </div>
);

const Duplicar: React.FC<z.infer<typeof duplicarSchema>> = ({ monedas, etiqueta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = useResorte(1.1, 7);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50 }}>
      <div style={{ display: "flex", gap: 90, alignItems: "flex-end" }}>
        <Pila n={monedas} delay={0} />
        <Pila n={monedas} delay={0.5} />
      </div>
      <div
        style={{
          ...estiloTexto(220, theme.accent),
          scale: String(badge),
          rotate: `${interpolate(badge, [0, 1], [-30, -6]) + 4 * Math.sin((frame / fps) * 5)}deg`,
          textShadow: "0 12px 0 rgba(0,0,0,0.4)",
        }}
      >
        ×2
      </div>
      <Pop delay={1.3}>
        <div style={estiloTexto(80)}>{etiqueta}</div>
      </Pop>
    </AbsoluteFill>
  );
};

const Barra: React.FC<{ b: { etiqueta: string; valor: number; texto: string }; i: number; max: number }> = ({ b, i, max }) => {
  const p = useResorte(0.3 + i * 0.45, 9);
  const dec = Number.isInteger(b.valor) ? 1 : 10;
  const valor = useContador(b.valor * dec, 0.3 + i * 0.45, 0.6) / dec;
  const ultima = i === 1;
  const color = ultima ? AMARILLO : theme.accent;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ ...estiloTexto(110, color), opacity: Math.min(1, p) }}>{dec === 1 ? miles(valor) : valor.toFixed(1).replace(".", ",")}</div>
      <div style={{ ...estiloTexto(44, theme.muted, 700), marginTop: -16 }}>{b.texto}</div>
      <div
        style={{
          width: 230,
          height: Math.max(0, (b.valor / max) * 640 * p),
          borderRadius: 30,
          background: `linear-gradient(180deg, ${color}, ${color}88)`,
          boxShadow: `0 0 50px ${color}66`,
        }}
      />
      <div style={estiloTexto(58, theme.text, 800)}>{b.etiqueta}</div>
    </div>
  );
};

const Barras: React.FC<z.infer<typeof barrasSchema>> = ({ titulo, barras }) => {
  const max = Math.max(...barras.map((b) => b.valor));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50 }}>
      <Pop>
        <div style={estiloTexto(84)}>{titulo}</div>
      </Pop>
      <div style={{ display: "flex", gap: 110, alignItems: "flex-end" }}>
        {barras.map((b, i) => (
          <Barra key={i} b={b} i={i} max={max} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Encoger: React.FC<z.infer<typeof encogerSchema>> = ({ titulo, desde, hasta, pie }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.8 * fps, 3.4 * fps], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const valor = Math.round(interpolate(p, [0, 1], [desde, hasta]));
  const escala = Math.sqrt(valor / desde);
  const flecha = interpolate(Math.sin((frame / fps) * Math.PI * 4), [-1, 1], [0, 30]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Pop>
        <div style={estiloTexto(80)}>{titulo}</div>
      </Pop>
      <div style={{ height: 560, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Pop delay={0.2}>
          <svg
            width={760}
            height={400}
            viewBox="0 0 760 400"
            style={{ scale: String(escala), rotate: `${-4 + 8 * p}deg`, filter: `saturate(${1 - p * 0.8})` }}
          >
            <rect x={6} y={6} width={748} height={388} rx={34} fill="#1f9d55" stroke="#0d5c2f" strokeWidth={12} />
            <rect x={40} y={40} width={680} height={320} rx={20} fill="none" stroke="#a7f3c4" strokeWidth={5} strokeDasharray="14 10" />
            <circle cx={380} cy={200} r={110} fill="#167a41" stroke="#a7f3c4" strokeWidth={6} />
            <text x={380} y={235} textAnchor="middle" fontFamily={theme.font} fontWeight={900} fontSize={110} fill="#eafff2">
              {valor}
            </text>
            <text x={90} y={110} fontFamily={theme.font} fontWeight={900} fontSize={60} fill="#eafff2">
              %
            </text>
          </svg>
        </Pop>
        <div style={{ position: "absolute", right: -40, top: 60 + flecha, opacity: p > 0.05 ? 1 : 0 }}>
          <div style={estiloTexto(180, theme.accent)}>↓</div>
        </div>
      </div>
      <Pop delay={3.2}>
        <div style={{ ...estiloTexto(62, theme.text, 800), padding: "0 70px" }}>{pie}</div>
      </Pop>
    </AbsoluteFill>
  );
};

const EscenaVista: React.FC<{ escena: Escena }> = ({ escena }) => {
  switch (escena.tipo) {
    case "titular":
      return <Titular {...escena} />;
    case "ecuacion":
      return <Ecuacion {...escena} />;
    case "duplicar":
      return <Duplicar {...escena} />;
    case "barras":
      return <Barras {...escena} />;
    case "encoger":
      return <Encoger {...escena} />;
  }
};

// Transición: entra con zoom y desenfoque, se acerca poco a poco y sale encogiendo.
const Transicion: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const salida = interpolate(frame, [frames - 7, frames], [0, 1], clamp);
  const zoomLento = interpolate(frame, [0, frames], [1, 1.05]);
  return (
    <AbsoluteFill
      style={{
        opacity: entrada * (1 - salida),
        scale: String(interpolate(entrada, [0, 1], [1.3, 1]) * zoomLento * interpolate(salida, [0, 1], [1, 0.8])),
        filter: `blur(${(1 - entrada) * 14 + salida * 10}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Destello: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4], [0.18, 0], clamp);
  return <AbsoluteFill style={{ background: "#ffffff", opacity: o, pointerEvents: "none" }} />;
};

const momentosDing = (e: Escena) => {
  if (e.tipo === "ecuacion") return [Math.max(1.2, e.revelar ?? 1.7)];
  if (e.tipo === "duplicar") return [1.1];
  if (e.tipo === "titular" && e.destacado) return [0.8];
  return [];
};

const H_ESCALA = 0.74;

export const DatosShort: React.FC<z.infer<typeof datosShortSchema>> = ({
  audio,
  duracion,
  aviso,
  sfx,
  horizontal,
  palabras,
  escenas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round(duracion * fps);
  return (
    <AbsoluteFill>
      <Fondo />
      {audio ? <Audio src={staticFile(audio)} /> : null}
      {escenas.map((e, i) => {
        const from = Math.round(e.inicio * fps);
        const to = i + 1 < escenas.length ? Math.round(escenas[i + 1].inicio * fps) : total;
        const dur = Math.max(1, to - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${e.tipo}`}>
            <div
              style={
                horizontal
                  ? { position: "absolute", top: 10, left: 60, width: 1800, height: ZONA_ALTO, scale: String(H_ESCALA), transformOrigin: "50% 0" }
                  : { position: "absolute", top: 150, left: 0, right: 0, height: ZONA_ALTO }
              }
            >
              <Transicion frames={dur}>
                <EscenaVista escena={e} />
              </Transicion>
            </div>
            {i > 0 ? <Destello /> : null}
            {sfx ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} /> : null}
            {sfx
              ? momentosDing(e).map((s) => (
                  <Sequence key={s} from={Math.round(s * fps)} layout="none">
                    <Audio src={staticFile("sfx/ding.wav")} volume={0.25} />
                  </Sequence>
                ))
              : null}
          </Sequence>
        );
      })}
      {palabras ? <Subtitulos palabras={palabras} top={horizontal ? 868 : 1440} /> : null}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 14,
          background: `linear-gradient(90deg, ${theme.accent}, ${AMARILLO})`,
          width: `${interpolate(frame, [0, total], [0, 100], clamp)}%`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: horizontal ? 24 : 70,
          left: 90,
          right: 90,
          ...estiloTexto(horizontal ? 24 : 30, theme.muted, 500),
        }}
      >
        {aviso}
      </div>
    </AbsoluteFill>
  );
};
