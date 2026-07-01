# 🔧 Configuration Railway - BudgetWise Backend

## Variables d'Environnement

Copier/Coller ces variables dans Railway (Variables tab) :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=GENERER-UN-SECRET-64-CARACTERES-ALEATOIRES
JWT_REFRESH_SECRET=GENERER-UN-AUTRE-SECRET-64-CARACTERES-DIFFERENT
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://budgetwise.vercel.app
CORS_ORIGIN=https://budgetwise.vercel.app
```

## Build & Start Commands

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Start Command:**
```bash
npm start
```

## Root Directory

```
server
```

## 🔐 Générer les Secrets JWT

**PowerShell :**
```powershell
# JWT_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# JWT_REFRESH_SECRET (générer une 2ème fois)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

**Ou utiliser :** https://randomkeygen.com/ (section "Fort Knox Passwords")

---

## Checklist Configuration

- [ ] Root Directory → `server`
- [ ] PostgreSQL database ajoutée
- [ ] Toutes les variables d'environnement configurées
- [ ] Secrets JWT générés (64+ caractères)
- [ ] Build command configuré
- [ ] Start command configuré
- [ ] Domaine public généré (Settings → Networking)
- [ ] URL copiée pour la configuration Vercel

---

**Notes :**
- `${{Postgres.DATABASE_URL}}` sera automatiquement remplacé par Railway
- Remplacer `budgetwise.vercel.app` par votre vraie URL Vercel
- Les secrets JWT doivent être DIFFÉRENTS et ALÉATOIRES
