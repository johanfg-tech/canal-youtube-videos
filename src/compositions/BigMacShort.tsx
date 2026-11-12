import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Fondo } from "../components/datos/Fondo";
import { Subtitulos, Palabra } from "../components/datos/Subtitulos";
import guion from "../../guiones/big-mac.json";

// Short "índice Big Mac": estilo visual nuevo, con gráficos propios del tema
// (barras de precios que crecen, regla barata/cara y remate integrado).

const FPS = 30;
const AMARILLO = "#ffd60a";
const VERDE = "#2ee59d";
const ROJO = "#ff4d6d";
const COLA = 1.6; // segundos extra al final para el "Sígueme"

export const duracionBigMac = Math.ceil((guion.duracion + COLA) * FPS);

const f = (s: number) => Math.round(s * FPS);

// Entrada con muelle desde un fotograma dado (en segundos).
const useEntrada = (desde: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - f(desde), fps, config: { damping, mass: 0.6 } });
};

// Escena que entra y sale suavemente.
const Escena: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const total = f(dur);
  const opacity = interpolate(frame, [0, 6, total - 8, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 10], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>
  );
};

const texto = (size: number, color = theme.text): React.CSSProperties => ({
  fontFamily: theme.font,
  fontWeight: 900,
  fontSize: size,
  color,
  lineHeight: 1.05,
  textAlign: "center",
  letterSpacing: -1,
});

// Hamburguesa que flota y gira un poco.
const Hamburguesa: React.FC<{ size: number; desde?: number; x?: number; y?: number }> = ({
  size,
  desde = 0,
  x = 540,
  y = 900,
}) => {
  const frame = useCurrentFrame();
  const e = useEntrada(desde, 9);
  const t = frame / FPS;
  return (
    <Img
      src={staticFile("ia/hamburguesa.png")}
      style={{
        position: "absolute",
        width: size,
        left: x - size / 2,
        top: y - size / 2 + 18 * Math.sin(t * 2),
        transform: `scale(${e}) rotate(${4 * Math.sin(t * 1.3)}deg)`,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))",
      }}
    />
  );
};

// 1. Gancho
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useEntrada(0.1);
  const b = useEntrada(0.9);
  const c = useEntrada(2.6);
  // Balanza que se inclina de un lado a otro.
  const giro = 10 * Math.sin(frame / 9);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
        <div style={{ ...texto(96), transform: `scale(${a})` }}>¿Tu moneda está</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 22,
            marginTop: 24,
            transform: `scale(${b})`,
          }}
        >
          <span style={{ ...texto(96, theme.bg), background: VERDE, borderRadius: 24, padding: "4px 22px", rotate: `${-giro / 3}deg` }}>
            BARATA
          </span>
          <span style={{ ...texto(90), alignSelf: "center" }}>o</span>
          <span style={{ ...texto(96, theme.bg), background: ROJO, borderRadius: 24, padding: "4px 22px", rotate: `${giro / 3}deg` }}>
            CARA?
          </span>
        </div>
      </div>
      <Hamburguesa size={560} desde={2.6} y={960} />
      <div style={{ position: "absolute", top: 1270, left: 60, right: 60, ...texto(64, AMARILLO), opacity: c }}>
        Lo dice una hamburguesa
      </div>
    </>
  );
};

// 2. Qué es
const QueEs: React.FC = () => {
  const a = useEntrada(0.1);
  const sello = useEntrada(2.4, 8);
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 60, right: 60, ...texto(70, theme.muted), opacity: a }}>
        Se llama
      </div>
      <div style={{ position: "absolute", top: 330, left: 40, right: 40, ...texto(140, AMARILLO), transform: `scale(${a})` }}>
        ÍNDICE
        <br />
        BIG MAC
      </div>
      <Hamburguesa size={480} desde={0.3} y={960} />
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            ...texto(58),
            border: `6px solid ${theme.text}`,
            borderRadius: 20,
            padding: "14px 34px",
            transform: `scale(${2 - sello}) rotate(-6deg)`,
            opacity: sello,
          }}
        >
          The Economist · 1986
        </div>
      </div>
    </>
  );
};

// 3. La idea: mismo producto, mismo precio
const Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useEntrada(0.1);
  const igual = useEntrada(1.4);
  const dolar = useEntrada(3.9);
  const banderas = ["🇺🇸", "🇯🇵", "🇲🇽", "🇪🇸", "🇧🇷", "🇨🇭"];
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 60, right: 60, ...texto(88), opacity: a }}>
        Mismo Big Mac
        <br />
        <span style={{ color: AMARILLO }}>en todo el mundo</span>
      </div>
      <Hamburguesa size={380} desde={0.2} y={760} />
      {banderas.map((b, i) => {
        const ang = (i / banderas.length) * Math.PI * 2 + frame / 50;
        const e = spring({ frame: frame - f(1.4) - i * 3, fps: FPS, config: { damping: 12 } });
        return (
          <div
            key={b}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * 330 - 50,
              top: 760 + Math.sin(ang) * 250 - 50,
              fontSize: 90,
              transform: `scale(${e * igual})`,
            }}
          >
            {b}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1120, left: 60, right: 60, ...texto(76), transform: `scale(${dolar})` }}>
        = mismo precio en <span style={{ color: VERDE }}>dólares</span>
      </div>
    </>
  );
};

