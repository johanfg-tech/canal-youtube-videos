import { Composition } from "remotion";
import { DatosShort, datosShortSchema } from "./compositions/DatosShort";
import { IntroVideo, introVideoSchema } from "./compositions/IntroVideo";
import regla72 from "../guiones/regla-72.json";
import { SECONDS_PER_POINT, ShortVideo, shortVideoSchema } from "./compositions/ShortVideo";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntroVideo"
        component={IntroVideo}
        schema={introVideoSchema}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Título del vídeo",
          subtitle: "Subtítulo o pregunta gancho",
        }}
      />
      <Composition
        id="ShortVideo"
        component={ShortVideo}
        schema={shortVideoSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={{
          hook: "3 cosas que nadie te cuenta",
          points: ["Primera idea", "Segunda idea", "Tercera idea"],
          cta: "Sígueme para más",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: FPS * (2 + props.points.length * SECONDS_PER_POINT + 3),
        })}
      />
      <Composition
        id="DatosShort"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(regla72)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
    </>
  );
};
