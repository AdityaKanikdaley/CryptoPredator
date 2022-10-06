import React from 'react';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import CryptoContext from './CryptoContext';

ReactDOM.render(
  <React.StrictMode>
    <CryptoContext>
      <App />
    </CryptoContext>
  </React.StrictMode>,
  document.getElementById('root')
);