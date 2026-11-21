import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/07-apolo-17.json";

// Calendario de adviento, puerta 7 (7 dic): Apolo 17, la última misión tripulada a la Luna, 1972.
export const apolo17: HistoriaFlow = {
  id: "apolo-17",
  carpeta: "flow-apolo-17",
  guion,
  adviento: { puerta: 7, fecha: "7 de diciembre de 1972", anio: "1972" },
  planos: [
    { frase: 3, src: "i10.jpg" },
    { frase: 4, src: "i03.jpg" },
    { frase: 5, src: "v_playa.mp4", video: true },
    { frase: 5, parte: 0.5, src: "v_despegue.mp4", video: true },
    { frase: 6, src: "i07.jpg" },
    { frase: 6, parte: 0.7, src: "v_canica.mp4", video: true },
    { frase: 8, src: "i06.jpg" },
    { frase: 9, src: "i01.jpg" },
    { frase: 10, src: "i11.jpg" },
    { frase: 11, src: "i09.jpg" },
    { frase: 11, parte: 0.55, src: "v_museo.mp4", video: true },
    { frase: 12, src: "v_cernan.mp4", video: true },
    { frase: 13, src: "v_huella.mp4", video: true },
    { frase: 14, src: "i05.jpg" },
  ],
  etiquetas: [
    { frase: 7, texto: "LA CANICA AZUL", size: 90, parte: 0.05 },
    { frase: 9, texto: "25.000 MILLONES $", size: 84, parte: 0.3 },
    { frase: 10, texto: "+250.000 MILLONES $", color: "ROJO", size: 76, parte: 0.1 },
    { frase: 14, texto: "+50 AÑOS", size: 110, parte: 0.05, dura: 2.2 },
  ],
  remate: { frase: 15, pregunta: "¿Tú crees que valió la pena lo que costó?", fondo: "i02.jpg" },
};
