import { useEffect } from 'react';

export function useRegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log('✅ Service Worker enregistré:', registration);
        })
        .catch((error: Error) => {
          console.error('❌ Erreur enregistrement Service Worker:', error);
        });
    }
  }, []);
}
