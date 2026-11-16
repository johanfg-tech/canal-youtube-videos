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

    # Cada frase termina en una pausa: reparte los tramos de voz entre las frases (contiguos) para que
    # la duración de cada una se parezca lo más posible a su peso. Así el resaltado no se adelanta.
    n, m = len(fh), len(habl)
    esperado = [w / tot * total_voz for w in pesos]
    dur_t = [b - a for a, b in habl]
    if m >= n:
        INF = float("inf")
        coste = [[INF] * (m + 1) for _ in range(n + 1)]
        de = [[0] * (m + 1) for _ in range(n + 1)]
        coste[0][0] = 0.0
        for i in range(1, n + 1):
            for j in range(i, m - (n - i) + 1):
                for k in range(i - 1, j):
                    if coste[i - 1][k] == INF:
                        continue
                    c = coste[i - 1][k] + (sum(dur_t[k:j]) - esperado[i - 1]) ** 2
                    if c < coste[i][j]:
                        coste[i][j], de[i][j] = c, k
        grupos, j = [], m
        for i in range(n, 0, -1):
            k = de[i][j]
            grupos.append(habl[k:j])
            j = k
        grupos.reverse()
    else:  # menos pausas que frases: reparto proporcional sobre toda la voz
        grupos = None

    def a_tiempo(v, tr):
        for a, b in tr:
            if v <= b - a:
                return a + v
            v -= b - a
        return tr[-1][1]

    palabras, lista_frases, acum = [], [], 0.0
    for idx, (sp, sh, w) in enumerate(zip(fp, fh, pesos)):
        if grupos:
            tr = grupos[idx]
            v0, v1 = 0.0, sum(b - a for a, b in tr)
        else:
            tr = habl
            v0, v1 = acum / tot * total_voz, (acum + w) / tot * total_voz
        t0, t1 = a_tiempo(v0 + 0.001, tr), a_tiempo(v1, tr)
        lista_frases.append({"texto": sp, "inicio": round(t0, 2), "fin": round(t1, 2)})
        toks = sp.split()
        wt = [len(re.sub(r"[^\w]", "", x)) + 2 + (6 if re.search(r"\d", x) else 0) for x in toks]
        s = sum(wt)
        c = 0.0
        for i, (tok, ww) in enumerate(zip(toks, wt)):
            a = a_tiempo(v0 + (v1 - v0) * c / s + 0.001, tr)
            c += ww
            b = a_tiempo(v0 + (v1 - v0) * c / s, tr)
            palabras.append({"texto": tok, "inicio": round(a, 2), "fin": round(b, 2), "corte": i == len(toks) - 1})
        acum += w
    json.dump({"palabras": palabras, "frases": lista_frases, "duracion": round(dur, 2)},
              open(salida, "w"), ensure_ascii=False, indent=1)
    for i, fr in enumerate(lista_frases):
        print(f"{i:2d} {fr['inicio']:6.2f} {fr['texto'][:70]}")


if __name__ == "__main__":
    main()
