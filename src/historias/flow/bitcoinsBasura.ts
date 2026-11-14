import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/bitcoins-basura.json";

export const bitcoinsBasura: HistoriaFlow = {
  id: "bitcoins-basura",
  carpeta: "flow-bitcoins-basura",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i11.jpg" },
    { frase: 2, src: "i01.jpg" },
    { frase: 2, parte: 0.55, src: "i17.jpg" },
    { frase: 3, src: "i16.jpg" },
    { frase: 4, src: "i18.jpg" },
    { frase: 5, src: "i15.jpg" },
    { frase: 5, parte: 0.5, src: "i13.jpg" },
    { frase: 6, src: "i14.jpg" },
    { frase: 7, src: "i05.jpg" },
    { frase: 7, parte: 0.4, src: "i10.jpg" },
    { frase: 7, parte: 0.7, src: "i03.jpg" },
    { frase: 8, src: "i08.jpg" },
    { frase: 9, src: "i07.jpg" },
    { frase: 10, src: "i04.jpg" },
    { frase: 11, src: "i12.jpg" },
    { frase: 12, src: "i02.jpg" },
    { frase: 13, src: "i06.jpg" },
    { frase: 14, src: "i09.jpg" },
  ],
  etiquetas: [
    { frase: 0, texto: "600 M $", color: "ROJO", size: 130 },
    { frase: 1, texto: "GALES · 2009" },
    { frase: 3, texto: "8.000 BITCOINS", color: "NARANJA" },
    { frase: 4, texto: "≈ 0 $", size: 120 },
    { frase: 5, texto: "2013" },
    { frase: 11, texto: "NO", color: "ROJO", size: 140 },
    { frase: 12, texto: "2025: RECHAZADA", color: "ROJO", parte: 0.5 },
  ],
  remate: { frase: 14, pregunta: "¿Tú seguirías buscando?", fondo: "i09.jpg" },
};
