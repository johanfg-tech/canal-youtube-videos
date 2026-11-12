#!/usr/bin/env python3
"""Pone el "inicio" de cada escena según la frase de la narración donde empieza.

    python3 scripts/anclar.py guiones/x.json

Cada escena lleva "en": las primeras palabras de la frase (tal como están en el .txt).
Necesita "palabras" en el guion (scripts/tiempos.py). La primera escena empieza en 0.
"""
import json, re, sys


def norm(t):
    return re.sub(r"[^\w%]", "", t.lower())


def main():
    ruta = sys.argv[1]
    d = json.load(open(ruta, encoding="utf-8"))
    pal = [norm(p["texto"].replace(" ", " ").split(" ")[0]) for p in d["palabras"]]
    desde = 0
    for i, e in enumerate(d["escenas"]):
        busca = [norm(w) for w in e["en"].split()]
        for j in range(desde, len(pal) - len(busca) + 1):
            if pal[j:j + len(busca)] == busca:
                e["inicio"] = 0 if i == 0 else round(d["palabras"][j]["inicio"] - 0.15, 2)
                desde = j + 1
                break
        else:
            sys.exit(f"No encuentro la escena {i + 1}: {e['en']!r}")
        print(f"{e['inicio']:7.2f}  {e['tipo']:9} {e['en']}")
    open(ruta, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
