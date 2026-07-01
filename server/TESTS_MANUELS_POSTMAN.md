# 🧪 TESTS MANUELS POSTMAN - GUIDE COMPLET

Guide étape par étape pour tester TOUT le backend BudgetWise manuellement dans Postman

**Base URL:** `http://localhost:5000/api/v1`

---

## 📋 PRÉPARATION

### 1. Démarrer le serveur
```bash
cd server
npm run dev
```
✅ Vérifier que le serveur affiche : "Server running on port 5000"

### 2. Créer une nouvelle collection dans Postman
- Nom : "BudgetWise Tests Manuels"
- Créer un environnement avec :
  - `baseUrl` = `http://localhost:5000/api/v1`

---

# 🔥 TESTS À EFFECTUER (Dans cet ordre !)

## ═══════════════════════════════════════════
## 📌 SECTION 1 : AUTHENTICATION (9 tests)
## ═══════════════════════════════════════════

### ✅ TEST 1.1 : Register (Créer un nouveau compte)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@budgetwise.com",
  "password": "TestPassword123",
  "firstName": "Test",
  "lastName": "User",
  "currency": "EUR",
  "language": "fr"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Response contient:
  - `accessToken` (string)
  - `refreshToken` (string)
  - `user` (object avec id, email, firstName, lastName)

**📝 ACTION:** Copier le `accessToken` pour les prochains tests

---

### ✅ TEST 1.2 : Login (Se connecter)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@budgetwise.com",
  "password": "TestPassword123"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Response contient: `accessToken` et `refreshToken`

**📝 ACTION:** Remplacer votre accessToken par ce nouveau

---

### ✅ TEST 1.3 : Get Me (Utilisateur actuel)

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/auth/me`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Response contient vos infos utilisateur

---

### ✅ TEST 1.4 : Refresh Token

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/refresh`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "refreshToken": "VOTRE_REFRESH_TOKEN_ICI"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Nouveau `accessToken` retourné

---

### ✅ TEST 1.5 : Change Password

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/change-password`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "currentPassword": "TestPassword123",
  "newPassword": "NewPassword456"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Message de confirmation

**⚠️ IMPORTANT:** Reconnectez-vous avec le nouveau mot de passe après ce test !

---

### ✅ TEST 1.6 : Forgot Password

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/forgot-password`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@budgetwise.com"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Message : Email de réinitialisation envoyé

---

### ✅ TEST 1.7 : Test sans token (Doit échouer)

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:** (AUCUN - ne pas mettre Authorization)

**✅ RÉSULTAT ATTENDU:**
- Status: `401 Unauthorized`
- Message d'erreur

---

### ✅ TEST 1.8 : Test avec token invalide (Doit échouer)

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer token-invalide-123
```

**✅ RÉSULTAT ATTENDU:**
- Status: `401 Unauthorized`

---

### ✅ TEST 1.9 : Logout

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/auth/logout`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "refreshToken": "VOTRE_REFRESH_TOKEN"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`

**📝 ACTION:** Reconnectez-vous (TEST 1.2) pour continuer

---

## ═══════════════════════════════════════════
## 📌 SECTION 2 : USERS / PROFIL (8 tests)
## ═══════════════════════════════════════════

### ✅ TEST 2.1 : Get Profile

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Profil utilisateur retourné

---

### ✅ TEST 2.2 : Get Full Profile

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/profile/full`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Profil complet avec toutes les informations

---

### ✅ TEST 2.3 : Update Profile

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "city": "Paris",
  "country": "France"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Profil mis à jour

---

### ✅ TEST 2.4 : Get Settings

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/settings`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Paramètres utilisateur

---

### ✅ TEST 2.5 : Update Settings

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/users/settings`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "emailNotifications": true,
  "budgetAlerts": true,
  "transactionAlerts": false,
  "goalAlerts": true,
  "weeklyReport": true,
  "monthlyReport": true
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Paramètres mis à jour

