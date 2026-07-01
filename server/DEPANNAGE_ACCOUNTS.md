# 🔧 DÉPANNAGE : GET /api/v1/accounts ne fonctionne pas

## 🚨 PROBLÈME : L'endpoint ne répond pas

---

## ✅ SOLUTION RAPIDE (Checklist)

### 1️⃣ Vérifier que le serveur est démarré

```bash
cd server
npm run dev
```

**✅ Vous devez voir :**
```
Server running on port 5000
Database connected successfully
```

❌ **Si vous voyez une erreur** → Lire le message d'erreur dans le terminal

---

### 2️⃣ Tester sans authentification d'abord

**Test 1 : Health Check (sans auth)**
```
GET http://localhost:5000/health
```

**✅ Si ça marche :**
```json
{
  "success": true,
  "message": "Server is running"
}
```

❌ **Si ça ne marche pas :** Le serveur n'est pas démarré ou le port 5000 est occupé

---

### 3️⃣ PROBLÈME PRINCIPAL : Token d'authentification manquant

L'endpoint `/api/v1/accounts` **NÉCESSITE un token d'authentification** !

#### ❌ MAUVAISE REQUÊTE (ne marchera jamais) :
```
GET http://localhost:5000/api/v1/accounts
```

#### ✅ BONNE REQUÊTE (avec token) :
```
GET http://localhost:5000/api/v1/accounts
Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI
```

---

## 🔐 COMMENT OBTENIR LE TOKEN

### Étape 1 : Se connecter d'abord

**Requête LOGIN :**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@budgetwise.com",
  "password": "Password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### Étape 2 : Copier le accessToken

📝 Copier tout le texte du `accessToken` (commence par eyJ...)

### Étape 3 : Utiliser le token dans Postman

**Dans Postman :**
1. Aller dans l'onglet **Headers**
2. Ajouter un nouveau header :
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   
⚠️ **IMPORTANT :** Il FAUT le mot `Bearer` suivi d'un espace avant le token !

---

## 📋 TEST COMPLET DANS POSTMAN

### ✅ Configuration correcte :

**Method:** `GET`

**URL:** `http://localhost:5000/api/v1/accounts`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI...
Content-Type: application/json
```

**Body:** (vide pour GET)

---

## 🐛 ERREURS COURANTES

### Erreur 1️⃣ : 401 Unauthorized

**Message :**
```json
{
  "success": false,
  "message": "No token provided" 
}
```

**❌ CAUSE :** Vous n'avez pas mis le header `Authorization`

**✅ SOLUTION :** Ajouter le header `Authorization: Bearer TOKEN`

---

### Erreur 2️⃣ : 401 Invalid token

**Message :**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**❌ CAUSES POSSIBLES :**
1. Token mal copié (espaces, caractères manquants)
2. Token expiré (expire après 15 minutes)
3. Oubli du mot "Bearer" avant le token

**✅ SOLUTION :** Se reconnecter pour obtenir un nouveau token

---

### Erreur 3️⃣ : Cannot GET /api/v1/accounts

**❌ CAUSE :** Le serveur n'est pas démarré

**✅ SOLUTION :**
```bash
cd server
npm run dev
```

---

### Erreur 4️⃣ : ECONNREFUSED

**Message :**
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**❌ CAUSE :** Le serveur backend n'est pas lancé

**✅ SOLUTION :**
```bash
cd server
npm run dev
```

---

### Erreur 5️⃣ : Database connection error

**❌ CAUSE :** PostgreSQL n'est pas lancé ou mal configuré

**✅ SOLUTION :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier le fichier `.env` :
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/budgetwise"
   ```
3. Relancer les migrations :
   ```bash
   npm run migrate
   ```

---

## 🧪 TESTS ÉTAPE PAR ÉTAPE

### ✅ TEST 1 : Serveur fonctionne ?

```bash
# Dans le terminal
cd server
npm run dev
```

Attendez de voir : `Server running on port 5000`

