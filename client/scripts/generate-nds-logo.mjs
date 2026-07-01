import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = resolve(__dirname, '../public');

console.log('🎨 Génération du logo Nefertiti Digital Solutions...\n');

try {
  // Lire le SVG
  const svgBuffer = readFileSync(resolve(publicDir, 'nefertiti-logo.svg'));
  
  // Générer la version PNG (200x50)
  await sharp(svgBuffer)
    .resize(200, 50)
    .png()
    .toFile(resolve(publicDir, 'nefertiti-logo.png'));
  
  console.log('✅ nefertiti-logo.png créé');
  
  console.log('\n🎉 Logo Nefertiti Digital Solutions généré avec succès!');
} catch (error) {
  console.error('❌ Erreur lors de la génération:', error);
  process.exit(1);
}
