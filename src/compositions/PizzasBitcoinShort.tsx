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
import {
  AMARILLO,
  BORDE,
  Escena,
  FPS,
  Flotante,
  Maquina,
  NARANJA,
  ROJO,
  RemateFinal,
  TARJETA,
  Tarjeta,
  VERDE,
  dinero,
  f,
  texto,
  useEntrada,
} from "../components/historia/kit";
import guion from "../../guiones/pizzas-bitcoin.json";

// Historia de las dos pizzas pagadas con 10.000 bitcoins (22 de mayo de 2010), recreada por escenas.

const COLA = 1.6;
export const duracionPizzas = Math.ceil((guion.duracion + COLA) * FPS);

const Etiqueta: React.FC<{ children: React.ReactNode; color?: string; desde?: number; size?: number }> = ({
  children,
  color = AMARILLO,
  desde = 0,
  size = 52,
}) => {
  const e = useEntrada(desde, 10);
  return (
    <span
      style={{
        ...texto(size, theme.bg),
        background: color,
        borderRadius: 18,
        padding: "8px 26px",
        display: "inline-block",
        transform: `scale(${e})`,
      }}
    >
      {children}
    </span>
  );
};

// Contador que sube con suavidad.
const Contador: React.FC<{ desde: number; dur: number; de: number; a: number; prefijo?: string; sufijo?: string; style: React.CSSProperties }> = ({
  desde,
  dur,
  de,
  a,
  prefijo = "",
  sufijo = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f(desde), f(desde + dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {prefijo}
      {dinero(de + (a - de) * p)}
      {sufijo}
    </div>
  );
};

// Cabecera de un mensaje de foro (estilo 2010, limpio).
const CabeceraForo: React.FC<{ usuario: string; fecha: string; color: string }> = ({ usuario, fecha, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
    <div style={{ width: 84, height: 84, borderRadius: 20, background: color, display: "flex", alignItems: "center", justifyContent: "center", ...texto(44, theme.bg) }}>
      {usuario[0].toUpperCase()}
    </div>
    <div>
      <div style={{ ...texto(44), textAlign: "left" }}>{usuario}</div>
      <div style={{ ...texto(32, theme.muted), textAlign: "left", fontWeight: 600, letterSpacing: 0 }}>{fecha}</div>
    </div>
  </div>
);

const Calendario: React.FC<{ dia: number; mes?: string; size?: number }> = ({ dia, mes = "MAYO", size = 1 }) => (
  <div style={{ width: 320 * size, borderRadius: 36 * size, overflow: "hidden", background: theme.text, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
    <div style={{ background: ROJO, ...texto(56 * size), padding: `${14 * size}px 0` }}>{mes}</div>
    <div style={{ ...texto(170 * size, theme.bg), padding: `${10 * size}px 0 ${20 * size}px` }}>{dia}</div>
  </div>
);

// ---------- Escenas ----------

const Gancho: React.FC = () => {
  const a = useEntrada(0.1);
  const b = useEntrada(4.6);
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 60, right: 60, ...texto(76), opacity: a }}>
        Estas 2 pizzas costaron
      </div>
      <Contador
        desde={0.6}
        dur={3.4}
        de={0}
        a={750000000}
        prefijo="$"
        style={{ position: "absolute", top: 320, left: 20, right: 20, ...texto(124, AMARILLO) }}
      />
      <div style={{ position: "absolute", top: 470, left: 60, right: 60, ...texto(48, theme.muted), opacity: a }}>
        dólares
      </div>
      <Flotante src="ia/pizzas.png" size={760} y={930} desde={0.2} />
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Etiqueta desde={4.6 - 0} color={VERDE}>
          Historia real
        </Etiqueta>
      </div>
      <div style={{ opacity: b }} />
    </>
  );
};

const Florida: React.FC = () => {
  const a = useEntrada(0.1);
  const b = useEntrada(1.9);
  const c = useEntrada(2.9);
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        <div style={{ transform: `scale(${a})` }}>
          <Etiqueta>Mayo 2010</Etiqueta>
        </div>
        <div style={{ transform: `scale(${b})` }}>
          <Etiqueta color={theme.text}>📍 Florida, EE. UU.</Etiqueta>
        </div>
      </div>
      <Flotante src="ia/programador.png" size={820} y={820} desde={0.4} giro={1} />
      <div style={{ position: "absolute", top: 1250, left: 60, right: 60, ...texto(72), opacity: c }}>
        Un programador: <span style={{ color: NARANJA }}>Laszlo</span>
      </div>
    </>
  );
};

