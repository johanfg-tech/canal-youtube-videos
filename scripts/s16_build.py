#!/usr/bin/env python3
"""Prepara un Short explicativo de la semana 16: tiempos + escenas -> guiones/s16/<k>.json y registro.
    python3 scripts/s16_build.py oro-mundo [otro ...]"""
import json, os, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(R, "guiones", "s16")
for k in sys.argv[1:]:
    tmp = os.path.join(G, f"{k}.tiempos.json")
    subprocess.run([sys.executable, os.path.join(R, "scripts", "tiempos2.py"), os.path.join(R, "public", "narraciones", f"{k}.mp3"),
                    os.path.join(G, f"{k}.txt"), os.path.join(G, f"{k}.voz.txt"), tmp], check=True)
    d = json.load(open(tmp))
    d["voz"] = f"narraciones/{k}.mp3"
    esc = json.load(open(os.path.join(G, f"{k}.escenas.json")))
    for e in esc:  # "enFrase" en items de lista -> segundos desde el inicio de la escena
        for it in e.get("items", []):
            if "enFrase" in it:
                it["en"] = round(d["frases"][it.pop("enFrase")]["inicio"] - d["frases"][e["frase"]]["inicio"] + it.pop("mas", 0), 2)
    d["escenas"] = esc
    json.dump(d, open(os.path.join(G, f"{k}.json"), "w"), ensure_ascii=False, indent=1)
    os.remove(tmp)
ks = sorted(f[:-13] for f in os.listdir(G) if f.endswith(".escenas.json") and os.path.exists(os.path.join(G, f[:-13] + ".json")))
lines = ['// Generado por scripts/s16_build.py: Shorts explicativos de la semana 16-22 nov.', 'import { DatosExplica } from "../compositions/ExplicaShort";']
for i, k in enumerate(ks):
    lines.append(f'import v{i} from "../../guiones/s16/{k}.json";')
lines.append("export const VIDEOS_S16: { id: string; datos: DatosExplica }[] = [")
for i, k in enumerate(ks):
    lines.append(f'  {{ id: "S16-{k}", datos: v{i} as unknown as DatosExplica }},')
lines.append("];\n")
os.makedirs(os.path.join(R, "src", "explica"), exist_ok=True)
open(os.path.join(R, "src", "explica", "videos.ts"), "w").write("\n".join(lines))
print("registro:", ks)
