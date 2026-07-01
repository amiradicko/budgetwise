# 🚀 CONNEXION FRONTEND ↔ BACKEND - GUIDE COMPLET

## ✅ MODIFICATIONS EFFECTUÉES

### 1️⃣ **Méthodes HTTP corrigées**

**Problème :** Le frontend utilisait `PATCH` mais le backend utilise `PUT`

**Fichiers modifiés :**
- ✅ `client/src/services/accounts.service.ts`
- ✅ `client/src/services/transactions.service.ts`
- ✅ `client/src/services/budgets.service.ts`
- ✅ `client/src/services/categories.service.ts`
- ✅ `client/src/services/goals.service.ts`

**Changement :**
```typescript
// Avant (❌)
api.patch(`/accounts/${id}`, data)

// Après (✅)
api.put(`/accounts/${id}`, data)
```

---

### 2️⃣ **Endpoint de refresh token corrigé**

**Problème :** URL incorrecte pour le refresh token

**Fichier modifié :** `client/src/lib/api.ts`

**Changement :**
```typescript
// Avant (❌)
await axios.post(`${API_URL}/auth/refresh`, { refreshToken })

// Après (✅)
await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken })
```

---

## 📊 STRUCTURE DE L'APPLICATION

### **Frontend (React + Vite)**
- **Port :** 5173
- **URL :** http://localhost:5173
- **Technologie :** React 18 + TypeScript + Tailwind CSS v4

### **Backend (Node.js + Express)**
- **Port :** 5000
- **URL :** http://localhost:5000/api/v1
- **Technologie :** Express + TypeScript + Prisma + PostgreSQL

---

## 🔌 CONFIGURATION API

### **Fichier : `client/src/lib/api.ts`**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Configuration automatique :**
- ✅ Ajoute automatiquement le token d'authentification
- ✅ Gère le refresh automatique du token
- ✅ Redirige vers /login si l'authentification échoue

---

## 📁 SERVICES FRONTEND

### **1. Auth Service**
```typescript
// client/src/services/auth.service.ts
authService.login(credentials)      // POST /auth/login
authService.register(data)          // POST /auth/register
authService.logout()                // POST /auth/logout
authService.getProfile()            // GET /auth/me
authService.changePassword()        // POST /auth/change-password
```

### **2. Accounts Service**
```typescript
// client/src/services/accounts.service.ts
accountsService.getAll()            // GET /accounts
accountsService.getById(id)         // GET /accounts/:id
accountsService.create(data)        // POST /accounts
accountsService.update(id, data)    // PUT /accounts/:id ✅ Corrigé
accountsService.delete(id)          // DELETE /accounts/:id
```

### **3. Transactions Service**
```typescript
// client/src/services/transactions.service.ts
transactionsService.getAll(filters) // GET /transactions?...
transactionsService.getById(id)     // GET /transactions/:id
transactionsService.create(data)    // POST /transactions
transactionsService.update(id, data)// PUT /transactions/:id ✅ Corrigé
transactionsService.delete(id)      // DELETE /transactions/:id
```

### **4. Budgets Service**
```typescript
// client/src/services/budgets.service.ts
budgetsService.getAll()             // GET /budgets
budgetsService.getById(id)          // GET /budgets/:id
budgetsService.create(data)         // POST /budgets
budgetsService.update(id, data)     // PUT /budgets/:id ✅ Corrigé
budgetsService.delete(id)           // DELETE /budgets/:id
```

### **5. Categories Service**
```typescript
// client/src/services/categories.service.ts
categoriesService.getAll()          // GET /categories
categoriesService.getById(id)       // GET /categories/:id
categoriesService.create(data)      // POST /categories
categoriesService.update(id, data)  // PUT /categories/:id ✅ Corrigé
categoriesService.delete(id)        // DELETE /categories/:id
```

### **6. Goals Service**
```typescript
// client/src/services/goals.service.ts
goalsService.getAll()               // GET /goals
goalsService.getById(id)            // GET /goals/:id
goalsService.create(data)           // POST /goals
goalsService.update(id, data)       // PUT /goals/:id ✅ Corrigé
goalsService.delete(id)             // DELETE /goals/:id
goalsService.addContribution()      // POST /goals/:id/contributions
```

