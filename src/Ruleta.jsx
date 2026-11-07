import React, { useState, useRef, useEffect, useCallback } from "react";

import "./Ruleta.css";
import centro from "./images/centro.png";
import ruleta from "./images/ruleta.png";
import PremioOverlay from "./PremioOverlay";
import ColapintoOverlay from "./ColapintoOverlay";
import { HoySePideTrazos, encajarHoySePide } from "./HoySePide";
import { PROB_REPETIR, elegirPremio, registrarTiro } from "./premios";

// La imagen de la ruleta (2160x2160) trae "HOY SE PIDE" rasterizado en los dos sectores
// de Mercado Libre. Se tapa con el amarillo del sector y se dibuja el texto vectorial
// en el mismo lugar. Medidas tomadas con el sector girado a horizontal (+22.5°).
function SectorHoySePide({ angulo }) {
  return (
    <g transform={`rotate(${angulo} 1080 1080)`}>
      <rect x="905" y="288" width="404" height="64" fill="#ffe700" />
      <HoySePideTrazos fill="#2d3075" transform={encajarHoySePide(915, 298, 384)} />
    </g>
  );
}

// Sectores de la imagen de la ruleta, en sentido horario desde las 12, 45° cada uno.
// El indicador (gota del centro) apunta hacia arriba.
const SECTORES = ["tira", "gracias", "otra", "ml", "tira", "gracias", "otra", "ml"];

const TEXTOS = {
  tira: "¡TIRÁ DE NUEVO!",
  otra: "¡OTRA OPORTUNIDAD!",
  gracias: "¡GRACIAS POR PARTICIPAR!",
};

const DURACION_GIRO = 7000; // ms

// Calcula la rotación necesaria para que el indicador caiga dentro del sector pedido.
function rotacionHacia(tipo, actual) {
  const opciones = SECTORES.map((s, i) => (s === tipo ? i : -1)).filter((i) => i >= 0);
  const i = opciones[Math.floor(Math.random() * opciones.length)];
  const angulo = i * 45 + 22.5 + (Math.random() * 2 - 1) * 18; // sin caer en el borde
  const objetivo = (360 - angulo) % 360;
  const delta = (objetivo - (actual % 360) + 360) % 360;
  const vueltas = 6 + Math.floor(Math.random() * 3);
  return actual + vueltas * 360 + delta;
}

function Ruleta({ estado, setEstado, onRegresar, bloqueado }) {
  const [rotation, setRotation] = useState(0);
  const [girando, setGirando] = useState(false);
  const [mensaje, setMensaje] = useState("¡SUERTE!");
  const [destacar, setDestacar] = useState(false);
  const [premio, setPremio] = useState(null); // id del premio ganado
  const repeticiones = useRef(0); // "tirá de nuevo" seguidos de la misma persona
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const girar = useCallback(() => {
    if (girando || premio || bloqueado) return;

    let tipo;
    let idPremio = null;
    const p = PROB_REPETIR[Math.min(repeticiones.current, PROB_REPETIR.length - 1)];
    if (Math.random() < p) {
      tipo = Math.random() < 0.5 ? "tira" : "otra";
    } else {
      idPremio = elegirPremio(estado);
      tipo = idPremio ? "ml" : "gracias"; // termina el turno sin premio
    }

    setGirando(true);
    setDestacar(false);
    setMensaje("¡SUERTE!");
    setRotation((r) => rotacionHacia(tipo, r));
    setEstado((e) => ({ ...e, giros: e.giros + 1 }));

    timer.current = setTimeout(() => {
      setGirando(false);
      if (tipo === "ml") {
        repeticiones.current = 0;
        setEstado((e) => registrarTiro(e, idPremio));
        setPremio(idPremio);
      } else if (tipo === "gracias") {
        repeticiones.current = 0;
        setEstado((e) => registrarTiro(e, null));
        setMensaje(TEXTOS.gracias);
        setDestacar(true);
      } else {
        repeticiones.current += 1;
        setMensaje(TEXTOS[tipo]);
        setDestacar(true);
      }
    }, DURACION_GIRO + 200);
  }, [girando, premio, bloqueado, estado, setEstado]);

  // Barra espaciadora o Enter también giran (útil con teclado o control remoto).
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        girar();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [girar]);

  const cerrarPremio = useCallback(() => {
    setPremio(null);
    setMensaje("¡SUERTE!");
    setDestacar(false);
  }, []);

  return (
    <div className="Pantalla Pantalla-ruleta">
      <div className="Ruleta-rueda">
        <div className="Ruleta-aro" />
        <div
          className="Ruleta-imagen"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${DURACION_GIRO}ms cubic-bezier(0.12, 0.72, 0.12, 1)`,
          }}
        >
          <svg viewBox="0 0 2160 2160" aria-hidden="true">
            <image href={ruleta} x="0" y="0" width="2160" height="2160" />
            <SectorHoySePide angulo={-22.5} />
            <SectorHoySePide angulo={157.5} />
          </svg>
        </div>
        <img className="Ruleta-centro" src={centro} alt="" draggable="false" />
      </div>

      <div
        className={`Ruleta-mensaje glass ${destacar ? "destacar" : ""} ${mensaje.length > 20 ? "largo" : ""}`}
        key={mensaje + destacar}
      >
        {mensaje}
      </div>

      <div className="Ruleta-botones">
        <button className="Boton Boton-girar glass" onClick={girar} disabled={girando || !!premio}>
          {girando ? "GIRANDO…" : "GIRAR"}
        </button>
        <button className="Boton Boton-regresar glass" onClick={onRegresar} disabled={girando}>
          REGRESAR
        </button>
      </div>

      {premio === "firmada" && <ColapintoOverlay onCerrar={cerrarPremio} />}
      {premio && premio !== "firmada" && <PremioOverlay id={premio} onCerrar={cerrarPremio} />}
    </div>
  );
}

export default Ruleta;
