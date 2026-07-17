const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'android', 'layout.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');

function storage(){
  const values = new Map();
  return {
    getItem:key => values.has(key) ? values.get(key) : null,
    setItem:(key, value) => values.set(key, String(value))
  };
}

function boot(localStorage){
  const panel = {hidden:false};
  const toggle = {attributes:{}, setAttribute(key, value){ this.attributes[key] = value; }};
  const chevron = {innerHTML:''};
  const elements = {
    simulationSettingsPanel:panel,
    simulationSettingsToggle:toggle,
    simulationSettingsChevron:chevron
  };
  const document = {getElementById:id => elements[id] || null};
  const window = {addEventListener(){}};
  const context = {document, window, localStorage, setTimeout(){}};
  vm.runInNewContext(source, context);
  return {context, panel, toggle, chevron};
}

const local = storage();
const first = boot(local);
assert.strictEqual(first.panel.hidden, true);
assert.strictEqual(first.toggle.attributes['aria-expanded'], 'false');
assert.strictEqual(first.context.toggleSimulationSettings(), true);
assert.strictEqual(first.panel.hidden, false);
assert.strictEqual(local.getItem('tncSimSimulationControlsOpenV1'), '1');

const restarted = boot(local);
assert.strictEqual(restarted.panel.hidden, false);
assert.strictEqual(restarted.toggle.attributes['aria-expanded'], 'true');
assert.strictEqual(restarted.context.toggleSimulationSettings(), false);
assert.strictEqual(restarted.panel.hidden, true);
assert.strictEqual(local.getItem('tncSimSimulationControlsOpenV1'), '0');

assert.match(index, /id="simulationSettingsToggle"[^>]*onclick="toggleSimulationSettings\(\)"/);
assert.match(index, /id="simulationSettingsPanel"[^>]*hidden/);
const viewAreaIndex = index.indexOf('<div class="view-area">');
for(const id of ['qualityGroup', 'compatModeToggle']){
  assert.ok(index.indexOf(`id="${id}"`) < viewAreaIndex,
    `${id} must stay outside the WebGL view area`);
}
assert.ok(index.indexOf('id="speedVal"') > viewAreaIndex,
  'speed control should be placed over the simulation surface');
assert.match(index, /id="canvasTopButtons"[\s\S]*id="canvasSpeedControl"[\s\S]*id="speedVal"/);
assert.match(index, /id="canvasSpeedControl"[\s\S]*class="refine-control-row"[\s\S]*id="refineBtnCanvas"/);

console.log('simulation-settings-panel.test.js: persistent drawer state verified');
