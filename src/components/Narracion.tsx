import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { useMemo } from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { TramoNarrado } from "../narracion";
import { theme } from "../theme";

// Subtítulos estilo TikTok: frases cortas y la palabra que suena resaltada con el color de acento.
const Subtitulos: React.FC<{ tramo: TramoNarrado; bottom: number }> = ({ tramo, bottom }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions: tramo.subtitulos, combineTokensWithinMilliseconds: 900 }),
    [tramo.subtitulos],
  );
  const pagina = pages.filter((p) => p.startMs <= ms && ms < p.startMs + p.durationMs + 300).pop();
  if (!pagina) return null;

  const entrada = interpolate(ms - pagina.startMs, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom }}>
      <div
        style={{
          maxWidth: width * 0.86,
          fontFamily: theme.font,
          fontSize: Math.round(width * 0.055),
          fontWeight: 800,
          lineHeight: 1.2,
          textAlign: "center",
          color: theme.text,
          textShadow: "0 4px 18px rgba(0,0,0,0.6)",
          whiteSpace: "pre-wrap",
          opacity: entrada,
          scale: interpolate(entrada, [0, 1], [0.92, 1]),
        }}
      >
        {pagina.tokens.map((t) => (
          <span key={t.fromMs} style={{ color: t.fromMs <= ms && ms < t.toMs ? theme.accent : theme.text }}>
            {t.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Pone cada segmento de audio en su sitio y, si se pide, sus subtítulos sincronizados.
export const PistaNarracion: React.FC<{ tramos: TramoNarrado[]; subtitulos: boolean; bottom?: number }> = ({
  tramos,
  subtitulos,
  bottom = 140,
}) => (
  <>
    {tramos.map((t, i) => (
      <Sequence key={i} from={t.from} durationInFrames={t.durationInFrames} name={`Voz ${i + 1}`} layout="none">
        <Audio src={staticFile(t.audio)} />
        {subtitulos ? <Subtitulos tramo={t} bottom={bottom} /> : null}
      </Sequence>
    ))}
  </>
);
