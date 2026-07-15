'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');

assert.match(app, /var APP_VERSION = '1\.0\.40';/);
assert.match(app, /function _installAndroid3DDiagnostics\(\)/);
assert.match(app, /THREE\.WebGLRenderer=function\(options\)/);
assert.match(app, /canvas\.getContext\('webgl',attrs\)/);
assert.match(app, /antialias:false/);
assert.match(app, /stencil:false/);
assert.match(app, /powerPreference:'low-power'/);
assert.match(app, /renderer\.setPixelRatio\(1\)/);
assert.match(app, /webglcontextlost/);
assert.match(app, /contextLostAfter=/);
assert.match(app, /UNMASKED_RENDERER_WEBGL/);
assert.match(app, /Copy diagnostic/);
assert.match(app, /finally\{ _restoreRendererCtor\(\); \}/);

console.log('android-3d-diagnostics.test.js: on-screen WebGL diagnostics verified');
