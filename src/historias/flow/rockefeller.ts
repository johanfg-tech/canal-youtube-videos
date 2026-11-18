import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/historias/rockefeller.json";

// Historia pedida por un seguidor (Williams Rubiano, comentario en TikTok): John D. y William Rockefeller. El agradecimiento al comentario va al final.
export const rockefeller: HistoriaFlow = {
  id: "rockefeller",
  carpeta: "flow-rockefeller",
  guion,
  comentario: {
    autor: "Williams Rubiano",
    texto: "la historia en sí de la riqueza de EEUU fue los Roquefeler",
    desde: 13,
    hasta: 15,
  },
  planos: [
    { frase: 0, src: "i01.jpg" },
    { frase: 2, src: "i02.jpg" },
    { frase: 3, src: "i03.jpg" },
    { frase: 4, src: "v_apreton.mp4", video: true },
    { frase: 5, src: "i05.jpg" },
    { frase: 5, parte: 0.5, src: "i06.jpg" },
    { frase: 6, src: "i09.jpg" },
    { frase: 6, parte: 0.35, src: "v_tren.mp4", video: true },
    { frase: 7, src: "i10.jpg" },
    { frase: 8, src: "i11.jpg" },
    { frase: 9, src: "v_barril.mp4", video: true },
    { frase: 11, src: "i13.jpg" },
    { frase: 12, src: "i14.jpg" },
    { frase: 13, src: "i07.jpg" },
  ],
  etiquetas: [
    { frase: 0, texto: "1855", size: 130 },
    { frase: 1, texto: "50 CENTAVOS AL DÍA", size: 80, parte: 0.55, dura: 2.6 },
    { frase: 4, texto: "STANDARD OIL", size: 110, parte: 0.55 },
    { frase: 6, texto: "90 % DEL PETRÓLEO", color: "VERDE", size: 90, parte: 0.78 },
    { frase: 8, texto: "34 COMPAÑÍAS", color: "ROJO", size: 110, parte: 0.65 },
    { frase: 9, texto: "EXXON · MOBIL · CHEVRON", size: 66, parte: 0.3 },
  ],
  remate: { frase: 16, pregunta: "¿Qué otra historia quieres que contemos?", fondo: "i14.jpg" },
};
