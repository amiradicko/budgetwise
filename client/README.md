# BudgetWise Client

Interface web de l'application BudgetWise - Gestion des finances personnelles.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

## 📦 Stack Technique

- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: React Context + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios avec intercepteurs JWT
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🏗️ Architecture

```
src/
├── components/        # Composants réutilisables
├── contexts/         # Contexts React (AuthContext)
├── hooks/           # Custom hooks
├── lib/             # Utilities (api client, utils)
├── pages/           # Pages de l'application
├── services/        # Services API
└── types/           # Types TypeScript
```

## 🔐 Authentification

L'application utilise JWT avec refresh tokens :

- **Access Token**: Stocké dans localStorage, expire après 15 minutes
- **Refresh Token**: Stocké dans localStorage, expire après 7 jours
- **Auto-refresh**: Les tokens sont automatiquement rafraîchis via axios interceptors

### Routes publiques
- `/login` - Page de connexion
- `/register` - Page d'inscription

### Routes protégées
- `/dashboard` - Tableau de bord principal

## 🎨 Design System

Le design utilise Tailwind CSS avec un thème personnalisé :

- **Couleur primaire**: Green (vert) - pour les actions positives
- **Mode sombre**: Support natif avec variables CSS
- **Responsive**: Mobile-first design

## 📡 API Integration

### Configuration

Le fichier `.env` est déjà configuré :

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Utilisation des services

```typescript
import { authService } from './services/auth.service';

// Connexion
const response = await authService.login({ email, password });

// Inscription
const response = await authService.register({
  email,
  password,
  firstName,
  lastName,
});

// Déconnexion
await authService.logout();
```

## 🧪 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linter
npm run lint
```

## 📱 Fonctionnalités

### ✅ Implémenté
- Authentification (login/register)
- Routes protégées
- Dashboard de base
- Gestion de l'état utilisateur

### 🚧 À venir
- Gestion des comptes bancaires
- Transactions (CRUD)
- Budgets avec alertes
- Objectifs d'épargne
- Catégories personnalisées
- Statistiques et graphiques

## 🤝 Contribution

Ce projet fait partie du monorepo BudgetWise.

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
