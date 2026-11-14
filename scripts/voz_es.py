"""Convierte un guion a versión para la voz: números escritos en letras (español).
Uso: python3 scripts/voz_es.py guion.txt > guion.voz.txt"""
import re, sys

U = "cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve".split()
D = {3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa"}
C = {1: "ciento", 2: "doscientos", 3: "trescientos", 4: "cuatrocientos", 5: "quinientos", 6: "seiscientos", 7: "setecientos", 8: "ochocientos", 9: "novecientos"}

def menor_mil(n):
    if n < 30: return U[n]
    if n < 100:
        d, u = divmod(n, 10)
        return D[d] + ("" if u == 0 else " y " + U[u])
    if n == 100: return "cien"
    c, r = divmod(n, 100)
    return C[c] + ("" if r == 0 else " " + menor_mil(r))

def letras(n):
    if n < 1000: return menor_mil(n)
    if n < 1_000_000:
        m, r = divmod(n, 1000)
        pre = "mil" if m == 1 else menor_mil(m).replace("uno", "un").replace("veintiún", "veintiún") + " mil"
        return pre + ("" if r == 0 else " " + menor_mil(r))
    mi, r = divmod(n, 1_000_000)
    pre = "un millón" if mi == 1 else letras(mi).replace("uno", "un") + " millones"
    return pre + ("" if r == 0 else " " + letras(r))

def convertir(t):
    t = t.replace(" por ciento", " por ciento")
    return re.sub(r"\d{1,3}(?:\.\d{3})+|\d+", lambda m: letras(int(m.group().replace(".", ""))), t)

if __name__ == "__main__":
    sys.stdout.write(convertir(open(sys.argv[1], encoding="utf-8").read()))
