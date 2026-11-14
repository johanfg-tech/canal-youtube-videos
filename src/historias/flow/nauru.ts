import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/nauru.json";

export const nauru: HistoriaFlow = {
  id: "nauru",
  carpeta: "flow-nauru",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i01.jpg" },
    { frase: 2, src: "i17.jpg" },
    { frase: 3, src: "i15.jpg" },
    { frase: 4, src: "i16.jpg" },
    { frase: 4, parte: 0.55, src: "i14.jpg" },
    { frase: 5, src: "i12.jpg" },
    { frase: 6, src: "i13.jpg" },
    { frase: 7, src: "i09.jpg" },
    { frase: 8, src: "i08.jpg" },
    { frase: 8, parte: 0.5, src: "i11.jpg" },
    { frase: 9, src: "i10.jpg" },
    { frase: 9, parte: 0.4, src: "i04.jpg" },
    { frase: 9, parte: 0.7, src: "i05.jpg" },
    { frase: 10, src: "i06.jpg" },
    { frase: 11, src: "i07.jpg" },
    { frase: 12, src: "i02.jpg" },
  ],
  etiquetas: [
    { frase: 2, texto: "20 MIN EN COCHE", parte: 0.4 },
    { frase: 5, texto: "1968", size: 130 },
    { frase: 8, texto: "0 IMPUESTOS", color: "VERDE" },
    { frase: 10, texto: "SE ACABA", color: "ROJO", size: 110 },
  ],
  remate: { frase: 12, pregunta: "¿Qué habrías hecho tú con esa riqueza?", fondo: "i02.jpg" },
};
