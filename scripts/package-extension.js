const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const packageDir = path.join(dist, 'bilidj-extension');
const zipPath = path.join(dist, 'bilidj-extension.zip');

const entries = [
  'manifest.json',
  'PRIVACY.md',
  'DESIGN.md',
  'assets/icon-16.png',
  'assets/icon-32.png',
  'assets/icon-48.png',
  'assets/icon-128.png',
  'src/content/storage.js',
  'src/content/bilibili.js',
  'src/content/beat.js',
  'src/content/ui.js',
  'src/content/hotkeys.js',
  'src/content/main.js',
  'src/content/styles.css'
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(packageDir, { recursive: true });

for (const entry of entries) {
  const from = path.join(root, entry);
  const to = path.join(packageDir, entry);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

execFileSync('powershell.exe', [
  '-NoProfile',
  '-Command',
  `Compress-Archive -Path ${JSON.stringify(path.join(packageDir, '*'))} -DestinationPath ${JSON.stringify(zipPath)} -Force`
], { stdio: 'inherit' });

console.log(`Created ${zipPath}`);
