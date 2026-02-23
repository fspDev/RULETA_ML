import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom'; // Importa HashRouter en lugar de BrowserRouter
import './Trivia.css';
import logo from './images/logo.png';

function Trivia() {
  // Array de preguntas con sus opciones y respuesta correcta
  const preguntas = [
    {
      pregunta: '¿Cuáles son técnicas de conducción defensiva en camiones?',
      opciones: ['Uso frecuente de espejos', 'Maniobras impulsivas', 'Seguir muy de cerca'],
      respuestaCorrecta: 'Uso frecuente de espejos'
    },
    {
      pregunta: '¿Cómo manejar en condiciones climáticas adversas (lluvia o niebla)?',
      opciones: ['Reducir velocidad y aumentar la distancia de frenado', 'Encender luces antiniebla', 'Ambas son correctas'],
      respuestaCorrecta: 'Ambas son correctas'
    },
    {
      pregunta: '¿Que color predomina en las señales de Reglamentación?',
      opciones: ['Amarillo', 'Azul', 'Rojo'],
      respuestaCorrecta: 'Rojo'
    },
    {
      pregunta: '¿Cuál es la velocidad límite en travesías urbanas?',
      opciones: ['80 km/h', '60 km/h', '40 km/hs'],
      respuestaCorrecta: '60 km/h'
    }
  ];

  // Estados para controlar la pregunta actual, respuestas seleccionadas y mensaje de resultado
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [mensaje, setMensaje] = useState('');

  // Función para manejar la selección de una respuesta
  const handleSeleccionarRespuesta = (respuesta) => {
    const respuestaCorrecta = preguntas[preguntaActual].respuestaCorrecta;
    if (respuesta === respuestaCorrecta) {
      if (preguntaActual === preguntas.length - 1) {
        setMensaje('¡FELICIDADES, GANASTE!');
      } else {
        setPreguntaActual(preguntaActual + 1);
        setMensaje('');
      }
    } else {
      setMensaje('QUIZÁS LA PRÓXIMA');
    }
  };

  // Función para manejar el evento de regresar
  const handleRegresar = () => {
    window.location.href = './index.html'; // Usa una ruta relativa para regresar
  };

  return (
    <div className="TriviaContainer">
      <p className='Titulo-principal'>SEGURIDAD EN LAS RUTAS</p>
      <p className='Titulos'>RESPONDÉ Y GANÁ!</p>
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      {/* Renderiza el mensaje de resultado o la pregunta actual */}
      {mensaje ? (
        <p className='Mensaje'>{mensaje}</p>
      ) : (
        <div className="Tarjeta">
          
          {/* Muestra la pregunta actual y las opciones */}
          <p className='Pregunta'>{preguntas[preguntaActual].pregunta}</p>
          <div className="Opciones">
            {preguntas[preguntaActual].opciones.map((opcion, index) => (
              <button key={index} className="Opcion" onClick={() => handleSeleccionarRespuesta(opcion)}>
                {opcion}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Botón para regresar */}
      <button className="BotonRegresar" onClick={handleRegresar}>Regresar</button>
    </div>
  );
}

function App() {
  return (
    <Router> {/* Utiliza el componente HashRouter para envolver tu aplicación */}
      <Trivia />
    </Router>
  );
}

export default App;
