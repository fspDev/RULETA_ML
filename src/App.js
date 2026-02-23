import React, { useState } from 'react';
import './App.css';
import Trivia from './Trivia';
import Ruleta from './Ruleta';
import logo from './images/logo.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'trivia':
        return <Trivia />;
      case 'ruleta':
        return <Ruleta />;
      default:
        return (
          <div className="App-home">
            <img src={logo} className="App-logo" alt="logo" />
            <div>
              
              <button className='Ruleta' onClick={() => setCurrentPage('ruleta')}>RULETA</button>
            
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {renderPage()}
      </header>
    </div>
  );
}

export default App;
