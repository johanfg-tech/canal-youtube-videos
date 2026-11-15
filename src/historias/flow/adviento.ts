// Registro del calendario de adviento: carpeta de cada puerta y la imagen que se ve
// dentro de la puerta cuando ya está abierta (los días siguientes).
export const PUERTAS_ADVIENTO: Record<number, { carpeta: string; portada: string; anio: string }> = {
  1: { carpeta: "flow-ford-cadena", portada: "i01.jpg", anio: "1913" },
  2: { carpeta: "flow-enron", portada: "i01.jpg", anio: "2001" },
  3: { carpeta: "flow-primer-sms", portada: "i01.jpg", anio: "1992" },
  4: { carpeta: "flow-pan-am", portada: "i01.jpg", anio: "1991" },
  5: { carpeta: "flow-ley-seca", portada: "i01.jpg", anio: "1933" },
  6: { carpeta: "flow-orange-county", portada: "i04.jpg", anio: "1994" },
  7: { carpeta: "flow-apolo-17", portada: "i01.jpg", anio: "1972" },
  8: { carpeta: "flow-ibm-lenovo", portada: "i01.jpg", anio: "2004" },
  9: { carpeta: "flow-viruela", portada: "i01.jpg", anio: "1979" },
  10: { carpeta: "flow-nobel-dinamita", portada: "i01.jpg", anio: "1901" },
  11: { carpeta: "flow-china-omc", portada: "i01.jpg", anio: "2001" },
  12: { carpeta: "flow-mona-lisa", portada: "i01.jpg", anio: "1913" },
  13: { carpeta: "flow-drake-tesoro", portada: "i01.jpg", anio: "1577" },
  14: { carpeta: "flow-panico-1825-poyais", portada: "i01.jpg", anio: "1825" },
  15: { carpeta: "flow-lo-que-el-viento", portada: "i01.jpg", anio: "1939" },
  16: { carpeta: "flow-motin-te", portada: "i01.jpg", anio: "1773" },
  17: { carpeta: "flow-hermanos-wright", portada: "i01.jpg", anio: "1903" },
  18: { carpeta: "flow-argentina-mundial", portada: "i01.jpg", anio: "2022" },
  19: { carpeta: "flow-cuento-navidad", portada: "i01.jpg", anio: "1843" },
  20: { carpeta: "flow-luisiana", portada: "i01.jpg", anio: "1803" },
  21: { carpeta: "flow-blancanieves", portada: "i01.jpg", anio: "1937" },
  22: { carpeta: "flow-el-gordo", portada: "i01.jpg", anio: "1812" },
  23: { carpeta: "flow-reserva-federal", portada: "i01.jpg", anio: "1913" },
  24: { carpeta: "flow-tregua-navidad", portada: "i01.jpg", anio: "1914" },
};

// Puertas ya abiertas antes de la del día, con su imagen.
export const abiertasAntes = (puerta: number) =>
  Array.from({ length: puerta - 1 }, (_, i) => i + 1).map((n) => ({
    puerta: n,
    src: `${PUERTAS_ADVIENTO[n].carpeta}/${PUERTAS_ADVIENTO[n].portada}`,
    anio: PUERTAS_ADVIENTO[n].anio,
  }));
