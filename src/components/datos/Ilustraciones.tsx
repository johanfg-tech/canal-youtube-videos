import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

// Dibujos animados para los Shorts: la mascota del canal (una moneda con cara) y escenas ilustradas.
// Todo se anima con useCurrentFrame/interpolate/spring.

const AMARILLO = "#ffd60a";
const ORO = "#f5a400";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

const useResorte = (delay = 0, damping = 11, mass = 0.6) => {
  const { frame, fps } = useT();
  return spring({
    frame: frame - Math.round(delay * fps),
    fps,
    config: { damping, mass },
  });
};

const texto = (
  size: number,
  color = theme.text,
  weight = 900,
): React.CSSProperties => ({
  fontFamily: theme.font,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.05,
  textAlign: "center",
});

// ---------------------------------------------------------------- Mascota

export type Cara = "feliz" | "sorpresa" | "pensando" | "guino" | "preocupada";

export const Moneda: React.FC<{
  cara: Cara;
  habla?: boolean;
  tam?: number;
}> = ({ cara, habla = false, tam = 260 }) => {
  const { frame, t } = useT();
  const parpadeo = frame % 96 < 4 && cara !== "guino" ? 0.1 : 1;
  const boca = habla ? 0.35 + 0.65 * Math.abs(Math.sin(t * 13)) : 0;
  const brazo = Math.sin(t * 4) * 12;
  const ojo = (cx: number, cerrado = false) =>
    cerrado ? (
      <path
        d={`M${cx - 16} 92 Q${cx} 80 ${cx + 16} 92`}
        stroke="#3a2600"
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
      />
    ) : (
      <g
        transform={`translate(${cx} 90) scale(1 ${cara === "sorpresa" ? 1.25 : parpadeo})`}
      >
        <ellipse cx={0} cy={0} rx={15} ry={19} fill="#fff" />
        <circle
          cx={cara === "pensando" ? 5 : 2}
          cy={cara === "pensando" ? -6 : 3}
          r={8}
          fill="#2a1b00"
        />
      </g>
    );
  let bocaSvg: React.ReactNode;
  if (cara === "sorpresa")
    bocaSvg = (
      <ellipse cx={100} cy={142} rx={14} ry={18 + boca * 4} fill="#5a1a00" />
    );
  else if (cara === "preocupada")
    bocaSvg = (
      <path
        d={`M76 ${150 - boca * 4} Q100 ${130 - boca * 6} 124 ${150 - boca * 4}`}
        stroke="#5a1a00"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
    );
  else if (cara === "pensando")
    bocaSvg = (
      <path
        d="M84 144 L116 140"
        stroke="#5a1a00"
        strokeWidth={8}
        strokeLinecap="round"
      />
    );
  else
    bocaSvg = (
      <path
        d={`M70 128 Q100 ${158 + boca * 14} 130 128 Z`}
        fill="#5a1a00"
        stroke="#5a1a00"
        strokeWidth={5}
        strokeLinejoin="round"
      />
    );
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="-30 -10 260 240"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="oro" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff3a0" />
          <stop offset="45%" stopColor={AMARILLO} />
          <stop offset="100%" stopColor={ORO} />
        </radialGradient>
      </defs>
      {/* brazos */}
      <path
        d={`M14 120 Q-14 ${100 - brazo} -18 ${78 - brazo}`}
        stroke={ORO}
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M186 120 Q214 ${100 + brazo} 218 ${78 + brazo}`}
        stroke={ORO}
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      {/* piernas */}
      <path
        d="M78 196 L72 222 L56 222"
        stroke={ORO}
        strokeWidth={11}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M122 196 L128 222 L144 222"
        stroke={ORO}
        strokeWidth={11}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={100}
        cy={105}
        r={100}
        fill="url(#oro)"
        stroke="#c98200"
        strokeWidth={6}
      />
      <circle
        cx={100}
        cy={105}
        r={82}
        fill="none"
        stroke="#e0a000"
        strokeWidth={4}
        strokeDasharray="6 8"
      />
      {ojo(70, cara === "guino")}
      {ojo(130)}
      {cara === "preocupada" ? (
        <>
          <path
            d="M52 62 L84 70"
            stroke="#3a2600"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d="M148 62 L116 70"
            stroke="#3a2600"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </>
      ) : null}
      {bocaSvg}
      <ellipse cx={52} cy={128} rx={12} ry={7} fill="#ff8a65" opacity={0.55} />
      <ellipse cx={148} cy={128} rx={12} ry={7} fill="#ff8a65" opacity={0.55} />
    </svg>
  );
};

// Mascota fija abajo a la derecha, con bocadillo opcional. "habla" mueve la boca mientras suena la voz.
export const MascotaEsquina: React.FC<{
  cara: Cara;
  texto?: string;
  habla: boolean;
  desdeFrame: number;
}> = ({ cara, texto: dicho, habla, desdeFrame }) => {
  const { frame, fps, t } = useT();
  const entrada = spring({ frame, fps, config: { damping: 12 } });
  const salto = spring({
    frame: frame - desdeFrame,
    fps,
    config: { damping: 8, mass: 0.5 },
  });
  const bob = Math.sin(t * 3) * 8;
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        bottom: 14,
        translate: `${(1 - entrada) * 400}px ${bob - Math.sin(Math.min(1, salto) * Math.PI) * 40}px`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {dicho ? (
        <div
          style={{
            ...texto(46, theme.bg, 900),
            background: "#fff",
            borderRadius: 30,
            padding: "16px 26px",
            scale: String(interpolate(salto, [0, 1], [0.3, 1], clamp)),
            transformOrigin: "100% 50%",
            boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
          }}
        >
          {dicho}
        </div>
      ) : null}
      <Moneda cara={cara} habla={habla} tam={180} />
    </div>
  );
};

// ---------------------------------------------------------------- Etiqueta de precio (con camiseta)

export type PasoEtiqueta = { en: number; descuento: string; precio?: number };

const Camiseta: React.FC<{ color?: string }> = ({ color = "#3b6cff" }) => (
  <svg width={520} height={480} viewBox="0 0 260 240">
    <path
      d="M80 10 L40 30 L6 74 L44 98 L60 80 L60 230 L200 230 L200 80 L216 98 L254 74 L220 30 L180 10 Q130 46 80 10 Z"
      fill={color}
      stroke="#1d3a9e"
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M80 10 Q130 46 180 10"
      fill="none"
      stroke="#1d3a9e"
      strokeWidth={6}
    />
    <path
      d="M100 120 L160 120 M100 150 L150 150"
      stroke="#ffffff55"
      strokeWidth={8}
      strokeLinecap="round"
    />
  </svg>
);

export const EscenaEtiqueta: React.FC<{
  titulo?: string;
  precio: number;
  moneda: string;
  pasos: PasoEtiqueta[];
}> = ({ titulo, precio, moneda, pasos }) => {
  const { t } = useT();
  const entra = useResorte(0, 9);
  const swing = Math.sin(t * 2.4) * 6 * Math.exp(-t * 0.6) + (1 - entra) * 40;
  const hechos = pasos.filter((p) => t >= p.en);
  const precios = [
    precio,
    ...hechos
      .filter((p) => p.precio !== undefined)
      .map((p) => p.precio as number),
  ];
  const actual = precios[precios.length - 1];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {titulo ? (
        <div
          style={{
            position: "absolute",
            top: 40,
            ...texto(76),
            opacity: entra,
            padding: "0 60px",
          }}
        >
          {titulo}
        </div>
      ) : null}
      <div
        style={{
          position: "relative",
          translate: `-250px ${(1 - entra) * -600}px`,
          scale: "1.2",
        }}
      >
        <Camiseta />
        {/* hilo + etiqueta */}
        <div
          style={{
            position: "absolute",
            left: 430,
            top: 40,
            transformOrigin: "0 0",
            rotate: `${6 + swing}deg`,
          }}
        >
          <svg
            width={60}
            height={120}
            style={{ position: "absolute", left: -6, top: -6 }}
          >
            <path
              d="M6 6 Q30 60 40 110"
              stroke="#ddd"
              strokeWidth={4}
              fill="none"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 100,
              width: 440,
              padding: "40px 20px 30px",
              background: "#fff6e0",
              borderRadius: "30px 30px 20px 20px",
              border: "6px solid #c9a35c",
              boxShadow: "0 16px 0 rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                width: 26,
                height: 26,
                borderRadius: 13,
                background: theme.bg,
              }}
            />
            {precios.slice(0, -1).map((p, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  ...texto(64, "#8a7a60", 800),
                  whiteSpace: "nowrap",
                }}
              >
                {p} {moneda}
                <Tachon
                  delay={
                    (hechos.filter((h) => h.precio !== undefined)[i]?.en ?? 0) +
                    0.05
                  }
                />
              </div>
            ))}
            <PrecioNuevo key={actual} valor={`${actual} ${moneda}`} />
          </div>
          {hechos.map((p, i) => (
            <Pegatina key={i} texto={p.descuento} en={p.en} i={i} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Tachon: React.FC<{ delay: number }> = ({ delay }) => {
  const { t } = useT();
  const p = interpolate(t, [delay, delay + 0.25], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: -10,
        top: "50%",
        height: 10,
        width: `${p * 110}%`,
        background: theme.accent,
        borderRadius: 5,
        rotate: "-8deg",
      }}
    />
  );
};

const PrecioNuevo: React.FC<{ valor: string }> = ({ valor }) => {
  // Se monta de nuevo con cada precio (key), así el resorte empieza en el momento del cambio.
  const { frame, fps } = useT();
  const p = spring({ frame, fps, config: { damping: 8, mass: 0.5 } });
  return (
    <div
      style={{
        ...texto(116, "#1a1a1a"),
        whiteSpace: "nowrap",
        scale: String(interpolate(p, [0, 1], [1.8, 1])),
      }}
    >
      {valor}
    </div>
  );
};

const Pegatina: React.FC<{ texto: string; en: number; i: number }> = ({
  texto: tx,
  en,
  i,
}) => {
  const p = useResorte(en, 9, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0 + i * 205,
        top: -260 + i * 30,
        width: 230,
        height: 230,
        borderRadius: "50%",
        background: i % 2 ? AMARILLO : theme.accent,
        border: "8px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...texto(60, i % 2 ? theme.bg : "#fff"),
        whiteSpace: "nowrap",
        scale: String(interpolate(p, [0, 1], [3, 1])),
        opacity: Math.min(1, p * 2),
        rotate: `${(i % 2 ? 12 : -14) + (1 - p) * 40}deg`,
        boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
      }}
    >
      {tx}
    </div>
  );
};

// ---------------------------------------------------------------- Pensamiento con tachón

export const EscenaPensamiento: React.FC<{
  texto: string;
  tachar?: number;
  correccion?: string;
}> = ({ texto: idea, tachar, correccion }) => {
  const { t } = useT();
  const nube = useResorte(0.2, 10);
  const x = useResortePlano(tachar ?? 9999);
  const c = useResortePlano((tachar ?? 9999) + 0.6);
  const cara: Cara =
    tachar !== undefined && t >= tachar ? "sorpresa" : "pensando";
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", left: 60, bottom: 40 }}>
        <Moneda cara={cara} tam={420} />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 380 + i * 50,
            top: 760 - i * 90,
            width: 40 + i * 24,
            height: 40 + i * 24,
            borderRadius: "50%",
            background: "#fff",
            scale: String(interpolate(nube, [0, 1], [0, 1])),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 60,
          right: 60,
          padding: "70px 40px",
          background: "#fff",
          borderRadius: 160,
          scale: String(interpolate(nube, [0, 1], [0.2, 1])),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 16px 0 rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            ...texto(78, theme.bg),
            whiteSpace: "nowrap",
            position: "relative",
          }}
        >
          {idea}
          {tachar !== undefined ? (
            <>
              {[0, 1].map((k) => (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: "-4%",
                    top: "45%",
                    height: 22,
                    borderRadius: 11,
                    background: theme.accent,
                    width: `${108 * Math.max(0, Math.min(1, x * 2 - k))}%`,
                    rotate: `${k ? -14 : 14}deg`,
                    transformOrigin: k ? "100% 50%" : "0 50%",
                    marginLeft: k ? "auto" : 0,
                    right: k ? "-4%" : undefined,
                  }}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
      {correccion ? (
        <div
          style={{
            position: "absolute",
            top: 560,
            right: 80,
            ...texto(120, theme.bg),
            background: AMARILLO,
            padding: "10px 40px",
            borderRadius: 30,
            rotate: "-4deg",
            scale: String(interpolate(c, [0, 1], [0, 1])),
            boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
          }}
        >
          {correccion}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Resorte sin hooks condicionales: devuelve 0..1 desde `delay` (se llama siempre igual en cada render).
const useResortePlano = (delay: number) => {
  const { frame, fps } = useT();
  return interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
};

// ---------------------------------------------------------------- Billetes que se van

export const EscenaBilletes: React.FC<{
  titulo: string;
  total: number;
  quedan: number;
  quitar: number;
  pie: string;
}> = ({ titulo, total, quedan, quitar, pie }) => {
  const { t } = useT();
  const entra = useResorte(0, 12);
  const pieP = useResortePlano(quitar + 0.9);
  const cols = 2;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{ position: "absolute", top: 30, ...texto(80), opacity: entra }}
      >
        {titulo}
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 380px)`,
          gap: "26px 40px",
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const sale = i >= quedan;
          const d = quitar + (i - quedan) * 0.07;
          const p = sale
            ? interpolate(t, [d, d + 0.6], [0, 1], {
                ...clamp,
                easing: Easing.in(Easing.cubic),
              })
            : 0;
          const llega = interpolate(t, [i * 0.05, i * 0.05 + 0.35], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.6)),
          });
          const dir = random(`b${i}`) > 0.5 ? 1 : -1;
          return (
            <div
              key={i}
              style={{
                width: 380,
                height: 150,
                borderRadius: 18,
                background: "linear-gradient(135deg, #2fbf71, #167a41)",
                border: "5px solid #a7f3c4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...texto(70, "#eafff2"),
                opacity: llega * (1 - p),
                translate: `${dir * p * 700}px ${-p * 900 + (1 - llega) * 300}px`,
                rotate: `${dir * p * 60}deg`,
              }}
            >
              <span
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  border: "5px dashed #a7f3c4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Math.round(100 / total)}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          ...texto(84, theme.bg),
          background: AMARILLO,
          padding: "12px 40px",
          borderRadius: 26,
          scale: String(interpolate(pieP, [0, 1], [0, 1])),
          boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
        }}
      >
        {pie}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Calculadora

