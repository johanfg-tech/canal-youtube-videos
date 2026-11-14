import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/hunt-plata.json";

export const huntPlata: HistoriaFlow = {
  id: "hunt-plata",
  carpeta: "flow-hunt-plata",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i15.jpg" },
    { frase: 2, src: "i12.jpg" },
    { frase: 2, parte: 0.55, src: "i06.jpg" },
    { frase: 3, src: "i09.jpg" },
    { frase: 4, src: "i03.jpg" },
    { frase: 5, src: "i08.jpg" },
    { frase: 5, parte: 0.4, src: "i02.jpg" },
    { frase: 5, parte: 0.7, src: "i13.jpg" },
    { frase: 7, src: "i14.jpg" },
    { frase: 7, parte: 0.5, src: "i17.jpg" },
    { frase: 8, src: "i07.jpg" },
    { frase: 9, src: "i16.jpg" },
    { frase: 10, src: "i04.jpg" },
    { frase: 11, src: "i18.jpg" },
    { frase: 12, src: "i01.jpg" },
    { frase: 13, src: "i11.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "TEXAS · 1979" },
    { frase: 4, texto: "MUCHA PLATA", color: "BLANCO", size: 110 },
    { frase: 9, texto: "27 MARZO 1980", color: "ROJO" },
    { frase: 10, texto: "JUEVES DE PLATA", color: "ROJO", size: 84 },
    { frase: 12, texto: "BANCARROTA", color: "ROJO", size: 110 },
  ],
  grafico: {
    desde: 6,
    hasta: 6,
    fondo: "i19.jpg",
    titulo: "Precio de la plata (dólares por onza)",
    tipo: "linea",
    puntos: [
      { etiqueta: "Ene 1979", v: 6, texto: "6 $" },
      { etiqueta: "Sep 1979", v: 16, texto: "16 $" },
      { etiqueta: "Ene 1980", v: 49.5, texto: "≈ 50 $" },
    ],
    colorFinal: "VERDE",
  },
  remate: { frase: 13, pregunta: "¿Tú habrías vendido tu plata?", fondo: "i11.jpg" },
};