---

### ✅ TEST 2.6 : Get Stats

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/users/stats`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Statistiques : nombre de comptes, transactions, budgets, objectifs

---

### ✅ TEST 2.7 : Upload Avatar (si implémenté)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/users/avatar`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**Body:** `form-data`
- Key: `avatar`
- Type: `File`
- Value: Sélectionner une image

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- URL de l'avatar retournée

---

### ✅ TEST 2.8 : Update Profile avec données invalides (Doit échouer)

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "email-invalide"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `400 Bad Request`
- Erreurs de validation

---

## ═══════════════════════════════════════════
## 📌 SECTION 3 : CATEGORIES (8 tests)
## ═══════════════════════════════════════════

### ✅ TEST 3.1 : Get All Categories

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/categories`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste de catégories (prédéfinies)

**📝 ACTION:** Copier un `categoryId` pour les tests suivants

---

### ✅ TEST 3.2 : Get Category by ID

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/categories/CATEGORY_ID_ICI`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Détails de la catégorie

---

### ✅ TEST 3.3 : Create Category (EXPENSE)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/categories`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Restaurants",
  "type": "EXPENSE",
  "icon": "🍽️",
  "color": "#f59e0b",
  "order": 100
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Catégorie créée avec un ID

**📝 ACTION:** Copier l'ID de cette catégorie

---

### ✅ TEST 3.4 : Create Category (INCOME)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/categories`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Salaire",
  "type": "INCOME",
  "icon": "💰",
  "color": "#10b981",
  "order": 1
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 3.5 : Update Category

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/categories/CATEGORY_ID_ICI`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Restaurants & Sorties",
  "color": "#ef4444",
  "order": 50
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Catégorie mise à jour

---

### ✅ TEST 3.6 : Get Categories with Totals

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/categories/with-totals?startDate=2026-01-01&endDate=2026-12-31`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Catégories avec totaux dépensés

---

### ✅ TEST 3.7 : Get Category Stats

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/categories/CATEGORY_ID/stats?startDate=2026-06-01&endDate=2026-06-30`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Statistiques de la catégorie

---

### ✅ TEST 3.8 : Create Category sans nom (Doit échouer)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/categories`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "EXPENSE",
  "icon": "🧪"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `400 Bad Request`
- Erreur de validation

---

## ═══════════════════════════════════════════
## 📌 SECTION 4 : ACCOUNTS (10 tests)
## ═══════════════════════════════════════════

### ✅ TEST 4.1 : Create Bank Account

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/accounts`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Compte Courant",
  "type": "BANK",
  "balance": 1500.00,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#3b82f6",
  "isDefault": true
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Compte créé

**📝 ACTION:** Copier l'`accountId`

---

### ✅ TEST 4.2 : Create Cash Account

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/accounts`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Espèces",
  "type": "CASH",
  "balance": 250.00,
  "currency": "EUR",
  "icon": "💵",
  "color": "#10b981"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 4.3 : Create Savings Account

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/accounts`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Livret A",
  "type": "SAVINGS",
  "balance": 5000.00,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#8b5cf6"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 4.4 : Get All Accounts

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste de tous vos comptes (3 comptes minimum)

---

### ✅ TEST 4.5 : Get Account by ID

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts/ACCOUNT_ID_ICI`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Détails du compte

---

### ✅ TEST 4.6 : Update Account

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/accounts/ACCOUNT_ID_ICI`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Compte Principal",
  "balance": 1750.00,
  "color": "#2563eb"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Compte mis à jour

---

### ✅ TEST 4.7 : Get Account Balance

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts/ACCOUNT_ID/balance`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Solde du compte

---

### ✅ TEST 4.8 : Get Account Stats

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts/ACCOUNT_ID/stats`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Statistiques du compte

---

### ✅ TEST 4.9 : Get Total Balance

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts/total-balance`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Solde total de tous les comptes

---

