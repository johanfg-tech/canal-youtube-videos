import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Modo presentador (Short 1080x1920): la moneda 3D de pie, grande, abajo; las escenas en una
// "pantalla" de plató arriba, a la que el presentador señala.
const ZONA_ANCHO = 1080;
const ZONA_ALTO = 1240;

export const PANTALLA = {
  top: 96,
  left: 60,
  ancho: 960,
  alto: 800,
  subtitulos: 890,
  presentadorTop: 1010,
  presentadorAncho: 960,
};

const ORO = "#e7b53c";

export const Pantalla: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const escala = (PANTALLA.alto - 40) / ZONA_ALTO;
  return (
    <div
      style={{
        position: "absolute",
        top: PANTALLA.top,
        left: PANTALLA.left,
        width: PANTALLA.ancho,
        height: PANTALLA.alto,
        borderRadius: 44,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 35%, rgba(40,46,66,0.92) 0%, rgba(12,14,20,0.94) 75%)",
        border: `6px solid ${ORO}`,
        boxShadow: `0 0 60px ${ORO}55, inset 0 0 50px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: (PANTALLA.ancho - 12 - ZONA_ANCHO * escala) / 2,
          width: ZONA_ANCHO,
          height: ZONA_ALTO,
          scale: String(escala),
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
      {/* reflejo de cristal que cruza la pantalla despacio */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: interpolate(frame % 240, [0, 240], [-500, 1400]),
          width: 160,
          height: 1300,
          rotate: "20deg",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        }}
      />
    </div>
  );
};

type EscenaConMascota = { inicio: number; mascota?: { texto?: string } };

export const PresentadorGrande: React.FC<{
  video: string;
  escenas: EscenaConMascota[];
}> = ({ video }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 14 } });
  const { presentadorTop: top, presentadorAncho: ancho } = PANTALLA;
  return (
    <AbsoluteFill>
      {/* foco del plató detrás del presentador y sombra en el suelo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 520,
          top: top + 40,
          width: 1040,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ORO}30 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: top + ancho * 0.865,
          width: 600,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (1080 - ancho) / 2,
          top,
          translate: `0px ${(1 - entrada) * 500}px`,
        }}
      >
        <OffthreadVideo
          src={staticFile(video)}
          transparent
          muted
          style={{ width: ancho, height: ancho }}
        />
      </div>
    </AbsoluteFill>
  );
};
