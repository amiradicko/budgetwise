#!/usr/bin/env node

/**
 * 🔐 Générateur de Secrets Sécurisés - BudgetWise
 * 
 * Ce script génère des secrets JWT aléatoires et sécurisés
 * pour la production.
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('');
console.log('🔐 Générateur de Secrets JWT - BudgetWise');
console.log('============================================');
console.log('');

// Générer JWT_SECRET (64 caractères)
const jwtSecret = crypto.randomBytes(48).toString('base64');
console.log('✅ JWT_SECRET généré (64 caractères) :');
console.log(jwtSecret);
console.log('');

// Générer JWT_REFRESH_SECRET (64 caractères, différent)
const jwtRefreshSecret = crypto.randomBytes(48).toString('base64');
console.log('✅ JWT_REFRESH_SECRET généré (64 caractères) :');
console.log(jwtRefreshSecret);
console.log('');

console.log('📋 Copier/Coller dans Railway (Variables d\'environnement) :');
console.log('------------------------------------------------------------');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log('');

console.log('⚠️  IMPORTANT :');
console.log('- Ne JAMAIS committer ces secrets dans Git');
console.log('- Utiliser des secrets différents pour dev/staging/prod');
console.log('- Sauvegarder ces secrets dans un gestionnaire sécurisé');
console.log('');
