/**
 * SVG to PNG 変換スクリプト
 * 使用後は削除可能
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');

const icons = [
  { svg: 'icon16.svg', png: 'icon16.png', size: 16 },
  { svg: 'icon48.svg', png: 'icon48.png', size: 48 },
  { svg: 'icon128.svg', png: 'icon128.png', size: 128 }
];

async function convertIcons() {
  console.log('🎨 SVG to PNG 変換を開始します...\n');

  for (const icon of icons) {
    const svgPath = path.join(iconsDir, icon.svg);
    const pngPath = path.join(iconsDir, icon.png);

    try {
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(pngPath);

      console.log(`✅ ${icon.svg} → ${icon.png} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ ${icon.svg} の変換に失敗: ${error.message}`);
    }
  }

  console.log('\n🎉 変換が完了しました！');
}

convertIcons();
