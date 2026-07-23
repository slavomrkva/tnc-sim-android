# Graph Report - android-origin-main  (2026-07-23)

## Corpus Check
- 83 files · ~283,922 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2684 nodes · 4789 edges · 157 communities (104 shown, 53 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ca03083`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Three.js Core Engine
- WebGL Texture Binding
- Quaternion Math Operations
- Code Editor Core
- 3D Vector Math
- Geometry Parsing and Colors
- Vector3 Operations
- Clock and Audio Analyzer
- Learn Tutorial System
- Spherical Harmonics Math
- Tool Table Management
- 3D Object Transforms
- Asset Loading Pipeline
- Skeleton Bone Binding
- Animation Action Control
- Object Cloning Utilities
- Field Editing UI
- Buffer Attribute Management
- Scene Object Traversal
- Bounding Box Operations
- Buffer Geometry Arrays
- Matrix3 Operations
- Animation Mixer Actions
- Capacitor Package Config
- WebGL Parameter Management
- Camera Projection Setup
- CNC Parser Engine
- Frustum and Plane Math
- Geometry Normal Computation
- Matrix3 Math
- Render Object Lifecycle
- Triangle Geometry Math
- .fromArray
- Quaternion Interpolation
- Bounding Box Math
- Ray and Sphere Math
- Raycaster Intersection
- Measure Tool UI
- Object Serialization
- Matrix4 Decomposition
- Animation Parsing Utils
- Bone Transform Updates
- clone
- Ray Casting Math
- Camera Ray Utilities
- Animation Interpolant Update
- Bug history — resolved bugs & how they were fixed
- bt
- Keyframe Track Interpolation
- Block Form Panel UI
- Bug Report UI
- Geometry Transform Helpers
- Buffer Geometry Groups
- Curve Path Building
- PMREM Texture Processing
- Skeleton Management
- Curve Length Mapping
- 3D Scene Rendering
- 2D View Controls
- Voxel Cutting Simulation
- Web App Manifest
- Orbit Camera Controls
- Vector Angle and Events
- Ll
- Shape and Font Parsing
- Radius Comp Tests
- App Input Handling
- Simulation Controls
- Geometry JSON Parsing
- Matrix Column Parsing
- Buffer Attribute Data
- 2D Path Drawing
- LOD Object Parsing
- String Utility Helpers
- Line3 Geometry Math
- Xn
- M-Code Panel UI
- Q Parameter Panel UI
- Path Curve Building
- Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android)
- Instanced Mesh Management
- Toolpath Parser Tests
- C25 — Custom keyboard kept and routed to a stale editor owner
- C1 — Mobile editor focus/scroll jumping during value editing and Learn
- Cycle Picker UI
- Cubic Bezier Curve
- Rl
- _a
- Property Binding Values
- .equals
- Mh
- README.md
- build.gradle
- Android Instrumented Test
- Help Popup UI
- Euler Rotation Clone
- .getCamera
- Android Unit Test
- Gradle Build Script
- Layout and Keypad UI
- Syntax Highlighting Utilities
- Theme and UI Toggles
- 2026-07-17 — ported mobile numeric editing and TNC 640 RL/RR corrections
- UV and Matrix Transforms
- Rs
- .getNormalMatrix
- ge
- TNC Sim — Android app
- .computeBoundingBox
- Android Main Activity
- Onboarding Flow
- Mobile Tab Navigation
- Ll
- Export (program and Tool Table) did nothing on device
- Copy Constructor Pair
- tc
- Asset Loader
- uc
- ExampleUnitTest
- capacitor.build.gradle
- Module-split refactor — historical context
- Clone Constructor Pair
- ol
- ai
- .fromJSON
- doc-name-header.test.js
- Android Build Config
- Capacitor Settings Config
- zo
- radius-comp-live-defer.test.js
- Test
- Test
- Module-split refactor — historical context
- .updateMatrices
- .addVectors
- .scale
- sim-run-resets-workpiece.test.js
- ac
- tc
- .copyLinearToSRGB
- tc
- ti
- Do
- .copy
- hs
- setFromCamera

## God Nodes (most connected - your core abstractions)
1. `vt` - 125 edges
2. `copy()` - 121 edges
3. `Lt` - 80 edges
4. `en` - 72 edges
5. `Wn` - 58 edges
6. `TNC Sim (Android) — Release notes` - 52 edges
7. `St` - 50 edges
8. `TNC Sim Android — technical changelog` - 46 edges
9. `Ce` - 43 edges
10. `tn` - 43 edges

## Surprising Connections (you probably didn't know these)
- `createHarness()` --indirect_call--> `makeInput()`  [INFERRED]
  tests/custom-keyboard-deep.test.js → tests/custom-keyboard.test.js
- `selectCycle()` --references--> `CYCLES`  [EXTRACTED]
  www/core/cycle-picker.js → tests/parser-cycles-audit.test.js
- `buildKeypad()` --indirect_call--> `i()`  [INFERRED]
  www/core/field-editing.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (157 total, 53 thin omitted)

### Community 0 - "Three.js Core Engine"
Cohesion: 0.03
Nodes (42): Ah, _allocateTargets(), _applyPMREM(), Ba, _blur(), bo, $c(), _cleanup() (+34 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (27): br(), cr(), dr(), er(), fr(), gr(), Hi(), hr() (+19 more)

### Community 3 - "Code Editor Core"
Cohesion: 0.07
Nodes (37): _applyEditorFs(), applyFix(), applyNumericSign(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), editorClear(), _editorConfirm() (+29 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.05
Nodes (8): dt(), $e(), ic, Ke(), mn, Qe(), tn, ut()

### Community 7 - "Clock and Audio Analyzer"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 8 - "Learn Tutorial System"
Cohesion: 0.06
Nodes (23): closeLearn(), learnBackToList(), learnCheck(), _learnCycleBlocks(), _learnEndEditorInput(), learnEvalChecks(), _learnExecutableCode(), learnExit() (+15 more)

### Community 9 - "Spherical Harmonics Math"
Cohesion: 0.14
Nodes (3): bl, dc, mc()

### Community 10 - "Tool Table Management"
Cohesion: 0.11
Nodes (28): buildToolIntoGroup(), calcToolTimes(), effectiveToolRadius(), field(), getToolByNum(), getToolColor3(), inferToolType(), insertToolDef() (+20 more)

### Community 11 - "3D Object Transforms"
Cohesion: 0.10
Nodes (18): ao(), co(), eo(), ho(), io(), ja(), ka(), lo() (+10 more)

### Community 12 - "Asset Loading Pipeline"
Cohesion: 0.05
Nodes (38): Attempts, Attempts, Attempts, Attempts, Attempts, Attempts, Attempts, Attempts (+30 more)

### Community 15 - "Object Cloning Utilities"
Cohesion: 0.10
Nodes (4): bind(), getValue(), Ko, nc

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (26): applyFeedMode(), applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext() (+18 more)

### Community 17 - "Buffer Attribute Management"
Cohesion: 0.12
Nodes (4): gl, kl, _sceneToCubeUV(), us()

### Community 19 - "Bounding Box Operations"
Cohesion: 0.08
Nodes (40): anEditorActive(), blurCodeSoon(), blurEditorNow(), cancelBackspaceHold(), clearCurrentValue(), currentTarget(), el(), ensureBuilt() (+32 more)

### Community 20 - "Buffer Geometry Arrays"
Cohesion: 0.05
Nodes (3): Ga, ls(), sn

### Community 21 - "Matrix3 Operations"
Cohesion: 0.06
Nodes (3): as(), se, ss()

### Community 23 - "Capacitor Package Config"
Cohesion: 0.07
Nodes (27): author, bugs, url, dependencies, @capacitor/android, @capacitor/cli, @capacitor/core, @capacitor/filesystem (+19 more)

### Community 24 - "WebGL Parameter Management"
Cohesion: 0.26
Nodes (13): _applyGridTheme(), _applyRefinedMesh(), buildScene(), _gridColors(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread() (+5 more)

### Community 26 - "CNC Parser Engine"
Cohesion: 0.10
Nodes (42): applyRadiusComp(), applyRadiusCompAnalytic(), _applyRadiusCompPolylineFallback(), buildToolMesh(), _carryPhysicalXY(), evalQExpr(), expandLblLines(), inspectQExpr() (+34 more)

### Community 27 - "Frustum and Plane Math"
Cohesion: 0.10
Nodes (3): qn, _s(), updateMatrixWorld()

### Community 28 - "Geometry Normal Computation"
Cohesion: 0.16
Nodes (6): assert, cyc(), H, mustError(), seg(), valErrors()

### Community 30 - "Render Object Lifecycle"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 31 - "Triangle Geometry Math"
Cohesion: 0.08
Nodes (15): ar(), ci, cl, constructor(), Da, en, fh, gn() (+7 more)

### Community 32 - ".fromArray"
Cohesion: 0.13
Nodes (4): dl, parseObject(), parseShapes(), parseTextures()

### Community 33 - "Quaternion Interpolation"
Cohesion: 0.05
Nodes (23): appSource, assert, before, boundaryDirty, BufferAttribute, BufferGeometry, chunkTriangles, compatibilityMesh (+15 more)

### Community 34 - "Bounding Box Math"
Cohesion: 0.13
Nodes (3): jo, wo, xo

### Community 36 - "Raycaster Intersection"
Cohesion: 0.18
Nodes (3): ct(), es(), Xe()

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 38 - "Object Serialization"
Cohesion: 0.06
Nodes (10): cn, dn, ec, fn, ge, hn, jn(), on (+2 more)

### Community 39 - "Matrix4 Decomposition"
Cohesion: 0.06
Nodes (32): 0. The app is ALWAYS single-column/mobile — never desktop side-by-side, 10. `www/index.html` is now split into `core/`/`android/` modules — see "Module map" above, 11. Drop the editor's bottom-tab reservation while the keyboard is open, 12. Resize the 3D renderer from the render loop, not only on window 'resize', 13. The bottom tab bar must NOT animate (no transform transition), 14. Bug lifecycle: TODO.md while open (log every attempt), BUG_HISTORY.md when fixed, 15. Chunked voxel meshing and Android memory limits, 16. Q-value fallbacks must treat 0 as valid (+24 more)

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.05
Nodes (23): ca, ei, fo(), hh, il(), Jr(), li(), mo() (+15 more)

### Community 41 - "Bone Transform Updates"
Cohesion: 0.18
Nodes (10): appSource, assert, completedProblems, context, fs, liveProblems, path, qPanelSource (+2 more)

### Community 45 - "Animation Interpolant Update"
Cohesion: 0.08
Nodes (25): appSource, assert, boot(), editorSource, exitBody, failed, finishBody, fs (+17 more)

### Community 46 - "Bug history — resolved bugs & how they were fixed"
Cohesion: 0.25
Nodes (7): 2026-07-17 — garbled `Ready â€" press Run` status line (Android only), 2026-07-18 — coloured leftover cut surfaces when re-running without Reset, 2026-07-18 — modal feed corrupted to FMAX after a fixed cycle / M99 call, Bug history — resolved bugs & how they were fixed, C10 — Cycle 209 explicit zero values were ignored, C8 — Cycle 208 used the wrong FAUTO feed and uneven helix infeed, C9 — Short drilling/tapping retracts appeared to teleport

### Community 48 - "Keyframe Track Interpolation"
Cohesion: 0.25
Nodes (7): assert, callLine, callSegments, code, context, harness, parsed

### Community 49 - "Block Form Panel UI"
Cohesion: 0.27
Nodes (11): blkBeforeInput(), blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal() (+3 more)

### Community 50 - "Bug Report UI"
Cohesion: 0.28
Nodes (15): _bugArea(), _bugBuildBody(), _bugContext(), _bugGetToken(), _bugPrefill(), _bugRenderTurnstile(), bugSetKind(), _bugSetStatus() (+7 more)

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.22
Nodes (4): assert, fs, source, vm

### Community 54 - "PMREM Texture Processing"
Cohesion: 0.18
Nodes (16): afterBoot(), attachErrorButton(), buildReloadUrl(), cleanupLegacyAutomaticMode(), isAndroidApp(), modeLabel(), modeRequestedByUrl(), readMode() (+8 more)

### Community 57 - "3D Scene Rendering"
Cohesion: 0.05
Nodes (36): app, assert, compatibilityToggleIndex, domElement(), environment(), errorContainer, failed, failedLocal (+28 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.22
Nodes (12): advance(), placeTool(), segSpeed(), shouldHoldVisibleSegment(), vxBuildGeometryRange(), vxBuildMesh(), vxCut(), vxDisposeObject() (+4 more)

### Community 61 - "Orbit Camera Controls"
Cohesion: 0.18
Nodes (9): assert, classList, context, elements, fs, overlayClasses, path, source (+1 more)

### Community 62 - "Vector Angle and Events"
Cohesion: 0.14
Nodes (11): assert, first, fs, index, local, path, restarted, root (+3 more)

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.11
Nodes (15): appSource, assert, context, cycle208Builder, cycle208Table, cycleTableSource, firstCycle208, fs (+7 more)

### Community 65 - "Radius Comp Tests"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "App Input Handling"
Cohesion: 0.20
Nodes (7): applyStockVisibility(), isCycleAnchor(), isLockedLine(), onMove(), onUp(), toggleStockVisibility(), updateStockToggle()

### Community 67 - "Simulation Controls"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 68 - "Geometry JSON Parsing"
Cohesion: 0.39
Nodes (7): CYCLES, closeCtxPanel(), closeCyclePicker(), openCyclePicker(), selectCycle(), showCycleList(), showCycleParams()

### Community 72 - "LOD Object Parsing"
Cohesion: 0.09
Nodes (12): appSource, assert, blkInput, ckSource, coreSource, cssSource, ctx, fs (+4 more)

### Community 73 - "String Utility Helpers"
Cohesion: 0.33
Nodes (5): Documentation budget, graphify, Non-negotiables, Start of every session, TNC Sim Android

### Community 75 - "Xn"
Cohesion: 0.15
Nodes (3): ai, an, ln

### Community 76 - "M-Code Panel UI"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "Q Parameter Panel UI"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 78 - "Path Curve Building"
Cohesion: 0.36
Nodes (11): _coachEnsureTabFor(), _coachMarkSeen(), _coachPaint(), _coachSeen(), _coachTarget(), learnCoachEnd(), learnCoachMaybeStart(), learnCoachNext() (+3 more)

### Community 79 - "Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android)"
Cohesion: 0.40
Nodes (5): Approaches tried, in order, Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android), Final resolved state, Hard constraint (kept costing time — read this first), Symptom (as originally reported, translated)

### Community 80 - "Instanced Mesh Management"
Cohesion: 0.40
Nodes (5): Attempts and fix, C2 — Pure-Z R0 cancellation moved diagonally after an RL/RR contour, Repro contour, Root cause, Symptom

### Community 81 - "Toolpath Parser Tests"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 82 - "C25 — Custom keyboard kept and routed to a stale editor owner"
Cohesion: 0.50
Nodes (4): Attempts and accepted fix, C25 — Custom keyboard kept and routed to a stale editor owner, Root cause, Symptom

### Community 83 - "C1 — Mobile editor focus/scroll jumping during value editing and Learn"
Cohesion: 0.50
Nodes (4): Attempts and fix, C1 — Mobile editor focus/scroll jumping during value editing and Learn, Root cause, Symptom

### Community 84 - "Cycle Picker UI"
Cohesion: 0.15
Nodes (7): ctx, fs, parserSource, path, root, TOOLS, vm

### Community 85 - "Cubic Bezier Curve"
Cohesion: 0.13
Nodes (11): applyNumericSign(), assert, createHarness(), FakeEvent, fs, keyboardSource, path, root (+3 more)

### Community 88 - "Property Binding Values"
Cohesion: 0.50
Nodes (4): Fix, Learn tab: dead near-black empty strip at the bottom (single-column layout), Root cause, Symptom

### Community 91 - "README.md"
Cohesion: 0.12
Nodes (14): angleCode, angleMatch, appSource, assert, completeMatch, context, fs, indexHtml (+6 more)

### Community 92 - "build.gradle"
Cohesion: 0.18
Nodes (8): assert, chamfer, context, fs, intro, path, root, vm

### Community 94 - "Help Popup UI"
Cohesion: 0.60
Nodes (3): hideHelpPopup(), openHelp(), toggleKpHelp()

### Community 95 - "Euler Rotation Clone"
Cohesion: 0.06
Nodes (10): Aa, copy(), cs, Do, hs, Rs, sc, uo() (+2 more)

### Community 100 - "Syntax Highlighting Utilities"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

### Community 102 - "2026-07-17 — ported mobile numeric editing and TNC 640 RL/RR corrections"
Cohesion: 0.67
Nodes (3): 2026-07-17 — ported mobile numeric editing and TNC 640 RL/RR corrections, Ported correction, Verification

### Community 103 - "UV and Matrix Transforms"
Cohesion: 0.18
Nodes (10): app, assert, controls, fs, index, parser, path, qualityButtons (+2 more)

### Community 104 - "Rs"
Cohesion: 0.67
Nodes (3): Accepted fix and verification, C19 — CALL LBL status was blank in the 3D simulation, Symptom and root cause

### Community 106 - "ge"
Cohesion: 0.67
Nodes (3): Attempts and accepted fixes, C16 — Complete Learn correctness, content and visual audit, Symptom and root causes

### Community 107 - "TNC Sim — Android app"
Cohesion: 0.25
Nodes (7): Build, Disclaimer, License, Project layout, Status, TNC Sim — Android app, What it does

### Community 113 - "Ll"
Cohesion: 0.10
Nodes (7): _a, bs, dispose(), Et, ft(), Tt, ws()

### Community 114 - "Export (program and Tool Table) did nothing on device"
Cohesion: 0.67
Nodes (3): Attempts and fix, Export (program and Tool Table) did nothing on device, Symptom and cause

### Community 115 - "Copy Constructor Pair"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 116 - "tc"
Cohesion: 0.67
Nodes (3): Attempts and fix, C7 — 3D stock updates stalled during machining, Symptom and cause

### Community 117 - "Asset Loader"
Cohesion: 0.04
Nodes (52): 1.0.1 (versionCode 2), 1.0.2 (versionCode 3), 1.0.3 (versionCode 4), 1.0.4 (versionCode 5), 1.0 (versionCode 1), Diagnostic test build (APP_VERSION 1.0.49), Diagnostic test build (APP_VERSION 1.0.50), Diagnostic test build (APP_VERSION 1.0.51) (+44 more)

### Community 118 - "uc"
Cohesion: 0.67
Nodes (3): C3 — RND/CHF occasionally inserted at the start of the program, Root cause and resolution, Symptom

### Community 122 - "Clone Constructor Pair"
Cohesion: 0.67
Nodes (3): C4 — Placement of a newly inserted block relative to the active line, Original expectation, Resolution note

### Community 123 - "ol"
Cohesion: 0.08
Nodes (15): bindSkeletons(), hl, i(), load(), oc, ol, parse(), parseAnimations() (+7 more)

### Community 124 - "ai"
Cohesion: 0.67
Nodes (3): C5 — Editor text passed behind mobile control panels, Root cause and fix, Symptom

### Community 126 - ".fromJSON"
Cohesion: 0.11
Nodes (3): ac, go, pl

### Community 127 - "doc-name-header.test.js"
Cohesion: 0.22
Nodes (8): assert, codeEl, core, ctx, fs, path, titleEl, vm

### Community 131 - "radius-comp-live-defer.test.js"
Cohesion: 0.22
Nodes (5): assert, ctx, harness, inProgress, unfitCorner

### Community 136 - "Module-split refactor — historical context"
Cohesion: 0.04
Nodes (46): APP_VERSION 1.0.37 — documentation damage control, APP_VERSION 1.0.38 — machining demos and accepted web ports, APP_VERSION 1.0.41 — adaptive Android WebGL compatibility, APP_VERSION 1.0.42 — accepted Learn audit port, APP_VERSION 1.0.43 — accepted shorter tutorial port, APP_VERSION 1.0.44 — Tool Table workflow hardening, APP_VERSION 1.0.45 — HEIDENHAIN cycle, cutting and validator corrections, APP_VERSION 1.0.46 — first tutorial orientation lesson (+38 more)

### Community 137 - ".updateMatrices"
Cohesion: 0.47
Nodes (12): initProgramAutosave(), programAutosaveChanged(), _programAutosaveRead(), _programAutosaveRestore(), programAutosaveResumeAfterLearn(), _programAutosaveSavedStatus(), _programAutosaveSignature(), _programAutosaveStatus() (+4 more)

### Community 142 - ".scale"
Cohesion: 0.67
Nodes (3): C6 — Measure panel overlapped the mobile BLKFORM control, Root cause and fix, Symptom

### Community 143 - "sim-run-resets-workpiece.test.js"
Cohesion: 0.25
Nodes (6): assert, fs, path, root, source, vm

### Community 156 - "tc"
Cohesion: 0.25
Nodes (6): Current non-obvious invariants, Edit, build, and release, Product and source layout, Testing before push or release, TNC Sim Android — current project contract, Versioning

### Community 157 - ".copyLinearToSRGB"
Cohesion: 0.29
Nodes (6): assert, button, fs, html, path, root

### Community 158 - "tc"
Cohesion: 0.14
Nodes (11): fi(), ni, pi(), Si(), ti, update(), wh(), wi() (+3 more)

### Community 159 - "ti"
Cohesion: 0.15
Nodes (6): ds(), gi(), mi(), pc, ps(), setValue()

## Knowledge Gaps
- **472 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+467 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `Euler Rotation Clone` to `Three.js Core Engine`, `Quaternion Math Operations`, `zo`, `Geometry Parsing and Colors`, `Spherical Harmonics Math`, `3D Object Transforms`, `Skeleton Bone Binding`, `.addVectors`, `Object Cloning Utilities`, `Buffer Attribute Management`, `Scene Object Traversal`, `Buffer Geometry Arrays`, `Matrix3 Operations`, `Camera Projection Setup`, `Frustum and Plane Math`, `tc`, `ti`, `.fromArray`, `Triangle Geometry Math`, `Do`, `.copy`, `Ray and Sphere Math`, `Object Serialization`, `setFromCamera`, `Animation Parsing Utils`, `clone`, `Ray Casting Math`, `Camera Ray Utilities`, `bt`, `Geometry Transform Helpers`, `Curve Path Building`, `Skeleton Management`, `Curve Length Mapping`, `Web App Manifest`, `Ll`, `Buffer Attribute Data`, `2D Path Drawing`, `Line3 Geometry Math`, `Xn`, `Rl`, `.equals`, `.getCamera`, `Android Unit Test`, `Ll`, `ol`, `.fromJSON`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `Lt` connect `Vector3 Operations` to `Three.js Core Engine`, `.getCamera`, `Quaternion Math Operations`, `.copy`, `Ray and Sphere Math`, `Object Serialization`, `Line3 Geometry Math`, `Ray Casting Math`, `Ll`, `Scene Object Traversal`, `Buffer Attribute Management`, `Buffer Geometry Arrays`, `Curve Length Mapping`, `Matrix3 Math`, `Triangle Geometry Math`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `vt` connect `WebGL Texture Binding` to `Three.js Core Engine`, `Geometry Parsing and Colors`, `Clock and Audio Analyzer`, `Skeleton Bone Binding`, `Buffer Attribute Management`, `Buffer Geometry Arrays`, `Matrix3 Operations`, `tc`, `ti`, `Triangle Geometry Math`, `Ray and Sphere Math`, `.copy`, `Animation Parsing Utils`, `clone`, `Curve Path Building`, `Skeleton Management`, `2D Path Drawing`, `Line3 Geometry Math`, `Euler Rotation Clone`, `Gradle Build Script`, `Ll`, `ol`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _472 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.03327596098680436 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.030821917808219176 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.06567992599444958 - nodes in this community are weakly interconnected._