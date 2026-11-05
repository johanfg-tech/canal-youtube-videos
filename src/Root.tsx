import { Composition } from "remotion";
import { Avatar } from "./compositions/Avatar";
import { Banner } from "./compositions/Banner";
import { DatosShort, datosShortSchema } from "./compositions/DatosShort";
import { IntroVideo, introVideoSchema } from "./compositions/IntroVideo";
import regla72 from "../guiones/regla-72.json";
import descuentos from "../guiones/descuentos.json";
import recuperar from "../guiones/recuperar.json";
import millon from "../guiones/millon.json";
import ahorro10 from "../guiones/ahorro10.json";
import regla115 from "../guiones/regla115.json";
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
      <Composition
        id="Descuentos"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(descuentos)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Recuperar"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(recuperar)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Millon"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(millon)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Ahorro10"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(ahorro10)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Regla115"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(regla115)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Banner"
        component={Banner}
        durationInFrames={1}
        fps={FPS}
        width={2560}
        height={1440}
        defaultProps={{ nombre: "Cifras Claras", lema: "Dinero y economía explicados con números" }}
      />
      <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={FPS} width={800} height={800} />
    </>
  );
};
