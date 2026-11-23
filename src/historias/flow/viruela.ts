import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/09-viruela.json";

// Calendario de adviento, puerta 9 (9 dic): la viruela, declarada erradicada en 1979.
export const viruela: HistoriaFlow = {
  id: "viruela",
  carpeta: "flow-viruela",
  guion,
  adviento: { puerta: 9, fecha: "9 de diciembre de 1979", anio: "1979" },
  planos: [
    { frase: 3, src: "i03.jpg" },
    { frase: 3, parte: 0.55, src: "v_virus.mp4", video: true },
    { frase: 5, src: "i05.jpg" },
    { frase: 6, src: "i08.jpg" },
    { frase: 6, parte: 0.3, src: "v_canoa.mp4", video: true },
    { frase: 6, parte: 0.58, src: "v_fila.mp4", video: true },
    { frase: 6, parte: 0.8, src: "v_vacuna.mp4", video: true },
    { frase: 7, src: "i09.jpg" },
    { frase: 8, src: "v_firma.mp4", video: true },
    { frase: 9, src: "i02.jpg" },
    { frase: 10, src: "v_hucha.mp4", video: true },
    { frase: 10, parte: 0.6, src: "i10.jpg" },
    { frase: 11, src: "i07.jpg" },
  ],
  etiquetas: [
    { frase: 3, texto: "300 MILLONES DE MUERTES", color: "ROJO", size: 70, parte: 0.25 },
    { frase: 6, texto: "1967: LA OMS", size: 100, parte: 0.05, dura: 2.4 },
    { frase: 7, texto: "ÚLTIMO CASO: 1977", size: 84, parte: 0.4 },
    { frase: 8, texto: "ERRADICADA", color: "VERDE", size: 110, parte: 0.5 },
    { frase: 9, texto: "300 MILLONES $", size: 96, parte: 0.2 },
    { frase: 11, texto: "LA MEJOR INVERSIÓN", color: "VERDE", size: 80, parte: 0.1 },
  ],
  remate: { frase: 12, pregunta: "¿Tú sabías que la viruela ya no existe?", fondo: "i04.jpg" },
};
