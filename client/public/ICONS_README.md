# Génération des icônes PWA

## Option 1 : Avec ImageMagick (Recommandé)

```powershell
# Installer ImageMagick depuis https://imagemagick.org/script/download.php

# Générer les icônes
magick convert icon.svg -resize 192x192 icon-192x192.png
magick convert icon.svg -resize 512x512 icon-512x512.png
magick convert icon.svg -resize 32x32 favicon.ico
```

## Option 2 : En ligne (Rapide)

1. Aller sur https://realfavicongenerator.net/
2. Uploader `icon.svg`
3. Télécharger le package d'icônes
4. Placer les fichiers dans `client/public/`

## Option 3 : Avec Sharp (Node.js)

```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-192x192.png resize 192 192
sharp -i icon.svg -o icon-512x512.png resize 512 512
```

## Fichiers nécessaires

- ✅ `icon.svg` - Créé
- ⏳ `icon-192x192.png` - À générer
- ⏳ `icon-512x512.png` - À générer
- ⏳ `favicon.ico` - À générer
