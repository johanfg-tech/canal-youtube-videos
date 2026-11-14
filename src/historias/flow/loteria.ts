import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/loteria-14.json";

export const loteria: HistoriaFlow = {
  id: "loteria-14",
  carpeta: "flow-loteria-14",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i05.jpg" },
    { frase: 2, src: "i14.jpg" },
    { frase: 3, src: "i04.jpg" },
    { frase: 4, src: "i01.jpg" },
    { frase: 5, src: "i10.jpg" },
    { frase: 6, src: "i07.jpg" },
    { frase: 6, parte: 0.5, src: "i13.jpg" },
    { frase: 7, src: "i09.jpg" },
    { frase: 10, src: "i06.jpg" },
    { frase: 11, src: "i12.jpg" },
    { frase: 11, parte: 0.55, src: "i03.jpg" },
    { frase: 12, src: "i16.jpg" },
    { frase: 12, parte: 0.6, src: "i02.jpg" },
    { frase: 13, src: "i15.jpg" },
    { frase: 14, src: "i19.jpg" },
    { frase: 15, src: "i18.jpg" },
  ],
  etiquetas: [
    { frase: 0, texto: "14 VECES", size: 130 },
    { frase: 6, texto: "2.500 INVERSORES", parte: 0.5 },
    { frase: 7, texto: "VIRGINIA · 1992" },
    { frase: 11, texto: "5 MILLONES DE BOLETOS", color: "NARANJA", size: 80 },
    { frase: 13, texto: "LEGAL", color: "VERDE", size: 120 },
  ],
  grafico: {
    desde: 8,
    hasta: 9,
    fondo: "i17.jpg",
    titulo: "Comprar todo… contra el premio",
    tipo: "barras",
    puntos: [
      { etiqueta: "Todos los boletos", v: 7e6, texto: "7 M $" },
      { etiqueta: "Premio", v: 2.7e7, texto: "27 M $" },
    ],
    colorFinal: "VERDE",
  },
  remate: { frase: 15, pregunta: "¿Tú habrías invertido con él?", fondo: "i18.jpg" },
};
