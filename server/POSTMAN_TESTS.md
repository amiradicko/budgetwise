# 🧪 Guide de Tests Postman - BudgetWise Backend

Guide complet pour tester tous les endpoints de l'API BudgetWise

**Base URL:** `http://localhost:5000/api/v1`

---

## ⚙️ Configuration Postman

### 1. Créer une Collection
- Nom: `BudgetWise API`
- Base URL: `http://localhost:5000/api/v1`

### 2. Créer des Variables d'Environnement
```
baseUrl: http://localhost:5000/api/v1
accessToken: (sera rempli automatiquement après login)
refreshToken: (sera rempli automatiquement après login)
userId: (sera rempli automatiquement)
accountId: (sera créé pendant les tests)
categoryId: (sera créé pendant les tests)
transactionId: (sera créé pendant les tests)
budgetId: (sera créé pendant les tests)
goalId: (sera créé pendant les tests)
```

---

## 🔥 Tests Essentiels (Dans cet ordre)

### ✅ ÉTAPE 1: Vérifier que le serveur fonctionne

#### Test 1.1: Health Check
```
GET {{baseUrl}}/health
```
**Résultat attendu:** 200 OK
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

---

### ✅ ÉTAPE 2: Authentication & Inscription

#### Test 2.1: Créer un nouveau compte utilisateur
```
POST {{baseUrl}}/auth/register
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

**Script Post-Response (onglet Tests):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.accessToken);
    pm.environment.set("refreshToken", response.data.refreshToken);
    pm.environment.set("userId", response.data.user.id);
}
```

**Résultat attendu:** 201 Created
- Retourne les tokens (accessToken, refreshToken)
- Retourne les infos utilisateur

#### Test 2.2: Se connecter
```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@budgetwise.com",
  "password": "TestPassword123"
}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.accessToken);
    pm.environment.set("refreshToken", response.data.refreshToken);
}
```

**Résultat attendu:** 200 OK
- Tokens JWT valides

#### Test 2.3: Obtenir l'utilisateur actuel
```
GET {{baseUrl}}/auth/me
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Infos de l'utilisateur connecté

#### Test 2.4: Rafraîchir le token
```
POST {{baseUrl}}/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}
```

**Résultat attendu:** 200 OK
- Nouveau accessToken

---

### ✅ ÉTAPE 3: Profil Utilisateur

#### Test 3.1: Obtenir le profil
```
GET {{baseUrl}}/users/profile
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 3.2: Mettre à jour le profil
```
PUT {{baseUrl}}/users/profile
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "firstName": "Test Updated",
  "lastName": "User Updated",
  "phone": "+33612345678",
  "city": "Paris",
  "country": "France"
}
```

**Résultat attendu:** 200 OK

#### Test 3.3: Obtenir les paramètres
```
GET {{baseUrl}}/users/settings
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 3.4: Mettre à jour les paramètres
```
PUT {{baseUrl}}/users/settings
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "emailNotifications": true,
  "budgetAlerts": true,
  "transactionAlerts": false,
  "goalAlerts": true,
  "weeklyReport": true,
  "monthlyReport": true
}
```

**Résultat attendu:** 200 OK

#### Test 3.5: Obtenir les statistiques utilisateur
```
GET {{baseUrl}}/users/stats
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Total comptes, transactions, budgets, objectifs

---

### ✅ ÉTAPE 4: Catégories

#### Test 4.1: Obtenir toutes les catégories
```
GET {{baseUrl}}/categories
Authorization: Bearer {{accessToken}}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.length > 0) {
        pm.environment.set("categoryId", response.data[0].id);
    }
}
```

**Résultat attendu:** 200 OK
- Liste des catégories (prédéfinies + custom)

#### Test 4.2: Créer une catégorie personnalisée
```
POST {{baseUrl}}/categories
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Test Catégorie",
  "type": "EXPENSE",
  "icon": "🧪",
  "color": "#ff6b6b",
  "order": 100
}
```

**Résultat attendu:** 201 Created

#### Test 4.3: Mettre à jour une catégorie
```
PUT {{baseUrl}}/categories/{{categoryId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Test Catégorie Updated",
  "color": "#4ecdc4"
}
```

**Résultat attendu:** 200 OK

#### Test 4.4: Obtenir les catégories avec totaux
```
GET {{baseUrl}}/categories/with-totals?startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

---

### ✅ ÉTAPE 5: Comptes

#### Test 5.1: Créer un compte bancaire
```
POST {{baseUrl}}/accounts
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Compte Test",
  "type": "BANK",
  "balance": 1000,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#3b82f6",
  "isDefault": true
}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("accountId", response.data.id);
}
```

**Résultat attendu:** 201 Created

#### Test 5.2: Créer un compte en espèces
```
POST {{baseUrl}}/accounts
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Espèces",
  "type": "CASH",
  "balance": 200,
  "currency": "EUR",
  "icon": "💵",
  "color": "#10b981"
}
```

**Résultat attendu:** 201 Created

#### Test 5.3: Obtenir tous les comptes
```
GET {{baseUrl}}/accounts
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Liste de tous les comptes

