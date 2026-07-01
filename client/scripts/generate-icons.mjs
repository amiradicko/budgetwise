import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const iconSvg = join(publicDir, 'icon.svg');

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA...');

  try {
    const svgBuffer = readFileSync(iconSvg);

    // Générer icon-192x192.png
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'icon-192x192.png'));
    console.log('✅ icon-192x192.png créé');

    // Générer icon-512x512.png
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'icon-512x512.png'));
    console.log('✅ icon-512x512.png créé');

    // Générer favicon.ico (32x32)
    const favicon32 = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    writeFileSync(join(publicDir, 'favicon.ico'), favicon32);
    console.log('✅ favicon.ico créé');

    console.log('🎉 Toutes les icônes ont été générées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

generateIcons();
