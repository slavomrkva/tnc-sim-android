# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1898 nodes · 3770 edges · 133 communities (66 shown, 67 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37091e23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- three.min.js
- vt
- At
- editor-core.js
- St
- tn
- Lt
- Lc
- learn-tutorial.js
- ec
- tool-table.js
- no
- parse
- jc
- xc
- copy
- field-editing.js
- ct
- Ce
- pt
- sn
- se
- yc
- package.json
- Wn
- .updateProjectionMatrix
- parser-engine.js
- Ne
- .setAttribute
- yt
- ws
- .subVectors
- nc
- eh
- jt
- .applyMatrix4
- measure-tool.js
- .toJSON
- .constructor
- _o
- updateMatrixWorld
- jn
- re
- .multiplyScalar
- ._update
- us
- yo
- block-form-panel.js
- bug-report.js
- constructor
- en
- nl
- _fromTexture
- .toArray
- ml
- render3d.js
- view2d.js
- voxel-cutting.js
- manifest.json
- OrbitControls
- .dot
- .dispatchEvent
- cl
- parser-radius-comp.test.js
- app.js
- sim-controls.js
- .fromJSON
- .fromArray
- ls
- bl
- .setFromMatrixPosition
- Hi
- rh
- zl
- mcode-panel.js
- qparam-panel.js
- dc
- .fromBufferAttribute
- la
- parser-toolpath-only.test.js
- cycle-picker.js
- fl
- Ll
- Rl
- bind
- dl
- el
- pl
- ExampleInstrumentedTest.java
- help-popups.js
- sc
- ExampleUnitTest.java
- gradlew
- klartext-syntax.js
- theme-toast.js
- Aa
- Mh
- ms
- ss
- uc
- Wl
- MainActivity.java
- onboarding.js
- mobile-tabs.js
- Ah
- Do
- Et
- fo
- hl
- po
- qo
- rc
- Rs
- Zc
- zo
- sync-core.sh

## God Nodes (most connected - your core abstractions)
1. `vt` - 125 edges
2. `copy()` - 121 edges
3. `Lt` - 80 edges
4. `en` - 72 edges
5. `Wn` - 58 edges
6. `St` - 50 edges
7. `Ce` - 43 edges
8. `tn` - 43 edges
9. `ws()` - 42 edges
10. `se` - 38 edges

## Surprising Connections (you probably didn't know these)
- `buildKeypad()` --indirect_call--> `i()`  [INFERRED]
  www/core/field-editing.js → www/vendor/three.min.js
- `bugCopyReport()` --indirect_call--> `ta`  [INFERRED]
  www/core/bug-report.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (133 total, 67 thin omitted)

### Community 0 - "three.min.js"
Cohesion: 0.03
Nodes (34): an, Ba, bo, ci, compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), Da (+26 more)

### Community 1 - "vt"
Cohesion: 0.03
Nodes (24): ar(), cr(), dr(), fr(), gr(), hr(), ir(), kr() (+16 more)

### Community 3 - "editor-core.js"
Cohesion: 0.07
Nodes (33): _applyEditorFs(), applyFix(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), _downloadTextFile(), editorClear(), _editorConfirm() (+25 more)

### Community 5 - "tn"
Cohesion: 0.06
Nodes (7): dt(), $e(), Ke(), mn, Qe(), tn, ut()

### Community 7 - "Lc"
Cohesion: 0.07
Nodes (5): bc, getInput(), getOutput(), ic, Lc

### Community 8 - "learn-tutorial.js"
Cohesion: 0.10
Nodes (19): closeLearn(), learnBackToList(), learnCheck(), _learnEndEditorInput(), learnEvalChecks(), learnExit(), learnFinishLesson(), learnNav() (+11 more)

### Community 9 - "ec"
Cohesion: 0.06
Nodes (10): $c(), ec, ge, il(), intersectObject(), intersectObjects(), Kc(), mt() (+2 more)

### Community 10 - "tool-table.js"
Cohesion: 0.11
Nodes (18): buildToolIntoGroup(), calcToolTimes(), field(), getToolByNum(), getToolColor3(), inferToolType(), onToolImportFile(), renderToolForm() (+10 more)

### Community 11 - "no"
Cohesion: 0.10
Nodes (18): ao(), co(), eo(), ho(), io(), ja(), ka(), lo() (+10 more)

### Community 12 - "parse"
Cohesion: 0.12
Nodes (10): bindSkeletons(), load(), oc, ol, parse(), parseAnimations(), parseImages(), parseSkeletons() (+2 more)

### Community 15 - "copy"
Cohesion: 0.09
Nodes (7): clone(), copy(), cs, hs, qn, uo(), Vs

### Community 16 - "field-editing.js"
Cohesion: 0.15
Nodes (25): applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext(), fieldPrev() (+17 more)

### Community 17 - "ct"
Cohesion: 0.08
Nodes (5): bt, ct(), es(), qc, Xe()

### Community 23 - "package.json"
Cohesion: 0.08
Nodes (23): @capacitor/android, @capacitor/cli, @capacitor/core, author, bugs, url, dependencies, @capacitor/android (+15 more)

### Community 24 - "Wn"
Cohesion: 0.14
Nodes (13): br(), ei, fi(), gi(), i(), mi(), pi(), update() (+5 more)

### Community 25 - ".updateProjectionMatrix"
Cohesion: 0.12
Nodes (3): Jl, Kn, vl()

### Community 26 - "parser-engine.js"
Cohesion: 0.16
Nodes (18): applyRadiusComp(), buildToolMesh(), _carryPhysicalXY(), checkRadiusVsTool(), evalQExpr(), expandLblLines(), offsetRun(), parseProgram() (+10 more)

