import {
  AbsoluteFill,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import manos from "./manos-descuentos.json";

// Modo presentador (Short 1080x1920): la moneda 3D de pie, abajo a la izquierda, junto a los
// objetos. Las escenas con un objeto (camiseta, billetes, calculadora) aparecen a su lado,
// apoyadas en su mano, y la siguen; las de texto salen arriba y la moneda las señala.
export const PANTALLA = {
  subtitulos: 70,
  presentadorLado: 1000,
  presentadorIzq: -285,
  presentadorTop: 930,
};

const ZONA_ANCHO = 1080;
const ZONA_ALTO = 1240;
const ESCALA_MANO = 0.68;
const ESCALA_ARRIBA = 0.66;

// Escenas cuyo objeto sostiene la moneda con la mano.
const SOSTENIDAS = new Set(["etiqueta", "billetes", "calculadora"]);

export const Zona: React.FC<{
  tipo: string;
  desde: number; // fotograma absoluto en que empieza la escena
  children: React.ReactNode;
}> = ({ tipo, desde, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { presentadorLado: lado, presentadorIzq: izq, presentadorTop: top } =
    PANTALLA;
  const f = Math.min(Math.max(0, desde + frame), manos.L.length - 1);
  const [u, v] = manos.L[f];
  const mano = { x: izq + u * lado, y: top + v * lado };
  const entrada = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  if (SOSTENIDAS.has(tipo)) {
    // la zona descansa sobre la mano: su esquina inferior derecha queda justo por encima y la sigue
    const base = mano.y + 20;
    return (
      <div
        style={{
          position: "absolute",
          left: 1080 + 6 - ZONA_ANCHO,
          top: base - ZONA_ALTO,
          width: ZONA_ANCHO,
          height: ZONA_ALTO,
          scale: String(ESCALA_MANO * (0.6 + 0.4 * entrada)),
          transformOrigin: "100% 100%",
          opacity: entrada,
        }}
      >
        {children}
      </div>
    );
  }
  const w = ZONA_ANCHO * ESCALA_ARRIBA;
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - w) / 2,
        top: 215 + (1 - entrada) * 60,
        width: ZONA_ANCHO,
        height: ZONA_ALTO,
        scale: String(ESCALA_ARRIBA),
        transformOrigin: "0 0",
        opacity: entrada,
      }}
    >
      {children}
    </div>
  );
};

export const PresentadorGrande: React.FC<{
  video: string;
}> = ({ video }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 14 } });
  const { presentadorLado: lado, presentadorIzq: izq, presentadorTop: top } =
    PANTALLA;
  return (
    <AbsoluteFill>
      {/* foco del plató detrás del presentador */}
      <div
        style={{
          position: "absolute",
          left: izq - 60,
          top: top + 60,
          width: lado * 1.15,
          height: lado * 0.9,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, #e7b53c26 0%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: izq,
          top,
          translate: `0px ${(1 - entrada) * 500}px`,
        }}
      >
        <OffthreadVideo
          src={staticFile(video)}
          transparent
          muted
          style={{ width: lado, height: lado }}
        />
      </div>
    </AbsoluteFill>
  );
};
