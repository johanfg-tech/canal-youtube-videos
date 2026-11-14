import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/blockbuster.json";

export const blockbuster: HistoriaFlow = {
  id: "blockbuster",
  carpeta: "flow-blockbuster",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 2, src: "i09.jpg" },
    { frase: 3, src: "i14.jpg" },
    { frase: 3, parte: 0.55, src: "i10.jpg" },
    { frase: 4, src: "i05.jpg" },
    { frase: 4, parte: 0.55, src: "i15.jpg" },
    { frase: 5, src: "i08.jpg" },
    { frase: 5, parte: 0.6, src: "i18.jpg" },
    { frase: 6, src: "i01.jpg" },
    { frase: 6, parte: 0.5, src: "i17.jpg" },
    { frase: 7, src: "i03.jpg" },
    { frase: 8, src: "i11.jpg" },
    { frase: 9, src: "i19.jpg" },
    { frase: 9, parte: 0.35, src: "i07.jpg" },
    { frase: 9, parte: 0.7, src: "i02.jpg" },
    { frase: 10, src: "i04.jpg" },
    { frase: 11, src: "i06.jpg" },
    { frase: 11, parte: 0.5, src: "i16.jpg" },
    { frase: 12, src: "i12.jpg" },
  ],
  etiquetas: [
    { frase: 0, texto: "50 M $", color: "VERDE", size: 130 },
    { frase: 2, texto: "AÑO 2000" },
    { frase: 3, texto: "9.000 TIENDAS", parte: 0.3 },
    { frase: 8, texto: "NO", color: "ROJO", size: 140 },
    { frase: 9, texto: "2010: QUIEBRA", color: "ROJO", parte: 0.35 },
    { frase: 10, texto: "1 TIENDA" },
  ],
  remate: { frase: 12, pregunta: "¿Tú habrías comprado Netflix?", fondo: "i12.jpg" },
};
