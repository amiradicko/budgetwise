# 💰 BudgetWise - Application Professionnelle de Gestion Financière

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Application web moderne et professionnelle pour la gestion complète de vos finances personnelles. Architecture monorepo avec backend Node.js/Express, frontend React/Vite et types partagés TypeScript.

**🏢 A Product of Nefertiti Digital Solutions**  
**💙 Innovating Digital Finance**

---

## 📚 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Démarrage Rapide](#-démarrage-rapide)
- [Configuration](#-configuration)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Données](#-base-de-données)
- [Sécurité](#-sécurité)

---

## ✨ Fonctionnalités

### 🔐 Authentification Sécurisée
✅ Inscription et connexion avec JWT  
✅ Refresh tokens pour sécurité maximale  
✅ Vérification d'email  
✅ Réinitialisation de mot de passe  
✅ Changement de mot de passe  
✅ Protection des routes  

### 💼 Gestion des Comptes (À venir)
- Comptes bancaires, espèces, Mobile Money
- Gestion multi-comptes
- Soldes en temps réel

### 💸 Gestion des Transactions (À venir)
- Revenus et dépenses
- Catégorisation personnalisée
- Upload de reçus
- Transactions récurrentes

### 🎯 Budgets et Objectifs (À venir)
- Budgets mensuels par catégorie
- Alertes de dépassement
- Objectifs d'épargne

### 📊 Rapports et Statistiques (À venir)
- Dashboard interactif
- Graphiques dynamiques
- Export PDF/Excel

---

## 🏗️ Architecture

### Architecture Monorepo

```
budgetwise/
├── client/              # Frontend React + Vite (À venir)
├── server/              # Backend Node.js + Express ✅
├── shared/              # Types et utilitaires partagés ✅
├── docs/                # Documentation
├── docker-compose.yml   # PostgreSQL + pgAdmin ✅
└── package.json         # Configuration monorepo ✅
```

### Clean Architecture (Backend)

```
server/src/modules/auth/
├── auth.service.ts      # Logique métier
├── auth.controller.ts   # Handlers HTTP
└── auth.routes.ts       # Routes Express
```

---

## 🛠️ Technologies

### Backend ✅ Complété
- Node.js 18+ + Express 4
- TypeScript 5.5
- Prisma 5.15 + PostgreSQL 16
- JWT + bcrypt
- Zod validation
- Winston logging

### Shared ✅ Complété
- Types TypeScript complets
- Validators Zod
- Constantes et utilitaires

### Frontend (Phase 3 - À venir)
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Router v6

---

## 🚀 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose

### Installation Rapide

```bash
# 1. Cloner et installer
git clone <repo>
cd budgetwise
npm install

# 2. Démarrer PostgreSQL
npm run docker:up

# 3. Setup base de données
cd server
npm run generate
npm run migrate
npm run seed

# 4. Démarrer le serveur
cd ..
npm run dev:server
```

**Le serveur sera accessible à : http://localhost:5000**

---

## ⚡ Démarrage Rapide

```bash
npm install
npm run docker:up
cd server && npm run generate && npm run migrate && npm run seed && cd ..
npm run dev:server
```

**Test de l'API :**
```bash
curl http://localhost:5000/health
```

**Credentials de démo :**
- Email: `demo@budgetwise.com`
- Password: `Password123`

---

## ⚙️ Configuration

Fichier `server/.env` :

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://budgetwise:budgetwise123@localhost:5432/budgetwise_db
JWT_SECRET=your-secret-32-chars-minimum
JWT_REFRESH_SECRET=your-refresh-secret-32-chars
```

---

## 📜 Scripts Disponibles

```bash
# Développement
npm run dev              # Client + Serveur
npm run dev:server       # Serveur uniquement

# Database
npm run docker:up        # Démarrer PostgreSQL
npm run db:migrate       # Migrations
npm run db:seed          # Seed données
npm run db:studio        # Prisma Studio

# Build
npm run build            # Build complet
npm run lint             # Lint code
npm run format           # Format code
```

---

## 📊 Base de Données

### Schéma (15 Modèles)

**Authentification :**  
User, UserProfile, UserSettings, RefreshToken, VerificationToken, PasswordResetToken

**Finance :**  
Account, Transaction, RecurringTransaction, Category, Budget, SavingGoal

**Système :**  
Notification, AuditLog

### Prisma Studio

```bash
npm run db:studio
# Ouvre http://localhost:5555
```

---

## 🔒 Sécurité

✅ JWT avec Refresh Tokens  
✅ bcrypt (10 rounds)  
✅ Validation Zod  
✅ Helmet security headers  
✅ CORS protection  
✅ Rate limiting (100 req/15min)  
✅ Prisma ORM (anti SQL injection)  
✅ Winston logging  
✅ Audit logs  

---

## 📈 Prochaines Étapes

- [ ] **Phase 3** : Frontend React + Vite
- [ ] **Phase 4** : Modules backend complets
- [ ] **Phase 5** : Features avancées (upload, export, email)
- [ ] **Phase 6** : Tests + Documentation
- [ ] **Phase 7** : Déploiement

---

## 📄 Licence

MIT License

---

<div align="center">

**Développé avec ❤️ pour une meilleure gestion financière**

⭐ Architecture professionnelle | Clean Code | Production-ready ⭐

</div>
