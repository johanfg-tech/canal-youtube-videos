import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/04-pan-am.json";

// Calendario de adviento, puerta 4 (4 dic): el fin de Pan Am, 1991.
export const panAm: HistoriaFlow = {
  id: "pan-am",
  carpeta: "flow-pan-am",
  guion,
  adviento: { puerta: 4, fecha: "4 de diciembre de 1991", anio: "1991" },
  planos: [
    { frase: 3, src: "i03.jpg" },
    { frase: 4, src: "i11.jpg" },
    { frase: 5, src: "v_azafata.mp4", video: true },
    { frase: 5, parte: 0.45, src: "v_cabina.mp4", video: true },
    { frase: 5, parte: 0.78, src: "i12.jpg" },
    { frase: 6, src: "v_747.mp4", video: true, zoom: [1.26, 1.3] },
    { frase: 7, src: "v_tormenta.mp4", video: true },
    { frase: 7, parte: 0.16, src: "i14.jpg" },
    { frase: 7, parte: 0.36, src: "i08.jpg" },
    { frase: 7, parte: 0.72, src: "i06.jpg" },
    { frase: 8, src: "i09.jpg" },
    { frase: 8, parte: 0.6, src: "i07.jpg" },
    { frase: 9, src: "v_luces.mp4", video: true },
    { frase: 10, src: "v_hangar.mp4", video: true },
    { frase: 11, src: "i04.jpg" },
    { frase: 11, parte: 0.55, src: "i05.jpg" },
  ],
  etiquetas: [
    { frase: 6, texto: "BOEING 747", size: 110, parte: 0.1 },
    { frase: 7, texto: "CRISIS DEL PETRÓLEO", size: 76, parte: 0.17, dura: 2.2 },
    { frase: 10, texto: "MILES SIN TRABAJO", color: "ROJO", size: 90, parte: 0.45 },
    { frase: 11, texto: "64 AÑOS", size: 130, parte: 0.1 },
  ],
  remate: { frase: 12, pregunta: "¿Tú alguna vez viste un avión de Pan Am?", fondo: "i09.jpg" },
};
