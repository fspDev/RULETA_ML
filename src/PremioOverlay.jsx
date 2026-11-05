import React, { useEffect, useMemo } from "react";
import { premioPorId } from "./premios";
import "./Overlays.css";

const COLORES = ["#ffe600", "#2D3277", "#ffffff", "#3483fa", "#ffe600"];

// Pantalla de premio común. Se cierra tocando o sola a los 15 segundos.
function PremioOverlay({ id, onCerrar }) {
  const premio = premioPorId(id);

  useEffect(() => {
    const t = setTimeout(onCerrar, 15000);
    const onKey = (e) => {
      if (e.code === "Enter" || e.code === "Space" || e.code === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onCerrar]);

  const confeti = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 3 + Math.random() * 3,
        size: 0.8 + Math.random() * 1.4,
        color: COLORES[i % COLORES.length],
        giro: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="Overlay Overlay-premio" onClick={onCerrar}>
      <div className="Confeti" aria-hidden="true">
        {confeti.map((c, i) => (
          <span
            key={i}
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
              width: `calc(var(--u) * ${c.size})`,
              height: `calc(var(--u) * ${c.size * 1.8})`,
              background: c.color,
              transform: `rotate(${c.giro}deg)`,
            }}
          />
        ))}
      </div>
      <div className="Premio-tarjeta glass">
        <div className="Premio-felicidades">¡FELICIDADES!</div>
        <div className="Premio-ganaste">GANASTE</div>
        <div className="Premio-titulo">{premio.titulo}</div>
        {premio.detalle && <div className="Premio-detalle">{premio.detalle}</div>}
      </div>
    </div>
  );
}

export default PremioOverlay;
