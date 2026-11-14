import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/mansa-musa.json";

export const mansaMusa: HistoriaFlow = {
  id: "mansa-musa",
  carpeta: "flow-mansa-musa",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i09.jpg" },
    { frase: 2, src: "i08.jpg" },
    { frase: 2, parte: 0.5, src: "i06.jpg" },
    { frase: 3, src: "i04.jpg" },
    { frase: 4, src: "i12.jpg" },
    { frase: 4, parte: 0.55, src: "i15.jpg" },
    { frase: 5, src: "i02.jpg" },
    { frase: 5, parte: 0.35, src: "i10.jpg" },
    { frase: 5, parte: 0.7, src: "i16.jpg" },
    { frase: 6, src: "i01.jpg" },
    { frase: 6, parte: 0.5, src: "i21.jpg" },
    { frase: 7, src: "i14.jpg" },
    { frase: 8, src: "i05.jpg" },
    { frase: 8, parte: 0.55, src: "i22.jpg" },
    { frase: 9, src: "i19.jpg" },
    { frase: 9, parte: 0.55, src: "i07.jpg" },
    { frase: 10, src: "i20.jpg" },
    { frase: 10, parte: 0.5, src: "i17.jpg" },
    { frase: 11, src: "i18.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "1324", size: 130 },
    { frase: 4, texto: "MILES DE PERSONAS", parte: 0.2 },
    { frase: 6, texto: "EL ORO SE DESPLOMA", color: "ROJO", size: 84 },
    { frase: 7, texto: "≈ 12 AÑOS", color: "NARANJA", size: 120 },
  ],
  remate: { frase: 11, pregunta: "¿Qué harías tú con tanto oro?", fondo: "i18.jpg" },
};
