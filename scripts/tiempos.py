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
           "24": "veinticuatro", "25": "veinticinco", "75": "setenta y cinco", "80": "ochenta", "400": "cuatrocientos", "11": "once", "32": "treinta y dos", "1000": "mil", "35": "treinta y cinco", "45": "cuarenta y cinco", "65": "sesenta y cinco", "30": "treinta", "24.000": "veinticuatro mil", "41.000": "cuarenta y un mil", "36.000": "treinta y seis mil", "83.000": "ochenta y tres mil", "12.000": "doce mil", "40": "cuarenta", "50": "cincuenta", "60": "sesenta", "70": "setenta",
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

    # 1) reparto proporcional por todo el tiempo hablado
    bruto, acum = [], 0.0
    for p in pesos:
        bruto.append((acum, acum + p * escala))
        acum += p * escala
    # 2) cada final de frase se ancla al final de tramo hablado más cercano (en tiempo de habla),
    #    y las palabras de esa frase se reparten de nuevo entre los dos anclajes
    finales, x = [], 0.0
    for a, b in hablado:
        x += b - a
        finales.append(x)
    cortes = [i for i, t in enumerate(toks) if re.search(r"[.:;…?!]$", t)]
    if not cortes or cortes[-1] != len(toks) - 1:
        cortes.append(len(toks) - 1)
    tiempos, desde_i, desde_x = [None] * len(toks), 0, 0.0
    for c in cortes:
        hasta_x = min(finales, key=lambda f: abs(f - bruto[c][1])) if c != len(toks) - 1 else total_habla
        if hasta_x <= desde_x:
            hasta_x = bruto[c][1]
        grupo = range(desde_i, c + 1)
        sp = sum(pesos[i] for i in grupo)
        y = desde_x
        for i in grupo:
            d_ = (hasta_x - desde_x) * pesos[i] / sp
            tiempos[i] = (y, y + d_)
            y += d_
        desde_i, desde_x = c + 1, hasta_x

    palabras = []
    for t, (x0, x1) in zip(toks, tiempos):
        palabras.append({"texto": t, "inicio": round(a_tiempo(x0 + 0.001), 2), "fin": round(a_tiempo(x1), 2),
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
