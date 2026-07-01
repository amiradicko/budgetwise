# ⚡ Configuration Vercel - BudgetWise Frontend

## Framework Preset

```
Vite
```

## Root Directory

```
client
```

## Build Command

```bash
npm run build
```

## Output Directory

```
dist
```

## Install Command

```bash
npm install
```

## Environment Variables

Variable name: `VITE_API_URL`  
Value: `https://budgetwise-production.up.railway.app`

**⚠️ Remplacer par votre vraie URL Railway !**

---

## Checklist Configuration

- [ ] Framework → Vite
- [ ] Root Directory → `client`
- [ ] Build Command → `npm run build`
- [ ] Output Directory → `dist`
- [ ] Install Command → `npm install`
- [ ] Variable `VITE_API_URL` ajoutée avec URL Railway
- [ ] Deploy lancé
- [ ] URL publique copiée
- [ ] URL ajoutée dans Railway (CLIENT_URL et CORS_ORIGIN)

---

## Custom Domain (Optionnel)

Si vous avez un nom de domaine :

1. Settings → Domains
2. Add Domain → `budgetwise.com` ou `www.budgetwise.com`
3. Configurer les DNS selon les instructions Vercel
4. Mettre à jour `CLIENT_URL` et `CORS_ORIGIN` sur Railway

---

**Notes :**
- L'URL Railway doit correspondre exactement (avec ou sans trailing slash)
- Pas de `/api` à la fin de `VITE_API_URL`
- Vérifier que HTTPS est bien activé (automatique sur Vercel)
