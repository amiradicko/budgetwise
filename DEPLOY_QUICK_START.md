# 🚀 Quick Start - Déploiement BudgetWise

Pour déployer BudgetWise en production en 30 minutes, suivez ces étapes :

## 📦 1. Préparer le Code (5 min)

```powershell
# Dans le dossier budgetwise
cd c:\Users\user\budgetwise

# Initialiser Git (si pas fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: BudgetWise by Nefertiti Digital Solutions"

# Créer un repo sur GitHub: https://github.com/new
# Puis lier et pousser:
git remote add origin https://github.com/VOTRE-USERNAME/budgetwise.git
git branch -M main
git push -u origin main
```

## 🚂 2. Déployer le Backend sur Railway (10 min)

1. **Créer compte** : [railway.app](https://railway.app) → Se connecter avec GitHub
2. **New Project** → Deploy from GitHub → Sélectionner `budgetwise`
3. **Ajouter PostgreSQL** : + New → Database → PostgreSQL
4. **Configurer le service** :
   - Settings → Root Directory : `server`
   - Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=[générer un secret 64 caractères]
   JWT_REFRESH_SECRET=[générer un autre secret 64 caractères]
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLIENT_URL=https://budgetwise.vercel.app
   CORS_ORIGIN=https://budgetwise.vercel.app
   ```
   - Settings → Build : `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Settings → Start : `npm start`
5. **Obtenir l'URL** : Settings → Networking → Generate Domain
6. **Copier l'URL** (ex: `budgetwise-production.up.railway.app`)

**🔐 Générer un secret JWT :**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

## ⚡ 3. Déployer le Frontend sur Vercel (10 min)

1. **Créer compte** : [vercel.com](https://vercel.com) → Se connecter avec GitHub
2. **Dashboard** → Add New → Project
3. **Import** : Sélectionner `budgetwise`
4. **Configure** :
   - Framework : Vite
   - Root Directory : `client`
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Environment Variables :
   ```
   VITE_API_URL=https://budgetwise-production.up.railway.app
   ```
5. **Deploy** → Attendre 2-3 minutes
6. **Copier l'URL** (ex: `budgetwise.vercel.app`)

## 🔄 4. Finaliser (5 min)

1. **Mettre à jour Railway** :
   - Variables → Modifier `CLIENT_URL` et `CORS_ORIGIN`
   - Remplacer par l'URL Vercel exacte
   - Railway redéploie automatiquement

2. **Tester** :
   - Ouvrir `https://budgetwise.vercel.app`
   - Vérifier le Splash Screen (logo NDS)
   - Créer un compte
   - Se connecter
   - Tester toutes les pages

## ✅ C'est Fait !

Votre application est EN LIGNE ! 🎉

**URLs de production :**
- Frontend : `https://budgetwise.vercel.app`
- Backend : `https://budgetwise-production.up.railway.app`

---

## 📚 Documentation Complète

Pour plus de détails, consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**BudgetWise - A Product of Nefertiti Digital Solutions**  
**Innovating Digital Finance** 💙
