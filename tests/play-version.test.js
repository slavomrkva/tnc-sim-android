const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const gradle = fs.readFileSync(path.join(root, 'android', 'app', 'build.gradle'), 'utf8');
const app = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');

const code = Number((gradle.match(/\bversionCode\s+(\d+)/) || [])[1]);
const name = (gradle.match(/\bversionName\s+"([^"]+)"/) || [])[1];
const appVersion = (app.match(/\bAPP_VERSION\s*=\s*'([^']+)'/) || [])[1];

assert.strictEqual(code, 7, 'the next upload after Play code 6 must use versionCode 7');
assert.strictEqual(name, '1.0.6', 'the next release after Play 1.0.5 must use versionName 1.0.6');
assert.strictEqual(appVersion, '1.0.108', 'the store-asset push must advance the internal build marker');

console.log('play-version.test.js: next Play release is 1.0.6/code 7; APP_VERSION is 1.0.108');
