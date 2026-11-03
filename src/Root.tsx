import { Composition } from "remotion";
import { IntroVideo, introVideoSchema, tiemposIntro } from "./compositions/IntroVideo";
import { ShortVideo, shortVideoSchema, tiemposShort } from "./compositions/ShortVideo";

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
        calculateMetadata={({ props }) => ({ durationInFrames: tiemposIntro(props, FPS).duracion })}
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
        calculateMetadata={({ props }) => ({ durationInFrames: tiemposShort(props, FPS).duracion })}
      />
    </>
  );
};
