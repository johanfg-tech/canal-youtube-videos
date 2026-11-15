// Registro del calendario de adviento: carpeta de cada puerta y la imagen que se ve
// dentro de la puerta cuando ya está abierta (los días siguientes).
export const PUERTAS_ADVIENTO: Record<number, { carpeta: string; portada: string; anio: string; titulo: string }> = {
  1: { carpeta: "flow-ford-cadena", portada: "i01.jpg", anio: "1913", titulo: "La cadena de montaje de Ford" },
  2: { carpeta: "flow-enron", portada: "i01.jpg", anio: "2001", titulo: "La caída de Enron" },
  3: { carpeta: "flow-primer-sms", portada: "i01.jpg", anio: "1992", titulo: "El primer SMS" },
  4: { carpeta: "flow-pan-am", portada: "i01.jpg", anio: "1991", titulo: "El fin de Pan Am" },
  5: { carpeta: "flow-ley-seca", portada: "i01.jpg", anio: "1933", titulo: "El fin de la Ley Seca" },
  6: { carpeta: "flow-orange-county", portada: "i04.jpg", anio: "1994", titulo: "La quiebra de Orange County" },
  7: { carpeta: "flow-apolo-17", portada: "i01.jpg", anio: "1972", titulo: "Apolo 17, adiós a la Luna" },
  8: { carpeta: "flow-ibm-lenovo", portada: "i01.jpg", anio: "2004", titulo: "IBM vende sus PC a Lenovo" },
  9: { carpeta: "flow-viruela", portada: "i01.jpg", anio: "1979", titulo: "El fin de la viruela" },
  10: { carpeta: "flow-nobel-dinamita", portada: "i01.jpg", anio: "1901", titulo: "Nobel y la dinamita" },
  11: { carpeta: "flow-china-omc", portada: "i01.jpg", anio: "2001", titulo: "China entra en la OMC" },
  12: { carpeta: "flow-mona-lisa", portada: "i01.jpg", anio: "1913", titulo: "Aparece la Mona Lisa" },
  13: { carpeta: "flow-drake-tesoro", portada: "i01.jpg", anio: "1577", titulo: "Drake y el tesoro del rey" },
  14: { carpeta: "flow-panico-1825-poyais", portada: "i01.jpg", anio: "1825", titulo: "Poyais, el país que no existía" },
  15: { carpeta: "flow-lo-que-el-viento", portada: "i01.jpg", anio: "1939", titulo: "Lo que el viento se llevó" },
  16: { carpeta: "flow-motin-te", portada: "i01.jpg", anio: "1773", titulo: "El Motín del Té" },
  17: { carpeta: "flow-hermanos-wright", portada: "i01.jpg", anio: "1903", titulo: "El primer vuelo de los Wright" },
  18: { carpeta: "flow-argentina-mundial", portada: "i01.jpg", anio: "2022", titulo: "Argentina campeona del mundo" },
  19: { carpeta: "flow-cuento-navidad", portada: "i01.jpg", anio: "1843", titulo: "Cuento de Navidad" },
  20: { carpeta: "flow-luisiana", portada: "i01.jpg", anio: "1803", titulo: "La compra de Luisiana" },
  21: { carpeta: "flow-blancanieves", portada: "i01.jpg", anio: "1937", titulo: "Blancanieves" },
  22: { carpeta: "flow-el-gordo", portada: "i01.jpg", anio: "1812", titulo: "El Gordo de Navidad" },
  23: { carpeta: "flow-reserva-federal", portada: "i01.jpg", anio: "1913", titulo: "Nace la Reserva Federal" },
  24: { carpeta: "flow-tregua-navidad", portada: "i01.jpg", anio: "1914", titulo: "La tregua de Navidad" },
};

// Puertas ya abiertas antes de la del día, con su imagen.
export const abiertasAntes = (puerta: number) =>
  Array.from({ length: puerta - 1 }, (_, i) => i + 1).map((n) => ({
    puerta: n,
    src: `${PUERTAS_ADVIENTO[n].carpeta}/${PUERTAS_ADVIENTO[n].portada}`,
    anio: PUERTAS_ADVIENTO[n].anio,
  }));
