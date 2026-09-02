import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = fs.readFileSync(root + 'versions/android-apk/app/src/main/assets/index.html', 'utf8');
const manifest = fs.readFileSync(root + 'versions/android-apk/app/src/main/AndroidManifest.xml', 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
assert.ok(!html.includes('serviceWorker'), 'APK must not depend on a service worker');
assert.ok(!manifest.includes('<uses-permission'), 'Offline APK must not request permissions');
assert.ok(html.includes("connect-src 'none'"));

const storage = new Map();
function app() {
  const elements = new Map();
  const ticks = [];
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, {
      innerHTML: '', textContent: '', value: '', disabled: false, className: '',
      addEventListener() {}, scrollIntoView() {},
      classList: { toggle() {}, contains() { return false; } },
    });
    return elements.get(id);
  };
  const context = vm.createContext({
    document: { getElementById: element, querySelectorAll: () => [], addEventListener() {} },
    window: { scrollTo() {} },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    setInterval: callback => { ticks.push(callback); return ticks.length; },
    clearInterval() {}, setTimeout() {}, Intl, Date,
  });
  vm.runInContext(source, context);
  return { evaluate: code => vm.runInContext(code, context), elements, ticks };
}

let run = app();
assert.equal(run.evaluate('foods.length'), 80);
assert.equal(run.evaluate('new Set(foods.map(f => f.name)).size'), 80);
assert.equal(run.evaluate('categories.length'), 9);
for (let i = 0; i < 100; i++) {
  const before = run.evaluate('current.name');
  run.evaluate('draw()');
  const tick = run.ticks.at(-1);
  for (let turn = 0; turn < 11; turn++) tick();
  assert.notEqual(run.evaluate('current.name'), before, 'Consecutive picks must differ');
  assert.equal(run.evaluate('rolling'), false);
  assert.ok(run.evaluate('recent.length <= 3'));
}
for (const category of run.evaluate('categories')) {
  for (const budget of [0, 20, 30]) {
    run.evaluate(`selectedCategory=${JSON.stringify(category)}; selectedBudget=${budget}; renderFilters();`);
    assert.equal(run.evaluate('getPool().every(f => (selectedCategory === "全部" || f.category === selectedCategory) && (!selectedBudget || f.price <= selectedBudget))'), true);
    assert.equal(run.elements.get('drawButton').disabled, run.evaluate('getPool().length === 0'));
  }
}
run.evaluate('selectedCategory="西式快餐"; selectedBudget=20; savePreferences();');
const lastFood = run.evaluate('current.name');
run = app();
assert.equal(run.evaluate('selectedCategory'), '西式快餐');
assert.equal(run.evaluate('selectedBudget'), 20);
assert.equal(run.evaluate('current.name'), lastFood);
assert.equal(run.evaluate('recent.length'), 3);
storage.set('chi-dian-sha-history', 'broken JSON');
storage.set('chi-dian-sha-preferences', 'broken JSON');
run = app();
assert.equal(run.evaluate('recent.length'), 0);
assert.equal(run.evaluate('selectedCategory'), '全部');
console.log('PASS: 80 foods, filtering, 100 draws, no immediate repeats, persistence, malformed storage and offline policy.');
