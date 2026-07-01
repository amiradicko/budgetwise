# 🚀 Guide de Démarrage Rapide - BudgetWise

## Installation & Configuration

### 1️⃣ Installation des Dépendances

```bash
# À la racine du projet
npm install
```

Cela installe automatiquement les dépendances pour :
- Root monorepo
- Workspace `shared`
- Workspace `server`

---

### 2️⃣ Démarrage de PostgreSQL avec Docker

```bash
# Démarrer PostgreSQL + pgAdmin
npm run docker:up

# Vérifier que les conteneurs sont actifs
docker ps
```

**Services disponibles :**
- **PostgreSQL:** `localhost:5432`
  - Database: `budgetwise_db`
  - User: `budgetwise`
  - Password: `budgetwise123`

- **pgAdmin:** `http://localhost:5050`
  - Email: `admin@budgetwise.com`
  - Password: `admin123`

---

### 3️⃣ Configuration de l'Environnement

Le fichier `.env` est déjà créé dans `server/.env` avec les bonnes valeurs par défaut.

**Variables importantes :**
```env
DATABASE_URL=postgresql://budgetwise:budgetwise123@localhost:5432/budgetwise_db
JWT_SECRET=budgetwise-super-secret-jwt-key-change-this-in-production-32chars-min
JWT_REFRESH_SECRET=budgetwise-super-secret-refresh-key-change-this-in-production-32chars-min
PORT=5000
```

> ⚠️ **En production:** Changez les secrets JWT !

---

### 4️⃣ Setup de la Base de Données

```bash
# Aller dans le dossier server
cd server

# Générer le client Prisma
npm run generate

# Créer la base de données et exécuter les migrations
npm run migrate

# Seed avec données de démonstration
npm run seed
```

**Données de démo créées :**
- ✅ Utilisateur demo (`demo@budgetwise.com` / `Password123`)
- ✅ 25 catégories par défaut
- ✅ 3 comptes (Banque 5000€, Cash 200€, Orange Money 150 XOF)
- ✅ 1 budget (Alimentation 400€)
- ✅ 1 objectif d'épargne (Vacances 2000€)

---

### 5️⃣ Démarrage du Serveur

```bash
# Retour à la racine
cd ..

# Option 1: Démarrer uniquement le serveur
npm run dev:server

# Option 2: Depuis le dossier server
cd server
npm run dev
```

**Le serveur démarre sur:** `http://localhost:5000`

---

## ✅ Vérification

### Test Health Check

```bash
curl http://localhost:5000/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-06-30T..."
}
```

---

## 🧪 Test de l'API

### 1. Register un Nouveau Utilisateur

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "currency": "EUR",
    "language": "fr"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      ...
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

---

### 2. Login avec l'Utilisateur Demo

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@budgetwise.com",
    "password": "Password123"
  }'
```

**Sauvegardez le `accessToken` pour les requêtes suivantes !**

---

### 3. Get Profile (Protected)

```bash
# Remplacez YOUR_ACCESS_TOKEN par votre token
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Get Accounts

```bash
curl -X GET http://localhost:5000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5. Create Transaction

```bash
curl -X POST http://localhost:5000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EXPENSE",
    "amount": 45.50,
    "currency": "EUR",
    "description": "Déjeuner restaurant",
    "fromAccountId": "YOUR_ACCOUNT_ID",
    "categoryId": "YOUR_CATEGORY_ID",
    "paymentMethod": "CARD",
    "date": "2026-06-30"
  }'
```

---

### 6. Get Transaction Stats

```bash
curl -X GET "http://localhost:5000/api/v1/transactions/stats?startDate=2026-06-01&endDate=2026-06-30" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛠️ Outils de Développement

### Prisma Studio

Interface graphique pour explorer la base de données :

```bash
cd server
npm run studio
```

**Ouvre:** `http://localhost:5555`

### Logs du Serveur

Les logs sont sauvegardés dans :
- `server/logs/error.log` - Erreurs uniquement
- `server/logs/combined.log` - Tous les logs

### pgAdmin

Interface web pour PostgreSQL :

1. Ouvrir `http://localhost:5050`
2. Login: `admin@budgetwise.com` / `admin123`
3. Add New Server:
   - Name: `BudgetWise`
   - Host: `postgres` (dans Docker) ou `localhost`
   - Port: `5432`
   - Database: `budgetwise_db`
   - Username: `budgetwise`
   - Password: `budgetwise123`

---

## 📚 Documentation Complète

### API Endpoints
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - Documentation de tous les 53 endpoints

### Modules Backend
- **[MODULES_SUMMARY.md](MODULES_SUMMARY.md)** - Récapitulatif des 7 modules créés

### README
- **[README.md](README.md)** - Documentation générale du serveur

---

## 🐛 Debugging

### Vérifier les Logs

```bash
# Logs en temps réel
cd server
tail -f logs/combined.log
```

### Vérifier la Base de Données

```bash
# Se connecter à PostgreSQL
docker exec -it budgetwise-postgres psql -U budgetwise -d budgetwise_db

# Lister les tables
\dt

# Voir les utilisateurs
SELECT id, email, "firstName", "lastName" FROM "User";

# Quitter
\q
```

### Réinitialiser la Base de Données

```bash
cd server

# Reset complet
npm run migrate:reset

# Re-seed
npm run seed
```

---

## 🚨 Erreurs Courantes

### Port 5000 déjà utilisé

```bash
# Changer le port dans server/.env
PORT=3000
```

### PostgreSQL n'est pas démarré

```bash
# Vérifier les conteneurs Docker
docker ps

# Si postgres n'est pas là, redémarrer
npm run docker:up
```

### Erreur de migration Prisma

```bash
# Supprimer le dossier migrations
rm -rf server/prisma/migrations

# Recréer les migrations
cd server
npm run migrate
```

### Token expiré

Les access tokens expirent après **15 minutes**. Utilisez le refresh token :

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 📝 Scripts Utiles

```bash
# Root
npm run dev:server      # Démarrer serveur
npm run docker:up       # Démarrer PostgreSQL
npm run docker:down     # Arrêter PostgreSQL
npm run lint            # Lint tout le code
npm run format          # Formatter le code

# Server (cd server)
npm run dev             # Dev avec hot reload
npm run build           # Build production
npm start               # Start production
npm run migrate         # Migrations
npm run seed            # Seed données
npm run studio          # Prisma Studio
npm run generate        # Générer client Prisma
```

---

## ✅ Checklist de Démarrage

- [ ] `npm install` à la racine
- [ ] `npm run docker:up` pour PostgreSQL
- [ ] `cd server && npm run generate`
- [ ] `npm run migrate`
- [ ] `npm run seed`
- [ ] `cd .. && npm run dev:server`
- [ ] Tester `curl http://localhost:5000/health`
- [ ] Login avec demo@budgetwise.com
- [ ] Explorer avec Prisma Studio

---

**Statut:** ✅ Backend prêt à l'emploi !  
**Prochaine étape:** Frontend React (Phase 3)