export const EscenaCalculadora: React.FC<{
  titulo: string;
  teclas: string[];
  tiempos: number[];
  resultado: string;
  revelar: number;
  pie: string;
}> = ({ titulo, teclas, tiempos, resultado, revelar, pie }) => {
  const { t } = useT();
  const entra = useResorte(0, 11);
  const pulsadas = teclas.filter((_, i) => t >= tiempos[i]);
  const pantalla = t >= revelar ? resultado : pulsadas.join(" ") || "0";
  const flash = interpolate(t, [revelar, revelar + 0.3], [1, 0], clamp);
  const pieP = useResortePlano(revelar + 0.5);
  const botones = [
    "7",
    "8",
    "9",
    "×",
    "4",
    "5",
    "6",
    "−",
    "1",
    "2",
    "3",
    "+",
    "0",
    ",",
    "=",
    "÷",
  ];
  const activa = (b: string) => {
    for (let i = teclas.length - 1; i >= 0; i--) {
      if (t >= tiempos[i] && t < tiempos[i] + 0.25 && teclas[i].includes(b))
        return true;
    }
    return t >= revelar && t < revelar + 0.25 && b === "=";
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{ position: "absolute", top: 20, ...texto(76), opacity: entra }}
      >
        {titulo}
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: 640,
          padding: 36,
          borderRadius: 50,
          background: "linear-gradient(180deg, #2b2f3a, #1b1e26)",
          border: "6px solid #3a3f4d",
          boxShadow: "0 24px 0 rgba(0,0,0,0.45)",
          translate: `0 ${(1 - entra) * 500}px`,
          rotate: `${(1 - entra) * -10}deg`,
        }}
      >
        <div
          style={{
            height: 190,
            borderRadius: 24,
            background: `rgb(${190 + flash * 65}, ${230 + flash * 25}, ${170 + flash * 85})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 30px",
            ...texto(t >= revelar ? 140 : 96, "#1b2b12"),
            fontVariantNumeric: "tabular-nums",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {pantalla}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
            marginTop: 30,
          }}
        >
          {botones.map((b) => {
            const on = activa(b);
            return (
              <div
                key={b}
                style={{
                  height: 110,
                  borderRadius: 26,
                  background: on
                    ? AMARILLO
                    : "×−+÷=".includes(b)
                      ? theme.accent
                      : "#454b5c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...texto(62, on ? theme.bg : "#fff"),
                  translate: `0 ${on ? 8 : 0}px`,
                  boxShadow: on
                    ? "0 2px 0 rgba(0,0,0,0.5)"
                    : "0 10px 0 rgba(0,0,0,0.5)",
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          ...texto(80, theme.bg),
          background: AMARILLO,
          padding: "10px 36px",
          borderRadius: 26,
          scale: String(interpolate(pieP, [0, 1], [0, 1])),
          boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
        }}
      >
        {pie}
      </div>
    </AbsoluteFill>
  );
};
