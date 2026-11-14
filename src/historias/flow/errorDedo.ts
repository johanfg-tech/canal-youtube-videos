import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/error-dedo.json";

export const errorDedo: HistoriaFlow = {
  id: "error-dedo",
  carpeta: "flow-error-dedo",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i13.jpg" },
    { frase: 2, src: "i15.jpg" },
    { frase: 3, src: "i14.jpg" },
    { frase: 3, parte: 0.5, src: "i17.jpg" },
    { frase: 4, src: "i12.jpg" },
    { frase: 5, src: "i01.jpg" },
    { frase: 6, src: "i16.jpg" },
    { frase: 7, src: "i08.jpg" },
    { frase: 8, src: "i06.jpg" },
    { frase: 9, src: "i07.jpg" },
    { frase: 9, parte: 0.5, src: "i11.jpg" },
    { frase: 10, src: "i09.jpg" },
    { frase: 10, parte: 0.55, src: "i02.jpg" },
    { frase: 11, src: "i05.jpg" },
    { frase: 12, src: "i04.jpg" },
    { frase: 13, src: "i03.jpg" },
    { frase: 14, src: "i10.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "TOKIO · 2005" },
    { frase: 3, texto: "1 ACCIÓN × 610.000 ¥", size: 80, parte: 0.45 },
    { frase: 5, texto: "610.000 ACCIONES × 1 ¥", color: "ROJO", size: 76 },
    { frase: 7, texto: "×41", color: "ROJO", size: 140 },
    { frase: 11, texto: "−340 M $", color: "ROJO", size: 120 },
    { frase: 12, texto: "+17 M $", color: "VERDE", size: 120 },
  ],
  remate: { frase: 14, pregunta: "¿Tú revisas dos veces antes de pagar?", fondo: "i10.jpg" },
};
