import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/adviento/12-mona-lisa.json";

export const monaLisa: HistoriaFlow = {
  id: "mona-lisa",
  carpeta: "flow-mona-lisa",
  guion,
  adviento: { puerta: 12, fecha: "12 de diciembre", anio: "1913" },
  planos: [
    { frase: 3, src: "i01.jpg" },
    { frase: 4, src: "v_sonrisa.mp4", video: true },
    { frase: 5, parte: 0.2, src: "v_armario.mp4", video: true },
    { frase: 5, parte: 0.5, src: "v_descuelga.mp4", video: true },
    { frase: 5, parte: 0.78, src: "i04.jpg" },
    { frase: 6, src: "i05.jpg" },
    { frase: 7, src: "v_periodicos.mp4", video: true },
    { frase: 8, src: "i07.jpg" },
    { frase: 9, src: "i08.jpg" },
    { frase: 10, src: "v_anticuario.mp4", video: true },
    { frase: 11, src: "i10.jpg" },
    { frase: 12, src: "i11.jpg" },
    { frase: 13, src: "v_regreso.mp4", video: true },
    { frase: 13, parte: 0.6, src: "i13.jpg" },
  ],
  etiquetas: [
    { frase: 5, texto: "1911: EL ROBO", color: "ROJO", size: 90, parte: 0.22, dura: 3 },
    { frase: 8, texto: "UN HUECO EN LA PARED", size: 70, parte: 0.4 },
    { frase: 9, texto: "2 AÑOS ESCONDIDA", size: 80, parte: 0.3 },
    { frase: 11, texto: "1913: DETENIDO", color: "ROJO", size: 90, parte: 0.4 },
    { frase: 13, texto: "NO TIENE PRECIO", color: "VERDE", size: 90, parte: 0.65 },
  ],
  remate: { frase: 14, pregunta: "¿Tú habrías ido a ver el hueco vacío?", fondo: "i14.jpg" },
};
