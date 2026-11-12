#!/usr/bin/env python3
"""Calcula los tiempos de cada palabra de una narración para los subtítulos de DatosShort.

    python3 scripts/tiempos.py public/narraciones/x.mp3 guiones/x.txt guiones/x.json

- x.txt: el texto tal como debe verse en pantalla (puede usar cifras: "72", "6 %").
- Detecta los silencios del audio con ffmpeg, reparte las palabras por el tiempo hablado según
  lo largas que son al decirlas, y escribe "palabras" y "duracion" en el guion JSON.
- Imprime los tramos hablados para ajustar a mano el "inicio" de cada escena.

Es una aproximación: si hay claves de ElevenLabs con marcas de tiempo, úsalas en su lugar.
"""
import json, re, subprocess, sys

NUMEROS = {"0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro", "5": "cinco", "6": "seis",
           "7": "siete", "8": "ocho", "9": "nueve", "10": "diez", "12": "doce", "20": "veinte",
           "24": "veinticuatro", "25": "veinticinco", "75": "setenta y cinco", "80": "ochenta", "400": "cuatrocientos", "11": "once", "160": "ciento sesenta", "1.500": "mil quinientos", "800": "ochocientos", "672": "seiscientos setenta y dos", "600": "seiscientos", "28": "veintiocho", "1.000": "mil", "9": "nueve", "32": "treinta y dos", "1000": "mil", "35": "treinta y cinco", "45": "cuarenta y cinco", "65": "sesenta y cinco", "30": "treinta", "24.000": "veinticuatro mil", "41.000": "cuarenta y un mil", "36.000": "treinta y seis mil", "83.000": "ochenta y tres mil", "12.000": "doce mil", "40": "cuarenta", "50": "cincuenta", "60": "sesenta", "70": "setenta",
           "72": "setenta y dos", "115": "ciento quince", "23": "veintitrés", "100": "cien", "%": "por ciento", "€": "euros", "×": "por", "÷": "entre"}


def peso(tok):
    total = 0.0
    for parte in re.findall(r"\d+(?:,\d+)?|[%€×÷]|[^\W\d_]+", tok):
        if "," in parte:
            a, b = parte.split(",")
            total += len(NUMEROS.get(a, "x" * 5 * len(a))) + 5 + len(NUMEROS.get(b, "x" * 5 * len(b)))
        else:
            total += len(NUMEROS.get(parte, parte if not parte.isdigit() else "x" * 5 * len(parte)))
    return total + 1.5


def tramos(mp3):
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", mp3]).decode())
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", mp3, "-af", "silencedetect=noise=-35dB:d=0.25",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    hablado, cursor = [], 0.0
    for a, b in zip(ini, fin):
        if a > cursor:
            hablado.append((cursor, a))
        cursor = b
    if cursor < dur:
        hablado.append((cursor, dur))
    return dur, hablado


def main():
    mp3, txt, guion = sys.argv[1:4]
    dur, hablado = tramos(mp3)
    toks = []
    for t in open(txt, encoding="utf-8").read().split():
        if toks and re.fullmatch(r"[%€][.,:;…?!]*", t):
            toks[-1] += " " + t  # "6 %" va junto
        else:
            toks.append(t)
    pesos = [peso(t) for t in toks]
    total_habla = sum(b - a for a, b in hablado)
    escala = total_habla / sum(pesos)

    def a_tiempo(x):  # x = segundos de habla acumulados -> segundo real del audio
        for a, b in hablado:
            if x <= b - a:
                return a + x
            x -= b - a
        return hablado[-1][1]

    # Alineación por programación dinámica: cada tramo hablado (entre silencios) se asigna a un
    # bloque seguido de palabras, de forma que la velocidad de habla de cada tramo se parezca lo más
    # posible a la media. Los cortes de tramo prefieren caer tras una coma o un punto.
    import math
    n, m = len(toks), len(hablado)
    media = sum(pesos) / total_habla
    acum = [0.0]
    for p_ in pesos:
        acum.append(acum[-1] + p_)
    puntuado = [bool(re.search(r"[.,:;…?!]$", t)) for t in toks]
    VENTANA = 80
    INF = float("inf")
    coste = [[INF] * (n + 1) for _ in range(m + 1)]
    previo = [[-1] * (n + 1) for _ in range(m + 1)]
    coste[0][0] = 0.0
    for i in range(1, m + 1):
        dur_t = hablado[i - 1][1] - hablado[i - 1][0]
        for j in range(i, n + 1):
            extra = 0.0 if (j == n or puntuado[j - 1]) else 1.0
            mejor, arg = INF, -1
            for k in range(max(i - 1, j - VENTANA), j):
                if coste[i - 1][k] == INF:
                    continue
                vel = (acum[j] - acum[k]) / dur_t
                c = coste[i - 1][k] + math.log(vel / media) ** 2 * (0.5 + dur_t) + extra
                if c < mejor:
                    mejor, arg = c, k
            coste[i][j], previo[i][j] = mejor, arg
    limites, j = [], n
    for i in range(m, 0, -1):
        k = previo[i][j]
        limites.append((k, j, i - 1))
        j = k
    tiempos = [None] * n
    for k, j, t in limites:
        a0, b0 = hablado[t]
        sp = acum[j] - acum[k]
        y = a0
        for idx in range(k, j):
            d_ = (b0 - a0) * pesos[idx] / sp
            tiempos[idx] = (y, y + d_)
            y += d_

    palabras = []
    for t, (x0, x1) in zip(toks, tiempos):
        palabras.append({"texto": t, "inicio": round(x0, 2), "fin": round(x1, 2),
                         "corte": bool(re.search(r"[.:;…?!]$", t))})
    d = json.load(open(guion, encoding="utf-8"))
    d["palabras"], d["duracion"] = palabras, round(dur + 0.5, 1)
    open(guion, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(palabras)} palabras, {dur:.1f} s. Tramos hablados:")
    for a, b in hablado:
        trozo = " ".join(p["texto"] for p in palabras if a - 0.05 <= p["inicio"] < b)
        print(f"  {a:6.2f}-{b:6.2f}  {trozo}")


if __name__ == "__main__":
    main()
