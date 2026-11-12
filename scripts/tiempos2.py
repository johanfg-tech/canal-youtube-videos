#!/usr/bin/env python3
"""Tiempos de palabras y frases a partir de la voz, con texto de pantalla y texto hablado en paralelo.

    python3 scripts/tiempos2.py voz.mp3 pantalla.txt hablado.txt salida.json

pantalla.txt usa cifras ("216.000"), hablado.txt las mismas frases con los números en letra.
Ambos deben tener las mismas frases (mismo número de . ? !). El peso de cada frase sale del texto
hablado; los tramos de voz se detectan por silencios. Escribe "palabras" (texto de pantalla),
"frases" (inicio/fin de cada frase) y "duracion".
"""
import json, re, sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from tiempos import tramos  # noqa: E402


def frases(t):
    t = re.sub(r"\s+", " ", t.strip())
    partes = re.split(r"(?<=[.?!])\s+", t)
    return [p.strip() for p in partes if p.strip()]


def peso_hablado(s):
    return len(re.sub(r"[^\w]", "", s)) + 1.8 * len(s.split()) + 4  # letras + pausas entre palabras + pausa final


def main():
    mp3, pantalla, hablado, salida = sys.argv[1:5]
    fp, fh = frases(open(pantalla).read()), frases(open(hablado).read())
    if len(fp) != len(fh):
        sys.exit(f"Frases distintas: pantalla {len(fp)} / hablado {len(fh)}")
    dur, habl = tramos(mp3)
    total_voz = sum(b - a for a, b in habl)
    pesos = [peso_hablado(s) for s in fh]
    tot = sum(pesos)

    # convierte "segundos de voz acumulados" en tiempo real saltando silencios
    def a_tiempo(v):
        for a, b in habl:
            if v <= b - a:
                return a + v
            v -= b - a
        return habl[-1][1]

    palabras, lista_frases, acum = [], [], 0.0
    for sp, sh, w in zip(fp, fh, pesos):
        v0, v1 = acum / tot * total_voz, (acum + w) / tot * total_voz
        t0, t1 = a_tiempo(v0 + 0.001), a_tiempo(v1)
        lista_frases.append({"texto": sp, "inicio": round(t0, 2), "fin": round(t1, 2)})
        toks = sp.split()
        wt = [len(re.sub(r"[^\w]", "", x)) + 2 + (6 if re.search(r"\d", x) else 0) for x in toks]
        s = sum(wt)
        c = 0.0
        for i, (tok, ww) in enumerate(zip(toks, wt)):
            a = a_tiempo(v0 + (v1 - v0) * c / s + 0.001)
            c += ww
            b = a_tiempo(v0 + (v1 - v0) * c / s)
            palabras.append({"texto": tok, "inicio": round(a, 2), "fin": round(b, 2), "corte": i == len(toks) - 1})
        acum += w
    json.dump({"palabras": palabras, "frases": lista_frases, "duracion": round(dur, 2)},
              open(salida, "w"), ensure_ascii=False, indent=1)
    for i, fr in enumerate(lista_frases):
        print(f"{i:2d} {fr['inicio']:6.2f} {fr['texto'][:70]}")


if __name__ == "__main__":
    main()
