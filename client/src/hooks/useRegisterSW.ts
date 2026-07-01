import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function useRegisterSW() {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('Une nouvelle version est disponible. Recharger maintenant ?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('✅ Application prête pour le mode hors ligne');
      },
      onRegistered(registration) {
        console.log('✅ Service Worker enregistré:', registration);
      },
      onRegisterError(error) {
        console.error('❌ Erreur enregistrement Service Worker:', error);
      },
    });
  }, []);
}