const Bitcoin2010: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  const b = useEntrada(14.4 - t0);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(78), opacity: a }}>
        Bitcoin en 2010
      </div>
      <Tarjeta top={380} desde={0.3}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: NARANJA, ...texto(110), display: "flex", alignItems: "center", justifyContent: "center" }}>
            ₿
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...texto(40, theme.muted), textAlign: "right", fontWeight: 700 }}>1 bitcoin valía</div>
            <div style={{ ...texto(100, VERDE), textAlign: "right" }}>$0,004</div>
          </div>
        </div>
      </Tarjeta>
      <div style={{ position: "absolute", top: 760, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 30, opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
        {["Casi nadie lo conocía", "Nadie compraba nada con él"].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, background: `${ROJO}1f`, border: `3px solid ${ROJO}`, borderRadius: 24, padding: "24px 30px" }}>
            <span style={{ ...texto(56, ROJO) }}>✕</span>
            <span style={{ ...texto(52), textAlign: "left" }}>{t}</span>
          </div>
        ))}
      </div>
    </>
  );
};

const PostForo: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(70), opacity: a }}>
        Escribe en un foro…
      </div>
      <Tarjeta top={390} desde={0.25}>
        <CabeceraForo usuario="laszlo" fecha="18 de mayo de 2010" color={NARANJA} />
        <Maquina
          texto_="Pagaré 10.000 bitcoins por un par de pizzas grandes."
          desde={20.5 - t0}
          cps={22}
          style={{ ...texto(66), textAlign: "left", lineHeight: 1.2, letterSpacing: 0, fontWeight: 800 }}
        />
      </Tarjeta>
      <Flotante src="ia/monedas-btc.png" size={430} y={1150} desde={21.4 - t0} />
    </>
  );
};

const Espera: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const dia = Math.min(22, 18 + Math.floor(interpolate(frame, [f(0.3), f(25.2 - t0)], [0, 4.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const b = useEntrada(25.48 - t0, 9);
  const c = useEntrada(26.7 - t0);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(78) }}>Pasan 4 días…</div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Calendario dia={dia} />
      </div>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${b})` }}>
          <Etiqueta color={ROJO} size={70}>0 respuestas serias</Etiqueta>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1080, left: 60, right: 60, ...texto(60, theme.muted), opacity: c }}>
        A la gente le parece raro 🤨
      </div>
    </>
  );
};

const Respuesta: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const ruta = interpolate(frame, [f(1.2), f(3.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const a = useEntrada(0.1);
  // Arco California -> Florida
  const x1 = 200;
  const x2 = 880;
  const y = 470;
  const largo = 900;
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${a})` }}>
        <Calendario dia={22} size={0.5} />
      </div>
      <svg width={1080} height={300} style={{ position: "absolute", top: 400 }}>
        <path
          d={`M ${x1} ${y - 300} Q 540 ${y - 520} ${x2} ${y - 300}`}
          stroke={AMARILLO}
          strokeWidth={8}
          strokeDasharray="20 18"
          fill="none"
          strokeDashoffset={0}
          style={{ clipPath: `inset(0 ${100 - ruta * 100}% 0 0)` }}
        />
        <circle cx={x1} cy={y - 300} r={18} fill={VERDE} />
        <circle cx={x2} cy={y - 300} r={18} fill={NARANJA} opacity={ruta > 0.95 ? 1 : 0.3} />
      </svg>
      <div style={{ position: "absolute", top: 640, left: 80, ...texto(40, VERDE) }}>California</div>
      <div style={{ position: "absolute", top: 640, right: 80, ...texto(40, NARANJA) }}>Florida</div>
      <Tarjeta top={780} desde={0.5}>
        <CabeceraForo usuario="joven de 19 años" fecha="22 de mayo de 2010 · California" color={VERDE} />
        <Maquina texto_="“Yo te las consigo.”" desde={32.86 - t0} cps={24} style={{ ...texto(76), textAlign: "left" }} />
      </Tarjeta>
      <div style={{ display: "none" }}>{largo}</div>
    </>
  );
};

