import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { theme } from "../theme";
import { AMARILLO, texto } from "../components/historia/kit";

// Portada vertical (1080x1920) para Reels de Instagram/Facebook. Se exporta con `npx remotion still`.
// Todo lo importante va dentro de la franja central 3:4 (y 240-1680), que es lo que se ve en la cuadrícula del perfil.

export const portadaSchema = z.object({
  lineas: z.array(z.string()),
  resaltar: z.string(),
  imgs: z.array(z.string()),
  foto: z.string().optional(),
  color: z.string().optional(),
});

export const Portada: React.FC<z.infer<typeof portadaSchema>> = ({ lineas, resaltar, imgs, foto, color }) => {
  const tono = color ?? "rgba(255,77,109,0.45)";
  const dos = imgs.length > 1;
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      {foto ? (
        <>
          <Img src={staticFile(foto)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,17,21,0.95) 0%, rgba(15,17,21,0.6) 40%, rgba(15,17,21,0.45) 65%, rgba(15,17,21,0.9) 100%)" }} />
        </>
      ) : (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, ${tono}, transparent 55%), radial-gradient(circle at 15% 15%, rgba(60,90,255,0.25), transparent 40%)` }} />
      )}

      {/* Título arriba, dentro de la zona segura */}
      <div style={{ position: "absolute", top: 300, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {lineas.map((l, i) => {
          const partes = l.split(resaltar);
          return (
            <div key={i} style={{ ...texto(Math.min(128, Math.floor(880 / (l.length * 0.62)))), whiteSpace: "nowrap", textShadow: "0 10px 40px rgba(0,0,0,0.7)", textTransform: "uppercase" }}>
              {partes.length > 1 ? (
                <>
                  {partes[0]}
                  <span style={{ background: AMARILLO, color: "#111", borderRadius: 18, padding: "0 20px", textShadow: "none", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{resaltar}</span>
                  {partes[1]}
                </>
              ) : l}
            </div>
          );
        })}
      </div>

      {/* Imagen principal */}
      {imgs.length > 0 && (
        <div style={{ position: "absolute", top: 760, bottom: 380, left: 40, right: 40, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
          {imgs.map((s, i) => (
            <Img
              key={i}
              src={staticFile(s)}
              style={{
                width: dos ? 480 : 760, height: dos ? 600 : 760, objectFit: "contain",
                transform: dos ? `rotate(${i ? 7 : -7}deg)` : "none",
                filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.6))",
              }}
            />
          ))}
        </div>
      )}

      {/* Marca */}
      <div style={{ position: "absolute", bottom: 270, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 36px", borderRadius: 999, background: theme.accent, ...texto(34, "#fff"), letterSpacing: 6 }}>CUENTAS CLARAS</div>
      </div>
    </AbsoluteFill>
  );
};
