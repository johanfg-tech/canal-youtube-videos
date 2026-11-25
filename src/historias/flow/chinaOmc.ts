import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/11-china-omc.json";

export const chinaOmc: HistoriaFlow = {
  id: "china-omc",
  carpeta: "flow-china-omc",
  guion,
  adviento: { puerta: 11, fecha: "11 de diciembre", anio: "2001" },
  planos: [
    { frase: 3, src: "v_etiqueta.mp4", video: true },
    { frase: 3, parte: 0.55, src: "i06.jpg" },
    { frase: 4, src: "v_doha.mp4", video: true },
    { frase: 5, src: "i05.jpg" },
    { frase: 6, src: "i01.jpg" },
    { frase: 6, parte: 0.45, src: "v_mapa.mp4", video: true },
    { frase: 7, src: "i09.jpg" },
    { frase: 7, parte: 0.5, src: "v_juguetes.mp4", video: true },
    { frase: 8, src: "v_puerto.mp4", video: true },
    { frase: 9, src: "i10.jpg" },
    { frase: 9, parte: 0.4, src: "v_barco.mp4", video: true },
    { frase: 9, parte: 0.75, src: "i07.jpg" },
    { frase: 10, src: "i02.jpg" },
    { frase: 10, parte: 0.5, src: "i03.jpg" },
  ],
  etiquetas: [
    { frase: 4, texto: "2001: CHINA ENTRA EN LA OMC", size: 66, parte: 0.3 },
    { frase: 5, texto: "ARANCELES", color: "ROJO", size: 100, parte: 0.45, dura: 2.2 },
    { frase: 8, texto: "EXPORTACIONES X10", color: "VERDE", size: 78, parte: 0.35 },
    { frase: 9, texto: "Nº 1 EXPORTADOR DEL MUNDO", size: 64, parte: 0.1 },
    { frase: 10, texto: "MÁS BARATO", color: "VERDE", size: 96, parte: 0.55, dura: 2 },
  ],
  remate: { frase: 11, pregunta: "¿Dónde se fabricó lo que tienes cerca?", fondo: "i08.jpg" },
};
