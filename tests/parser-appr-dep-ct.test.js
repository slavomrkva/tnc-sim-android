const assert = require('assert');
const H = require('./_cycle-harness');

function errors(list){
  return Array.from(list || []).filter(problem => problem.sev === 'err');
}

function spindleWarnings(list){
  return Array.from(list || []).filter(problem => /M3\/M4 not programmed before first cutting move/.test(problem.msg));
}

function close(actual, expected, message, tolerance=1e-5){
  assert.ok(Math.abs(actual-expected) <= tolerance,
    `${message}: expected ${expected}, got ${actual}`);
}

// HEIDENHAIN TNC 640 Klartext Programming 34059x-18 (10/2023), page 172.
const officialCircular = [
  'BEGIN PGM CIRCULAR MM',
  'BLK FORM 0.1 Z X+0 Y+0 Z-20',
  'BLK FORM 0.2 X+100 Y+100 Z+0',
  'TOOL CALL 1 Z S4000',
  'L Z+250 R0 FMAX',
  'L X-10 Y-10 R0 FMAX',
  'L Z-5 R0 F1000 M3',
  'APPR LCT X+5 Y+5 R5 RL F300',
  'L X+5 Y+85',
  'RND R10 F150',
  'L X+30 Y+85',
  'CR X+70 Y+95 R+30 DR-',
  'L X+95',
  'L X+95 Y+40',
  'CT X+40 Y+5',
  'L X+5',
  'DEP LCT X-20 Y-20 R5 F1000',
  'L Z+250 R0 FMAX M2',
  'END PGM CIRCULAR MM'
].join('\n');

{
  const circularProblems=H.validate(officialCircular);
  assert.deepStrictEqual(errors(circularProblems), [],
    'official circular example validates');
  assert.deepStrictEqual(spindleWarnings(circularProblems), [],
    'official circular example accepts its M3 after the safe FMAX positioning moves');
  const parsed=H.parse(officialCircular);
  assert.deepStrictEqual(errors(parsed.resultProblems), [],
    'official circular example produces a complete Android toolpath');
  const appr=parsed.sub.filter(segment => /^APPR-LCT/.test(segment.pathFunction || ''));
  const dep=parsed.sub.filter(segment => /^DEP-LCT/.test(segment.pathFunction || ''));
  assert.ok(appr.length>2 && dep.length>2, 'APPR/DEP LCT generate line and arc portions');
  close(appr[appr.length-1].to.x,0,'compensated PA.x');
  close(appr[appr.length-1].to.y,5,'compensated PA.y');
  close(dep[dep.length-1].to.x,-20,'programmed PN.x');
  close(dep[dep.length-1].to.y,-20,'programmed PN.y');

  const rndLine=officialCircular.split('\n').findIndex(line => line.startsWith('RND '));
  const rnd=parsed.sub.filter(segment => segment.srcLine===rndLine);
  assert.ok(rnd.length>0 && rnd.every(segment => Math.abs(segment.feed-150)<1e-9),
    'RND uses its block-local feed');
}

// Official polar helix example from the same manual, page 180.
const officialHelix = [
  'BEGIN PGM HELIX MM',
  'BLK FORM 0.1 Z X+0 Y+0 Z-20',
  'BLK FORM 0.2 X+100 Y+100 Z+0',
  'TOOL CALL 1 Z S1400',
  'L Z+250 R0 FMAX',
  'L X+50 Y+50 R0 FMAX',
  'CC',
  'L Z-12.75 R0 F1000 M3',
  'APPR PCT PR+32 PA-182 CCA180 R+2 RL F100',
  'CP IPA+3240 IZ+13.5 DR+ F200',
  'DEP CT CCA180 R+2',
  'L Z+250 R0 FMAX M2',
  'END PGM HELIX MM'
].join('\n');

{
  const helixProblems=H.validate(officialHelix);
  assert.deepStrictEqual(errors(helixProblems), [],
    'official polar helix validates');
  assert.deepStrictEqual(spindleWarnings(helixProblems), [],
    'official polar helix accepts its M3 after the safe FMAX positioning moves');
  const parsed=H.parse(officialHelix);
  assert.deepStrictEqual(errors(parsed.resultProblems), [],
    'official polar helix produces a complete Android toolpath');
  const appr=parsed.sub.filter(segment => segment.pathFunction==='APPR-CT');
  const helix=parsed.sub.filter(segment =>
    segment.pathFunction==='CP' || (segment.rcGeom && segment.rcGeom.kind==='CP'));
  const dep=parsed.sub.filter(segment => segment.pathFunction==='DEP-CT');
  assert.ok(appr.length>2, 'official APPR PCT generates its circular approach');
  assert.ok(helix.length>100, 'official nine-turn CP helix is generated');
  assert.ok(dep.length>2, 'official DEP CT generates its circular departure');
  close(helix[helix.length-1].to.z,0.75,'official CP helix final Z');
  close(dep[dep.length-1].to.z,0.75,'official DEP CT stays in the contour plane');
}

