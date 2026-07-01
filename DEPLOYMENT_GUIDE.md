# 🚀 Guide de Déploiement Complet - BudgetWise

## 📋 Vue d'ensemble

Ce guide vous accompagne étape par étape pour déployer **BudgetWise** (application complète full-stack avec branding Nefertiti Digital Solutions) en production.

---

## ✅ Pré-requis

Avant de commencer, assurez-vous d'avoir :

- [x] **Compte GitHub** - Pour héberger le code source
- [x] **Git installé** - Pour versionner votre code
- [x] **Node.js 18+** - Installé localement
- [x] **PostgreSQL** - Base de données locale fonctionnelle
- [x] **Logo NDS officiel** - Remplacé dans `client/public/nefertiti-logo.svg`

---

## 🎯 Architecture de Déploiement Recommandée

### Option 1 : Railway + Vercel (RECOMMANDÉ) 🌟

**Pourquoi cette combinaison ?**
- ✅ **Gratuit** pour démarrer
- ✅ **Simple** et rapide (30-45 minutes)
- ✅ **Scalable** - Passage facile à un plan payant
- ✅ **PostgreSQL inclus** - Base de données gérée
- ✅ **HTTPS automatique** - Certificats SSL gratuits
- ✅ **Git Deployment** - Déploiement automatique à chaque push

**Coût estimé :**
- Railway : $0/mois (500h gratuit) puis $5/mois
- Vercel : $0/mois (hobby) ou $20/mois (pro)
- **Total : GRATUIT** pour commencer ! 💰

---

## 📦 ÉTAPE 1 : Préparer le Code

### 1.1 - Initialiser Git (si pas déjà fait)

```powershell
cd c:\Users\user\budgetwise

# Initialiser Git
git init

# Créer .gitignore
```

Créons le fichier `.gitignore` :

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist
/client/dist
/client/dev-dist
/server/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
lerna-debug.log*

# local env files
.env
.env*.local
.env.development
.env.test
.env.production.local
server/.env
client/.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/server/prisma/dev.db
/server/prisma/dev.db-journal

# logs
logs
*.log
/server/logs

# IDEs
.idea
.vscode
*.swp
*.swo
*~
.project
.classpath
.settings
.metadata
```

### 1.2 - Créer le dépôt GitHub

```powershell
# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: BudgetWise - Financial Management Platform by Nefertiti Digital Solutions"

# Créer un nouveau repo sur GitHub (via navigateur)
# https://github.com/new
# Nom: budgetwise
# Description: BudgetWise - Plateforme moderne de gestion financière développée par Nefertiti Digital Solutions

# Lier le repo local au repo distant
git remote add origin https://github.com/VOTRE-USERNAME/budgetwise.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 1.3 - Créer les fichiers de configuration pour la production

**Fichier `server/.env.example` :**

```env
# DATABASE
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# JWT
JWT_SECRET="CHANGEZ-MOI-SECRET-256-BITS-MINIMUM"
JWT_REFRESH_SECRET="CHANGEZ-MOI-REFRESH-SECRET-256-BITS"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# SERVER
NODE_ENV="production"
PORT=5000
CLIENT_URL="https://votre-app.vercel.app"

# CORS
CORS_ORIGIN="https://votre-app.vercel.app"
```

---

## 🚂 ÉTAPE 2 : Déployer le Backend sur Railway

### 2.1 - Créer un compte Railway

1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur **"Start a New Project"**
3. Se connecter avec GitHub
4. Autoriser Railway à accéder à vos repos

### 2.2 - Créer le projet

1. **New Project** → **Deploy from GitHub repo**
2. Sélectionner `budgetwise`
3. Railway va détecter automatiquement le projet

### 2.3 - Ajouter PostgreSQL

1. Dans votre projet Railway, cliquer **"+ New"**
2. Sélectionner **"Database"** → **"Add PostgreSQL"**
3. Railway crée automatiquement la database
4. Noter l'URL de connexion

### 2.4 - Configurer le service Backend

1. Cliquer sur le service `budgetwise`
2. Aller dans **Settings** → **Root Directory**
3. Changer en : `server`

4. **Variables d'environnement** :
   - Aller dans l'onglet **"Variables"**
   - Cliquer **"+ New Variable"**
   - Ajouter :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=votre-secret-super-securise-256-bits-minimum-utilisez-un-generateur
JWT_REFRESH_SECRET=votre-refresh-secret-super-securise-256-bits-different
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://budgetwise.vercel.app
CORS_ORIGIN=https://budgetwise.vercel.app
```

**🔐 Générer des secrets sécurisés :**

```powershell
# PowerShell - Générer un secret aléatoire
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

Ou utiliser : https://randomkeygen.com/

5. **Build & Start Commands** :
   - Aller dans **Settings**
   - **Build Command :**
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
   - **Start Command :**
   ```bash
   npm start
   ```

