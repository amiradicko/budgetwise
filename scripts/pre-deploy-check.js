#!/usr/bin/env node

/**
 * ✅ Vérificateur Pré-Déploiement - BudgetWise
 * 
 * Ce script vérifie que tout est prêt pour le déploiement
 * en production.
 * 
 * Usage:
 *   node scripts/pre-deploy-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('');
console.log('✅ Vérificateur Pré-Déploiement - BudgetWise');
console.log('============================================');
console.log('');

let errors = 0;
let warnings = 0;

// Vérifier les fichiers essentiels
const requiredFiles = [
  '.gitignore',
  'README.md',
  'DEPLOYMENT_GUIDE.md',
  'DEPLOY_QUICK_START.md',
  'server/.env.example',
  'client/.env.example',
  'client/public/nefertiti-logo.svg',
  'client/public/nefertiti-logo.png',
  'client/public/icon-simple.svg'
];

console.log('📁 Vérification des fichiers essentiels...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    errors++;
  }
});
console.log('');

// Vérifier que .env n'est PAS commité
console.log('🔐 Vérification de la sécurité...');
const sensitiveFiles = [
  'server/.env',
  'client/.env',
  '.env'
];

sensitiveFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ⚠️  ${file} existe (vérifier qu'il n'est pas dans Git)`);
    warnings++;
  } else {
    console.log(`  ✅ ${file} n'existe pas (OK)`);
  }
});
console.log('');

// Vérifier le logo NDS
console.log('🎨 Vérification du logo NDS...');
const logoPath = path.join(__dirname, '..', 'client/public/nefertiti-logo.svg');
if (fs.existsSync(logoPath)) {
  const logoContent = fs.readFileSync(logoPath, 'utf8');
  if (logoContent.includes('PLACEHOLDER') || logoContent.includes('placeholder')) {
    console.log('  ⚠️  Le logo NDS semble être un placeholder');
    console.log('     → Remplacer par le logo officiel avant le déploiement');
    warnings++;
  } else {
    console.log('  ✅ Logo NDS semble être configuré');
  }
} else {
  console.log('  ❌ Logo NDS manquant');
  errors++;
}
console.log('');

// Vérifier node_modules
console.log('📦 Vérification des dépendances...');
const moduleDirs = [
  'node_modules',
  'server/node_modules',
  'client/node_modules',
  'shared/node_modules'
];

let allModulesInstalled = true;
moduleDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ⚠️  ${dir} - Exécuter 'npm install'`);
    allModulesInstalled = false;
    warnings++;
  }
});
console.log('');

// Vérifier Git
console.log('🗂️  Vérification Git...');
const gitDir = path.join(__dirname, '..', '.git');
if (fs.existsSync(gitDir)) {
  console.log('  ✅ Git initialisé');
  
  // Vérifier .gitignore
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const requiredIgnores = ['.env', 'node_modules', 'dist'];
    let allIgnoresPresent = true;
    
    requiredIgnores.forEach(ignore => {
      if (gitignoreContent.includes(ignore)) {
        console.log(`  ✅ .gitignore inclut "${ignore}"`);
      } else {
        console.log(`  ⚠️  .gitignore ne contient pas "${ignore}"`);
        warnings++;
        allIgnoresPresent = false;
      }
    });
  } else {
    console.log('  ❌ .gitignore manquant');
    errors++;
  }
} else {
  console.log('  ⚠️  Git non initialisé');
  console.log('     → Exécuter "git init"');
  warnings++;
}
console.log('');

// Résumé
console.log('═══════════════════════════════════════════');
console.log('');
if (errors === 0 && warnings === 0) {
  console.log('🎉 TOUT EST PRÊT POUR LE DÉPLOIEMENT !');
  console.log('');
  console.log('📚 Prochaines étapes :');
  console.log('  1. Remplacer le logo NDS si nécessaire');
  console.log('  2. Suivre DEPLOY_QUICK_START.md');
  console.log('  3. Déployer sur Railway + Vercel');
  console.log('');
  process.exit(0);
} else {
  console.log(`⚠️  ${errors} erreur(s), ${warnings} avertissement(s)`);
  console.log('');
  if (errors > 0) {
    console.log('❌ CORRECTION REQUISE AVANT DÉPLOIEMENT');
    console.log('   → Corriger les erreurs ci-dessus');
  } else {
    console.log('⚠️  VÉRIFIER LES AVERTISSEMENTS');
    console.log('   → Déploiement possible mais non optimal');
  }
  console.log('');
  process.exit(errors > 0 ? 1 : 0);
}
