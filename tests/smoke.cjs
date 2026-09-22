const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'dist', 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'dist', 'app.js'), 'utf8');

const checks = [
  [html.includes('弄染之约'), 'title is present'],
  [html.includes('notebook-dialog'), 'notebook exists'],
  [html.includes('character-art'), 'character portrait layer exists'],
  [css.includes('@media (max-width: 820px)'), 'mobile portrait layout exists'],
  [css.includes('@media (max-height: 600px) and (orientation: landscape)'), 'mobile landscape layout exists'],
  [css.includes('env(safe-area-inset-bottom)'), 'mobile safe areas are handled'],
  [css.includes('user-select: none'), 'game text selection is disabled'],
  [css.includes('-webkit-user-drag: none'), 'image dragging is disabled'],
  [css.includes('--scene-image'), 'dynamic scene background styling exists'],
  [js.includes("id: 'c1intro'"), 'chapter one exists'],
  [js.includes("id: 'c2intro'"), 'chapter two exists'],
  [js.includes("id: 'c3intro'"), 'chapter three exists'],
  [js.includes('17时30分'), 'telegram time is used'],
  [js.includes('1989年3月31日'), 'recognition node is used'],
  [js.includes('localStorage'), 'progress persistence exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'nongran-mountains.webp')), 'optimized background asset exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'scene-village-gate.webp')), 'optimized village gate scene exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'scene-old-yard.webp')), 'optimized old yard scene exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'scene-archive-courtyard.webp')), 'optimized archive courtyard scene exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'scene-village-square.webp')), 'optimized village square scene exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'character-shibo.webp')), 'optimized Shi Bo portrait exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'character-lanpo.webp')), 'optimized Lan Po portrait exists'],
  [fs.existsSync(path.join(root, 'dist', 'assets', 'character-zhoubo.webp')), 'optimized Zhou Bo portrait exists'],
  [js.includes('requestIdleCallback'), 'story assets preload during browser idle time'],
  [js.includes('const sceneImages'), 'scene mapping exists'],
  [js.includes('const characterImages'), 'character mapping exists']
];

for (const [ok, label] of checks) {
  if (!ok) throw new Error(`Smoke check failed: ${label}`);
}

console.log(`Smoke checks passed: ${checks.length}`);