---

### ✅ TEST 2 : Health check

**Dans Postman :**
```
GET http://localhost:5000/health
```

**Résultat attendu :** `200 OK`

---

### ✅ TEST 3 : Login

**Dans Postman :**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@budgetwise.com",
  "password": "Password123"
}
```

**Résultat attendu :** `200 OK` avec `accessToken`

**📝 ACTION :** Copier le `accessToken` complet

---

### ✅ TEST 4 : Get Accounts (AVEC TOKEN)

**Dans Postman :**

**Method :** `GET`  
**URL :** `http://localhost:5000/api/v1/accounts`  
**Headers :**
```
Authorization: Bearer COLLER_LE_TOKEN_ICI
```

**Résultat attendu :** `200 OK` avec liste de comptes

---

## 💡 ASTUCE POSTMAN

### Utiliser les variables d'environnement

1. Créer un environnement "BudgetWise Local"
2. Ajouter une variable `accessToken`
3. Dans l'onglet **Tests** du Login, ajouter :

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.accessToken);
}
```

4. Dans les autres requêtes, utiliser :
```
Authorization: Bearer {{accessToken}}
```

---

## 🔍 VÉRIFIER LES LOGS DU SERVEUR

Quand vous faites la requête, regardez le terminal du serveur :

**✅ Requête réussie :**
```
GET /api/v1/accounts 200 45ms
```

**❌ Erreur d'authentification :**
```
GET /api/v1/accounts 401 12ms
```

**❌ Erreur serveur :**
```
GET /api/v1/accounts 500 102ms
[Error details...]
```

---

## 📊 CHECKLIST COMPLÈTE

- [ ] Le serveur est démarré (`npm run dev`)
- [ ] PostgreSQL est lancé
- [ ] Les migrations sont à jour (`npm run migrate`)
- [ ] Le fichier `.env` est configuré
- [ ] J'ai fait un LOGIN et récupéré le token
- [ ] J'ai copié le token COMPLET
- [ ] J'ai ajouté le header `Authorization: Bearer TOKEN`
- [ ] Le mot "Bearer" est bien présent avant le token
- [ ] Il y a bien un espace entre "Bearer" et le token
- [ ] Le token n'est pas expiré (moins de 15 minutes)

---

## 🎯 EXEMPLE COMPLET FONCTIONNEL

### 1. Login
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@budgetwise.com",
  "password": "Password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHd5...",
    "user": { ... }
  }
}
```

### 2. Get Accounts (avec le token)
```http
GET http://localhost:5000/api/v1/accounts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHd5...
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Compte Principal",
      "type": "BANK",
      "balance": 1500.00,
      "currency": "EUR"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 🆘 TOUJOURS PAS DE SOLUTION ?

### Envoyez-moi ces informations :

1. **Le message d'erreur complet** que vous voyez dans Postman
2. **Les logs du serveur** dans le terminal
3. **Screenshot de vos headers** dans Postman
4. **La réponse complète** de la requête

---

## ✅ SI ÇA MARCHE MAINTENANT

Vous verrez :
- Status : `200 OK`
- Body : Liste de vos comptes (peut être vide `[]` si vous n'avez pas créé de comptes)

**Si la liste est vide**, c'est normal ! Créez un compte d'abord :

```http
POST http://localhost:5000/api/v1/accounts
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json

{
  "name": "Mon Compte",
  "type": "BANK",
  "balance": 1000,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#3b82f6"
}
```

Ensuite refaites le `GET /accounts` → vous verrez votre compte !

---

## 🎉 RÉSUMÉ

**LE PROBLÈME :** L'endpoint GET /accounts nécessite l'authentification

**LA SOLUTION :** 
1. Se connecter avec POST /auth/login
2. Récupérer le accessToken
3. L'ajouter dans le header : `Authorization: Bearer TOKEN`
4. Faire la requête GET /accounts

**C'EST TOUT !** 🚀
