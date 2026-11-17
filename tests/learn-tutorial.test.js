const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const learnSource = read('www/core/learn-tutorial.js');
const appSource = read('www/android/app.js');
const demoSource = read('www/core/demo-programs.js');
const editorCoreSource = read('www/core/editor-core.js');
const panelsSource = read('www/android/panels.js');
const stylesSource = read('www/android/styles.css');
const context = {
  console, Math, JSON, RegExp, Date, parseFloat, parseInt, isFinite,
  TOOL_R: 5, DEFAULT_FEED: 500, lastDefinedFeed: 500,
  currentToolNum: 1, _WORKPIECE_TOP_Z: 0,
  pFloat: value => parseFloat(String(value).replace(',', '.')),
  getToolByNum: number => ({
    T:number, R:number === 4 ? 3.4 : (number === 5 ? 0.001 : (number === 7 ? 4 : 5)),
    L:100, DR:0, DL:0, TYPE:number === 1 ? 'MILL' : (number === 5 ? 'COUNTERSINK' : 'DRILL')
  }),
  inferToolType: tool => tool.TYPE || 'MILL',
  _synHighlightLine: line => line,
  document: {getElementById: () => null}
};
context.window = context;
vm.createContext(context);
vm.runInContext(read('www/core/data-tables.js'), context, {filename:'data-tables.js'});
vm.runInContext(read('www/core/parser-engine.js'), context, {filename:'parser-engine.js'});
vm.runInContext(learnSource, context, {filename:'learn-tutorial.js'});

function solutionFor(task){
  if(task.solRepl) return task.starter.replace(task.solRepl[0], task.solRepl[1]);
  if(task.sol !== undefined) return task.starter.replace('\n\n', '\n' + task.sol + '\n');
  return null;
}

assert.ok(!context.LESSONS.some(lesson => lesson.intro || lesson.id === 'L00'),
  'the Start here intro lesson is removed; the list opens with lesson 1');
assert.ok(!fs.existsSync(path.join(root, 'www', 'core', 'learn-coach.js')), 'the spotlight tour is removed');
assert.doesNotMatch(learnSource + read('www/index.html') + stylesSource, /learnCoach|learn-coach/,
  'nothing loads, styles or starts the removed spotlight tour');

assert.match(editorCoreSource, /learn-answer-line/,
  'the syntax overlay paints the intended answer rows');
assert.match(panelsSource, /cls\+=' learn-target'/,
  'the line-number gutter marks the same answer rows');
assert.match(stylesSource, /#hlLayer \.learn-answer-line\{[^}]*background:var\(--learn-answer-bg\)/,
  'answer rows use the muted web v1.000 answer highlight');
assert.match(appSource, /var answerRange = typeof learnAnswerLineRange[\s\S]*atProtectedStart[\s\S]*atProtectedEnd/,
  'Backspace and Delete preserve the outer answer boundaries');

const svgOpenings = learnSource.match(/return '<svg class="learn-svg"[^\r\n]*/g) || [];
assert.strictEqual(svgOpenings.length, 31, 'all Learn diagram factories are covered by the accessibility check');
for(const opening of svgOpenings){
  assert.match(opening, /aria-label="[^"]{20,}"/,
    `Learn diagram needs a meaningful source-level aria-label: ${opening}`);
}
const profileSvg = context.learnSvgPartProfile();
assert.match(profileSvg, /<circle cx="70" cy="250"[^>]*>[\s\S]*?<text x="62" y="263"[^>]*text-anchor="end"[^>]*>datum 0,0</,
  'Lesson 15 datum label sits below and to the left of its reference point without extending past the SVG edge');
const tappingSvg = context.learnSvgThreadCycle();
assert.match(tappingSvg, /Q256[\s\S]*0\.5 x pitch back/,
  'Cycle 209 diagram explains that Q256 is a factor of pitch');
assert.match(appSource, /Q256 × Q239/,
  'Q256 help explains the pitch-factor calculation');
assert.doesNotMatch(appSource, /Q256[^]*?Chip break retract distance \(mm\)/,
  'Cycle 209 guided input must not describe Q256 as millimetres');
assert.doesNotMatch(demoSource, /Q256[^\r\n]*\[mm\]/,
  'demo code must not label Q256 with millimetre units');

