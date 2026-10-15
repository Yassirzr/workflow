'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assets = ['index.html', 'style.css', 'pipeline.js', 'script.js'];
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const asset of assets.slice(1)) {
  if (!html.includes(`"${asset}"`)) {
    throw new Error(`Le fichier index.html ne référence pas ${asset}`);
  }
}
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const asset of assets) {
  fs.copyFileSync(path.join(root, asset), path.join(dist, asset));
}
console.log(`✓ Build terminé : dist/ (${assets.length} fichiers)`);