### ✅ TEST 4.10 : Get Accounts avec pagination

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/accounts?page=1&limit=2`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- 2 comptes maximum + infos pagination

---

## ═══════════════════════════════════════════
## 📌 SECTION 5 : TRANSACTIONS (12 tests)
## ═══════════════════════════════════════════

### ✅ TEST 5.1 : Create EXPENSE Transaction

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/transactions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "EXPENSE",
  "amount": 45.50,
  "currency": "EUR",
  "description": "Restaurant Le Gourmet",
  "categoryId": "VOTRE_CATEGORY_ID",
  "fromAccountId": "VOTRE_ACCOUNT_ID",
  "paymentMethod": "CARD",
  "date": "2026-06-30",
  "notes": "Déjeuner d'affaires"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Transaction créée

**📝 ACTION:** Copier le `transactionId`

---

### ✅ TEST 5.2 : Create INCOME Transaction

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/transactions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "INCOME",
  "amount": 2500.00,
  "currency": "EUR",
  "description": "Salaire mensuel",
  "categoryId": "INCOME_CATEGORY_ID",
  "toAccountId": "VOTRE_ACCOUNT_ID",
  "paymentMethod": "BANK_TRANSFER",
  "date": "2026-06-30"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 5.3 : Create TRANSFER Transaction

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/transactions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "TRANSFER",
  "amount": 100.00,
  "currency": "EUR",
  "description": "Virement interne",
  "fromAccountId": "ACCOUNT_ID_1",
  "toAccountId": "ACCOUNT_ID_2",
  "date": "2026-06-30"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 5.4 : Get All Transactions

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions?page=1&limit=20`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste de toutes vos transactions

---

### ✅ TEST 5.5 : Get Transaction by ID

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions/TRANSACTION_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Détails de la transaction

---

### ✅ TEST 5.6 : Update Transaction

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/transactions/TRANSACTION_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "description": "Restaurant Le Gourmet (Updated)",
  "amount": 50.00,
  "notes": "Déjeuner avec client"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Transaction mise à jour

---

### ✅ TEST 5.7 : Filter by Type (EXPENSE)

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions?type=EXPENSE`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Seulement les dépenses

---

### ✅ TEST 5.8 : Filter by Date Range

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions?startDate=2026-06-01&endDate=2026-06-30`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Transactions du mois de juin

---

### ✅ TEST 5.9 : Filter by Category

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions?categoryId=CATEGORY_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Transactions de cette catégorie

---

### ✅ TEST 5.10 : Search Transactions

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions?search=restaurant`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Transactions contenant "restaurant"

---

### ✅ TEST 5.11 : Get Transaction Stats

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/transactions/stats?startDate=2026-06-01&endDate=2026-06-30`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Total revenus, dépenses, balance

---

### ✅ TEST 5.12 : Create Transaction sans montant (Doit échouer)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/transactions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "EXPENSE",
  "description": "Test"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `400 Bad Request`
- Erreur de validation

---

## ═══════════════════════════════════════════
## 📌 SECTION 6 : BUDGETS (8 tests)
## ═══════════════════════════════════════════

### ✅ TEST 6.1 : Create MONTHLY Budget

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/budgets`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Budget Alimentation",
  "amount": 400.00,
  "currency": "EUR",
  "period": "MONTHLY",
  "startDate": "2026-06-01",
  "categoryId": "CATEGORY_ID",
  "alertThreshold": 80
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Budget créé

**📝 ACTION:** Copier le `budgetId`

---

### ✅ TEST 6.2 : Create YEARLY Budget

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/budgets`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Budget Vacances",
  "amount": 3000.00,
  "currency": "EUR",
  "period": "YEARLY",
  "startDate": "2026-01-01",
  "categoryId": "CATEGORY_ID",
  "alertThreshold": 90
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 6.3 : Get All Budgets

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/budgets`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste de vos budgets

---

### ✅ TEST 6.4 : Get Budget by ID

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/budgets/BUDGET_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Détails du budget

---

### ✅ TEST 6.5 : Update Budget

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/budgets/BUDGET_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "amount": 450.00,
  "alertThreshold": 85
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Budget mis à jour

---

### ✅ TEST 6.6 : Get Budget Progress

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/budgets/BUDGET_ID/progress`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Montant dépensé, pourcentage, reste

