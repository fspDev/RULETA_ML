import React, { useRef } from "react";
import marca from "./images/logo-marca.png";

// Logo original (marca Mercado Libre, píxeles intactos) con "HOY SE PIDE"
// en el lugar exacto donde iba "PEDÍ COMIDA": mismo ancho, alto de letra y color.
// Tres toques rápidos abren el menú oculto.
function Logo({ className = "", onTripleTap }) {
  const toques = useRef([]);

  const tocar = () => {
    const ahora = Date.now();
    toques.current = [...toques.current.filter((t) => ahora - t < 900), ahora];
    if (toques.current.length >= 3) {
      toques.current = [];
      if (onTripleTap) onTripleTap();
    }
  };

  return (
    <svg
      className={`Logo ${className}`}
      viewBox="0 0 1931 894"
      role="img"
      aria-label="Mercado Libre — Hoy se pide"
      onClick={tocar}
    >
      <image href={marca} x="0" y="0" width="1931" height="489" />
      <text
        x="0"
        y="890"
        textLength="1926"
        lengthAdjust="spacingAndGlyphs"
        fill="#2a2a29"
        fontFamily="Montserrat, Arial, sans-serif"
        fontWeight="700"
        fontSize="297"
      >
        HOY SE PIDE
      </text>
    </svg>
  );
}

export default Logo;