#### Test 5.4: Obtenir un compte par ID
```
GET {{baseUrl}}/accounts/{{accountId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 5.5: Mettre à jour un compte
```
PUT {{baseUrl}}/accounts/{{accountId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Compte Principal Updated",
  "balance": 1500
}
```

**Résultat attendu:** 200 OK

#### Test 5.6: Obtenir le solde d'un compte
```
GET {{baseUrl}}/accounts/{{accountId}}/balance
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 5.7: Obtenir les stats d'un compte
```
GET {{baseUrl}}/accounts/{{accountId}}/stats
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 5.8: Obtenir le solde total
```
GET {{baseUrl}}/accounts/total-balance
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

---

### ✅ ÉTAPE 6: Transactions

#### Test 6.1: Créer une dépense
```
POST {{baseUrl}}/transactions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "type": "EXPENSE",
  "amount": 50.00,
  "currency": "EUR",
  "description": "Test Restaurant",
  "categoryId": "{{categoryId}}",
  "fromAccountId": "{{accountId}}",
  "paymentMethod": "CARD",
  "date": "2026-06-30",
  "notes": "Test transaction"
}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("transactionId", response.data.id);
}
```

**Résultat attendu:** 201 Created

#### Test 6.2: Créer un revenu
```
POST {{baseUrl}}/transactions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "type": "INCOME",
  "amount": 2000.00,
  "currency": "EUR",
  "description": "Salaire",
  "categoryId": "{{categoryId}}",
  "toAccountId": "{{accountId}}",
  "paymentMethod": "BANK_TRANSFER",
  "date": "2026-06-30"
}
```

**Résultat attendu:** 201 Created

#### Test 6.3: Obtenir toutes les transactions
```
GET {{baseUrl}}/transactions?page=1&limit=20
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Liste paginée des transactions

#### Test 6.4: Filtrer les transactions par type
```
GET {{baseUrl}}/transactions?type=EXPENSE
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 6.5: Filtrer par date
```
GET {{baseUrl}}/transactions?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 6.6: Rechercher dans les transactions
```
GET {{baseUrl}}/transactions?search=restaurant
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 6.7: Obtenir une transaction par ID
```
GET {{baseUrl}}/transactions/{{transactionId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 6.8: Mettre à jour une transaction
```
PUT {{baseUrl}}/transactions/{{transactionId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "description": "Restaurant Updated",
  "amount": 55.00
}
```

**Résultat attendu:** 200 OK

#### Test 6.9: Obtenir les statistiques des transactions
```
GET {{baseUrl}}/transactions/stats?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Total revenus, dépenses, balance

---

### ✅ ÉTAPE 7: Budgets

#### Test 7.1: Créer un budget mensuel
```
POST {{baseUrl}}/budgets
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Budget Test",
  "amount": 500,
  "currency": "EUR",
  "period": "MONTHLY",
  "startDate": "2026-06-01",
  "categoryId": "{{categoryId}}",
  "alertThreshold": 80
}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("budgetId", response.data.id);
}
```

**Résultat attendu:** 201 Created

#### Test 7.2: Obtenir tous les budgets
```
GET {{baseUrl}}/budgets
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 7.3: Obtenir un budget par ID
```
GET {{baseUrl}}/budgets/{{budgetId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 7.4: Mettre à jour un budget
```
PUT {{baseUrl}}/budgets/{{budgetId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "amount": 600,
  "alertThreshold": 90
}
```

**Résultat attendu:** 200 OK

#### Test 7.5: Obtenir la progression d'un budget
```
GET {{baseUrl}}/budgets/{{budgetId}}/progress
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Montant dépensé, pourcentage, reste

---

### ✅ ÉTAPE 8: Objectifs d'Épargne

#### Test 8.1: Créer un objectif
```
POST {{baseUrl}}/goals
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Test Goal",
  "description": "Objectif de test",
  "targetAmount": 1000,
  "currency": "EUR",
  "targetDate": "2027-12-31",
  "icon": "🎯",
  "color": "#14b8a6",
  "priority": 5,
  "monthlyContribution": 100
}
```

**Script Post-Response:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("goalId", response.data.id);
}
```

**Résultat attendu:** 201 Created

#### Test 8.2: Obtenir tous les objectifs
```
GET {{baseUrl}}/goals
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 8.3: Obtenir un objectif par ID
```
GET {{baseUrl}}/goals/{{goalId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 8.4: Ajouter une contribution
```
POST {{baseUrl}}/goals/{{goalId}}/contributions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "amount": 100,
  "description": "Contribution de test"
}
```

**Résultat attendu:** 201 Created

#### Test 8.5: Obtenir la progression d'un objectif
```
GET {{baseUrl}}/goals/{{goalId}}/progress
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK
- Montant actuel, pourcentage, reste

#### Test 8.6: Mettre à jour un objectif
```
PUT {{baseUrl}}/goals/{{goalId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "targetAmount": 1200,
  "monthlyContribution": 120
}
```

**Résultat attendu:** 200 OK

---

### ✅ ÉTAPE 9: Tests de Sécurité

#### Test 9.1: Accès sans token (doit échouer)
```
GET {{baseUrl}}/users/profile
```

**Résultat attendu:** 401 Unauthorized

#### Test 9.2: Token invalide (doit échouer)
```
GET {{baseUrl}}/users/profile
Authorization: Bearer invalid-token-here
```

**Résultat attendu:** 401 Unauthorized

#### Test 9.3: Changer le mot de passe
```
POST {{baseUrl}}/auth/change-password
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "currentPassword": "TestPassword123",
  "newPassword": "NewPassword456"
}
```

**Résultat attendu:** 200 OK

---

### ✅ ÉTAPE 10: Tests de Suppression

#### Test 10.1: Supprimer une transaction
```
DELETE {{baseUrl}}/transactions/{{transactionId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 10.2: Supprimer un budget
```
DELETE {{baseUrl}}/budgets/{{budgetId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 10.3: Supprimer un objectif
```
DELETE {{baseUrl}}/goals/{{goalId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 10.4: Supprimer un compte
```
DELETE {{baseUrl}}/accounts/{{accountId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

#### Test 10.5: Supprimer une catégorie
```
DELETE {{baseUrl}}/categories/{{categoryId}}
Authorization: Bearer {{accessToken}}
```

**Résultat attendu:** 200 OK

---

### ✅ ÉTAPE 11: Logout

#### Test 11.1: Se déconnecter
```
POST {{baseUrl}}/auth/logout
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}
```

**Résultat attendu:** 200 OK

---

## 📊 Checklist Complète

### Authentication ✅
- [x] Register
- [x] Login
- [x] Get Me
- [x] Refresh Token
- [x] Change Password
- [x] Logout

### Users ✅
- [x] Get Profile
- [x] Update Profile
- [x] Get Settings
- [x] Update Settings
- [x] Get Stats

### Categories ✅
- [x] Get All
- [x] Create
- [x] Update
- [x] Get with Totals
- [x] Delete

### Accounts ✅
- [x] Create (BANK)
- [x] Create (CASH)
- [x] Get All
- [x] Get by ID
- [x] Update
- [x] Get Balance
- [x] Get Stats
- [x] Get Total Balance
- [x] Delete

### Transactions ✅
- [x] Create (EXPENSE)
- [x] Create (INCOME)
- [x] Get All (paginated)
- [x] Filter by Type
- [x] Filter by Date
- [x] Search
- [x] Get by ID
- [x] Update
- [x] Get Stats
- [x] Delete

### Budgets ✅
- [x] Create
- [x] Get All
- [x] Get by ID
- [x] Update
- [x] Get Progress
- [x] Delete

### Goals ✅
- [x] Create
- [x] Get All
- [x] Get by ID
- [x] Add Contribution
- [x] Get Progress
- [x] Update
- [x] Delete

### Security ✅
- [x] Unauthorized Access
- [x] Invalid Token
- [x] Protected Routes

---

## 🎯 Résultats Attendus Globaux

### Après tous les tests, vous devriez avoir:
- ✅ Utilisateur créé et authentifié
- ✅ Profil configuré
- ✅ Au moins 2 comptes créés
- ✅ Plusieurs transactions créées
- ✅ Au moins 1 budget créé
- ✅ Au moins 1 objectif créé
- ✅ Catégories disponibles et modifiables
- ✅ Toutes les opérations CRUD testées
- ✅ Sécurité validée

---

## 💡 Conseils

1. **Exécuter dans l'ordre** - Les tests dépendent les uns des autres
2. **Utiliser les scripts** - Automatiser la sauvegarde des IDs
3. **Vérifier les codes de statut** - 200/201 = succès
4. **Tester les erreurs** - Essayer avec des données invalides
5. **Nettoyer après les tests** - Supprimer les données de test

---

## 🚨 Tests d'Erreurs Supplémentaires

### Validation
```
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "123"
}
```
**Résultat attendu:** 400 Bad Request avec détails des erreurs

### Données manquantes
```
POST {{baseUrl}}/accounts
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Test"
}
```
**Résultat attendu:** 400 Bad Request

### Ressource inexistante
```
GET {{baseUrl}}/accounts/00000000-0000-0000-0000-000000000000
Authorization: Bearer {{accessToken}}
```
**Résultat attendu:** 404 Not Found

---

## ✅ Backend est fonctionnel si:
- [x] Tous les tests retournent les codes de statut attendus
- [x] Les données sont persistées correctement
- [x] L'authentification fonctionne
- [x] Les relations entre entités sont respectées
- [x] Les validations rejettent les données invalides
- [x] Les tokens JWT sont valides et sécurisés
