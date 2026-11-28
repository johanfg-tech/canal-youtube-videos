import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/14-panico-1825-poyais.json";

export const poyais: HistoriaFlow = {
  id: "poyais",
  carpeta: "flow-panico-1825-poyais",
  guion,
  adviento: { puerta: 14, fecha: "14 de diciembre", anio: "1825" },
  planos: [
    { frase: 3, src: "i01.jpg" },
    { frase: 3, parte: 0.45, src: "v_bolsa.mp4", video: true },
    { frase: 4, src: "v_bonos.mp4", video: true },
    { frase: 5, parte: 0.4, src: "i02.jpg" },
    { frase: 6, src: "i03.jpg" },
    { frase: 7, src: "i04.jpg" },
    { frase: 7, parte: 0.45, src: "v_ciudad.mp4", video: true },
    { frase: 8, src: "i14.jpg" },
    { frase: 9, src: "i07.jpg" },
    { frase: 9, parte: 0.25, src: "v_selva.mp4", video: true },
    { frase: 9, parte: 0.7, src: "i09.jpg" },
    { frase: 10, src: "i10.jpg" },
    { frase: 10, parte: 0.5, src: "i11.jpg" },
    { frase: 11, src: "v_banco.mp4", video: true },
    { frase: 11, parte: 0.6, src: "i12.jpg" },
    { frase: 12, src: "i13.jpg" },
    { frase: 12, parte: 0.4, src: "v_boveda.mp4", video: true },
  ],
  etiquetas: [
    { frase: 3, texto: "1825: PÁNICO", color: "ROJO", size: 90, parte: 0.1 },
    { frase: 7, texto: "PRÍNCIPE DE POYAIS", color: "AMARILLO", size: 76, parte: 0.1 },
    { frase: 9, texto: "POYAIS NO EXISTÍA", color: "ROJO", size: 80, parte: 0.1 },
    { frase: 11, texto: "DECENAS DE BANCOS CAEN", size: 70, parte: 0.3 },
    { frase: 12, texto: "CASI SIN DINERO", color: "ROJO", size: 84, parte: 0.2 },
  ],
  remate: { frase: 13, pregunta: "¿Tú habrías invertido en Poyais?", fondo: "i05.jpg" },
};