let insertRanges = 0;
let editRanges = 0;
for(const lesson of context.LESSONS){
  for(let i=0; i<lesson.tasks.length; i++){
    const task = lesson.tasks[i];
    const plan = context._learnStarterPlan(lesson, i);
    assert.ok(plan.start >= 0, `${lesson.id}.${i+1} exposes an answer range`);
    assert.ok(plan.count >= 1, `${lesson.id}.${i+1} highlights at least one row`);
    assert.ok(plan.start + plan.count <= plan.code.split('\n').length,
      `${lesson.id}.${i+1} keeps its answer range inside the starter`);
    if(plan.mode === 'insert'){
      insertRanges++;
      if(task.answerPrefix !== undefined){
        assert.strictEqual(plan.code.split('\n')[plan.start], task.answerPrefix,
          `${lesson.id}.${i+1} starts at its editable answer prefix`);
        assert.strictEqual(plan.caretColumn, task.answerPrefix.length,
          `${lesson.id}.${i+1} places the caret after its prefix`);
      } else {
        assert.ok(plan.code.split('\n').slice(plan.start, plan.start + plan.count).every(line => line === ''),
          `${lesson.id}.${i+1} reserves empty rows for the answer`);
      }
    } else {
      editRanges++;
      assert.ok(plan.code.split('\n').slice(plan.start, plan.start + plan.count).some(Boolean),
        `${lesson.id}.${i+1} highlights existing rows that must be edited`);
    }

    assert.strictEqual(
      context._learnExecutableCode(plan.code).replace(/\n+/g, '\n'),
      context._learnExecutableCode(task.starter).replace(/\n+/g, '\n'),
      `${lesson.id}.${i+1} answer zoning does not change executable Klartext`);

    const solution = solutionFor(task);
    if(!solution || !task.checks) continue;

    const zonedSolution = context._learnSolvedCode(lesson, i);
    // A comment task with an answer prefix may receive its official comment on
    // the block below the prefix row (same as web v1.000); grading covers it.
    if(plan.mode === 'insert' && task.answerPrefix === undefined){
      assert.notDeepStrictEqual(
        zonedSolution.split('\n').slice(plan.start, plan.start + plan.count),
        plan.code.split('\n').slice(plan.start, plan.start + plan.count),
        `${lesson.id}.${i+1} password solution fills the highlighted answer range`);
    }
    const solved = context.learnEvalChecks(zonedSolution, task);
    assert.ok(solved.every(result => result.ok),
      `${lesson.id}.${i+1} zoned official solution failed: ${solved.filter(r => !r.ok).map(r => r.label).join(', ')}`);

    const starter = context.learnEvalChecks(task.starter, task);
    assert.ok(!starter.every(result => result.ok), `${lesson.id}.${i+1} starter already passes`);

    if(!task.checks.some(check => check.t === 'has_comment')){
      const answer = task.solRepl ? task.solRepl[1] : task.sol;
      const comments = String(answer).split('\n').map(line => '; ' + line).join('\n');
      const cheated = task.starter.replace(/\nEND PGM/i, '\n' + comments + '\nEND PGM');
      const results = context.learnEvalChecks(cheated, task);
      assert.ok(!results.every(result => result.ok), `${lesson.id}.${i+1} accepts answer only in comments`);
    }
  }
}
assert.ok(insertRanges > 40 && editRanges > 0,
  `all tasks use answer zoning (${insertRanges} insertion ranges, ${editRanges} edit ranges)`);

const onlyMarker = 'BEGIN PGM HELLO MM\n; >>> YOUR ANSWER \u2014 TASK 1/1\nEND PGM HELLO MM';
assert.ok(!context.learnEvalChecks(onlyMarker, context.LESSONS.find(lesson => lesson.id === 'L01').tasks[0]).some(result => result.ok && /comment/i.test(result.label)),
  'the injected answer marker cannot satisfy a comment task');
const emptyComment = 'BEGIN PGM HELLO MM\n; \nBLK FORM 0.1 Z X+0 Y+0 Z-20\nEND PGM HELLO MM';
assert.ok(!context.learnEvalChecks(emptyComment, context.LESSONS.find(lesson => lesson.id === 'L01').tasks[0]).some(result => result.ok && /comment/i.test(result.label)),
  'an empty comment row cannot borrow text from the following NC block');

function validationErrors(code){
  return context.validateProgram(code, false).filter(problem => problem.sev === 'err');
}

const compensationLesson = context.LESSONS.find(lesson => lesson.id === 'L07');
const compensationSolved = solutionFor(compensationLesson.tasks[0]);
assert.match(compensationSolved, /L Z\+50 R0 FMAX/,
  'Lesson 7 task 1 cancels radius compensation before the rapid retract');
assert.strictEqual(validationErrors(compensationSolved).length, 0,
  'Lesson 7 task 1 password solution passes the full Run validator: '
  + validationErrors(compensationSolved).map(problem => problem.msg).join(', '));

const tappingLesson = context.LESSONS.find(lesson => lesson.id === 'L21');
const tappingParameters = ['Q200','Q201','Q239','Q203','Q204','Q257','Q256','Q336','Q403'];
for(let i=0; i<tappingLesson.tasks.length; i++){
  const solvedCode = solutionFor(tappingLesson.tasks[i]);
  const tappingStart = solvedCode.indexOf('CYCL DEF 209');
  assert.ok(tappingStart >= 0, `L21.${i+1} contains Cycle 209`);
  const tappingBlock = solvedCode.slice(tappingStart, solvedCode.indexOf('\nM5', tappingStart));
  assert.doesNotMatch(tappingBlock.split('\n')[0], /\bQ\d+/,
    `L21.${i+1} keeps Q parameters off the CYCL DEF header`);
  let previous = -1;
  for(const parameter of tappingParameters){
    const at = tappingBlock.indexOf('\n  ' + parameter + '=');
    assert.ok(at > previous, `L21.${i+1} serializes ${parameter} in editor order`);
    previous = at;
  }
  const errors = validationErrors(solvedCode);
  assert.strictEqual(errors.length, 0,
    `L21.${i+1} password solution passes the full Run validator: ${errors.map(problem => problem.msg).join(', ')}`);
}

const cycle209Builder = appSource.slice(
  appSource.indexOf("'CYCL DEF 209':"),
  appSource.indexOf("'CYCL DEF 200':", appSource.indexOf("'CYCL DEF 209':"))
);
assert.match(cycle209Builder, /\{p:'Q403'/,
  'Cycle 209 guided fields include the documented Q403 retraction factor');

const chamfer = context.LESSONS.find(lesson => lesson.id === 'L22');
for(const [taskIndex, wrong, correct] of [[0, 'Q201=+4', 'Q201=-4'], [1, 'Q201=+1', 'Q201=-1']]){
  const task = chamfer.tasks[taskIndex];
  const wrongCode = solutionFor(task).replace(new RegExp(correct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b'), wrong);
  const results = context.learnEvalChecks(wrongCode, task);
  assert.ok(!results.every(result => result.ok), `L22.${taskIndex+1} accepted the wrong Q201 sign`);
}

console.log('Learn tutorial checks passed');