const Entrega: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  const recibo = useEntrada(36.0 - t0);
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 60, right: 60, ...texto(72), opacity: a }}>
        Pide a una pizzería
        <br />
        <span style={{ color: theme.muted }}>de Florida</span>
      </div>
      <Flotante src="ia/repartidor.png" size={760} y={900} desde={0.3} giro={1.5} />
      <div
        style={{
          position: "absolute",
          top: 1180,
          right: 90,
          background: theme.text,
          borderRadius: 20,
          padding: "22px 34px",
          transform: `rotate(6deg) scale(${recibo})`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ ...texto(34, "#555"), fontWeight: 700, letterSpacing: 0 }}>Pagado con tarjeta</div>
        <div style={{ ...texto(84, theme.bg) }}>$25</div>
      </div>
    </>
  );
};

const Intercambio: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const a = useEntrada(0.1);
  const flecha = useEntrada(0.8);
  const b = useEntrada(43.5 - t0);
  const pulso = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(78), opacity: a }}>
        El trato
      </div>
      <Tarjeta top={380} desde={0.2}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center", width: 360 }}>
            <div style={{ ...texto(96, NARANJA) }}>10.000</div>
            <div style={{ ...texto(44, theme.muted) }}>bitcoins</div>
          </div>
          <div style={{ ...texto(110, AMARILLO), transform: `translateX(${(flecha - 1) * 60}px) scale(${pulso})`, opacity: flecha }}>→</div>
          <div style={{ textAlign: "center", width: 300 }}>
            <div style={{ ...texto(96) }}>2</div>
            <div style={{ ...texto(44, theme.muted) }}>pizzas</div>
          </div>
        </div>
      </Tarjeta>
      <Flotante src="ia/pizzas.png" size={560} y={940} desde={0.6} />
      <div style={{ position: "absolute", top: 1230, left: 60, right: 60, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
        <div style={{ ...texto(48, theme.muted) }}>Ese día valían</div>
        <div style={{ ...texto(110, VERDE) }}>$41</div>
      </div>
    </>
  );
};

