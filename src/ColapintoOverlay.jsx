import React, { useEffect, useMemo, useState } from "react";
import colapinto1 from "./images/colapinto1.png";
import colapinto2 from "./images/colapinto2.png";
import Logo from "./Logo";
import "./Overlays.css";

const RAYAS_COLORES = ["rgba(255,255,255,0.9)", "rgba(94,200,255,0.9)", "rgba(255,90,174,0.85)"];

// Pantalla especial del tiro de la gorra firmada.
// Las dos imágenes pasan alternadas a toda velocidad, con líneas de velocidad y flashes.
// No se cierra sola: el staff la cierra tocando después de entregar el premio.
function ColapintoOverlay({ onCerrar }) {
  const [puedeCerrar, setPuedeCerrar] = useState(false);

  const rayas = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        top: Math.random() * 100,
        ancho: 18 + Math.random() * 40,
        alto: 0.15 + Math.random() * 0.45,
        dur: 0.35 + Math.random() * 0.5,
        delay: -Math.random() * 1,
        color: RAYAS_COLORES[i % RAYAS_COLORES.length],
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setPuedeCerrar(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!puedeCerrar) return;
    const onKey = (e) => {
      if (e.code === "Enter" || e.code === "Space" || e.code === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [puedeCerrar, onCerrar]);

  return (
    <div className="Overlay Overlay-colapinto" onClick={puedeCerrar ? onCerrar : undefined}>
      <div className="Velocidad" aria-hidden="true">
        {rayas.map((r, i) => (
          <span
            key={i}
            style={{
              top: `${r.top}%`,
              width: `${r.ancho}%`,
              height: `calc(var(--u) * ${r.alto})`,
              animationDuration: `${r.dur}s`,
              animationDelay: `${r.delay}s`,
              background: `linear-gradient(90deg, transparent, ${r.color})`,
            }}
          />
        ))}
      </div>
      <div className="Cuadros Cuadros-arriba" aria-hidden="true" />
      <div className="Cuadros Cuadros-abajo" aria-hidden="true" />

      <div className="Flash" aria-hidden="true" />

      <div className="Colapinto-logo Logo-caja">
        <Logo />
      </div>

      <div className="Colapinto-escena" aria-hidden="true">
        <img className="Colapinto-img Colapinto-img-1" src={colapinto1} alt="" />
        <img className="Colapinto-img Colapinto-img-2" src={colapinto2} alt="" />
      </div>

      <div className="Colapinto-tarjeta glass">
        <div className="Colapinto-felicidades">¡FELICIDADES!</div>
        <div className="Colapinto-texto">
          GANASTE LA GORRA
          <br />
          FIRMADA POR
        </div>
        <div className="Colapinto-nombre">FRANCO COLAPINTO</div>
      </div>

      {puedeCerrar && <div className="Overlay-hint">Tocá para continuar</div>}
    </div>
  );
}

export default ColapintoOverlay;
