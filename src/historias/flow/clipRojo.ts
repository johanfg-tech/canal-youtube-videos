import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/clip-rojo.json";

export const clipRojo: HistoriaFlow = {
  id: "clip-rojo",
  carpeta: "flow-clip-rojo",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i10.jpg" },
    { frase: 2, src: "i08.jpg" },
    { frase: 3, src: "i09.jpg" },
    { frase: 4, src: "i12.jpg" },
    { frase: 5, src: "i17.jpg" },
    { frase: 6, src: "i16.jpg" },
    { frase: 7, src: "i15.jpg" },
    { frase: 8, src: "i19.jpg" },
    { frase: 8, parte: 0.3, src: "i14.jpg" },
    { frase: 8, parte: 0.55, src: "i11.jpg" },
    { frase: 8, parte: 0.78, src: "i13.jpg" },
    { frase: 9, src: "i05.jpg" },
    { frase: 9, parte: 0.55, src: "i02.jpg" },
    { frase: 10, src: "i01.jpg" },
    { frase: 10, parte: 0.6, src: "i06.jpg" },
    { frase: 11, src: "i04.jpg" },
    { frase: 12, src: "i18.jpg" },
    { frase: 13, src: "i07.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "2006 · CANADÁ" },
    { frase: 2, texto: "1 CLIP ROJO", color: "ROJO", parte: 0.6 },
    { frase: 11, texto: "14 TRUEQUES · 1 AÑO", color: "VERDE", size: 84 },
  ],
  remate: { frase: 13, pregunta: "¿Tú qué cambiarías primero?", fondo: "i07.jpg" },
};
