import React, { useRef } from "react";
import marca from "./images/logo-marca.png";
import { HoySePideTrazos, encajarHoySePide } from "./HoySePide";

// Logo original (marca Mercado Libre, píxeles intactos) con "HOY SE PIDE" vectorial
// en el lugar donde iba "PEDÍ COMIDA": mismo ancho que la marca y mismo color.
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
      {/* Letras de 0 a 1926 de ancho, con la base en y≈890 como el texto anterior */}
      <HoySePideTrazos fill="#2a2a29" transform={encajarHoySePide(0, 675, 1926)} />
    </svg>
  );
}

export default Logo;