const LoLogre: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  const sello = useEntrada(49.1 - t0, 8);
  return (
    <>
      <Tarjeta top={240} desde={0.1}>
        <CabeceraForo usuario="laszlo" fecha="22 de mayo de 2010" color={NARANJA} />
        <Maquina texto_="¡Lo logré! 🍕" desde={48.1 - t0} cps={16} style={{ ...texto(80), textAlign: "left" }} />
        <div style={{ marginTop: 26, height: 430, borderRadius: 24, background: "#0b0d12", border: `3px solid ${BORDE}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: a }}>
          <Img src={staticFile("ia/pizzas.png")} style={{ height: "112%" }} />
        </div>
      </Tarjeta>
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            ...texto(58, AMARILLO),
            border: `6px solid ${AMARILLO}`,
            borderRadius: 24,
            padding: "16px 34px",
            transform: `scale(${2 - sello}) rotate(-5deg)`,
            opacity: sello,
          }}
        >
          1.ª compra física con bitcoin
        </div>
      </div>
    </>
  );
};

// Gráfico del valor de los 10.000 bitcoins.
const PUNTOS = [
  { anio: "2010", v: 41, en: 52.9 },
  { anio: "2013", v: 10e6, en: 55.9 },
  { anio: "2017", v: 200e6, en: 59.3 },
  { anio: "2021", v: 690e6, en: 62.3 },
  { anio: "Máximo", v: 1260e6, en: 65.5 },
  { anio: "Hoy", v: 750e6, en: 69.2 },
];

const Grafico: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = t0 + frame / FPS;
  const a = useEntrada(0.1);
  const W = 860;
  const H = 640;
  const X0 = 110;
  const Y0 = 520;
  const MAX = 1300e6;
  const px = (i: number) => X0 + (i / (PUNTOS.length - 1)) * W;
  const py = (v: number) => Y0 + H - (v / MAX) * H;
  // progreso continuo a lo largo de los puntos
  let k = 0;
  for (let i = 1; i < PUNTOS.length; i++) {
    const p = interpolate(t, [PUNTOS[i].en - 0.2, PUNTOS[i].en + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    k += p;
  }
  const i0 = Math.floor(k);
  const fr = k - i0;
  const visibles = PUNTOS.slice(0, i0 + 1).map((p, i) => [px(i), py(p.v)] as const);
  if (i0 < PUNTOS.length - 1) {
    const A = PUNTOS[i0];
    const B = PUNTOS[i0 + 1];
    visibles.push([px(i0) + (px(i0 + 1) - px(i0)) * fr, py(A.v + (B.v - A.v) * fr)]);
  }
  const actual = i0 < PUNTOS.length - 1 ? PUNTOS[i0].v + (PUNTOS[i0 + 1].v - PUNTOS[i0].v) * fr : PUNTOS[PUNTOS.length - 1].v;
  const d = visibles.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const area = `${d} L ${visibles[visibles.length - 1][0]} ${Y0 + H} L ${X0} ${Y0 + H} Z`;
  const final = useEntrada(72.0 - t0, 9);
  return (
    <>
      <div style={{ position: "absolute", top: 210, left: 60, right: 60, ...texto(54, theme.muted), opacity: a }}>
        Lo que valen esos 10.000 bitcoins
      </div>
      <div style={{ position: "absolute", top: 290, left: 20, right: 20, ...texto(118, AMARILLO), fontVariantNumeric: "tabular-nums" }}>
        ${dinero(actual)}
      </div>
      <svg width={1080} height={1300} style={{ position: "absolute", top: 0, left: 0 }}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={X0} x2={X0 + W} y1={Y0 + H - g * H} y2={Y0 + H - g * H} stroke={BORDE} strokeWidth={2} />
        ))}
        <defs>
          <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NARANJA} stopOpacity={0.45} />
            <stop offset="100%" stopColor={NARANJA} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#relleno)" />
        <path d={d} stroke={NARANJA} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {PUNTOS.map((p, i) =>
          i <= i0 ? (
            <g key={p.anio}>
              <circle cx={px(i)} cy={py(p.v)} r={14} fill={theme.text} stroke={NARANJA} strokeWidth={6} />
              <text x={px(i)} y={Y0 + H + 60} fill={i === PUNTOS.length - 1 ? AMARILLO : theme.muted} fontFamily={theme.font} fontWeight={800} fontSize={34} textAnchor="middle">
                {p.anio}
              </text>
            </g>
          ) : null,
        )}
      </svg>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${final})` }}>
        <Etiqueta color={ROJO} size={66}>Por 2 pizzas 🍕</Etiqueta>
      </div>
    </>
  );
};

const Cien: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(80), opacity: a }}>
        Y lo más loco…
      </div>
      <div style={{ position: "absolute", top: 380, left: 60, right: 60, ...texto(52, theme.muted), opacity: a }}>
        Ese año siguió pagando pizzas con bitcoin
      </div>
      <Flotante src="ia/monedas-btc.png" size={600} y={860} desde={0.3} />
      <div style={{ position: "absolute", top: 1170, left: 60, right: 60 }}>
        <div style={{ ...texto(46, theme.muted) }}>En total gastó unos</div>
        <Contador desde={77.8 - t0} dur={1.5} de={10000} a={100000} sufijo=" BTC" style={{ ...texto(116, NARANJA) }} />
      </div>
    </>
  );
};

