import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/manhattan.json";

export const manhattan: HistoriaFlow = {
  id: "manhattan",
  carpeta: "flow-manhattan",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i13.jpg" },
    { frase: 2, src: "i10.jpg" },
    { frase: 3, src: "i06.jpg" },
    { frase: 3, parte: 0.5, src: "i12.jpg" },
    { frase: 4, src: "i05.jpg" },
    { frase: 5, src: "i04.jpg" },
    { frase: 5, parte: 0.5, src: "i02.jpg" },
    { frase: 6, src: "i09.jpg" },
    { frase: 6, parte: 0.55, src: "i07.jpg" },
    { frase: 7, src: "i01.jpg" },
    { frase: 8, src: "i18.jpg" },
    { frase: 9, src: "i08.jpg" },
    { frase: 10, src: "i16.jpg" },
    { frase: 12, src: "i14.jpg" },
    { frase: 12, parte: 0.5, src: "i15.jpg" },
    { frase: 13, src: "i11.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "1626", size: 130 },
    { frase: 5, texto: "60 FLORINES", parte: 0.3 },
    { frase: 6, texto: "= 24 $", color: "VERDE", size: 120, parte: 0.55 },
    { frase: 9, texto: "NO SE VENDÍA", color: "NARANJA" },
  ],
  grafico: {
    desde: 11,
    hasta: 11,
    fondo: "i03.jpg",
    titulo: "24 $ invertidos al 7 % anual",
    tipo: "linea",
    log: true,
    puntos: [
      { etiqueta: "1626", v: 24, texto: "24 $" },
      { etiqueta: "1776", v: 6e5, texto: "≈ 600.000 $" },
      { etiqueta: "1900", v: 2.7e9, texto: "≈ 2.700 M $" },
      { etiqueta: "Hoy", v: 1.4e13, texto: "≈ 14 billones $" },
    ],
    colorFinal: "VERDE",
  },
  remate: { frase: 13, pregunta: "¿Fue una ganga o un malentendido?", fondo: "i11.jpg" },
};
