import React, { useState } from "react";
import {
  PREMIOS,
  premioPorId,
  totalRestante,
  deshacerUltimo,
  reiniciarContador,
  reiniciarTodo,
} from "./premios";
import "./MenuOculto.css";

// Panel para el staff. Se abre con 3 toques rápidos en el logo.
// Las acciones destructivas piden un segundo toque para confirmar.
function MenuOculto({ estado, setEstado, onCerrar }) {
  const [confirmando, setConfirmando] = useState(null);

  const accion = (clave, fn) => () => {
    if (confirmando !== clave) {
      setConfirmando(clave);
      return;
    }
    setEstado(fn(estado));
    setConfirmando(null);
  };

  const cambiarTiroFirmada = (delta) =>
    setEstado({ ...estado, tiroFirmada: Math.max(1, estado.tiroFirmada + delta) });

  const ultimo = estado.historial[estado.historial.length - 1];
  const firmadaEntregada = estado.stock.firmada === 0;

  return (
    <div className="Menu-fondo" onClick={onCerrar}>
      <div className="Menu glass" onClick={(e) => e.stopPropagation()}>
        <div className="Menu-titulo">Panel de control</div>

        <div className="Menu-contador">
          <div>
            <span className="Menu-num">{estado.entregados}</span>
            <span className="Menu-label">premios entregados</span>
          </div>
          <div>
            <span className="Menu-num">{estado.entregados + 1}</span>
            <span className="Menu-label">próximo tiro</span>
          </div>
          <div>
            <span className="Menu-num">{estado.giros}</span>
            <span className="Menu-label">giros totales</span>
          </div>
        </div>

        <div className="Menu-firmada">
          <span>Gorra firmada en el tiro N°</span>
          <button onClick={() => cambiarTiroFirmada(-1)}>−</button>
          <strong>{estado.tiroFirmada}</strong>
          <button onClick={() => cambiarTiroFirmada(1)}>+</button>
          <em className={firmadaEntregada ? "ok" : ""}>
            {firmadaEntregada ? "ENTREGADA" : "pendiente"}
          </em>
        </div>

        <table className="Menu-stock">
          <thead>
            <tr>
              <th>Premio</th>
              <th>Quedan</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {PREMIOS.map((p) => (
              <tr key={p.id} className={estado.stock[p.id] === 0 ? "agotado" : ""}>
                <td>
                  {p.titulo} {p.detalle}
                </td>
                <td>{estado.stock[p.id]}</td>
                <td>{p.cantidad}</td>
              </tr>
            ))}
            <tr className="total">
              <td>TOTAL</td>
              <td>{totalRestante(estado)}</td>
              <td>{PREMIOS.reduce((a, p) => a + p.cantidad, 0)}</td>
            </tr>
          </tbody>
        </table>

        <div className="Menu-acciones">
          <button
            className={confirmando === "contador" ? "confirmar" : ""}
            onClick={accion("contador", reiniciarContador)}
          >
            {confirmando === "contador" ? "Tocá de nuevo para confirmar" : "Reiniciar contador"}
          </button>
          <button
            disabled={!ultimo}
            className={confirmando === "deshacer" ? "confirmar" : ""}
            onClick={accion("deshacer", deshacerUltimo)}
          >
            {confirmando === "deshacer"
              ? "Tocá de nuevo para confirmar"
              : ultimo
              ? `Deshacer último (N° ${ultimo.n}: ${premioPorId(ultimo.id).titulo} ${premioPorId(ultimo.id).detalle})`
              : "Deshacer último premio"}
          </button>
          <button
            className={`peligro ${confirmando === "todo" ? "confirmar" : ""}`}
            onClick={accion("todo", reiniciarTodo)}
          >
            {confirmando === "todo"
              ? "Tocá de nuevo: vuelve todo a cero y repone el stock"
              : "Reiniciar contador y stock"}
          </button>
          <button className="cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuOculto;