6. **Déployer** :
   - Railway va automatiquement déployer
   - Attendre 2-3 minutes
   - Vérifier les logs pour confirmer le déploiement

7. **Obtenir l'URL publique** :
   - Aller dans **Settings** → **Networking**
   - Cliquer **"Generate Domain"**
   - Copier l'URL (ex: `budgetwise-production.up.railway.app`)

---

## ⚡ ÉTAPE 3 : Déployer le Frontend sur Vercel

### 3.1 - Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer **"Sign Up"**
3. Se connecter avec GitHub

### 3.2 - Installer Vercel CLI

```powershell
npm install -g vercel
```

### 3.3 - Créer `.env.production` dans `client/`

```env
VITE_API_URL=https://budgetwise-production.up.railway.app
```

**Commit et push :**

```powershell
git add .
git commit -m "Add production environment variables"
git push
```

### 3.4 - Déployer depuis le Dashboard Vercel

1. Sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquer **"Add New..."** → **"Project"**
3. **Import Git Repository** → Sélectionner `budgetwise`
4. **Configure Project :**
   - **Framework Preset :** Vite
   - **Root Directory :** `client`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
   - **Install Command :** `npm install`

5. **Environment Variables :**
   - Cliquer **"Environment Variables"**
   - Ajouter :
   ```
   VITE_API_URL = https://budgetwise-production.up.railway.app
   ```

6. Cliquer **"Deploy"**
7. Attendre 2-3 minutes
8. Copier l'URL (ex: `budgetwise.vercel.app`)

### 3.5 - Mettre à jour le CORS sur Railway

1. Retourner sur Railway
2. Aller dans les variables d'environnement du backend
3. Modifier `CLIENT_URL` et `CORS_ORIGIN` avec l'URL Vercel :
   ```env
   CLIENT_URL=https://budgetwise.vercel.app
   CORS_ORIGIN=https://budgetwise.vercel.app
   ```
4. Railway va automatiquement redéployer

---

## 🧪 ÉTAPE 4 : Tester l'Application en Production

### 4.1 - Accéder à l'application

1. Ouvrir : `https://budgetwise.vercel.app`
2. Vérifier le **Splash Screen** (logo Nefertiti Digital Solutions)
3. Tester l'**inscription** d'un nouveau compte
4. Tester la **connexion**
5. Vérifier toutes les pages :
   - Dashboard (avec badge NDS)
   - Comptes
   - Transactions
   - Budgets
   - Objectifs
   - Page "À propos" (branding NDS complet)

### 4.2 - Vérifier les fonctionnalités

- [ ] Création de compte
- [ ] Création de transaction
- [ ] Création de budget
- [ ] Smart Alerts
- [ ] Export PDF (footer NDS)
- [ ] Mode sombre
- [ ] Responsive mobile
- [ ] PWA (installation possible)

### 4.3 - Vérifier les logs

**Railway (Backend) :**
1. Aller sur Railway
2. Cliquer sur votre service
3. Onglet **"Deployments"** → Dernier déploiement
4. Vérifier qu'il n'y a pas d'erreurs

**Vercel (Frontend) :**
1. Aller sur Vercel
2. Cliquer sur votre projet
3. Onglet **"Deployments"** → Dernier déploiement
4. Cliquer **"View Function Logs"**

---

## 🔧 ÉTAPE 5 : Configuration Avancée (Optionnel)

### 5.1 - Nom de domaine personnalisé

#### Sur Vercel :
1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine (ex: `budgetwise.com`)
3. Configurer les DNS selon les instructions Vercel

#### Sur Railway :
1. Aller dans **Settings** → **Networking**
2. Ajouter un domaine personnalisé (ex: `api.budgetwise.com`)
3. Configurer un CNAME vers Railway

### 5.2 - Variables d'environnement sensibles

**Ne JAMAIS committer :**
- ❌ `.env` avec des vraies clés
- ❌ Secrets JWT en dur
- ❌ Mots de passe database

**Toujours :**
- ✅ Utiliser `.env.example` avec des placeholders
- ✅ Configurer les variables sur Railway/Vercel
- ✅ Utiliser des secrets générés aléatoirement

### 5.3 - Monitoring & Analytics

#### Ajouter Sentry (Monitoring d'erreurs)

**Backend :**
```bash
cd server
npm install @sentry/node
```

**Frontend :**
```bash
cd client
npm install @sentry/react @sentry/vite-plugin
```

Configuration dans `server/src/app.ts` et `client/src/main.tsx`.

---

## 📊 ÉTAPE 6 : Automatisation CI/CD

### 6.1 - Déploiement automatique

**Railway :**
- ✅ Déjà configuré ! Chaque push sur `main` déclenche un déploiement

