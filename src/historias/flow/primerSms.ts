import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/03-primer-sms.json";

// Calendario de adviento, puerta 3 (3 dic): el primer SMS, 1992.
export const primerSms: HistoriaFlow = {
  id: "primer-sms",
  carpeta: "flow-primer-sms",
  guion,
  adviento: { puerta: 3, fecha: "3 de diciembre de 1992", anio: "1992" },
  planos: [
    { frase: 3, src: "i02.jpg" },
    { frase: 4, src: "i05.jpg" },
    { frase: 5, parte: 0.15, src: "v_neil.mp4", video: true },
    { frase: 6, src: "v_teclado.mp4", video: true },
    { frase: 7, src: "v_fiesta.mp4", video: true },
    { frase: 8, src: "v_richard.mp4", video: true },
    { frase: 9, parte: 0.45, src: "i13.jpg" },
    { frase: 10, src: "i08.jpg" },
    { frase: 11, src: "i01.jpg" },
    { frase: 11, parte: 0.35, src: "v_monedas.mp4", video: true },
    { frase: 11, parte: 0.72, src: "i09.jpg" },
    { frase: 12, src: "v_subasta.mp4", video: true },
    { frase: 12, parte: 0.82, src: "i03.jpg" },
    { frase: 13, src: "i10.jpg" },
  ],
  etiquetas: [
    { frase: 3, texto: "2 PALABRAS", size: 120, parte: 0.2 },
    { frase: 6, texto: "«MERRY CHRISTMAS»", size: 80, parte: 0.45 },
    { frase: 11, texto: "BILLONES AL AÑO", color: "VERDE", size: 100, parte: 0.75 },
    { frase: 12, texto: "+100.000 €", color: "VERDE", size: 120, parte: 0.5 },
  ],
  remate: { frase: 14, pregunta: "¿Recuerdas cuánto te cobraban por un mensaje?", fondo: "i10.jpg" },
};
