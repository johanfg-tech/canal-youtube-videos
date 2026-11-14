import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/flow/pepsi-flota.json";

export const pepsiFlota: HistoriaFlow = {
  id: "pepsi-flota",
  carpeta: "flow-pepsi-flota",
  guion,
  planos: [
    { frase: 0, src: "v01.mp4", video: true },
    { frase: 1, src: "i16.jpg" },
    { frase: 2, src: "i11.jpg" },
    { frase: 3, src: "i12.jpg" },
    { frase: 4, src: "i15.jpg" },
    { frase: 4, parte: 0.55, src: "i05.jpg" },
    { frase: 5, src: "i18.jpg" },
    { frase: 6, src: "i17.jpg" },
    { frase: 7, src: "i13.jpg" },
    { frase: 7, parte: 0.5, src: "i04.jpg" },
    { frase: 8, src: "i03.jpg" },
    { frase: 8, parte: 0.55, src: "i02.jpg" },
    { frase: 9, src: "i06.jpg" },
    { frase: 9, parte: 0.5, src: "i08.jpg" },
    { frase: 10, src: "i09.jpg" },
    { frase: 11, src: "i10.jpg" },
    { frase: 11, parte: 0.5, src: "i01.jpg" },
    { frase: 12, src: "i07.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "MOSCÚ · 1959" },
    { frase: 5, texto: "RUBLO ✗", color: "ROJO" },
    { frase: 6, texto: "PAGO = VODKA", color: "NARANJA" },
    { frase: 7, texto: "1989" },
    { frase: 8, texto: "17 SUBMARINOS", color: "ROJO", parte: 0.25, dura: 1.6 },
    { frase: 8, texto: "+ CRUCERO, FRAGATA Y DESTRUCTOR", color: "NARANJA", size: 64, parte: 0.6 },
    { frase: 11, texto: "CHATARRA", color: "NARANJA" },
  ],
  remate: { frase: 12, pregunta: "¿Sabías que se podía pagar un refresco con submarinos?", fondo: "i07.jpg" },
};
