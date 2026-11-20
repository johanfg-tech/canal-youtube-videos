import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/06-orange-county.json";

// Calendario de adviento, puerta 6 (6 dic): la quiebra de Orange County, 1994.
export const orangeCounty: HistoriaFlow = {
  id: "orange-county",
  carpeta: "flow-orange-county",
  guion,
  adviento: { puerta: 6, fecha: "6 de diciembre de 1994", anio: "1994" },
  planos: [
    { frase: 3, src: "i09.jpg" },
    { frase: 4, src: "i05.jpg" },
    { frase: 5, src: "v_aplausos.mp4", video: true },
    { frase: 5, parte: 0.55, src: "v_bola.mp4", video: true },
    { frase: 6, src: "i10.jpg" },
    { frase: 6, parte: 0.5, src: "i14.jpg" },
    { frase: 7, src: "i13.jpg" },
    { frase: 8, src: "v_palanca.mp4", video: true },
    { frase: 8, parte: 0.75, src: "v_torre.mp4", video: true },
    { frase: 10, src: "i07.jpg" },
    { frase: 11, src: "i04.jpg" },
    { frase: 11, parte: 0.55, src: "v_vecinos.mp4", video: true },
    { frase: 12, src: "v_escuela.mp4", video: true },
    { frase: 12, parte: 0.5, src: "i11.jpg" },
  ],
  etiquetas: [
    { frase: 5, texto: "+20 AÑOS", size: 110, parte: 0.1, dura: 2.4 },
    { frase: 8, texto: "SUBEN LOS INTERESES", color: "ROJO", size: 72, parte: 0.4 },
    { frase: 10, texto: "1.600 MILLONES $", color: "ROJO", size: 90, parte: 0.1 },
    { frase: 11, texto: "QUIEBRA", color: "ROJO", size: 120, parte: 0.1, dura: 2.4 },
  ],
  remate: { frase: 13, pregunta: "¿Tú dejarías tu dinero a alguien solo porque siempre gana?", fondo: "i12.jpg" },
};
