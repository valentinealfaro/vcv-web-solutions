import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Remove the inline loading overlay once React has painted its first frame
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById('root-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 260);
    }
  });
});
