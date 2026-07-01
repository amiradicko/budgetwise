# 🚀 Guide Rapide - Test Backend BudgetWise avec Postman

## ⚡ Démarrage Rapide (5 minutes)

### 1️⃣ Préparer le Backend

```bash
cd server

# Installer les dépendances (si ce n'est pas déjà fait)
npm install

# Lancer les migrations
npm run migrate

# (Optionnel) Créer des données de démo
npm run seed

# Démarrer le serveur
npm run dev
```

✅ Le serveur devrait être lancé sur `http://localhost:5000`

---

### 2️⃣ Importer dans Postman

**Option A: Import automatique**
1. Ouvrir Postman
2. Cliquer sur **Import** (en haut à gauche)
3. Glisser-déposer les fichiers:
   - `BudgetWise.postman_collection.json`
   - `BudgetWise-Local.postman_environment.json`
4. Sélectionner l'environnement **BudgetWise Local** (en haut à droite)

**Option B: Manuel**
- Suivre le guide complet dans `POSTMAN_TESTS.md`

---

### 3️⃣ Tests Minimaux Essentiels (dans l'ordre)

#### ✅ Test 1: Créer un compte
**Requête:**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@budgetwise.com",
  "password": "TestPassword123",
  "firstName": "Test",
  "lastName": "User",
  "currency": "EUR",
  "language": "fr"
}
```

**✅ Réussite si:** Status `201 Created` + vous recevez un `accessToken`

---

#### ✅ Test 2: Se connecter
**Requête:**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@budgetwise.com",
  "password": "TestPassword123"
}
```

**✅ Réussite si:** Status `200 OK` + `accessToken` reçu

**💡 Important:** Copiez le `accessToken` pour les prochaines requêtes

---

#### ✅ Test 3: Vérifier l'authentification
**Requête:**
```
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
```

**✅ Réussite si:** Status `200 OK` + vos infos utilisateur

---

#### ✅ Test 4: Créer un compte bancaire
**Requête:**
```
POST http://localhost:5000/api/v1/accounts
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
Content-Type: application/json

{
  "name": "Mon Compte Test",
  "type": "BANK",
  "balance": 1000,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#3b82f6"
}
```

**✅ Réussite si:** Status `201 Created` + compte créé avec un ID

---

#### ✅ Test 5: Obtenir toutes les catégories
**Requête:**
```
GET http://localhost:5000/api/v1/categories
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
```

**✅ Réussite si:** Status `200 OK` + liste de catégories

**💡 Astuce:** Notez un `categoryId` et `accountId` pour le prochain test

---

#### ✅ Test 6: Créer une transaction
**Requête:**
```
POST http://localhost:5000/api/v1/transactions
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
Content-Type: application/json

{
  "type": "EXPENSE",
  "amount": 50.00,
  "currency": "EUR",
  "description": "Restaurant",
  "categoryId": "VOTRE_CATEGORY_ID",
  "fromAccountId": "VOTRE_ACCOUNT_ID",
  "paymentMethod": "CARD",
  "date": "2026-06-30"
}
```

**✅ Réussite si:** Status `201 Created` + transaction créée

---

#### ✅ Test 7: Obtenir les statistiques
**Requête:**
```
GET http://localhost:5000/api/v1/users/stats
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
```

**✅ Réussite si:** Status `200 OK` + stats (nombre de comptes, transactions, etc.)

---

## ✅ Backend Fonctionnel Si:

- [x] ✅ **Test 1** réussit → Inscription fonctionne
- [x] ✅ **Test 2** réussit → Connexion fonctionne  
- [x] ✅ **Test 3** réussit → Authentification JWT fonctionne
- [x] ✅ **Test 4** réussit → Création de comptes fonctionne
- [x] ✅ **Test 5** réussit → Lecture de catégories fonctionne
- [x] ✅ **Test 6** réussit → Création de transactions fonctionne
- [x] ✅ **Test 7** réussit → Stats et calculs fonctionnent

---

## 🎯 Checklist Rapide

### Endpoints Critiques à Tester:
- [ ] **Auth:** Register + Login
- [ ] **Profile:** Get user profile
- [ ] **Accounts:** Create + Get all
- [ ] **Categories:** Get all
- [ ] **Transactions:** Create + Get all
- [ ] **Stats:** Get user stats

---

## 🔥 Test Rapide avec cURL (Terminal)

### 1. Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@budgetwise.com\",\"password\":\"TestPassword123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"currency\":\"EUR\",\"language\":\"fr\"}"
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@budgetwise.com\",\"password\":\"TestPassword123\"}"
```

---

## 📊 Codes de Statut à Vérifier

| Code | Signification | Action |
|------|---------------|--------|
| 200  | ✅ OK | Tout fonctionne |
| 201  | ✅ Created | Ressource créée |
| 400  | ❌ Bad Request | Vérifier les données envoyées |
| 401  | ❌ Unauthorized | Token manquant ou invalide |
| 404  | ❌ Not Found | Endpoint ou ressource introuvable |
| 500  | ❌ Server Error | Erreur backend (voir les logs) |

---

## 🐛 En cas d'erreur

### Erreur 500 (Internal Server Error)
```bash
# Vérifier les logs du serveur
cd server
npm run dev
# Regarder la console pour les erreurs
```

### Erreur 401 (Unauthorized)
- Vérifiez que le token est bien dans le header `Authorization: Bearer TOKEN`
- Le token expire après 15 minutes, reconnectez-vous

### Erreur 400 (Bad Request)
- Vérifiez le format JSON
- Vérifiez que tous les champs requis sont présents
- Lisez le message d'erreur pour savoir quel champ est invalide

### Base de données
```bash
# Reset complet
cd server
npm run migrate:reset
npm run migrate
npm run seed
```

---

## 📝 Avec les Données de Démo

Si vous avez exécuté `npm run seed`, utilisez:

**Email:** `demo@budgetwise.com`  
**Password:** `Password123`

---

## 🎓 Documentation Complète

- **Guide complet:** Voir `POSTMAN_TESTS.md`
- **API Reference:** Voir `API_ENDPOINTS.md`
- **Architecture:** Voir `README.md`

---

## ✨ Félicitations !

Si tous les tests passent, votre backend est **100% fonctionnel** ! 🎉

Vous pouvez maintenant:
1. ✅ Connecter le frontend
2. ✅ Développer de nouvelles fonctionnalités
3. ✅ Déployer en production

---

## 🆘 Besoin d'aide ?

1. Vérifiez que PostgreSQL est lancé
2. Vérifiez le fichier `.env`
3. Vérifiez que les migrations sont à jour
4. Consultez les logs du serveur

**Support:** Ouvrir une issue sur GitHub