---

### ✅ TEST 6.7 : Get Budgets avec pagination

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/budgets?page=1&limit=10`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste paginée

---

### ✅ TEST 6.8 : Create Budget sans période (Doit échouer)

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/budgets`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Budget Test",
  "amount": 100
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `400 Bad Request`

---

## ═══════════════════════════════════════════
## 📌 SECTION 7 : GOALS (10 tests)
## ═══════════════════════════════════════════

### ✅ TEST 7.1 : Create Saving Goal

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/goals`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Vacances d'été",
  "description": "Voyage en Italie",
  "targetAmount": 2000.00,
  "currency": "EUR",
  "targetDate": "2027-08-01",
  "icon": "✈️",
  "color": "#14b8a6",
  "priority": 5,
  "monthlyContribution": 200.00
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Objectif créé

**📝 ACTION:** Copier le `goalId`

---

### ✅ TEST 7.2 : Create Another Goal

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/goals`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Nouvelle voiture",
  "description": "Achat d'une voiture électrique",
  "targetAmount": 15000.00,
  "currency": "EUR",
  "targetDate": "2028-12-31",
  "icon": "🚗",
  "color": "#3b82f6",
  "priority": 8,
  "monthlyContribution": 300.00
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 7.3 : Get All Goals

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/goals`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste de vos objectifs

---

### ✅ TEST 7.4 : Get Goal by ID

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/goals/GOAL_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Détails de l'objectif

---

### ✅ TEST 7.5 : Update Goal

**Méthode:** `PUT`  
**URL:** `{{baseUrl}}/goals/GOAL_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "targetAmount": 2500.00,
  "monthlyContribution": 250.00,
  "priority": 7
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Objectif mis à jour

---

### ✅ TEST 7.6 : Add Contribution

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/goals/GOAL_ID/contributions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "amount": 200.00,
  "description": "Contribution mensuelle juin"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`
- Contribution ajoutée

**📝 ACTION:** Copier le `contributionId`

---

### ✅ TEST 7.7 : Add Another Contribution

**Méthode:** `POST`  
**URL:** `{{baseUrl}}/goals/GOAL_ID/contributions`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "amount": 150.00,
  "description": "Contribution bonus"
}
```

**✅ RÉSULTAT ATTENDU:**
- Status: `201 Created`

---

### ✅ TEST 7.8 : Get Goal Progress

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/goals/GOAL_ID/progress`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Montant actuel, pourcentage, reste

---

### ✅ TEST 7.9 : Remove Contribution

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/goals/GOAL_ID/contributions/CONTRIBUTION_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Contribution supprimée

---

### ✅ TEST 7.10 : Get Goals avec pagination

**Méthode:** `GET`  
**URL:** `{{baseUrl}}/goals?page=1&limit=5`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Liste paginée

---

## ═══════════════════════════════════════════
## 📌 SECTION 8 : SUPPRESSIONS (6 tests)
## ═══════════════════════════════════════════

### ✅ TEST 8.1 : Delete Transaction

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/transactions/TRANSACTION_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Transaction supprimée

---

### ✅ TEST 8.2 : Delete Budget

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/budgets/BUDGET_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Budget supprimé

---

### ✅ TEST 8.3 : Delete Goal

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/goals/GOAL_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Objectif supprimé

---

### ✅ TEST 8.4 : Delete Category

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/categories/CATEGORY_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Catégorie supprimée

---

### ✅ TEST 8.5 : Delete Account

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/accounts/ACCOUNT_ID`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `200 OK`
- Compte supprimé

