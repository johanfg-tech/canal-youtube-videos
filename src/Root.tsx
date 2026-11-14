import { ExplicaShort, duracionExplica } from "./compositions/ExplicaShort";
import { VIDEOS_S16 } from "./explica/videos";
import { HISTORIAS } from "./explica/historias";
import { HistoriaCineShort, duracionHistoria } from "./compositions/HistoriaCineShort";
import { PilotoFloridaShort, duracionPiloto } from "./compositions/PilotoFloridaShort";
import { Composition } from "remotion";
import { Avatar } from "./compositions/Avatar";
import { Miniatura } from "./compositions/Miniatura";
import { Portada, portadaSchema } from "./compositions/Portada";
import { Banner } from "./compositions/Banner";
import { DatosShort, datosShortSchema } from "./compositions/DatosShort";
import { LargoConIntro, INTRO_SEG } from "./compositions/IntroLargo";
import { IntroVideo, introVideoSchema } from "./compositions/IntroVideo";
import { BigMacShort, duracionBigMac } from "./compositions/BigMacShort";
import { PizzasBitcoinShort, duracionPizzas } from "./compositions/PizzasBitcoinShort";
import { PizzasFlowShort, duracionPizzasFlow } from "./compositions/PizzasFlowShort";
import { Remate, remateSchema, duracionRemate } from "./compositions/Remate";
import remates from "../guiones/remates.json";
import regla72 from "../guiones/regla-72.json";
import descuentos from "../guiones/descuentos.json";
import recuperar from "../guiones/recuperar.json";
import millon from "../guiones/millon.json";
import ahorro10 from "../guiones/ahorro10.json";
import regla115 from "../guiones/regla115.json";
import comision from "../guiones/comision.json";
import movilPlazos from "../guiones/movil-plazos.json";
import horaTrabajo from "../guiones/hora-trabajo.json";
import tulipanes from "../guiones/tulipanes.json";
import hiperinflacion from "../guiones/hiperinflacion.json";
import ahorro200 from "../guiones/ahorro-200.json";
import sueldoInflacion from "../guiones/sueldo-inflacion.json";
import reto52 from "../guiones/reto-52.json";
import pagoMinimo from "../guiones/pago-minimo.json";
import fondoEmergencia from "../guiones/fondo-emergencia.json";
import interesMensual from "../guiones/interes-mensual.json";
import ordenDescuento from "../guiones/orden-descuento.json";
import duplicar10 from "../guiones/duplicar10.json";
import cafe from "../guiones/cafe.json";
import simpleCompuesto from "../guiones/simple-compuesto.json";
import inflacion from "../guiones/inflacion.json";
import largo7reglas from "../guiones/largo-7reglas.json";
import largoInteresCompuesto from "../guiones/largo-interes-compuesto.json";
import largoDinero from "../guiones/largo-de-donde-sale-el-dinero.json";
import largoMadoff from "../guiones/largo-madoff.json";
import largoArgentina from "../guiones/largo-argentina.json";
import largoNewton from "../guiones/largo-newton.json";
import largoCrisis2008 from "../guiones/largo-crisis2008.json";
import largoGamestop from "../guiones/largo-gamestop.json";
import largoCorea from "../guiones/largo-corea.json";
import regla503020 from "../guiones/regla503020.json";
import descuentosV2 from "../guiones/descuentos-v2.json";
import descuentosV3 from "../guiones/descuentos-v3.json";
import descuentosPresentador from "../guiones/descuentos-presentador.json";
import descuentosV4 from "../guiones/descuentos-v4.json";
import {
  SECONDS_PER_POINT,
  ShortVideo,
  shortVideoSchema,
} from "./compositions/ShortVideo";

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
          durationInFrames:
            FPS * (2 + props.points.length * SECONDS_PER_POINT + 3),
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
        id="Comision"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(comision)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Inflacion"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(inflacion)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="SimpleCompuesto"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(simpleCompuesto)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Cafe"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(cafe)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Duplicar10"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(duplicar10)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="OrdenDescuento"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(ordenDescuento)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="InteresMensual"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(interesMensual)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="FondoEmergencia"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(fondoEmergencia)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="PagoMinimo"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(pagoMinimo)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Reto52"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(reto52)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="SueldoInflacion"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(sueldoInflacion)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Ahorro200"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(ahorro200)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Hiperinflacion"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(hiperinflacion)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Tulipanes"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(tulipanes)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="HoraTrabajo"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(horaTrabajo)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="MovilPlazos"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(movilPlazos)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Regla503020"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(regla503020)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="DescuentosV2"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(descuentosV2)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="DescuentosV3"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(descuentosV3)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="DescuentosV4"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(descuentosV4)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="DescuentosPresentador"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(descuentosPresentador)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="Largo7Reglas"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(largo7reglas)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="LargoInteresCompuesto"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(largoInteresCompuesto)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="LargoDeDondeSaleElDinero"
        component={DatosShort}
        schema={datosShortSchema}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={datosShortSchema.parse(largoDinero)}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * props.duracion),
        })}
      />
      <Composition
        id="LargoDeDondeSaleElDineroIntro"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["¿De dónde sale", "el DINERO?"],
            resaltar: "DINERO",
            sub: "De las primeras monedas a tu cuenta del banco",
            imgs: ["ia/s16/moneda-lidia.png", "ia/s16/billete-chino.png", "ia/s16/lingotes.png", "ia/s16/banco.png", "ia/s16/monitor-billetes.png", "ia/s16/billetes-montana.png", "ia/s16/cofre-recibo.png", "ia/s16/trueque.png"],
          },
          video: datosShortSchema.parse(largoDinero),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoMadoff"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["La MAYOR estafa", "de la historia"],
            resaltar: "MAYOR",
            sub: "Bernie Madoff y los 65.000 millones que no existían",
            imgs: ["ia/s16/piramide.png", "ia/s16/bolsa.png", "ia/s16/esposas.png", "ia/s16/mazo.png", "ia/s16/fajo.png", "ia/s16/extracto.png", "ia/s16/billetes-montana.png", "ia/s16/rejas.png"],
          },
          video: datosShortSchema.parse(largoMadoff),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoArgentina"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["De país RICO", "a crisis eterna"],
            resaltar: "RICO",
            sub: "Argentina: 13 ceros, 9 impagos y un ciclo que no termina",
            imgs: ["ia/s16/bandera-arg.png", "ia/s16/vaca-trigo.png", "ia/s16/prensa-monedas.png", "ia/s16/cacerola.png", "ia/billete-desvanece.png", "ia/s16/locomotora.png", "ia/s16/carretilla.png", "ia/s16/cajero.png"],
          },
          video: datosShortSchema.parse(largoArgentina),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoNewton"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["El GENIO que", "lo perdió todo"],
            resaltar: "GENIO",
            sub: "Isaac Newton y la burbuja de los Mares del Sur",
            imgs: ["ia/s16/manzana-pluma.png", "ia/s16/burbuja-oro.png", "ia/s16/velero.png", "ia/s16/pergamino.png", "ia/grafico-sube.png", "ia/s16/lingotes.png", "ia/s16/rejas.png", "ia/s16/monedas.png"],
          },
          video: datosShortSchema.parse(largoNewton),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoCrisis2008"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["¿Salvar a los BANCOS", "con tu dinero?"],
            resaltar: "BANCOS",
            sub: "La crisis de 2008 y el rescate más polémico",
            imgs: ["ia/s16/banco-roto.png", "ia/s16/salvavidas.png", "ia/s16/paquete-casas.png", "ia/s16/islandia.png", "ia/s16/casa-huracan.png", "ia/s16/rejas.png", "ia/s16/capitolio.png", "ia/s16/fajo.png"],
          },
          video: datosShortSchema.parse(largoCrisis2008),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoGamestop"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["Pequeños contra", "WALL STREET"],
            resaltar: "WALL STREET",
            sub: "GameStop: la rebelión que hizo temblar a los grandes fondos",
            imgs: ["ia/s16/gato-rugiendo.png", "ia/s16/cohete.png", "ia/s16/mando.png", "ia/s16/movil-candado.png", "ia/s16/bolsa.png", "ia/s16/billetes-montana.png", "ia/s16/banco-roto.png", "ia/s16/ruleta.png"],
          },
          video: datosShortSchema.parse(largoGamestop),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="LargoCorea"
        component={LargoConIntro}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={FPS * 10}
        defaultProps={{
          intro: {
            lineas: ["De POBRE a potencia", "en una generación"],
            resaltar: "POBRE",
            sub: "Corea del Sur frente a América Latina: la receta y su precio",
            imgs: ["ia/s16/bandera-corea.png", "ia/s16/chip.png", "ia/s16/birrete.png", "ia/s16/joyas-oro.png", "ia/s16/barco.png", "ia/s16/fabrica.png", "ia/s16/coche.png", "ia/s16/barril.png"],
          },
          video: datosShortSchema.parse(largoCorea),
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil(FPS * (INTRO_SEG + props.video.duracion)),
        })}
      />
      <Composition
        id="Portada"
        component={Portada}
        schema={portadaSchema}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={1}
        defaultProps={{ lineas: ["El banco te presta", "dinero que no tiene"], resaltar: "no tiene", imgs: ["ia/s16/banco.png"] }}
      />
      <Composition
        id="Miniatura"
        component={Miniatura}
        fps={FPS}
        width={1280}
        height={720}
        durationInFrames={1}
        defaultProps={{
          numero: "7",
          arriba: "reglas de dinero",
          abajo: "que nadie te explica",
          chips: ["72", "115", "50/30/20", "×25"],
        }}
      />
      <Composition
        id="Banner"
        component={Banner}
        durationInFrames={1}
        fps={FPS}
        width={2560}
        height={1440}
        defaultProps={{
          nombre: "Cifras Claras",
          lema: "Dinero y economía explicados con números",
        }}
      />
      <Composition
        id="Avatar"
        component={Avatar}
        durationInFrames={1}
        fps={FPS}
        width={800}
        height={800}
      />
      {Object.entries(remates).map(([nombre, props]) => (
        <Composition
          key={nombre}
          id={`Remate-${nombre}`}
          component={Remate}
          schema={remateSchema}
          fps={FPS}
          width={1080}
          height={1920}
          durationInFrames={FPS * 10}
          defaultProps={props}
          calculateMetadata={({ props: p }) => ({
            durationInFrames: Math.ceil(FPS * duracionRemate(p)),
          })}
        />
      ))}
      <Composition
        id="BigMac"
        component={BigMacShort}
        durationInFrames={duracionBigMac}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="PizzasBitcoin"
        component={PizzasBitcoinShort}
        durationInFrames={duracionPizzas}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="PizzasFlow"
        component={PizzasFlowShort}
        durationInFrames={duracionPizzasFlow}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="PilotoFlorida"
        component={PilotoFloridaShort}
        durationInFrames={duracionPiloto}
        fps={30}
        width={1080}
        height={1920}
      />
      {VIDEOS_S16.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={ExplicaShort}
          durationInFrames={duracionExplica(v.datos)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ datos: v.datos }}
        />
      ))}
      {HISTORIAS.map((h) => (
        <Composition
          key={h.id}
          id={h.id}
          component={HistoriaCineShort}
          durationInFrames={duracionHistoria(h.datos)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ datos: h.datos }}
        />
      ))}
    </>
  );
};
