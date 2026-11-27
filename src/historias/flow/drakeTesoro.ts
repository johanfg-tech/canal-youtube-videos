import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/13-drake-tesoro.json";

export const drakeTesoro: HistoriaFlow = {
  id: "drake-tesoro",
  carpeta: "flow-drake-tesoro",
  guion,
  adviento: { puerta: 13, fecha: "13 de diciembre", anio: "1577" },
  planos: [
    { frase: 3, src: "i08.jpg" },
    { frase: 4, src: "v_zarpa.mp4", video: true },
    { frase: 5, parte: 0.35, src: "i03.jpg" },
    { frase: 5, parte: 0.6, src: "i04.jpg" },
    { frase: 5, parte: 0.8, src: "v_tormenta.mp4", video: true },
    { frase: 6, src: "v_regreso.mp4", video: true },
    { frase: 6, parte: 0.72, src: "i02.jpg" },
    { frase: 7, src: "v_vuelta.mp4", video: true },
    { frase: 8, src: "v_galeon.mp4", video: true },
    { frase: 8, parte: 0.6, src: "i07.jpg" },
    { frase: 9, src: "v_monedas.mp4", video: true },
    { frase: 10, src: "i11.jpg" },
    { frase: 10, parte: 0.5, src: "i12.jpg" },
    { frase: 11, src: "i13.jpg" },
  ],
  etiquetas: [
    { frase: 5, texto: "MISIÓN SECRETA", color: "ROJO", size: 90, parte: 0.12 },
    { frase: 6, texto: "5 BARCOS... VUELVE 1", size: 72, parte: 0.2 },
    { frase: 7, texto: "VUELTA AL MUNDO", color: "AMARILLO", size: 84, parte: 0.1 },
    { frase: 9, texto: "DECENAS DE VECES", color: "VERDE", size: 84, parte: 0.4 },
    { frase: 10, texto: "DEUDA PAGADA", color: "VERDE", size: 96, parte: 0.6 },
  ],
  remate: { frase: 12, pregunta: "¿Héroe o pirata? ¿Tú qué piensas?", fondo: "i14.jpg" },
};
