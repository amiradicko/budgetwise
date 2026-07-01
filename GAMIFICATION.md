# 🎮 Système de Gamification BudgetWise

## Vue d'ensemble

Le système de gamification transforme BudgetWise en une expérience engageante qui récompense les bonnes habitudes financières.

## 🏆 Fonctionnalités

### 1. **Badges & Achievements**

Débloquez des badges en atteignant des objectifs :

#### 🌟 Catégorie DÉBUTANT
- **Premier Pas** (Bronze, 10 pts) - Enregistrez votre première transaction
- **Planificateur** (Bronze, 15 pts) - Créez votre premier budget
- **Visionnaire** (Bronze, 15 pts) - Définissez votre premier objectif d'épargne
- **Actif** (Argent, 40 pts) - Enregistrez 50 transactions
- **Super Actif** (Or, 100 pts) - Enregistrez 200 transactions

#### 🔥 Catégorie RÉGULARITÉ
- **Semaine Parfaite** (Bronze, 25 pts) - Connectez-vous 7 jours consécutifs
- **Mois Exceptionnel** (Argent, 100 pts) - Connectez-vous 30 jours consécutifs
- **Discipline de Fer** (Or, 300 pts) - Connectez-vous 90 jours consécutifs

#### 💰 Catégorie ÉPARGNANT
- **Petit Économe** (Bronze, 20 pts) - Économisez 10 000 FCFA
- **Grand Économe** (Argent, 50 pts) - Économisez 100 000 FCFA
- **Millionnaire** (Or, 200 pts) - Économisez 1 000 000 FCFA

#### 📊 Catégorie BUDGÉTAIRE
- **Maître du Budget** (Or, 150 pts) - Respectez votre budget pendant 3 mois

#### 🎯 Catégorie OBJECTIFS
- **Objectif Atteint** (Argent, 75 pts) - Complétez votre premier objectif
- **Champion des Objectifs** (Or, 250 pts) - Complétez 5 objectifs

### 2. **Système de Niveaux**

- Gagnez **100 points = 1 niveau**
- Montez de niveau en débloquant des badges
- Affichez votre niveau sur votre profil

### 3. **Streaks (Régularité)**

- **Streak actuel** : Jours consécutifs de connexion
- **Streak le plus long** : Record personnel
- Les streaks se réinitialisent si vous manquez un jour
- Débloquez des badges de streak à 7, 30 et 90 jours

### 4. **Stats Personnelles**

Suivez votre progression :
- Niveau actuel
- Total de points
- Streak actuel
- Nombre de transactions
- Nombre de budgets créés
- Objectifs complétés
- Total épargné

### 5. **Classement** (À venir)

Comparez-vous aux autres utilisateurs (anonymisé et optionnel)

## 📱 Interface Utilisateur

### Page Réalisations (`/achievements`)

Accédez à la page dédiée avec :
- **Vue d'ensemble** : Niveau, points, streak, badges débloqués
- **Filtres par catégorie** : Tous, Débutant, Épargnant, Régularité, Budgétaire, Objectifs
- **Badges débloqués** : Colorés et avec animation
- **Badges verrouillés** : En niveaux de gris avec description

### Navigation

Un nouveau lien **"Réalisations"** apparaît dans le menu latéral avec l'icône 🏆

## 🔧 Déclenchement Automatique

Le système se met à jour automatiquement :

### Au Login
- ✅ Mise à jour du **streak** quotidien
- ✅ Vérification des nouveaux badges

### Lors des Actions
- ✅ **Créer une transaction** → Incrémente le compteur, vérifie les badges
- ✅ **Créer un budget** → Incrémente le compteur, vérifie les badges
- ✅ **Compléter un objectif** → Incrémente le compteur, vérifie les badges
- ✅ **Épargner de l'argent** → Met à jour le total épargné, vérifie les badges

## 🎯 API Endpoints

### GET `/api/v1/achievements`
Obtenir tous les achievements disponibles

### GET `/api/v1/achievements/my`
Obtenir les achievements de l'utilisateur (débloqués + verrouillés)

### GET `/api/v1/achievements/stats`
Obtenir les statistiques de l'utilisateur

### POST `/api/v1/achievements/check`
Vérifier et débloquer les achievements (appelé automatiquement)

### GET `/api/v1/achievements/leaderboard`
Obtenir le classement des utilisateurs

### POST `/api/v1/achievements/update-streak`
Mettre à jour le streak (appelé au login)

## 🗄️ Base de Données

### Table `achievements`
- Définition des badges disponibles
- Catégorie, tier, points, description, icône
- Critères de déblocage

### Table `user_achievements`
- Badges débloqués par utilisateur
- Date de déblocage
- Progression (0-100%)

### Table `user_stats`
- Statistiques globales de l'utilisateur
- Niveau, points, streaks
- Compteurs (transactions, budgets, objectifs)

## 🚀 Prochaines Améliorations

1. **Notifications en temps réel** quand un badge est débloqué
2. **Animations** lors du déblocage de badges
3. **Partage sur réseaux sociaux** de vos réussites
4. **Défis mensuels** avec récompenses spéciales
5. **Badges saisonniers** (Noël, Nouvel An, etc.)
6. **Système de quêtes** avec plusieurs étapes
7. **Récompenses tangibles** (réductions, cadeaux)

## 💡 Conseils d'Utilisation

1. **Connectez-vous chaque jour** pour maintenir votre streak
2. **Enregistrez toutes vos transactions** pour débloquer les badges d'activité
3. **Créez des budgets** et respectez-les pour gagner des points
4. **Fixez-vous des objectifs** réalistes et complétez-les
5. **Explorez toutes les catégories** de badges pour maximiser vos points

## 🎨 Personnalisation

Les tiers de badges ont des couleurs distinctives :
- **Bronze** : Ambre/Orange
- **Argent** : Gris clair
- **Or** : Jaune/Or
- **Platine** : Violet

---

**Amusez-vous bien et devenez un champion de la gestion budgétaire ! 🎯💰**