type Pais = { nombre: string; bandera: string; precio: number; en: number };

// Barra horizontal de precio que crece y cuenta.
const Barra: React.FC<{ p: Pais; max: number; ref_: number; ancho: number; alto: number }> = ({
  p,
  max,
  ref_,
  ancho,
  alto,
}) => {
  const frame = useCurrentFrame();
  const e = spring({ frame: frame - f(p.en), fps: FPS, config: { damping: 18 } });
  const valor = p.precio * e;
  const color = p.nombre === "Estados Unidos" ? theme.text : p.precio > ref_ ? ROJO : VERDE;
  return (
    <div style={{ display: "flex", alignItems: "center", height: alto, opacity: Math.min(1, e * 3) }}>
      <div style={{ width: 300, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 64 }}>{p.bandera}</span>
        <span style={{ ...texto(40), textAlign: "left", fontWeight: 800 }}>{p.nombre}</span>
      </div>
      <div
        style={{
          width: (ancho * valor) / max,
          height: alto * 0.62,
          background: color,
          borderRadius: 16,
          boxShadow: `0 0 30px ${color}55`,
        }}
      />
      <span style={{ ...texto(54, color), marginLeft: 16, fontVariantNumeric: "tabular-nums" }}>
        ${valor.toFixed(2).replace(".", ",")}
      </span>
    </div>
  );
};

const Grafico: React.FC<{ titulo: string; paises: Pais[]; max: number; alto: number }> = ({
  titulo,
  paises,
  max,
  alto,
}) => {
  const a = useEntrada(0.05);
  const ref_ = 6.22;
  const ANCHO = 470;
  const top = 380;
  const lineaX = 60 + 300 + (ANCHO * ref_) / max;
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 60, right: 60, ...texto(76), opacity: a }}>
        {titulo}
      </div>
      <div style={{ position: "absolute", top, left: 60, right: 60 }}>
        {paises.map((p) => (
          <Barra key={p.nombre} p={p} max={max} ref_={ref_} ancho={ANCHO} alto={alto} />
        ))}
      </div>
      {/* línea de referencia de EE. UU. */}
      <div
        style={{
          position: "absolute",
          left: lineaX,
          top: top - 20,
          height: paises.length * alto + 40,
          borderLeft: `4px dashed ${AMARILLO}`,
          opacity: 0.8 * a,
        }}
      />
      <div style={{ position: "absolute", left: lineaX - 150, width: 300, top: top + paises.length * alto + 30, ...texto(36, AMARILLO), opacity: a }}>
        precio en EE. UU.
      </div>
    </>
  );
};

// 5. La regla
const Regla: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(26.27 - t0);
  const b = useEntrada(30.65 - t0);
  const fila = (e: number, color: string, flecha: string, arriba: string, abajo: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 34,
        background: `${color}22`,
        border: `5px solid ${color}`,
        borderRadius: 36,
        padding: "34px 40px",
        transform: `translateX(${(1 - e) * 600}px)`,
        opacity: e,
      }}
    >
      <span style={{ ...texto(150, color) }}>{flecha}</span>
      <div>
        <div style={{ ...texto(52), textAlign: "left" }}>{arriba}</div>
        <div style={{ ...texto(74, color), textAlign: "left", marginTop: 10 }}>{abajo}</div>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: 330, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 50 }}>
      <div style={{ ...texto(70), opacity: a }}>Comparado con EE. UU.:</div>
      {fila(a, VERDE, "↓", "Más barato", "moneda BARATA")}
      {fila(b, ROJO, "↑", "Más caro", "moneda CARA")}
    </div>
  );
};

// 7. Matiz
const Matiz: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.05);
  const no = useEntrada(48.22 - t0, 8);
  const chips = [
    { t: "Sueldos", en: 50.6 },
    { t: "Alquileres", en: 51.3 },
    { t: "Impuestos", en: 52.2 },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 250, left: 60, right: 60, ...texto(80), opacity: a }}>
        ¿Allí todo es más caro?
      </div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(92, theme.bg), background: AMARILLO, borderRadius: 28, padding: "10px 36px", whiteSpace: "nowrap", transform: `scale(${no}) rotate(-3deg)` }}>
          NO EXACTAMENTE
        </div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ ...texto(54, theme.muted), opacity: no }}>También cuentan:</div>
        {chips.map((c) => (
          <Chip key={c.t} texto_={c.t} desde={c.en - t0} />
        ))}
      </div>
    </>
  );
};

