import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Désactivé temporairement - cause des erreurs
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then((registration) => {
//         console.log('Service Worker enregistré:', registration);
//       })
//       .catch((error) => {
//         console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
//       });
//   });
// }

createRoot(document.getElementById('root')!).render(<App />);

