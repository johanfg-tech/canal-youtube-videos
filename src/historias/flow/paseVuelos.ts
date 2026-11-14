import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/pase-vuelos.json";

export const paseVuelos: HistoriaFlow = {
  id: "pase-vuelos",
  carpeta: "flow-pase-vuelos",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i15.jpg" },
    { frase: 2, src: "i13.jpg" },
    { frase: 3, src: "i03.jpg" },
    { frase: 3, parte: 0.5, src: "t03.jpg" },
    { frase: 4, src: "i07.jpg" },
    { frase: 5, src: "i10.jpg" },
    { frase: 6, src: "i16.jpg" },
    { frase: 7, src: "i06.jpg" },
    { frase: 8, src: "t01.jpg" },
    { frase: 9, src: "n04.jpg" },
    { frase: 11, src: "i08.jpg" },
    { frase: 11, parte: 0.55, src: "i11.jpg" },
    { frase: 12, src: "t02.jpg" },
    { frase: 13, src: "i14.jpg" },
  ],
  etiquetas: [
    { frase: 0, texto: "250.000 $", size: 130 },
    { frase: 1, texto: "1981", size: 130 },
    { frase: 2, texto: "PRIMERA CLASE · SIN LÍMITE", size: 70, parte: 0.4 },
    { frase: 3, texto: "1987" },
    { frase: 4, texto: "+150.000 $", color: "VERDE" },
    { frase: 9, texto: "+10.000 VUELOS", size: 100 },
    { frase: 11, texto: "2008", color: "NARANJA", size: 120 },
  ],
  grafico: {
    desde: 10,
    hasta: 10,
    fondo: "i12.jpg",
    titulo: "Lo que pagó y lo que costó",
    tipo: "barras",
    puntos: [
      { etiqueta: "Pagó", v: 400000, texto: "400.000 $" },
      { etiqueta: "Costó (≈21 años)", v: 2.1e7, texto: "≈ 21 M $" },
    ],
    colorFinal: "ROJO",
  },
  remate: { frase: 13, pregunta: "¿Tú lo habrías comprado?", fondo: "i14.jpg" },
};