const Arrepentido: React.FC<{ t0: number }> = ({ t0 }) => {
  const a = useEntrada(0.1);
  const no = useEntrada(80.85 - t0, 8);
  const cita = useEntrada(81.75 - t0);
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 60, right: 60, ...texto(92), opacity: a }}>
        ¿Se arrepiente?
      </div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...texto(160, theme.bg), background: VERDE, borderRadius: 32, padding: "0 60px", transform: `scale(${no}) rotate(-4deg)` }}>NO</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 70,
          right: 70,
          background: TARJETA,
          borderLeft: `14px solid ${NARANJA}`,
          borderRadius: 24,
          padding: "40px 44px",
          opacity: cita,
          transform: `translateY(${(1 - cita) * 50}px)`,
        }}
      >
        <div style={{ ...texto(64), textAlign: "left", lineHeight: 1.2 }}>
          Bitcoin pasó de ser <span style={{ color: theme.muted }}>una idea</span> a algo con lo que <span style={{ color: NARANJA }}>se podía comprar</span>.
        </div>
      </div>
    </>
  );
};

const PizzaDay: React.FC = () => {
  const a = useEntrada(0.1);
  const b = useEntrada(1.6);
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, ...texto(66, theme.muted), opacity: a }}>
        Cada 22 de mayo se celebra el
      </div>
      <div style={{ position: "absolute", top: 330, left: 40, right: 40, ...texto(128, NARANJA), transform: `scale(${b})` }}>
        Bitcoin
        <br />
        Pizza Day
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Calendario dia={22} size={0.85} />
      </div>
    </>
  );
};

const ESCENAS: { desde: number; hasta: number; C: React.FC<{ t0: number }> }[] = [
  { desde: 0, hasta: 6.6, C: () => <Gancho /> },
  { desde: 6.6, hasta: 12.75, C: () => <Florida /> },
  { desde: 12.75, hasta: 17.95, C: ({ t0 }) => <Bitcoin2010 t0={t0} /> },
  { desde: 17.95, hasta: 23.75, C: ({ t0 }) => <PostForo t0={t0} /> },
  { desde: 23.75, hasta: 28.1, C: ({ t0 }) => <Espera t0={t0} /> },
  { desde: 28.1, hasta: 34.1, C: ({ t0 }) => <Respuesta t0={t0} /> },
  { desde: 34.1, hasta: 40.8, C: ({ t0 }) => <Entrega t0={t0} /> },
  { desde: 40.8, hasta: 46.0, C: ({ t0 }) => <Intercambio t0={t0} /> },
  { desde: 46.0, hasta: 52.75, C: ({ t0 }) => <LoLogre t0={t0} /> },
  { desde: 52.75, hasta: 73.25, C: ({ t0 }) => <Grafico t0={t0} /> },
  { desde: 73.25, hasta: 79.7, C: ({ t0 }) => <Cien t0={t0} /> },
  { desde: 79.7, hasta: 86.25, C: ({ t0 }) => <Arrepentido t0={t0} /> },
  { desde: 86.25, hasta: 90.4, C: () => <PizzaDay /> },
  {
    desde: 90.4,
    hasta: guion.duracion + COLA,
    C: ({ t0 }) => <RemateFinal pregunta="¿Cambiarías 10.000 bitcoins por 2 pizzas?" sigueme={96.0 - t0} />,
  },
];

export const PizzasBitcoinShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Fondo />
      <Audio src={staticFile("narraciones/pizzas-bitcoin.mp3")} />
      {ESCENAS.map(({ desde, hasta, C }, i) => (
        <Sequence key={i} from={f(desde)} durationInFrames={f(hasta - desde)} layout="none">
          <Escena dur={hasta - desde}>
            <C t0={desde} />
          </Escena>
          {i > 0 ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} /> : null}
        </Sequence>
      ))}
      <Subtitulos palabras={guion.palabras as Palabra[]} top={1480} tamano={78} />
    </AbsoluteFill>
  );
};
