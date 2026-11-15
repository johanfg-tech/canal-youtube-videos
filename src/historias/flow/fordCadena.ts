import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/01-ford-cadena.json";

// Calendario de adviento, puerta 1 (1 dic): la cadena de montaje de Ford, 1913.
export const fordCadena: HistoriaFlow = {
  id: "ford-cadena",
  carpeta: "flow-ford-cadena",
  guion,
  adviento: { puerta: 1, fecha: "1 de diciembre de 1913", anio: "1913" },
  planos: [
    { frase: 3, src: "i03.jpg" },
    { frase: 4, src: "v_detroit.mp4", video: true },
    { frase: 5, parte: 0.35, src: "v_a_mano.mp4", video: true },
    { frase: 6, src: "v_idea.mp4", video: true },
    { frase: 6, parte: 0.64, src: "i06.jpg" },
    { frase: 7, src: "v_ford_pasarela.mp4", video: true },
    { frase: 8, src: "v_tareas.mp4", video: true },
    { frase: 9, src: "v_joe_tornillo.mp4", video: true },
    { frase: 9, parte: 0.55, src: "v_coches_saliendo.mp4", video: true },
    { frase: 10, src: "v_escaparate.mp4", video: true },
    { frase: 11, src: "i12.jpg" },
    { frase: 13, src: "v_familia.mp4", video: true },
    { frase: 14, src: "v_robots.mp4", video: true },
    { frase: 15, src: "i14.jpg" },
  ],
  etiquetas: [
    { frase: 3, texto: "12 H → 1 H 30", size: 110, parte: 0.3 },
    { frase: 4, texto: "DETROIT", size: 120 },
    { frase: 9, texto: "93 MINUTOS", color: "VERDE", size: 120, parte: 0.4 },
  ],
  grafico: {
    desde: 11,
    hasta: 12,
    fondo: "i12.jpg",
    titulo: "Precio de un Modelo T nuevo",
    tipo: "barras",
    puntos: [
      { etiqueta: "1908", v: 850, texto: "850 $" },
      { etiqueta: "1925", v: 260, texto: "260 $" },
    ],
    colorFinal: "VERDE",
  },
  remate: { frase: 15, pregunta: "¿Tú trabajarías haciendo la misma tarea todo el día?", fondo: "i14.jpg" },
};
