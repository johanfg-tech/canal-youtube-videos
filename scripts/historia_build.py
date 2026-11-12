#!/usr/bin/env python3
"""Monta una historia animada: voz + plan de planos -> guiones/<dir>/<k>.json y src/explica/historias.ts
    python3 scripts/historia_build.py guiones/s16/cocacola
Necesita <base>.txt, <base>.voz.txt, <base>.plan.json y public/narraciones/<k>.mp3."""
import json, os, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = os.path.join(R, sys.argv[1]); k = os.path.basename(base)
tmp = base + ".tiempos.json"
subprocess.run([sys.executable, os.path.join(R, "scripts", "tiempos2.py"), os.path.join(R, "public", "narraciones", k + ".mp3"),
                base + ".txt", base + ".voz.txt", tmp], check=True)
t = json.load(open(tmp)); os.remove(tmp)
fr = t["frases"]; plan = json.load(open(base + ".plan.json"))
ini = lambda i: max(0.0, fr[i]["inicio"] - 0.12)
rem = ini(plan["remate"]["frase"])
planos = []
P = plan["planos"]
for i, p in enumerate(P):
    a = 0.0 if i == 0 else ini(p["frase"])
    b = ini(P[i + 1]["frase"]) if i + 1 < len(P) else t["duracion"] + 2.6
    n = (b - a) * 30 + 8
    desde = p.get("desde", 0)
    if "ancla" in p:
        desde = max(desde, round(p["ancla"]["frame"] - (fr[p["ancla"]["frase"]]["inicio"] - a) * 30))
    disp = p["frames"] - desde
    ritmo = max(0.5, min(1.0, disp / n))
    planos.append({"src": p["src"], "inicio": round(a, 2), "fin": round(b, 2), "desde": int(desde), "ritmo": round(ritmo, 3)})
rot = [{"inicio": round(ini(r["frase"]) + r.get("mas", 0.2), 2), "dur": r.get("dur", 2.6), **{x: r[x] for x in ("arriba", "abajo", "color", "top") if x in r}} for r in plan["rotulos"]]
d = {"voz": f"narraciones/{k}.mp3", "palabras": t["palabras"], "duracion": t["duracion"], "planos": planos, "rotulos": rot,
     "remate": {"inicio": round(rem, 2), "pregunta": plan["remate"]["pregunta"]}}
if "grafico" in plan:
    g = plan["grafico"]; gi = ini(g["frase"]); gf = ini(g["hasta"])
    d["grafico"] = {"inicio": round(gi, 2), "fin": round(gf, 2), "titulo": g["titulo"],
                    "barras": [{**{x: b[x] for x in ("etiqueta", "valor", "texto", "color") if x in b}, "en": round(max(0.3, fr[b["frase"]]["inicio"] - gi + b.get("mas", 0.3)), 2)} for b in g["barras"]]}
json.dump(d, open(base + ".json", "w"), ensure_ascii=False, indent=1)
for p in planos: print(p)
hs = sorted(set([os.path.relpath(base, R)] + [l.split('"')[1] for l in open(os.path.join(R, "src/explica/historias.ts")).read().split("\n") if l.startswith("// h ")] if os.path.exists(os.path.join(R, "src/explica/historias.ts")) else [os.path.relpath(base, R)]))
L = ["// Generado por scripts/historia_build.py", 'import { DatosHistoria } from "../compositions/HistoriaCineShort";']
for i, h in enumerate(hs): L += [f'// h "{h}"', f'import h{i} from "../../{h}.json";']
L.append("export const HISTORIAS: { id: string; datos: DatosHistoria }[] = [")
for i, h in enumerate(hs): L.append(f'  {{ id: "H-{os.path.basename(h)}", datos: h{i} as unknown as DatosHistoria }},')
L.append("];\n")
open(os.path.join(R, "src/explica/historias.ts"), "w").write("\n".join(L))
