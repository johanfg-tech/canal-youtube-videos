import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/10-nobel-dinamita.json";

// Calendario de adviento, puerta 10 (10 dic): Alfred Nobel, la dinamita y los premios (1901).
export const nobelDinamita: HistoriaFlow = {
  id: "nobel-dinamita",
  carpeta: "flow-nobel-dinamita",
  guion,
  adviento: { puerta: 10, fecha: "10 de diciembre", anio: "1901" },
  planos: [
    { frase: 3, src: "i05.jpg" },
    { frase: 3, parte: 0.55, src: "i06.jpg" },
    { frase: 4, src: "i08.jpg" },
    { frase: 4, parte: 0.3, src: "v_explosion.mp4", video: true },
    { frase: 4, parte: 0.62, src: "v_tren.mp4", video: true },
    { frase: 5, src: "i02.jpg" },
    { frase: 5, parte: 0.45, src: "v_imprenta.mp4", video: true },
    { frase: 6, src: "v_periodico.mp4", video: true },
    { frase: 7, src: "i12.jpg" },
    { frase: 8, src: "v_testamento.mp4", video: true },
    { frase: 8, parte: 0.55, src: "i03.jpg" },
    { frase: 9, src: "i01.jpg" },
    { frase: 10, src: "i11.jpg" },
    { frase: 10, parte: 0.28, src: "v_ceremonia.mp4", video: true },
    { frase: 11, src: "i14.jpg" },
  ],
  etiquetas: [
    { frase: 4, texto: "DINAMITA", color: "ROJO", size: 110, parte: 0.32, dura: 2.2 },
    { frase: 6, texto: "«EL MERCADER DE LA MUERTE»", color: "ROJO", size: 60, parte: 0.3 },
    { frase: 8, texto: "31 MILLONES DE CORONAS", size: 70, parte: 0.6 },
    { frase: 10, texto: "1901: PRIMEROS NOBEL", size: 80, parte: 0.3 },
    { frase: 11, texto: "11 MILLONES POR PREMIO", color: "VERDE", size: 72, parte: 0.1 },
  ],
  remate: { frase: 12, pregunta: "¿Tú qué harías con tu fortuna?", fondo: "i04.jpg" },
};
