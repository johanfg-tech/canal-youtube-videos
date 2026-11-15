// Registro del calendario de adviento: carpeta de cada puerta y la imagen que se ve
// dentro de la puerta cuando ya está abierta (los días siguientes).
export const PUERTAS_ADVIENTO: Record<number, { carpeta: string; portada: string }> = {
  1: { carpeta: "flow-ford-cadena", portada: "i01.jpg" },
  2: { carpeta: "flow-enron", portada: "i01.jpg" },
  3: { carpeta: "flow-primer-sms", portada: "i01.jpg" },
  4: { carpeta: "flow-pan-am", portada: "i01.jpg" },
  5: { carpeta: "flow-ley-seca", portada: "i01.jpg" },
  6: { carpeta: "flow-orange-county", portada: "i04.jpg" },
  7: { carpeta: "flow-apolo-17", portada: "i01.jpg" },
  8: { carpeta: "flow-ibm-lenovo", portada: "i01.jpg" },
  9: { carpeta: "flow-viruela", portada: "i01.jpg" },
  10: { carpeta: "flow-nobel-dinamita", portada: "i01.jpg" },
  11: { carpeta: "flow-china-omc", portada: "i01.jpg" },
  12: { carpeta: "flow-mona-lisa", portada: "i01.jpg" },
  13: { carpeta: "flow-drake-tesoro", portada: "i01.jpg" },
  14: { carpeta: "flow-panico-1825-poyais", portada: "i01.jpg" },
  15: { carpeta: "flow-lo-que-el-viento", portada: "i01.jpg" },
  16: { carpeta: "flow-motin-te", portada: "i01.jpg" },
  17: { carpeta: "flow-hermanos-wright", portada: "i01.jpg" },
  18: { carpeta: "flow-argentina-mundial", portada: "i01.jpg" },
  19: { carpeta: "flow-cuento-navidad", portada: "i01.jpg" },
  20: { carpeta: "flow-luisiana", portada: "i01.jpg" },
  21: { carpeta: "flow-blancanieves", portada: "i01.jpg" },
  22: { carpeta: "flow-el-gordo", portada: "i01.jpg" },
  23: { carpeta: "flow-reserva-federal", portada: "i01.jpg" },
  24: { carpeta: "flow-tregua-navidad", portada: "i01.jpg" },
};

// Puertas ya abiertas antes de la del día, con su imagen.
export const abiertasAntes = (puerta: number) =>
  Array.from({ length: puerta - 1 }, (_, i) => i + 1).map((n) => ({
    puerta: n,
    src: `${PUERTAS_ADVIENTO[n].carpeta}/${PUERTAS_ADVIENTO[n].portada}`,
  }));
