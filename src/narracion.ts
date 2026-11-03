import { z } from "zod";

// Narración generada con `npm run narrar` (ElevenLabs). Cada segmento es un MP3 en public/
// con sus subtítulos palabra a palabra. El orden de los segmentos lo decide cada plantilla
// (p. ej. en ShortVideo: gancho, un segmento por punto y CTA).
export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
});

export const narracionSchema = z.object({
  pausaMs: z.number(),
  segmentos: z.array(
    z.object({
      audio: z.string(),
      duracionMs: z.number(),
      subtitulos: z.array(captionSchema),
    }),
  ),
});

export type Narracion = z.infer<typeof narracionSchema>;

export type TramoNarrado = {
  audio: string;
  from: number;
  durationInFrames: number;
  subtitulos: Narracion["segmentos"][number]["subtitulos"];
};

// Coloca los segmentos uno detrás de otro, separados por `pausaMs`, en frames.
export const colocarSegmentos = (narracion: Narracion, fps: number, inicioFrames = 0): TramoNarrado[] => {
  let cursor = inicioFrames;
  const pausa = Math.round((narracion.pausaMs / 1000) * fps);
  return narracion.segmentos.map((s) => {
    const durationInFrames = Math.ceil((s.duracionMs / 1000) * fps);
    const tramo = { audio: s.audio, from: cursor, durationInFrames, subtitulos: s.subtitulos };
    cursor += durationInFrames + pausa;
    return tramo;
  });
};

export const finDeNarracion = (tramos: TramoNarrado[]) => {
  const ultimo = tramos[tramos.length - 1];
  return ultimo ? ultimo.from + ultimo.durationInFrames : 0;
};