---

## 🔐 GESTION DE L'AUTHENTIFICATION

### **Flux d'authentification**

**1. Login/Register :**
```typescript
// Frontend envoie
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Backend répond
{
  "success": true,
  "data": {
    "user": { id, email, firstName, ... },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}

// Frontend sauvegarde
localStorage.setItem('accessToken', accessToken)
localStorage.setItem('refreshToken', refreshToken)
```

**2. Requêtes authentifiées :**
```typescript
// Intercepteur ajoute automatiquement
headers: {
  Authorization: `Bearer ${accessToken}`
}
```

**3. Token expiré (après 15 min) :**
```typescript
// Si 401 Unauthorized
→ Appel automatique à POST /auth/refresh-token
→ Récupération du nouveau accessToken
→ Retry de la requête originale avec le nouveau token
```

**4. Refresh échoué :**
```typescript
→ Suppression des tokens
→ Redirection vers /login
```

---

## 🎯 STRUCTURE DES RÉPONSES

### **Réponse succès**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### **Réponse erreur**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 🧪 TESTER LA CONNEXION

### **1. Démarrer le backend**
```bash
cd server
npm run dev
```
✅ Attendre : "Server running on port 5000"

### **2. Démarrer le frontend**
```bash
cd client
npm run dev
```
✅ Ouvrir : http://localhost:5173

### **3. Tester l'authentification**
1. Aller sur http://localhost:5173/register
2. Créer un compte
3. Vérifier que vous êtes redirigé vers le dashboard
4. Ouvrir les DevTools (F12) → Network
5. Vérifier que les requêtes vers `http://localhost:5000/api/v1/...` fonctionnent

---

## 🔍 DÉBOGAGE

### **Frontend ne se connecte pas au backend**

**Vérifier :**
```bash
# 1. Backend est démarré ?
curl http://localhost:5000/health

# 2. CORS activé sur le backend ?
# Dans server/src/app.ts :
cors({
  origin: 'http://localhost:5173',
  credentials: true,
})
```

**Vérifier dans le navigateur :**
- F12 → Console → Erreurs CORS ?
- F12 → Network → Status 500/401/404 ?

### **Erreur "Network Error"**
→ Backend pas démarré ou port incorrect

### **Erreur 401 Unauthorized**
→ Token manquant ou invalide
→ Vérifier localStorage dans DevTools

### **Erreur 404 Not Found**
→ Route incorrecte
→ Vérifier que l'URL correspond au backend

---

## ✅ CHECKLIST DE VÉRIFICATION

- [ ] Backend démarré sur port 5000
- [ ] Frontend démarré sur port 5173
- [ ] PostgreSQL en cours d'exécution
- [ ] Migrations appliquées (`npm run migrate`)
- [ ] CORS configuré pour `http://localhost:5173`
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Token stocké dans localStorage après login
- [ ] Requêtes API affichées dans Network tab

---

## 🚀 PROCHAINES ÉTAPES

1. **Démarrer l'application complète**
   ```bash
   # Terminal 1 : Backend
   cd server
   npm run dev
   
   # Terminal 2 : Frontend
   cd client
   npm run dev
   ```

2. **Créer un compte**
   - Aller sur http://localhost:5173/register
   - Remplir le formulaire
   - Se connecter

3. **Tester les fonctionnalités**
   - Créer un compte bancaire
   - Ajouter une transaction
   - Créer un budget
   - Définir un objectif d'épargne

---

## 📚 DOCUMENTATION

- **API Backend :** `server/API_ENDPOINTS.md`
- **Tests Postman :** `server/TESTS_MANUELS_POSTMAN.md`
- **Guide rapide :** `server/QUICK_TEST_GUIDE.md`

---

## 🎉 RÉSUMÉ

✅ **Tous les services frontend utilisent maintenant PUT au lieu de PATCH**
✅ **Endpoint de refresh token corrigé**
✅ **Structure de réponse compatible avec le backend**
✅ **Authentification avec tokens JWT fonctionnelle**
✅ **Gestion automatique du refresh des tokens**

**Le frontend est maintenant complètement connecté au backend !** 🚀