### Community 30 - "ws"
Cohesion: 0.12
Nodes (6): _a, bs, dispose(), ft(), Tt, ws()

### Community 37 - "measure-tool.js"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 38 - ".toJSON"
Cohesion: 0.12
Nodes (3): ac, go, tc

### Community 40 - "_o"
Cohesion: 0.16
Nodes (7): ca, Jr(), mo(), _o, os(), qr(), uh()

### Community 41 - "updateMatrixWorld"
Cohesion: 0.13
Nodes (3): _s(), _sceneToCubeUV(), updateMatrixWorld()

### Community 42 - "jn"
Cohesion: 0.12
Nodes (8): cn, dn, fn, hn, jn(), on, pn, un

### Community 45 - "._update"
Cohesion: 0.15
Nodes (3): jo, wo, xo

### Community 47 - "us"
Cohesion: 0.17
Nodes (3): kl, ni, us()

### Community 49 - "block-form-panel.js"
Cohesion: 0.29
Nodes (10): blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal(), insertBlkForm() (+2 more)

### Community 50 - "bug-report.js"
Cohesion: 0.16
Nodes (3): _bugBuildText(), bugCopyReport(), ta

### Community 51 - "constructor"
Cohesion: 0.14
Nodes (5): constructor(), setDirection(), Si(), ti, wh()

### Community 52 - "en"
Cohesion: 0.19
Nodes (3): en, li(), yn()

### Community 54 - "_fromTexture"
Cohesion: 0.22
Nodes (13): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), fromCubemap(), fromEquirectangular(), fromScene(), _fromTexture() (+5 more)

### Community 57 - "render3d.js"
Cohesion: 0.30
Nodes (11): _applyRefinedMesh(), buildScene(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread(), _scene3dBgColor(), show3DError() (+3 more)

### Community 58 - "view2d.js"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "voxel-cutting.js"
Cohesion: 0.23
Nodes (6): advance(), placeTool(), segSpeed(), vxBuildMesh(), vxInit(), vxRebuildMesh()

### Community 60 - "manifest.json"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 64 - "cl"
Cohesion: 0.18
Nodes (3): cl, ds(), ps()

### Community 65 - "parser-radius-comp.test.js"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "app.js"
Cohesion: 0.27
Nodes (7): applyStockVisibility(), isCycleAnchor(), isLockedLine(), onMove(), onUp(), toggleStockVisibility(), updateStockToggle()

### Community 67 - "sim-controls.js"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 68 - ".fromJSON"
Cohesion: 0.18
Nodes (3): Al, parseGeometries(), parseShapes()

### Community 73 - "Hi"
Cohesion: 0.20
Nodes (9): er(), Hi(), ji(), ki(), nr(), qi(), tr(), vi() (+1 more)

### Community 76 - "mcode-panel.js"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "qparam-panel.js"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 81 - "parser-toolpath-only.test.js"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 84 - "cycle-picker.js"
Cohesion: 0.48
Nodes (6): closeCtxPanel(), closeCyclePicker(), openCyclePicker(), selectCycle(), showCycleList(), showCycleParams()

### Community 88 - "bind"
Cohesion: 0.40
Nodes (3): bind(), getValue(), setValue()

### Community 93 - "ExampleInstrumentedTest.java"
Cohesion: 0.60
Nodes (3): ExampleInstrumentedTest, Test, RunWith

### Community 94 - "help-popups.js"
Cohesion: 0.60
Nodes (3): hideHelpPopup(), openHelp(), toggleKpHelp()

### Community 98 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 100 - "klartext-syntax.js"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

## Knowledge Gaps
- **41 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `copy` to `three.min.js`, `At`, `tn`, `ec`, `no`, `jc`, `ct`, `Ce`, `pt`, `sn`, `yc`, `Wn`, `.updateProjectionMatrix`, `Ne`, `.setAttribute`, `ws`, `.subVectors`, `nc`, `eh`, `jt`, `.applyMatrix4`, `.toJSON`, `.constructor`, `updateMatrixWorld`, `jn`, `re`, `.multiplyScalar`, `.isEmpty`, `us`, `bug-report.js`, `en`, `nl`, `.toArray`, `ml`, `.dot`, `cl`, `.fromJSON`, `.setFromMatrixPosition`, `rh`, `zl`, `.fromBufferAttribute`, `la`, `fl`, `Ll`, `Rl`, `.copy`, `dl`, `el`, `pl`, `sc`, `Aa`, `Do`, `fo`, `Rs`, `zo`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `vt` connect `vt` to `three.min.js`, `tn`, `Lc`, `ec`, `parse`, `jc`, `copy`, `ct`, `Wn`, `.setAttribute`, `ws`, `.getX`, `jt`, `_o`, `.multiplyScalar`, `.isEmpty`, `us`, `constructor`, `en`, `nl`, `.toArray`, `cl`, `ls`, `Hi`, `.length`, `Aa`, `uc`, `fo`, `hl`, `rc`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `i()` connect `Wn` to `three.min.js`, `cl`, `vt`, `ls`, `.constructor`, `Hi`, `updateMatrixWorld`, `no`, `parse`, `uc`, `field-editing.js`, `constructor`, `en`, `.setAttribute`, `.subVectors`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `three.min.js` be split into smaller, more focused modules?**
  _Cohesion score 0.031388329979879274 - nodes in this community are weakly interconnected._
- **Should `vt` be split into smaller, more focused modules?**
  _Cohesion score 0.029399585921325053 - nodes in this community are weakly interconnected._
- **Should `At` be split into smaller, more focused modules?**
  _Cohesion score 0.06560283687943262 - nodes in this community are weakly interconnected._