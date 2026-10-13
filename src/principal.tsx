// Ponto de entrada do app: carrega os estilos e liga o React à página (index.html).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos.css';
import Aplicativo from './Aplicativo.tsx';

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('Não achei a div "raiz" no index.html');

createRoot(raiz).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
);