{
  const code=H.program(`TOOL CALL 23 Z S2000 F200
L X+0 Y+0 Z+5 R0 FMAX
L Z-2 F100
CC X+0 Y+10
C X+10 Y+10 DR+
CT X+20 Y+20 LIN_Z-6 F80`);
  assert.deepStrictEqual(errors(H.validate(code)), [], 'CT LIN_Z validates');
  const parsed=H.parse(code);
  assert.deepStrictEqual(errors(parsed.resultProblems), [], 'CT LIN_Z parses');
  const ctLine=code.split('\n').findIndex(line => line.startsWith('CT '));
  const ct=parsed.sub.filter(segment => segment.srcLine===ctLine);
  close(ct[ct.length-1].to.z,-6,'CT LIN_Z endpoint');
  const primitive=ct[0].rcGeom;
  const dir=primitive.sweep>=0?1:-1;
  close(-Math.sin(primitive.a0)*dir,0,'CT analytic tangent.x');
  close(Math.cos(primitive.a0)*dir,1,'CT analytic tangent.y');
}

[
  ['LT','LEN10','LT','LEN8'],
  ['LN','LEN+10','LN','LEN+8'],
  ['CT','CCA180 R+10','CT','CCA90 R-8']
].forEach(([apprForm,apprArgs,depForm,depArgs]) => {
  const code=H.program(`TOOL CALL 23 Z S2000 F200
L X-15 Y-10 Z-2 R0 FMAX
APPR ${apprForm} X+0 Y+0 ${apprArgs} RL F120
L X+30 Y+0
L X+30 Y+20
DEP ${depForm} ${depArgs} F300
L Z+20 FMAX`);
  assert.deepStrictEqual(errors(H.validate(code)), [], `${apprForm}/${depForm} validates`);
  const parsed=H.parse(code);
  assert.deepStrictEqual(errors(parsed.resultProblems), [], `${apprForm}/${depForm} parses`);
  assert.ok(parsed.sub.some(segment => (segment.pathFunction||'').startsWith(`APPR-${apprForm}`)));
  assert.ok(parsed.sub.some(segment => (segment.pathFunction||'').startsWith(`DEP-${depForm}`)));
});

[
  ['PLT','LEN8','L X+10 Y+20','DEP LT LEN8'],
  ['PLN','LEN8','L X+10 Y+20','DEP LN LEN8'],
  ['PCT','CCA180 R+5','CP IPA+90 DR+','DEP CT CCA90 R+5']
].forEach(([form,args,contour,departure]) => {
  const code=H.program(`TOOL CALL 23 Z S2000 F200
L X-20 Y-10 Z-2 R0 FMAX
CC X+0 Y+0
APPR ${form} PR+10 PA+0 ${args} RL F100
${contour} F150
${departure} F300`);
  assert.deepStrictEqual(errors(H.validate(code)), [], `APPR ${form} validates`);
  const parsed=H.parse(code);
  assert.deepStrictEqual(errors(parsed.resultProblems), [], `APPR ${form} parses`);
  assert.ok(parsed.sub.some(segment => (segment.pathFunction||'').startsWith(`APPR-${form.replace(/^P/,'')}`)));
});

{
  const code=H.program(`TOOL CALL 23 Z S2000 F200
L X-20 Y-10 Z-2 R0 FMAX
CC X+0 Y+0
APPR PLCT PR+10 PA+0 R5 RL F100
L X+10 Y+20
DEP PLCT PR+25 PA+180 R5 F300`);
  assert.deepStrictEqual(errors(H.validate(code)), [], 'polar APPR/DEP validate');
  const parsed=H.parse(code);
  assert.deepStrictEqual(errors(parsed.resultProblems), [], 'polar APPR/DEP parse');
  const dep=parsed.sub.filter(segment => /^DEP-LCT/.test(segment.pathFunction||''));
  close(dep[dep.length-1].to.x,-25,'polar PN.x');
  close(dep[dep.length-1].to.y,0,'polar PN.y');
}

console.log('parser-appr-dep-ct.test.js: Android APPR/DEP and analytic CT verified');
