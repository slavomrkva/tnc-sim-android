'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const voxel = fs.readFileSync(path.join(root, 'www', 'core', 'voxel-cutting.js'), 'utf8');
const parser = fs.readFileSync(path.join(root, 'www', 'core', 'parser-engine.js'), 'utf8');
const controls = fs.readFileSync(path.join(root, 'www', 'core', 'sim-controls.js'), 'utf8');

assert.match(app, /var VX_QUALITY = 1; \/\/ 0=low, 1=default, 2=high/);
assert.match(app, /var VX_RES_LEVELS = \[100, 150, 200\];/);
assert.match(app, /VX_RES_LEVELS = \[50, 75, 100\];/);
assert.match(app, /if\(VX_COMPAT_MODE\)/);
assert.match(voxel, /var CELL_CAP = \[1\.0, 0\.7, 0\.5\]/);
assert.match(voxel, /CELL_CAP = \[2\.0, 1\.5, 1\.0\]/);
assert.match(voxel, /typeof VX_COMPAT_MODE/);
assert.match(voxel, /fullGeometry\.deleteAttribute\('color'\)/);
assert.match(voxel, /new THREE\.MeshLambertMaterial\(\{color:_stockHex\(\),side:THREE\.DoubleSide\}\)/);
assert.match(voxel, /var VOXEL_BUDGET = 12000000;/);
assert.match(parser, /var HI_LEVELS = \[300, 400, 500\];/);
assert.match(parser, /var HI_CELL_CAP = \[0\.5, 0\.4, 0\.3\]/);
assert.match(parser, /var HI_VOXEL_BUDGET = 32000000;/);
assert.match(parser, /if\(typeof VX_COMPAT_MODE!==\'undefined\' && VX_COMPAT_MODE\)/);
assert.match(controls, /typeof VX_COMPAT_MODE===\'undefined\' \|\| !VX_COMPAT_MODE/);
assert.match(app, /Refine is unavailable in compatibility mode/);

const qualityButtons = [...index.matchAll(/onclick="setQuality\((\d)\)"[^>]*>(Low|Def|High)<\/button>/g)];
assert.deepStrictEqual(qualityButtons.map((m) => [Number(m[1]), m[2]]), [
  [0, 'Low'], [1, 'Def'], [2, 'High']
]);
assert.match(index, /class="btn btn-tog active" onclick="setQuality\(1\)"/);

console.log('quality-profiles.test.js: Low/Default/High live and Refine profiles verified');
