# 🚀 BudgetWise API Endpoints

Documentation complète de l'API REST BudgetWise

**Base URL:** `http://localhost:5000/api/v1`

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "currency": "EUR",
  "language": "fr"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Logout
```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification-token"
}
```

### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "NewPassword123"
}
```

### Change Password (Protected)
```http
POST /auth/change-password
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### Get Current User (Protected)
```http
GET /auth/me
Authorization: Bearer <access-token>
```

---

## 👤 Users

### Get Profile (Protected)
```http
GET /users/profile
Authorization: Bearer <access-token>
```

### Get Full Profile (Protected)
```http
GET /users/profile/full
Authorization: Bearer <access-token>
```

### Update Profile (Protected)
```http
PUT /users/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "currency": "USD",
  "language": "en",
  "phone": "+33612345678",
  "city": "Paris",
  "country": "France"
}
```

### Upload Avatar (Protected)
```http
POST /users/avatar
Authorization: Bearer <access-token>
Content-Type: multipart/form-data

avatar: <file>
```

### Get Settings (Protected)
```http
GET /users/settings
Authorization: Bearer <access-token>
```

### Update Settings (Protected)
```http
PUT /users/settings
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "emailNotifications": true,
  "budgetAlerts": true,
  "transactionAlerts": true,
  "goalAlerts": true,
  "weeklyReport": false,
  "monthlyReport": true
}
```

### Delete Account (Protected)
```http
DELETE /users/account
Authorization: Bearer <access-token>
```

### Get User Stats (Protected)
```http
GET /users/stats
Authorization: Bearer <access-token>
```

---

## 💼 Accounts

### Get All Accounts (Protected)
```http
GET /accounts?page=1&limit=20
Authorization: Bearer <access-token>
```

### Get Account by ID (Protected)
```http
GET /accounts/:id
Authorization: Bearer <access-token>
```

### Create Account (Protected)
```http
POST /accounts
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Compte Principal",
  "type": "BANK",
  "balance": 5000,
  "currency": "EUR",
  "icon": "🏦",
  "color": "#3b82f6",
  "isDefault": true
}
```

### Update Account (Protected)
```http
PUT /accounts/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Compte Courant",
  "balance": 5500
}
```

### Delete Account (Protected)
```http
DELETE /accounts/:id
Authorization: Bearer <access-token>
```

### Get Account Balance (Protected)
```http
GET /accounts/:id/balance
Authorization: Bearer <access-token>
```

### Get Account Stats (Protected)
```http
GET /accounts/:id/stats
Authorization: Bearer <access-token>
```

### Get Total Balance (Protected)
```http
GET /accounts/total-balance
Authorization: Bearer <access-token>
```

---

## 💸 Transactions

### Get All Transactions (Protected)
```http
GET /transactions?page=1&limit=20&type=EXPENSE&categoryId=xxx&startDate=2026-01-01&endDate=2026-06-30&search=restaurant
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `type` - INCOME | EXPENSE | TRANSFER
- `categoryId` - Filter by category
- `fromAccountId` - Filter by source account
- `toAccountId` - Filter by destination account
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `search` - Search in description/notes

### Get Transaction by ID (Protected)
```http
GET /transactions/:id
Authorization: Bearer <access-token>
```

### Create Transaction (Protected)
```http
POST /transactions
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "type": "EXPENSE",
  "amount": 50.00,
  "currency": "EUR",
  "description": "Restaurant",
  "categoryId": "category-id",
  "fromAccountId": "account-id",
  "paymentMethod": "CARD",
  "date": "2026-06-30",
  "notes": "Déjeuner d'affaires"
}
```

### Update Transaction (Protected)
```http
PUT /transactions/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "description": "Restaurant - Déjeuner",
  "amount": 55.00
}
```

### Delete Transaction (Protected)
```http
DELETE /transactions/:id
Authorization: Bearer <access-token>
```

### Get Transaction Stats (Protected)
```http
GET /transactions/stats?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer <access-token>
```

---

## 🎯 Budgets

### Get All Budgets (Protected)
```http
GET /budgets?page=1&limit=20
Authorization: Bearer <access-token>
```

### Get Budget by ID (Protected)
```http
GET /budgets/:id
Authorization: Bearer <access-token>
```

### Create Budget (Protected)
```http
POST /budgets
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Budget Alimentation",
  "amount": 400,
  "currency": "EUR",
  "period": "MONTHLY",
  "startDate": "2026-06-01",
  "categoryId": "category-id",
  "alertThreshold": 80
}
```

**Periods:** `MONTHLY` | `QUARTERLY` | `YEARLY` | `CUSTOM`

### Update Budget (Protected)
```http
PUT /budgets/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 450,
  "alertThreshold": 90
}
```

### Delete Budget (Protected)
```http
DELETE /budgets/:id
Authorization: Bearer <access-token>
```

### Get Budget Progress (Protected)
```http
GET /budgets/:id/progress
Authorization: Bearer <access-token>
```

---

## 🎁 Saving Goals

### Get All Goals (Protected)
```http
GET /goals?page=1&limit=20
Authorization: Bearer <access-token>
```

### Get Goal by ID (Protected)
```http
GET /goals/:id
Authorization: Bearer <access-token>
```

### Create Goal (Protected)
```http
POST /goals
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Vacances d'été",
  "description": "Économiser pour les vacances",
  "targetAmount": 2000,
  "currency": "EUR",
  "targetDate": "2027-08-01",
  "icon": "✈️",
  "color": "#14b8a6",
  "priority": 5,
  "monthlyContribution": 200
}
```

### Update Goal (Protected)
```http
PUT /goals/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "targetAmount": 2500,
  "monthlyContribution": 250
}
```

### Delete Goal (Protected)
```http
DELETE /goals/:id
Authorization: Bearer <access-token>
```

### Add Contribution (Protected)
```http
POST /goals/:id/contributions
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 100,
  "description": "Contribution mensuelle"
}
```

### Remove Contribution (Protected)
```http
DELETE /goals/:id/contributions/:contributionId
Authorization: Bearer <access-token>
```

### Get Goal Progress (Protected)
```http
GET /goals/:id/progress
Authorization: Bearer <access-token>
```

---

## 📁 Categories

### Get All Categories (Protected)
```http
GET /categories
Authorization: Bearer <access-token>
```

### Get Category by ID (Protected)
```http
GET /categories/:id
Authorization: Bearer <access-token>
```

### Create Category (Protected)
```http
POST /categories
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Restaurants",
  "type": "EXPENSE",
  "icon": "🍽️",
  "color": "#f59e0b",
  "order": 10,
  "parentId": "parent-category-id"
}
```

### Update Category (Protected)
```http
PUT /categories/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Restaurants & Sorties",
  "color": "#ef4444"
}
```

### Delete Category (Protected)
```http
DELETE /categories/:id
Authorization: Bearer <access-token>
```

### Get Category Stats (Protected)
```http
GET /categories/:id/stats?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer <access-token>
```

### Get Categories with Totals (Protected)
```http
GET /categories/with-totals?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer <access-token>
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔒 Authentication

All protected endpoints require a JWT access token in the Authorization header:

```http
Authorization: Bearer <access-token>
```

Access tokens expire after **15 minutes**. Use the refresh token endpoint to obtain a new access token.

---

## 🌐 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 📦 Total Endpoints

- **Authentication:** 9 endpoints
- **Users:** 8 endpoints
- **Accounts:** 8 endpoints
- **Transactions:** 6 endpoints
- **Budgets:** 6 endpoints
- **Goals:** 8 endpoints
- **Categories:** 8 endpoints

**Total: 53 endpoints** ✅
