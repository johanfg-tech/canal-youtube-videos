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

// Short 9:16 de "dinero explicado con datos": una narración y una serie de escenas
// que se muestran en los segundos indicados (sacados de las pausas de la narración).

const titularSchema = z.object({
  tipo: z.literal("titular"),
  inicio: z.number(),
  lineas: z.array(z.string()),
  destacado: z.string().optional(),
});

const ecuacionSchema = z.object({
  tipo: z.literal("ecuacion"),
  inicio: z.number(),
  a: z.string(),
  b: z.string(),
  resultado: z.string(),
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
  barrasSchema,
  encogerSchema,
]);

export const datosShortSchema = z.object({
  audio: z.string().optional(),
  duracion: z.number(),
  aviso: z.string(),
  escenas: z.array(escenaSchema),
});

type Escena = z.infer<typeof escenaSchema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const salida = Easing.bezier(0.16, 1, 0.3, 1);

const useEntrada = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay * fps, fps, config: { damping: 200 } });
};

const Aparece: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const p = useEntrada(delay);
  return (
    <div style={{ opacity: p, translate: `0px ${interpolate(p, [0, 1], [50, 0])}px` }}>{children}</div>
  );
};

const texto = (size: number, color = theme.text, weight = 800): React.CSSProperties => ({
  fontFamily: theme.font,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.1,
  textAlign: "center",
});

const Titular: React.FC<z.infer<typeof titularSchema>> = ({ lineas, destacado }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, gap: 40 }}>
    {destacado ? (
      <Aparece>
        <div style={{ ...texto(340, theme.accent, 900), letterSpacing: -10 }}>{destacado}</div>
      </Aparece>
    ) : null}
    {lineas.map((l, i) => (
      <Aparece key={i} delay={0.25 + i * 0.35}>
        <div style={texto(destacado ? 76 : 96)}>{l}</div>
      </Aparece>
    ))}
  </AbsoluteFill>
);

const Ecuacion: React.FC<z.infer<typeof ecuacionSchema>> = ({ a, b, resultado, etiqueta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pr = useEntrada(1.1);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <Aparece>
          <div style={texto(200, theme.text, 900)}>{a}</div>
        </Aparece>
        <Aparece delay={0.3}>
          <div style={texto(160, theme.muted, 700)}>÷</div>
        </Aparece>
        <Aparece delay={0.6}>
          <div style={texto(200, theme.text, 900)}>{b}</div>
        </Aparece>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: theme.accent,
          width: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 600], { ...clamp, easing: salida }),
        }}
      />
      <div style={{ ...texto(280, theme.accent, 900), scale: String(interpolate(pr, [0, 1], [0.6, 1])), opacity: pr }}>
        {resultado}
      </div>
      <Aparece delay={1.4}>
        <div style={texto(64, theme.muted, 600)}>{etiqueta}</div>
      </Aparece>
    </AbsoluteFill>
  );
};

const Barras: React.FC<z.infer<typeof barrasSchema>> = ({ titulo, barras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...barras.map((b) => b.valor));
  const alto = 900;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, gap: 80 }}>
      <Aparece>
        <div style={texto(80)}>{titulo}</div>
      </Aparece>
      <div style={{ display: "flex", gap: 70, alignItems: "flex-end", height: alto + 120 }}>
        {barras.map((b, i) => {
          const start = (0.4 + i * 0.5) * fps;
          const p = interpolate(frame, [start, start + 0.8 * fps], [0, 1], { ...clamp, easing: salida });
          const ultima = i === barras.length - 1;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ ...texto(56, ultima ? theme.accent : theme.text, 800), opacity: p }}>{b.texto}</div>
              <div
                style={{
                  width: 200,
                  height: (b.valor / max) * alto * p,
                  borderRadius: 24,
                  background: ultima ? theme.accent : theme.bgAlt,
                  border: `4px solid ${ultima ? theme.accent : theme.muted}`,
                }}
              />
              <div style={texto(48, theme.muted, 600)}>{b.etiqueta}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Encoger: React.FC<z.infer<typeof encogerSchema>> = ({ titulo, desde, hasta, pie }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [1 * fps, 4 * fps], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const valor = Math.round(interpolate(p, [0, 1], [desde, hasta]));
  const lado = 640 * Math.sqrt(valor / desde);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, gap: 70 }}>
      <Aparece>
        <div style={texto(80)}>{titulo}</div>
      </Aparece>
      <div style={{ height: 720, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: lado,
            height: lado * 0.6,
            borderRadius: 32,
            background: `color-mix(in srgb, ${theme.accent} ${Math.round(100 - p * 55)}%, ${theme.bgAlt})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={texto(60 + 120 * (lado / 640), theme.text, 900)}>{valor} %</div>
        </div>
      </div>
      <Aparece delay={3.6}>
        <div style={{ ...texto(68, theme.muted, 600), padding: "0 90px" }}>{pie}</div>
      </Aparece>
    </AbsoluteFill>
  );
};

const EscenaVista: React.FC<{ escena: Escena }> = ({ escena }) => {
  switch (escena.tipo) {
    case "titular":
      return <Titular {...escena} />;
    case "ecuacion":
      return <Ecuacion {...escena} />;
    case "barras":
      return <Barras {...escena} />;
    case "encoger":
      return <Encoger {...escena} />;
  }
};

// Fundido de entrada y salida de cada escena.
const Fundido: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const DatosShort: React.FC<z.infer<typeof datosShortSchema>> = ({ audio, duracion, aviso, escenas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round(duracion * fps);
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {audio ? <Audio src={staticFile(audio)} /> : null}
      {escenas.map((e, i) => {
        const from = Math.round(e.inicio * fps);
        const to = i + 1 < escenas.length ? Math.round(escenas[i + 1].inicio * fps) : total;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} name={`${i + 1}. ${e.tipo}`}>
            <Fundido frames={Math.max(1, to - from)}>
              <EscenaVista escena={e} />
            </Fundido>
          </Sequence>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 14,
          background: theme.accent,
          width: `${interpolate(frame, [0, total], [0, 100], clamp)}%`,
        }}
      />
      <div style={{ position: "absolute", bottom: 120, left: 90, right: 90, ...texto(34, theme.muted, 500) }}>
        {aviso}
      </div>
    </AbsoluteFill>
  );
};
