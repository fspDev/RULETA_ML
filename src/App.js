import React, { useEffect, useState } from "react";
import "./App.css";
import Ruleta from "./Ruleta";
import Logo from "./Logo";
import Fondo from "./Fondo";
import MenuOculto from "./MenuOculto";
import { cargarEstado, guardarEstado } from "./premios";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [estado, setEstado] = useState(cargarEstado);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    guardarEstado(estado);
  }, [estado]);

  const abrirMenu = () => setMenuAbierto(true);

  return (
    <div className="App">
      <Fondo />

      {currentPage === "ruleta" ? (
        <Ruleta
          estado={estado}
          setEstado={setEstado}
          onRegresar={() => setCurrentPage("home")}
          bloqueado={menuAbierto}
        />
      ) : (
        <div className="Pantalla App-home">
          <div className="App-logo Logo-caja">
            <Logo onTripleTap={abrirMenu} />
          </div>
          <button className="Boton Boton-girar glass" onClick={() => setCurrentPage("ruleta")}>
            RULETA
          </button>
        </div>
      )}

      {menuAbierto && (
        <MenuOculto estado={estado} setEstado={setEstado} onCerrar={() => setMenuAbierto(false)} />
      )}
    </div>
  );
}

export default App;