---

### ✅ TEST 8.6 : Delete ressource inexistante (Doit échouer)

**Méthode:** `DELETE`  
**URL:** `{{baseUrl}}/accounts/00000000-0000-0000-0000-000000000000`  
**Headers:**
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**✅ RÉSULTAT ATTENDU:**
- Status: `404 Not Found`

---

## ═══════════════════════════════════════════
## 📌 RÉSUMÉ FINAL
## ═══════════════════════════════════════════

## 📊 TOTAL DES TESTS : **71 TESTS**

### Par section:
- ✅ Authentication : 9 tests
- ✅ Users/Profil : 8 tests
- ✅ Categories : 8 tests
- ✅ Accounts : 10 tests
- ✅ Transactions : 12 tests
- ✅ Budgets : 8 tests
- ✅ Goals : 10 tests
- ✅ Suppressions : 6 tests

---

## ✅ BACKEND EST FONCTIONNEL SI :

- [x] Tous les tests retournent le code de statut attendu
- [x] Les données sont créées correctement dans la base
- [x] Les relations entre entités fonctionnent
- [x] Les validations rejettent les données invalides
- [x] L'authentification protège les routes correctement
- [x] Les filtres et recherches fonctionnent
- [x] Les suppressions fonctionnent sans erreur
- [x] Les statistiques sont calculées correctement

---

## 🎯 CHECKLIST COMPLÈTE

### Authentication ✅
- [ ] Register fonctionne
- [ ] Login fonctionne
- [ ] Token JWT valide
- [ ] Refresh token fonctionne
- [ ] Change password fonctionne
- [ ] Routes protégées refusent accès sans token
- [ ] Token invalide = 401
- [ ] Logout fonctionne

### Users ✅
- [ ] Get profile
- [ ] Update profile
- [ ] Get/Update settings
- [ ] Get stats
- [ ] Validation fonctionne

### Categories ✅
- [ ] Get all categories
- [ ] Create EXPENSE category
- [ ] Create INCOME category
- [ ] Update category
- [ ] Get with totals
- [ ] Delete category

### Accounts ✅
- [ ] Create BANK account
- [ ] Create CASH account
- [ ] Create SAVINGS account
- [ ] Get all accounts
- [ ] Update account
- [ ] Get balance
- [ ] Get total balance
- [ ] Delete account

### Transactions ✅
- [ ] Create EXPENSE
- [ ] Create INCOME
- [ ] Create TRANSFER
- [ ] Get all + pagination
- [ ] Filter by type
- [ ] Filter by date
- [ ] Filter by category
- [ ] Search
- [ ] Update transaction
- [ ] Get stats
- [ ] Delete transaction

### Budgets ✅
- [ ] Create MONTHLY budget
- [ ] Create YEARLY budget
- [ ] Get all budgets
- [ ] Update budget
- [ ] Get progress
- [ ] Delete budget

### Goals ✅
- [ ] Create goal
- [ ] Get all goals
- [ ] Update goal
- [ ] Add contribution
- [ ] Get progress
- [ ] Remove contribution
- [ ] Delete goal

---

## 💡 NOTES IMPORTANTES

1. **Ordre des tests** : Respecter l'ordre pour avoir les IDs nécessaires
2. **Copier les IDs** : Noter les IDs retournés pour les tests suivants
3. **Token** : Le copier après login et l'utiliser partout
4. **Validation** : Tester aussi les cas d'erreur
5. **Dates** : Utiliser le format YYYY-MM-DD
6. **Montants** : Utiliser des décimales (50.00 pas 50)

---

## 🎉 FÉLICITATIONS !

Si vous avez complété tous les tests avec succès, votre backend est **PLEINEMENT FONCTIONNEL** ! 🚀

Vous pouvez maintenant :
- ✅ Connecter le frontend
- ✅ Ajouter de nouvelles fonctionnalités
- ✅ Déployer en production
