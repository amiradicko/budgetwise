import { useEffect, useRef } from 'react';
import achievementsService from '../services/achievements.service';
import { useToastContext } from '../contexts/ToastContext';

/**
 * Hook qui vérifie automatiquement les nouveaux badges après certaines actions
 * et affiche des toasts de célébration
 */
export function useAchievementChecker() {
  const { showAchievement } = useToastContext();
  const checkedRef = useRef(false);

  const checkForNewAchievements = async () => {
    try {
      const result = await achievementsService.check();
      
      // Afficher un toast pour chaque nouveau badge débloqué
      if (result.data && result.data.length > 0) {
        result.data.forEach((achievement: any, index: number) => {
          // Délai progressif pour ne pas tous afficher en même temps
          setTimeout(() => {
            showAchievement(
              achievement.name,
              achievement.description,
              achievement.icon,
              achievement.points
            );
          }, index * 1000); // 1 seconde de décalage entre chaque toast
        });
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  // Vérifier au montage du composant (une seule fois par session)
  useEffect(() => {
    if (!checkedRef.current) {
      checkedRef.current = true;
      // Attendre un peu pour ne pas surcharger le login
      setTimeout(checkForNewAchievements, 2000);
    }
  }, []);

  return {
    checkForNewAchievements,
  };
}
