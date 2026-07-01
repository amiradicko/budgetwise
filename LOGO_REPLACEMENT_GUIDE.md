# 🔄 Guide Rapide : Remplacer le Logo Nefertiti Digital Solutions

## ⚠️ Important

Le logo actuel `nefertiti-logo.svg` est un **placeholder** (logo temporaire). Vous devez le remplacer par votre **logo officiel** Nefertiti Digital Solutions avant le déploiement en production.

---

## 📋 Étapes Simples

### Étape 1 : Préparer Votre Logo

**Format requis :** SVG (vectoriel)  
**Dimensions recommandées :** 200x50 pixels (ou ratio similaire)  
**Fond :** Transparent  
**Couleurs :** Cohérentes avec votre identité (cyan/bleu de préférence)  

**Assurez-vous que votre logo :**
- ✅ Est lisible à petite taille (6-8px de hauteur)
- ✅ Fonctionne sur fond clair ET foncé
- ✅ Contient "NEFERTITI DIGITAL SOLUTIONS" (ou juste "NDS" pour les petites tailles)

---

### Étape 2 : Remplacer le Fichier SVG

**Option A : Via l'explorateur de fichiers**
1. Ouvrir `c:\Users\user\budgetwise\client\public\`
2. Sauvegarder l'ancien logo :
   - Renommer `nefertiti-logo.svg` en `nefertiti-logo-old.svg`
3. Copier votre nouveau logo dans ce dossier
4. Renommer votre logo en `nefertiti-logo.svg`

**Option B : Via PowerShell**
```powershell
cd c:\Users\user\budgetwise\client\public

# Sauvegarder l'ancien
mv nefertiti-logo.svg nefertiti-logo-old.svg

# Copier le nouveau (adaptez le chemin)
cp C:\chemin\vers\votre\logo.svg nefertiti-logo.svg
```

---

### Étape 3 : Régénérer le PNG

Le logo PNG est utilisé dans certains composants pour de meilleures performances.

```powershell
cd c:\Users\user\budgetwise\client
node scripts\generate-nds-logo.mjs
```

**Résultat attendu :**
```
🎨 Génération du logo Nefertiti Digital Solutions...

✅ nefertiti-logo.png créé

🎉 Logo Nefertiti Digital Solutions généré avec succès!
```

---

### Étape 4 : Vérifier le Résultat

#### 1. Démarrer l'application
```powershell
# Terminal 1 : Serveur
cd server
npm run dev

# Terminal 2 : Client
cd client
npm run dev
```

#### 2. Tester visuellement

**Ouvrir :** http://localhost:5174

**Vérifier ces emplacements :**

✅ **Splash Screen (3 premières secondes)**
- Votre logo apparaît sous le logo BudgetWise
- Taille adaptée
- Lisible

✅ **Page de Connexion** (`/login`)
- Logo en bas du formulaire
- Taille : ~6px de hauteur
- Lisible sur fond blanc

✅ **Page d'Inscription** (`/register`)
- Logo en bas du formulaire
- Identique à la page de connexion

✅ **Dashboard** (`/dashboard`)
- Badge flottant en bas à droite
- Votre logo à côté de "Powered by"
- Taille : ~5px de hauteur

✅ **Footer (toutes les pages)**
- Logo dans le footer central
- Taille : ~5px de hauteur
- Visible sur fond clair et foncé

✅ **Page À propos** (`/about`)
- Logo en haut à droite (à côté de BudgetWise)
- Taille : ~16px de hauteur
- Bien visible

✅ **Page 404** (route invalide comme `/test`)
- Logo en bas de page
- Taille : ~6px de hauteur
- Lisible sur fond noir spatial

---

### Étape 5 : Ajustements (si nécessaire)

#### Si le logo est trop grand/petit

**Fichiers à modifier :**

1. **SplashScreen.tsx** (Logo principal au démarrage)
   ```tsx
   // Ligne ~53
   <img 
     src="/nefertiti-logo.png" 
     className="h-8 object-contain"  // ← Changer h-8 (32px)
   />
   ```

2. **Footer.tsx** (Footer global)
   ```tsx
   // Ligne ~18
   <img 
     className="h-5 object-contain"  // ← Changer h-5 (20px)
   />
   ```

3. **NDSBadge.tsx** (Badge dashboard)
   ```tsx
   // Ligne ~9
   <img 
     className="h-5 object-contain"  // ← Changer h-5 (20px)
   />
   ```

4. **LoginPage.tsx** & **RegisterPage.tsx**
   ```tsx
   // Ligne ~180 (login) / ~185 (register)
   <img 
     className="h-6 object-contain"  // ← Changer h-6 (24px)
   />
   ```

5. **AboutPage.tsx** (Header page)
   ```tsx
   // Ligne ~28
   <img 
     className="h-16 object-contain"  // ← Changer h-16 (64px)
   />
   ```

6. **NotFoundPage.tsx** (Page 404)
   ```tsx
   // Ligne ~55
   <img 
     className="h-6 object-contain"  // ← Changer h-6 (24px)
   />
   ```

**Tailles Tailwind disponibles :**
- `h-4` = 16px
- `h-5` = 20px
- `h-6` = 24px
- `h-8` = 32px
- `h-10` = 40px
- `h-12` = 48px
- `h-16` = 64px

---

#### Si le logo n'est pas lisible sur fond sombre

**Option 1 : Ajouter un fond blanc**
```tsx
<img 
  src="/nefertiti-logo.png" 
  className="h-6 object-contain bg-white px-2 py-1 rounded"