const Chip: React.FC<{ texto_: string; desde: number }> = ({ texto_, desde }) => {
  const e = useEntrada(desde, 10);
  return (
    <div
      style={{
        ...texto(72),
        border: `5px solid ${theme.text}`,
        borderRadius: 999,
        padding: "16px 60px",
        transform: `scale(${e})`,
      }}
    >
      {texto_}
    </div>
  );
};

// 8. Conclusión
const Truco: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.05);
  const b = useEntrada(55.57 - t0);
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 60, right: 60, ...texto(84), opacity: a }}>
        Un truco,
        <br />
        <span style={{ color: theme.muted }}>no una ciencia<br />exacta</span>
      </div>
      <Hamburguesa size={420} desde={0.1} y={860} />
      <div style={{ position: "absolute", top: 1130, left: 60, right: 60, ...texto(70, AMARILLO), transform: `scale(${b})` }}>
        ¿Tu dinero vale más
        <br />o menos fuera?
      </div>
    </>
  );
};

// 9. Remate integrado: pregunta + sígueme
const Remate: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const a = useEntrada(0.05, 8);
  const b = useEntrada(0.6);
  const c = useEntrada(63.05 - t0, 9);
  const pulso = 1 + 0.05 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(170, theme.bg), background: AMARILLO, borderRadius: 32, padding: "0 50px", transform: `scale(${a}) rotate(-4deg)` }}>
          ¿Y TÚ?
        </div>
      </div>
      <div style={{ position: "absolute", top: 520, left: 60, right: 60, ...texto(80), opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
        ¿Cuánto cuesta un Big Mac en tu país?
      </div>
      <div style={{ position: "absolute", top: 830, left: 60, right: 60, ...texto(54, theme.muted), opacity: b }}>
        Déjalo en los comentarios 👇
      </div>
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(100), background: ROJO, borderRadius: 999, padding: "20px 70px", transform: `scale(${c * pulso})` }}>
          SÍGUEME ▶
        </div>
      </div>
    </>
  );
};

const ESCENAS: { desde: number; hasta: number; C: React.FC<{ t0: number }> }[] = [
  { desde: 0, hasta: 5.0, C: () => <Gancho /> },
  { desde: 5.0, hasta: 11.3, C: () => <QueEs /> },
  { desde: 11.3, hasta: 17.6, C: () => <Idea /> },
  {
    desde: 17.6,
    hasta: 26.1,
    C: ({ t0 }) => (
      <Grafico
        titulo="Precio de un Big Mac"
        max={9.04}
        alto={190}
        paises={[
          { nombre: "Estados Unidos", bandera: "🇺🇸", precio: 6.22, en: 18.9 - t0 },
          { nombre: "Suiza", bandera: "🇨🇭", precio: 9.04, en: 21.6 - t0 },
          { nombre: "Indonesia", bandera: "🇮🇩", precio: 2.38, en: 24.3 - t0 },
        ]}
      />
    ),
  },
  { desde: 26.1, hasta: 33.1, C: ({ t0 }) => <Regla t0={t0} /> },
  {
    desde: 33.1,
    hasta: 45.85,
    C: ({ t0 }) => (
      <Grafico
        titulo="¿Y en Latinoamérica?"
        max={8}
        alto={150}
        paises={[
          { nombre: "México", bandera: "🇲🇽", precio: 6.27, en: 35.3 - t0 },
          { nombre: "Argentina", bandera: "🇦🇷", precio: 5.91, en: 37.6 - t0 },
          { nombre: "Chile", bandera: "🇨🇱", precio: 5.41, en: 39.9 - t0 },
          { nombre: "Brasil", bandera: "🇧🇷", precio: 4.71, en: 42.3 - t0 },
          { nombre: "Colombia", bandera: "🇨🇴", precio: 8.0, en: 44.5 - t0 },
        ]}
      />
    ),
  },
  { desde: 45.85, hasta: 53.0, C: ({ t0 }) => <Matiz t0={t0} /> },
  { desde: 53.0, hasta: 59.35, C: ({ t0 }) => <Truco t0={t0} /> },
  { desde: 59.35, hasta: guion.duracion + COLA, C: ({ t0 }) => <Remate t0={t0} /> },
];

export const BigMacShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Fondo />
      <Audio src={staticFile("narraciones/big-mac.mp3")} />
      {ESCENAS.map(({ desde, hasta, C }, i) => (
        <Sequence key={i} from={f(desde)} durationInFrames={f(hasta - desde)} layout="none">
          <Escena dur={hasta - desde}>
            <C t0={desde} />
          </Escena>
          {i > 0 ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} /> : null}
        </Sequence>
      ))}
      <Subtitulos palabras={guion.palabras as Palabra[]} top={1470} tamano={80} />
    </AbsoluteFill>
  );
};
