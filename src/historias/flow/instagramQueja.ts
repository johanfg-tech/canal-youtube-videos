import { HistoriaFlow } from "../../compositions/FlowHistoria";
import guion from "../../../guiones/historias/instagram-queja.json";

// Queja: Instagram inhabilitó la cuenta del canal sin motivo ni opción de apelar. Se pide compartir
// y etiquetar a Meta e Instagram. Captura real del mensaje de Instagram en la frase 2.
export const instagramQueja: HistoriaFlow = {
  id: "instagram-queja",
  carpeta: "flow-instagram-queja",
  guion,
  captura: { src: "captura-modal.png", frase: 2, hasta: 3, titulo: "LO ÚNICO QUE NOS DIJERON" },
  planos: [
    { frase: 0, src: "v_shock.mp4", video: true },
    { frase: 1, src: "i02.jpg" },
    { frase: 2, src: "i03.jpg" },
    { frase: 3, src: "i04.jpg" },
    { frase: 5, src: "i05.jpg" },
    { frase: 6, src: "i06.jpg" },
    { frase: 7, src: "i07.jpg" },
    { frase: 8, src: "i08.jpg" },
    { frase: 9, src: "i09.jpg" },
    { frase: 10, src: "i10.jpg" },
    { frase: 11, src: "v_borra.mp4", video: true },
    { frase: 12, src: "i12.jpg" },
    { frase: 13, src: "v_comparte.mp4", video: true },
    { frase: 14, src: "i14.jpg" },
    { frase: 15, src: "i15.jpg" },
    { frase: 16, src: "i16.jpg" },
  ],
  etiquetas: [
    { frase: 1, texto: "SIN MOTIVO · SIN APELACIÓN", color: "ROJO", size: 66 },
    { frase: 6, texto: "CUENTA INHABILITADA", color: "ROJO", size: 80, parte: 0.55 },
    { frase: 13, texto: "@meta  @instagram", size: 90, parte: 0.3 },
    { frase: 14, texto: "REVISIÓN HUMANA", color: "VERDE", size: 90, parte: 0.3 },
  ],
  remate: { frase: 15, pregunta: "¿A ti también te ha pasado?", fondo: "i16.jpg" },
};
