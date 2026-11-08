import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";

export type Palabra = {
  texto: string;
  inicio: number;
  fin: number;
  corte?: boolean;
};

// Agrupa las palabras en bloques cortos (máx. 3) sin cruzar el final de una frase.
const agrupar = (palabras: Palabra[]) => {
  const grupos: Palabra[][] = [];
  let actual: Palabra[] = [];
  for (const p of palabras) {
    actual.push(p);
    if (actual.length === 3 || p.corte) {
      grupos.push(actual);
      actual = [];
    }
  }
  if (actual.length) grupos.push(actual);
  return grupos;
};

// Subtítulos estilo Shorts: bloque de 1-3 palabras, la palabra que suena se resalta y salta.
export const Subtitulos: React.FC<{
  palabras: Palabra[];
  top: number;
  derecha?: number;
  tamano?: number;
}> = ({ palabras, top, derecha = 60, tamano = 92 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grupos = agrupar(palabras);
  const grupo = grupos.find((g, i) => {
    const fin =
      i + 1 < grupos.length
        ? grupos[i + 1][0].inicio
        : g[g.length - 1].fin + 0.4;
    return t >= g[0].inicio && t < Math.min(fin, g[g.length - 1].fin + 0.4);
  });
  if (!grupo) return null;
  const entrada = spring({
    frame: frame - Math.round(grupo[0].inicio * fps),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: derecha,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 22px",
        scale: String(0.7 + 0.3 * entrada),
      }}
    >
      {grupo.map((p, i) => {
        const activa = t >= p.inicio && t < p.fin + 0.05;
        const salto = spring({
          frame: frame - Math.round(p.inicio * fps),
          fps,
          config: { damping: 10, mass: 0.4 },
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: theme.font,
              fontSize: tamano,
              fontWeight: 900,
              textTransform: "uppercase",
              color: activa ? theme.bg : theme.text,
              background: activa ? "#ffd60a" : "transparent",
              borderRadius: 18,
              padding: "0 14px",
              WebkitTextStroke: activa ? "0px" : `3px ${theme.bg}`,
              textShadow: activa ? "none" : "0 8px 0 rgba(0,0,0,0.45)",
              scale: activa ? String(1 + 0.12 * salto) : "1",
              rotate: activa ? `${(i % 2 ? 1 : -1) * 2}deg` : "0deg",
              display: "inline-block",
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};