/>
```

**Option 2 : Créer une version dark mode**
1. Créer `nefertiti-logo-dark.svg` (version claire pour fond sombre)
2. Modifier les composants :
```tsx
<img 
  src="/nefertiti-logo.png" 
  className="h-6 object-contain dark:hidden"
/>
<img 
  src="/nefertiti-logo-dark.png" 
  className="h-6 object-contain hidden dark:block"
/>
```

---

## 🎨 Personnalisation Avancée

### Changer les Couleurs NDS

Si votre logo officiel utilise des couleurs différentes de cyan/bleu :

**Fichiers à modifier :**

1. **index.html** - Theme color
   ```html
   <meta name="theme-color" content="#VOTRE_COULEUR" />
   ```

2. **vite.config.ts** - PWA manifest
   ```typescript
   theme_color: '#VOTRE_COULEUR',
   background_color: '#VOTRE_COULEUR_FOND',
   ```

3. **SplashScreen.tsx** - Gradients
   ```tsx
   // Remplacer toutes les occurrences de :
   from-[#00d9ff] via-[#0088ff] to-[#0055ff]
   // Par :
   from-[#VOTRE_COULEUR1] via-[#VOTRE_COULEUR2] to-[#VOTRE_COULEUR3]
   ```

4. **Autres composants** - Chercher et remplacer
   ```
   #00d9ff → VOTRE_COULEUR_PRINCIPALE
   #0088ff → VOTRE_COULEUR_SECONDAIRE
   #0055ff → VOTRE_COULEUR_TERTIAIRE
   ```

---

## ✅ Checklist Finale

Après avoir remplacé le logo :

- [ ] Fichier `nefertiti-logo.svg` remplacé
- [ ] PNG régénéré avec succès
- [ ] Application démarrée sans erreur
- [ ] Splash screen : logo visible et lisible
- [ ] Login/Register : logo en bas du formulaire
- [ ] Dashboard : badge avec logo
- [ ] Footer : logo visible sur toutes les pages
- [ ] Page About : logo en header
- [ ] Page 404 : logo en bas
- [ ] Taille du logo adaptée partout
- [ ] Lisible sur fond clair ET foncé
- [ ] Mode sombre testé
- [ ] Responsive mobile testé

---

## 🚨 Problèmes Courants

### Logo ne s'affiche pas
**Solution :**
1. Vérifier que le fichier existe : `client\public\nefertiti-logo.png`
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Redémarrer le serveur de développement

### Logo pixelisé
**Solution :**
1. Utiliser un SVG de meilleure qualité
2. Augmenter la résolution du PNG généré dans `generate-nds-logo.mjs`

### Logo trop grand/petit
**Solution :**
Modifier les classes `h-X` dans chaque composant (voir section Ajustements)

### Erreur lors de la génération du PNG
**Solution :**
1. Vérifier que `sharp` est installé : `npm install sharp`
2. Vérifier que le SVG est valide (ouvrir dans un navigateur)
3. Vérifier les permissions du dossier `client\public\`

---

## 📚 Documentation Complète

Pour plus de détails sur le système de branding :

📖 **[BRANDING_NDS.md](./BRANDING_NDS.md)** - Documentation complète du branding  
📋 **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Résumé de l'implémentation  

---

## 💡 Conseils Pro

### Pour un résultat optimal :

1. **Utilisez un SVG** plutôt qu'un PNG source
   - Scalable à l'infini
   - Fichier plus léger
   - Meilleure qualité

2. **Optimisez votre SVG**
   - Utilisez [SVGO](https://jakearchibald.github.io/svgomg/)
   - Supprimez les métadonnées inutiles
   - Simplifiez les paths

3. **Testez sur différents appareils**
   - Desktop (Windows, Mac)
   - Mobile (iOS, Android)
   - Tablette
   - Différents navigateurs

4. **Vérifiez l'accessibilité**
   - Contraste suffisant
   - Taille lisible
   - Alternative text (déjà configuré)

---

## 🎉 C'est Fait !

Votre logo officiel Nefertiti Digital Solutions est maintenant intégré partout dans BudgetWise ! 🚀

L'application affiche maintenant votre **véritable identité de marque** de manière professionnelle et cohérente.

**Prêt pour le déploiement en production ! ✅**

---

**Besoin d'aide ?** Consultez [BRANDING_NDS.md](./BRANDING_NDS.md) section "Support & Questions"
