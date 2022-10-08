import React from 'react';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import "react-alice-carousel/lib/alice-carousel.css";
import CryptoContext from './CryptoContext';

// 52:25

ReactDOM.render(
  <React.StrictMode>
    <CryptoContext>
      <App />
    </CryptoContext>
  </React.StrictMode>,
  document.getElementById('root')
);