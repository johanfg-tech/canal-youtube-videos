import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/02-enron.json";

// Calendario de adviento, puerta 2 (2 dic): la quiebra de Enron, 2001.
export const enron: HistoriaFlow = {
  id: "enron",
  carpeta: "flow-enron",
  guion,
  adviento: { puerta: 2, fecha: "2 de diciembre de 2001", anio: "2001" },
  planos: [
    { frase: 3, src: "i05.jpg" },
    { frase: 3, parte: 0.5, src: "i01.jpg" },
    { frase: 5, src: "v_energia.mp4", video: true },
    { frase: 6, src: "v_sala.mp4", video: true },
    { frase: 7, src: "v_esconden.mp4", video: true },
    { frase: 7, parte: 0.65, src: "i04.jpg" },
    { frase: 8, src: "i11.jpg" },
    { frase: 9, src: "i13.jpg" },
    { frase: 9, parte: 0.3, src: "v_torre.mp4", video: true },
    { frase: 10, src: "v_cajas.mp4", video: true },
    { frase: 10, parte: 0.62, src: "i08.jpg" },
    { frase: 11, parte: 0.1, src: "v_tritura.mp4", video: true },
    { frase: 12, src: "i12.jpg" },
  ],
  etiquetas: [
    { frase: 3, texto: "6 AÑOS «LA MÁS INNOVADORA»", size: 66, parte: 0.1, dura: 3.4 },
    { frase: 6, texto: "90 $", color: "VERDE", size: 130 },
    { frase: 9, texto: "QUIEBRA", color: "ROJO", size: 130, parte: 0.05, dura: 2.6 },
  ],
  grafico: {
    desde: 8,
    hasta: 8,
    fondo: "i11.jpg",
    titulo: "Precio de una acción de Enron",
    tipo: "barras",
    puntos: [
      { etiqueta: "Agosto 2000", v: 90, texto: "90 $" },
      { etiqueta: "Diciembre 2001", v: 0.26, texto: "0,26 $" },
    ],
    colorFinal: "ROJO",
  },
  remate: { frase: 12, pregunta: "¿Tú pondrías todos tus ahorros en la empresa donde trabajas?", fondo: "i12.jpg" },
};
