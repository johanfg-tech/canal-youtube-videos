import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/08-ibm-lenovo.json";

// Calendario de adviento, puerta 8 (8 dic): IBM vende su división de PC a Lenovo, 2004.
export const ibmLenovo: HistoriaFlow = {
  id: "ibm-lenovo",
  carpeta: "flow-ibm-lenovo",
  guion,
  adviento: { puerta: 8, fecha: "8 de diciembre de 2004", anio: "2004" },
  planos: [
    { frase: 3, src: "i03.jpg" },
    { frase: 4, src: "i07.jpg" },
    { frase: 4, parte: 0.3, src: "v_pc81.mp4", video: true },
    { frase: 4, parte: 0.65, src: "i01.jpg" },
    { frase: 5, src: "i02.jpg" },
    { frase: 5, parte: 0.55, src: "i08.jpg" },
    { frase: 6, src: "i04.jpg" },
    { frase: 6, parte: 0.55, src: "v_barco.mp4", video: true },
    { frase: 7, src: "v_escenario.mp4", video: true },
    { frase: 7, parte: 0.45, src: "v_portatil.mp4", video: true },
    { frase: 8, src: "i09.jpg" },
    { frase: 8, parte: 0.55, src: "i10.jpg" },
    { frase: 9, src: "v_prensa.mp4", video: true },
    { frase: 10, src: "v_fabrica.mp4", video: true },
    { frase: 10, parte: 0.55, src: "i13.jpg" },
  ],
  etiquetas: [
    { frase: 4, texto: "1981: IBM PC", size: 100, parte: 0.05, dura: 2.4 },
    { frase: 5, texto: "PÉRDIDAS", color: "ROJO", size: 110, parte: 0.6, dura: 2.2 },
    { frase: 8, texto: "1.750 MILLONES $", size: 88, parte: 0.1 },
    { frase: 9, texto: "¿UNA LOCURA?", color: "ROJO", size: 100, parte: 0.05 },
    { frase: 10, texto: "Nº 1 DEL MUNDO", color: "VERDE", size: 96, parte: 0.35 },
  ],
  remate: { frase: 11, pregunta: "¿Tú tienes un Lenovo o un ThinkPad?", fondo: "i12.jpg" },
};
