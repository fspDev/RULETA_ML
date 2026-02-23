import React, { useState, useRef } from "react";

import "./Ruleta.css"; // Importa el archivo de estilos CSS
import centro from "./images/centro.png";
import ruleta from "./images/ruleta.png"; // Importa la imagen de la ruleta

function Ruleta() {
  // Estado para controlar la visibilidad de la imagen y el número de la casilla
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [numeroCasilla] = useState(null);

  // Estado para controlar el premio actual
  const [premio, setPremio] = useState("Suerte!");

  // Estado para controlar la rotación de la ruleta
  const [rotation, setRotation] = useState(0);

  // Referencia para acceder al elemento de la barra de girar
  const barraRef = useRef(null);

  // Función para realizar la rotación de la ruleta
  const girar = () => {
    const nuevaRotacion = Math.floor(Math.random() * 210) + 340;
    setRotation((prevRotation) => prevRotation + 2 * nuevaRotacion);
  };

  // Función ejecutada al finalizar la animación de la ruleta
  const final = () => {
    const grados = ((rotation % 360) + 360) % 360;
    let nuevoPremio = "";

    // Determinar el premio según el rango de grados
    if (grados >= 0 && grados <= 44) {
      nuevoPremio = "¡GANASTE!";
    } else if (grados >= 45 && grados <= 89) {
      nuevoPremio = "OTRA OPORTUNIDAD";
    } else if (grados >= 90 && grados <= 134) {
      nuevoPremio = "GRACIAS POR PARTICIPAR";
    } else if (grados >= 135 && grados <= 179) {
      nuevoPremio = "TIRÁ DE NUEVO";
    } else if (grados >= 180 && grados <= 224) {
      nuevoPremio = "¡GANASTE!";
    } else if (grados >= 225 && grados <= 269) {
      nuevoPremio = "OTRA OPORTUNIDAD";
    } else if (grados >= 270 && grados <= 314) {
      nuevoPremio = "GRACIAS POR PARTICIPAR";
    } else if (grados >= 315 && grados <= 359) {
      nuevoPremio = "TIRÁ DE NUEVO";
    }

    // Actualizar el premio
    setPremio(nuevoPremio);

    // Restaurar el texto de "Suerte!" después de 3 segundos
    setTimeout(() => {
      setPremio("SUERTE!");
    }, 2000);
  };

  // Función para manejar el evento de clic en el botón de girar
  const lanzar = () => {
    setMostrarImagen(false);
    girar();
  };

  // Función para manejar el evento de clic en el botón de regresar
  const handleRegresar = () => {
    window.location.href = "./index.html"; // Usa una ruta relativa para regresar
  };

  return (
    <div className="plafon">
      {/* Elemento de la ruleta */}
      <div
        className="ruleta"
        style={{
          backgroundImage: `url(${ruleta})`, // Aquí se referencia la imagen de la ruleta
          transform: `rotate(${rotation}deg)`,
          transition: "transform 4s cubic-bezier(0.2, 1.2, 1.0, 0.99)",
          filter: mostrarImagen ? "blur(5px)" : "none",
        }}
        onTransitionEnd={final}
      ></div>

      {/* Contenedor de la imagen de la casilla */}
      <div className="imagen-casilla-container">
        {/* Mostrar la imagen de la casilla si está activa */}
        {mostrarImagen && numeroCasilla && (
          <div className="imagen-casilla">
            <img
              src={`./${numeroCasilla}.png`}
              alt={`Casilla ${numeroCasilla}`}
            />
          </div>
        )}
      </div>

      {/* Elemento para mostrar el premio actual */}
      <div className="premio">{premio}</div>

      {/* Barra inferior con los botones de girar y regresar */}
      <div className="barraInferior">
        <button className="BotonGirar" onClick={lanzar}>
          Girar
        </button>
        <button className="BotonRegresar" onClick={handleRegresar}>
          Regresar
        </button>
      </div>

      {/* Elemento central con imagen */}
      <div className="central">
        <img
          src={centro}
          alt="centro"
          style={{ filter: mostrarImagen ? "blur(5px)" : "none" }}
        />
      </div>
    </div>
  );
}

export default Ruleta;
