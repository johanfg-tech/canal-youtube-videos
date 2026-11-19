import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/05-ley-seca.json";

// Calendario de adviento, puerta 5 (5 dic): el fin de la Ley Seca, 1933.
export const leySeca: HistoriaFlow = {
  id: "ley-seca",
  carpeta: "flow-ley-seca",
  guion,
  adviento: { puerta: 5, fecha: "5 de diciembre de 1933", anio: "1933" },
  planos: [
    { frase: 3, src: "i01.jpg" },
    { frase: 4, src: "i07.jpg" },
    { frase: 4, parte: 0.5, src: "i08.jpg" },
    { frase: 5, src: "v_barriles.mp4", video: true },
    { frase: 6, src: "v_mirilla.mp4", video: true },
    { frase: 7, src: "v_bar.mp4", video: true },
    { frase: 7, parte: 0.5, src: "v_contrabando.mp4", video: true },
    { frase: 8, src: "v_ganster.mp4", video: true },
    { frase: 8, parte: 0.7, src: "i04.jpg" },
    { frase: 9, src: "i13.jpg" },
    { frase: 9, parte: 0.55, src: "i12.jpg" },
    { frase: 10, src: "i02.jpg" },
    { frase: 11, src: "i10.jpg" },
    { frase: 12, src: "i03.jpg" },
    { frase: 13, src: "v_cerveceria.mp4", video: true },
    { frase: 13, parte: 0.55, src: "i14.jpg" },
  ],
  etiquetas: [
    { frase: 4, texto: "1920: PROHIBIDO", size: 100, parte: 0.1 },
    { frase: 8, texto: "100 MILLONES AL AÑO", size: 70, parte: 0.55, dura: 2.6 },
    { frase: 9, texto: "IMPUESTOS PERDIDOS", color: "ROJO", size: 84, parte: 0.3 },
    { frase: 10, texto: "GRAN DEPRESIÓN", size: 96, parte: 0.1 },
    { frase: 12, texto: "FIN DE LA LEY SECA", color: "VERDE", size: 90, parte: 0.1 },
  ],
  remate: { frase: 14, pregunta: "¿Tú crees que prohibir algo hace que la gente lo deje?", fondo: "i11.jpg" },
};
