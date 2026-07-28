'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'www', 'android', 'app.js'), 'utf8');
const start = appSource.indexOf('function _downloadTextFile');
const end = appSource.indexOf('// ===== constants.js', start);
assert.ok(start >= 0 && end > start, 'Android export implementation must remain discoverable');
const exportSource = appSource.slice(start, end);

async function settle(){
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setImmediate(resolve));
}

(async function(){
  const messages = [];
  const calls = [];
  const context = {
    window:{Capacitor:{Plugins:{}}},
    _toast(message, isError){ messages.push({message,isError}); },
    console
  };
  vm.createContext(context);
  vm.runInContext(exportSource, context);

  context._downloadTextFile('BEGIN PGM X MM', 'X.H');
  assert.match(messages.pop().message, /Filesystem plugin missing/i,
    'missing native Filesystem plugin must give an actionable error');

  context.window.Capacitor.Plugins = {
    Filesystem:{
      writeFile(options){
        calls.push({kind:'write',options});
        return Promise.resolve({uri:'file:///cache/X.H'});
      }
    },
    Share:{
      share(options){
        calls.push({kind:'share',options});
        return Promise.resolve();
      }
    }
  };
  context._downloadTextFile('BEGIN PGM X MM', 'X.H');
  await settle();
  assert.deepStrictEqual(JSON.parse(JSON.stringify(calls[0])), {kind:'write',options:{
    path:'X.H',data:'BEGIN PGM X MM',directory:'CACHE',encoding:'utf8'
  }}, 'native export writes the exact program to the app cache');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(calls[1])), {kind:'share',options:{
    title:'X.H',url:'file:///cache/X.H',dialogTitle:'Save X.H'
  }}, 'native export passes the written URI to the Android share sheet');
  assert.strictEqual(messages.length, 0, 'successful export must not show an error');

  delete context.window.Capacitor.Plugins.Share;
  context._downloadTextFile('x', 'X.H');
  await settle();
  assert.match(messages.pop().message, /Share plugin missing/i,
    'a cache write without a share plugin must not be reported as a usable export');

  context.window.Capacitor.Plugins.Share = {
    share(){ return Promise.resolve(); }
  };
  context.window.Capacitor.Plugins.Filesystem.writeFile = () =>
    Promise.reject(new Error('No space left on device'));
  context._downloadTextFile('x', 'X.H');
  await settle();
  assert.match(messages.pop().message, /No space left on device/,
    'storage failures must be visible to the user');

  context.window.Capacitor.Plugins.Filesystem.writeFile = () =>
    Promise.resolve({uri:'file:///cache/X.H'});
  context.window.Capacitor.Plugins.Share.share = () =>
    Promise.reject(new Error('User cancelled'));
  context._downloadTextFile('x', 'X.H');
  await settle();
  assert.strictEqual(messages.length, 0,
    'closing the system share sheet is not an export failure');

  console.log('android-native-export.test.js: plugin absence, success, full storage and cancelled share verified');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
