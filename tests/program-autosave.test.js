const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'core', 'program-autosave.js'), 'utf8');

function storage(seed, failWrites){
  const values = new Map(Object.entries(seed || {}));
  return {
    getItem(key){ return values.has(key) ? values.get(key) : null; },
    setItem(key, value){
      if(failWrites) throw new Error('storage disabled');
      values.set(key, String(value));
    },
    removeItem(key){ values.delete(key); },
    value(key){ return values.get(key); }
  };
}

function boot(options = {}){
  const codeEvents = {};
  const documentEvents = {};
  const timers = [];
  const status = {
    textContent:'', hidden:true, state:'',
    setAttribute(name, value){ if(name === 'data-state') this.state = value; }
  };
  const codeEl = {
    value:options.code || 'DEFAULT PROGRAM',
    addEventListener(name, fn){ codeEvents[name] = fn; }
  };
  const localStorage = storage(options.local, options.failWrites);
  const sessionStorage = storage(options.session);
  const context = vm.createContext({
    console,
    codeEl,
    _docName:options.docName || 'program.H',
    LEARN:{open:false},
    localStorage,
    sessionStorage,
    Date,
    JSON,
    setTimeout(fn, delay){ fn.delay = delay; timers.push(fn); return timers.length; },
    clearTimeout(){},
    document:{
      visibilityState:'visible',
      getElementById(id){ return id === 'programAutosaveStatus' ? status : null; },
      addEventListener(name, fn){ documentEvents[name] = fn; }
    },
    window:{addEventListener(){}}
  });
  vm.runInContext('function _setDocName(name){ _docName = name || "program.H"; }', context);
  vm.runInContext(source, context, {filename:'program-autosave.js'});
  vm.runInContext('initProgramAutosave()', context);
  return {context, codeEl, status, localStorage, sessionStorage, codeEvents, documentEvents, timers};
}

const typed = boot({docName:'part.H'});
typed.codeEl.value = 'BEGIN PGM PART MM\nEND PGM PART MM';
typed.codeEvents.input();
assert.strictEqual(typed.status.state, 'pending');
assert.strictEqual(typed.timers[0].delay, 30000);
typed.codeEl.value = 'BEGIN PGM PART MM\nL X+20\nEND PGM PART MM';
typed.codeEvents.input();
assert.strictEqual(typed.timers.length, 1, 'continuous typing must not postpone the scheduled save');
typed.timers.shift()();
const payload = JSON.parse(typed.localStorage.value('tncsim.programDraft.v1'));
assert.strictEqual(payload.code, typed.codeEl.value);
assert.strictEqual(payload.docName, 'part.H');
assert.strictEqual(typed.status.state, 'saved');

const restored = boot({
  code:'STALE WEBVIEW VALUE',
  local:{'tncsim.programDraft.v1':JSON.stringify({
    version:1, code:'MAIN PROGRAM', docName:'main.H', savedAt:123456789
  })}
});
assert.strictEqual(restored.codeEl.value, 'MAIN PROGRAM');
assert.strictEqual(restored.context._docName, 'main.H');
assert.strictEqual(restored.status.state, 'restored');

const learn = boot({code:'MY MAIN PROGRAM', docName:'mine.H'});
vm.runInContext('programAutosaveSuspendForLearn()', learn.context);
const mainDraft = learn.localStorage.value('tncsim.programDraft.v1');
learn.context.LEARN.open = true;
learn.codeEl.value = 'LESSON EXERCISE';
vm.runInContext('programAutosaveChanged()', learn.context);
assert.strictEqual(learn.localStorage.value('tncsim.programDraft.v1'), mainDraft);
assert.strictEqual(learn.status.state, 'lesson');
learn.context.LEARN.open = false;
vm.runInContext('programAutosaveResumeAfterLearn()', learn.context);
assert.strictEqual(learn.codeEl.value, 'MY MAIN PROGRAM');

const interrupted = boot({
  code:'TRANSIENT LESSON CODE',
  local:{'tncsim.programDraft.v1':mainDraft},
  session:{'tncsim.programDraft.learnActive.v1':'1'}
});
assert.strictEqual(interrupted.codeEl.value, 'MY MAIN PROGRAM');
assert.strictEqual(vm.runInContext('programAutosaveWasInterruptedInLearn()', interrupted.context), true);

const pending = boot();
pending.codeEl.value = 'LAST SECOND EDIT';
pending.codeEvents.input();
pending.context.document.visibilityState = 'hidden';
pending.documentEvents.visibilitychange();
assert.strictEqual(JSON.parse(pending.localStorage.value('tncsim.programDraft.v1')).code, 'LAST SECOND EDIT');

const failed = boot({failWrites:true});
failed.codeEl.value = 'CANNOT SAVE';
failed.codeEvents.input();
failed.timers.shift()();
assert.strictEqual(failed.status.state, 'error');
assert.match(failed.status.textContent, /could not be saved/i);

const learnSource = fs.readFileSync(path.join(root, 'www', 'core', 'learn-tutorial.js'), 'utf8');
const finishBody = learnSource.slice(learnSource.indexOf('function learnFinishLesson'), learnSource.indexOf('function learnExit'));
assert.ok(!/LEARN\.savedCode\s*=\s*null/.test(finishBody));
assert.match(learnSource, /programAutosaveSuspendForLearn/);
assert.match(learnSource, /programAutosaveResumeAfterLearn/);
const openBody = learnSource.slice(learnSource.indexOf('function openLearn'), learnSource.indexOf('function closeLearn'));
assert.ok(openBody.indexOf('programAutosaveSuspendForLearn()') < openBody.indexOf('LEARN.open = true'));
const exitBody = learnSource.slice(learnSource.indexOf('function learnExit'), learnSource.indexOf('function _learnEndEditorInput'));
assert.match(exitBody, /!LEARN\.open[^\n]+programAutosaveResumeAfterLearn/);
assert.match(learnSource, /onclick="closeLearn\(\)" title="Exit practice/,
  'the practice close button must fully close Learn so autosave resumes immediately');
assert.doesNotMatch(learnSource, /onclick="learnExit\(\)" title="Exit practice/,
  'the practice close button must not leave Learn open with autosave suspended');

const tabsSource = fs.readFileSync(path.join(root, 'www', 'core', 'mobile-tabs.js'), 'utf8');
assert.match(tabsSource, /LEARN\.open = false;\s*\n\s*learnExit\(\)/);

const editorSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
assert.match(editorSource, /function runValidation[\s\S]*?programAutosaveChanged\(\)/);

const appSource = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');
assert.match(appSource, /programAutosaveWasInterruptedInLearn/);
assert.match(appSource, /restoreSessionState\(_ignoreTransientLearnCode \? null : codeEl\)/);
assert.ok(appSource.indexOf('initProgramAutosave()') < appSource.indexOf('restoreSessionState('));

const indexSource = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
assert.match(indexSource, /id="programAutosaveStatus"/);
assert.match(indexSource, /core\/program-autosave\.js/);
const stylesSource = fs.readFileSync(path.join(root, 'www', 'android', 'styles.css'), 'utf8');
assert.match(stylesSource, /data-state="pending"[^}]*color:var\(--text3\)/);
assert.match(stylesSource, /data-state="error"[^}]*color:var\(--accent-warm\)/);

console.log('program-autosave.test.js: Android draft persistence and Learn isolation verified');
