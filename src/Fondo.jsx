import React, { useEffect, useState } from "react";
import fondo1 from "./images/fondo1.jpg";
import fondo2 from "./images/fondo2.jpg";

const FONDOS = [fondo1, fondo2];
const INTERVALO = 10000; // ms entre cambios de fondo

// Fondo de la app: alterna entre las dos imágenes con un fundido suave.
function Fondo() {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActivo((a) => (a + 1) % FONDOS.length), INTERVALO);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="Fondo" aria-hidden="true">
      {FONDOS.map((src, i) => (
        <div
          key={src}
          className={`Fondo-capa ${i === activo ? "activo" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}

export default Fondo;
