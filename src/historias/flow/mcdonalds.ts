import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/mcdonalds.json";

export const mcdonalds: HistoriaFlow = {
  id: "mcdonalds",
  carpeta: "flow-mcdonalds",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 0, parte: 0.55, src: "i02.jpg" },
    { frase: 1, src: "i05.jpg" },
    { frase: 2, src: "i09.jpg" },
    { frase: 2, parte: 0.55, src: "i16.jpg" },
    { frase: 3, src: "i15.jpg" },
    { frase: 4, src: "i13.jpg" },
    { frase: 4, parte: 0.5, src: "i14.jpg" },
    { frase: 5, src: "i11.jpg" },
    { frase: 5, parte: 0.55, src: "i04.jpg" },
    { frase: 6, src: "i03.jpg" },
    { frase: 7, src: "i12.jpg" },
    { frase: 8, src: "i06.jpg" },
    { frase: 9, src: "i18.jpg" },
    { frase: 11, src: "i08.jpg" },
    { frase: 12, src: "i07.jpg" },
    { frase: 13, src: "i10.jpg" },
    { frase: 14, src: "i01.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "CALIFORNIA · 1948" },
    { frase: 3, texto: "1954" },
    { frase: 7, texto: "2,7 M $", color: "VERDE", size: 120 },
    { frase: 8, texto: "0,5 % DE LAS VENTAS", color: "NARANJA", size: 80, parte: 0.4 },
    { frase: 9, texto: "SIN FIRMA", color: "ROJO" },
    { frase: 10, texto: "0 $", color: "ROJO", size: 130 },
  ],
  remate: { frase: 14, pregunta: "¿Tú habrías firmado el trato?", fondo: "i01.jpg" },
};
