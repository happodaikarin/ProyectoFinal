// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ReactGA from "react-ga4";
import { AuthProvider } from './context/AuthContext';
import './index.scss'
ReactGA.initialize("G-NL6TRG7MES");

ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
});

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) si estás usando TypeScript

root.render(
  
  <React.StrictMode>
    <AuthProvider> {/* Envuelve tu aplicación con el AuthProvider */}
    
      <App />
    </AuthProvider>
  </React.StrictMode>
);