**Vercel :**
- ✅ Déjà configuré ! Chaque push sur `main` déclenche un déploiement

### 6.2 - Branches de preview

**Vercel :**
- Chaque Pull Request crée automatiquement un preview
- URL unique pour tester avant de merger

**Railway :**
- Configurez des environnements multiples (dev, staging, prod)

---

## 🛡️ ÉTAPE 7 : Sécurité & Performance

### 7.1 - Checklist Sécurité

- [x] **HTTPS** - Automatique sur Vercel/Railway
- [x] **Helmet.js** - Déjà configuré dans le backend
- [x] **CORS** - Configuré pour l'URL Vercel uniquement
- [x] **Rate Limiting** - À ajouter si nécessaire
- [x] **JWT Secrets** - Générés aléatoirement
- [ ] **CSP Headers** - À configurer
- [ ] **2FA** - À implémenter plus tard

### 7.2 - Performance

**Backend :**
- Activer les logs en production
- Monitorer les temps de réponse
- Optimiser les requêtes Prisma

**Frontend :**
- Build production optimisé par Vite
- Code splitting automatique
- Service Worker pour PWA

---

## 💰 ÉTAPE 8 : Gestion des Coûts

### Tier Gratuit (Recommandé pour démarrer)

**Railway :**
- 500 heures/mois gratuites
- PostgreSQL : 500MB gratuit
- **Coût :** $0/mois

**Vercel :**
- 100GB de bande passante
- Déploiements illimités
- **Coût :** $0/mois

**Total : GRATUIT ! 🎉**

### Scaling (Quand nécessaire)

**Railway :**
- Pro Plan : $20/mois
- PostgreSQL : $0.02/GB/mois

**Vercel :**
- Pro Plan : $20/mois/utilisateur
- Plus de bande passante

**Estimation pour 1000 utilisateurs actifs :** ~$40-60/mois

---

## 🚨 Dépannage

### Problème : Backend ne démarre pas

**Solution :**
1. Vérifier les logs Railway
2. Vérifier que `DATABASE_URL` est correct
3. Vérifier que les migrations Prisma ont été appliquées :
   ```bash
   npx prisma migrate deploy
   ```

### Problème : Frontend ne se connecte pas au Backend

**Solution :**
1. Vérifier `VITE_API_URL` sur Vercel
2. Vérifier le CORS sur Railway (`CLIENT_URL`)
3. Vérifier les logs réseau (F12 → Network)

### Problème : Erreurs de database

**Solution :**
1. Vérifier que PostgreSQL est bien démarré sur Railway
2. Régénérer le client Prisma :
   ```bash
   npx prisma generate
   ```
3. Appliquer les migrations :
   ```bash
   npx prisma migrate deploy
   ```

### Problème : Splash Screen ne s'affiche pas

**Solution :**
1. Vérifier que `nefertiti-logo.png` existe
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier les logs de build Vercel

---

## ✅ Checklist Finale de Déploiement

### Avant le déploiement

- [ ] Logo NDS officiel remplacé
- [ ] `.env.example` créé (sans secrets)
- [ ] `.gitignore` créé
- [ ] Code committé sur GitHub
- [ ] Secrets JWT générés (256+ bits)
- [ ] Tests passent en local

### Déploiement

- [ ] Backend déployé sur Railway
- [ ] PostgreSQL configuré
- [ ] Migrations appliquées
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement

### Post-déploiement

- [ ] Application accessible en production
- [ ] Inscription/Connexion fonctionnelle
- [ ] Toutes les pages chargent
- [ ] Branding NDS visible partout
- [ ] Export PDF fonctionne
- [ ] PWA installable
- [ ] Mode sombre fonctionne
- [ ] Responsive mobile OK

---

## 📞 Support

### En cas de problème

1. **Vérifier les logs** :
   - Railway : Onglet Deployments
   - Vercel : Onglet Functions

2. **Documentation officielle** :
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
   - [Prisma Docs](https://www.prisma.io/docs)

3. **Community** :
   - [Railway Discord](https://discord.gg/railway)
   - [Vercel Discord](https://vercel.com/discord)

---

## 🎉 Félicitations !

Votre application **BudgetWise** est maintenant **EN PRODUCTION** ! 🚀

### URLs de production

- **Frontend :** `https://budgetwise.vercel.app`
- **Backend API :** `https://budgetwise-production.up.railway.app`

### Prochaines étapes

1. **Partagez l'app** avec vos premiers utilisateurs
2. **Collectez les feedbacks**
3. **Ajoutez des fonctionnalités**
4. **Monitorez les performances**
5. **Scalez si nécessaire**

---

**BudgetWise - A Product of Nefertiti Digital Solutions**  
**Innovating Digital Finance** 💙

---

**Document créé le :** 2026-07-01  
**Version :** 1.0  
**Statut :** ✅ PRODUCTION READY
