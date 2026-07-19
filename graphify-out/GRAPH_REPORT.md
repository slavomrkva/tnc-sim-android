# Graph Report - tnc-sim-android-turnstile  (2026-07-19)

## Corpus Check
- 76 files · ~221,626 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2452 nodes · 4436 edges · 166 communities (103 shown, 63 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb5ed40d`
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
- Quaternion Interpolation
- Ray and Sphere Math
- Raycaster Intersection
- Measure Tool UI
- Object Serialization
- Matrix4 Decomposition
- Animation Parsing Utils
- Bone Transform Updates
- Render Target Setup
- Ray Casting Math
- Camera Ray Utilities
- Animation Interpolant Update
- Bounding Geometry Utils
- Shadow Map Management
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
- Scene Graph Management
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
- Line Geometry Utils
- Instanced Mesh Management
- Toolpath Parser Tests
- .multiplyMatrices
- Cycle Picker UI
- Cubic Bezier Curve
- Rl
- _a
- Property Binding Values
- Rs
- Quadratic Bezier Curve
- README.md
- build.gradle
- Android Instrumented Test
- Help Popup UI
- Euler Rotation Clone
- Android Unit Test
- Gradle Build Script
- Layout and Keypad UI
- Syntax Highlighting Utilities
- Theme and UI Toggles
- Clone Constructor Update Pattern
- UV and Matrix Transforms
- Rs
- .getNormalMatrix
- ge
- TNC Sim — Android app
- C4 — Placement of a newly inserted block relative to the active line
- Android Main Activity
- Onboarding Flow
- Mobile Tab Navigation
- Ll
- .setStyle
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
- dc
- .fromBufferAttribute
- .scale
- sim-run-resets-workpiece.test.js
- xs
- .equals
- .findNode
- Rl
- cs
- Ll
- el
- bind
- .setCrossOrigin
- tc
- vl
- setFromCamera

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
- `selectCycle()` --references--> `CYCLES`  [EXTRACTED]
  www/core/cycle-picker.js → tests/parser-cycles-audit.test.js
- `buildKeypad()` --indirect_call--> `i()`  [INFERRED]
  www/core/field-editing.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (166 total, 63 thin omitted)

### Community 0 - "Three.js Core Engine"
Cohesion: 0.04
Nodes (39): _allocateTargets(), _applyPMREM(), Ba, _blur(), _cleanup(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial() (+31 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (28): br(), cr(), dr(), er(), fr(), gr(), Hi(), hr() (+20 more)

### Community 2 - "Quaternion Math Operations"
Cohesion: 0.06
Nodes (4): At, fe, ht(), ps()

### Community 3 - "Code Editor Core"
Cohesion: 0.07
Nodes (37): _applyEditorFs(), applyFix(), applyNumericSign(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), editorClear(), _editorConfirm() (+29 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.07
Nodes (6): dt(), $e(), ic, Qe(), tn, ut()

### Community 7 - "Clock and Audio Analyzer"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 8 - "Learn Tutorial System"
Cohesion: 0.06
Nodes (23): closeLearn(), learnBackToList(), learnCheck(), _learnCycleBlocks(), _learnEndEditorInput(), learnEvalChecks(), _learnExecutableCode(), learnExit() (+15 more)

### Community 10 - "Tool Table Management"
Cohesion: 0.11
Nodes (28): buildToolIntoGroup(), calcToolTimes(), effectiveToolRadius(), field(), getToolByNum(), getToolColor3(), inferToolType(), insertToolDef() (+20 more)

### Community 11 - "3D Object Transforms"
Cohesion: 0.11
Nodes (17): co(), eo(), ho(), io(), ja(), ka(), lo(), no() (+9 more)

### Community 12 - "Asset Loading Pipeline"
Cohesion: 0.06
Nodes (30): Attempts, Attempts, Attempts, Attempts, Attempts, Attempts, C12 — Light-theme 3D table grid is too dark, C14 — Revealed hints leak into a newly opened lesson (+22 more)

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (26): applyFeedMode(), applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext() (+18 more)

### Community 23 - "Capacitor Package Config"
Cohesion: 0.07
Nodes (27): author, bugs, url, dependencies, @capacitor/android, @capacitor/cli, @capacitor/core, @capacitor/filesystem (+19 more)

### Community 24 - "WebGL Parameter Management"
Cohesion: 0.26
Nodes (13): _applyGridTheme(), _applyRefinedMesh(), buildScene(), _gridColors(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread() (+5 more)

### Community 26 - "CNC Parser Engine"
Cohesion: 0.10
Nodes (42): applyRadiusComp(), applyRadiusCompAnalytic(), _applyRadiusCompPolylineFallback(), buildToolMesh(), _carryPhysicalXY(), evalQExpr(), expandLblLines(), inspectQExpr() (+34 more)

### Community 28 - "Geometry Normal Computation"
Cohesion: 0.18
Nodes (6): assert, cyc(), H, mustError(), seg(), valErrors()

### Community 31 - "Triangle Geometry Math"
Cohesion: 0.05
Nodes (27): Ah, ao(), ar(), bo, ci, cl, Da, ds() (+19 more)

### Community 33 - "Quaternion Interpolation"
Cohesion: 0.05
Nodes (23): appSource, assert, before, boundaryDirty, BufferAttribute, BufferGeometry, chunkTriangles, compatibilityMesh (+15 more)

### Community 36 - "Raycaster Intersection"
Cohesion: 0.11
Nodes (4): bt, ct(), es(), Xe()

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 38 - "Object Serialization"
Cohesion: 0.06
Nodes (11): ai, clone(), copy(), Do, hs, parseObject(), Rs, sc (+3 more)

### Community 39 - "Matrix4 Decomposition"
Cohesion: 0.06
Nodes (32): 0. The app is ALWAYS single-column/mobile — never desktop side-by-side, 10. `www/index.html` is now split into `core/`/`android/` modules — see "Module map" above, 11. Drop the editor's bottom-tab reservation while the keyboard is open, 12. Resize the 3D renderer from the render loop, not only on window 'resize', 13. The bottom tab bar must NOT animate (no transform transition), 14. Bug lifecycle: TODO.md while open (log every attempt), BUG_HISTORY.md when fixed, 15. Chunked voxel meshing and Android memory limits, 16. Q-value fallbacks must treat 0 as valid (+24 more)

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.05
Nodes (13): ca, el, fo(), hh, li(), _o, os(), po (+5 more)

### Community 41 - "Bone Transform Updates"
Cohesion: 0.18
Nodes (10): appSource, assert, completedProblems, context, fs, liveProblems, path, qPanelSource (+2 more)

### Community 48 - "Keyframe Track Interpolation"
Cohesion: 0.25
Nodes (7): assert, callLine, callSegments, code, context, harness, parsed

### Community 49 - "Block Form Panel UI"
Cohesion: 0.27
Nodes (11): blkBeforeInput(), blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal() (+3 more)

### Community 50 - "Bug Report UI"
Cohesion: 0.26
Nodes (14): _bugArea(), _bugBuildBody(), _bugContext(), _bugGetToken(), _bugPrefill(), _bugRenderTurnstile(), bugSetKind(), _bugSetStatus() (+6 more)

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.22
Nodes (4): assert, fs, source, vm

### Community 54 - "PMREM Texture Processing"
Cohesion: 0.18
Nodes (16): afterBoot(), attachErrorButton(), buildReloadUrl(), cleanupLegacyAutomaticMode(), isAndroidApp(), modeLabel(), modeRequestedByUrl(), readMode() (+8 more)

### Community 57 - "3D Scene Rendering"
Cohesion: 0.06
Nodes (34): app, assert, compatibilityToggleIndex, domElement(), environment(), errorContainer, failed, failedLocal (+26 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.22
Nodes (12): advance(), placeTool(), segSpeed(), shouldHoldVisibleSegment(), vxBuildGeometryRange(), vxBuildMesh(), vxCut(), vxDisposeObject() (+4 more)

### Community 60 - "Web App Manifest"
Cohesion: 0.24
Nodes (3): an, Ea(), ln

### Community 62 - "Vector Angle and Events"
Cohesion: 0.14
Nodes (11): assert, first, fs, index, local, path, restarted, root (+3 more)

### Community 63 - "Scene Graph Management"
Cohesion: 0.20
Nodes (3): parseGeometries(), parseShapes(), Rl

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.14
Nodes (11): assert, context, firstCycle208, fs, html, parserSource, path, playbackSource (+3 more)

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
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 73 - "String Utility Helpers"
Cohesion: 0.33
Nodes (5): Documentation budget, graphify, Non-negotiables, Start of every session, TNC Sim Android

### Community 75 - "Xn"
Cohesion: 0.11
Nodes (8): ei, fi(), Mh, ni, rt, update(), wi(), yi()

### Community 76 - "M-Code Panel UI"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "Q Parameter Panel UI"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 78 - "Path Curve Building"
Cohesion: 0.36
Nodes (11): _coachEnsureTabFor(), _coachMarkSeen(), _coachPaint(), _coachSeen(), _coachTarget(), learnCoachEnd(), learnCoachMaybeStart(), learnCoachNext() (+3 more)

### Community 79 - "Line Geometry Utils"
Cohesion: 0.12
Nodes (8): cn, dn, fn, hn, jn(), on, pn, un

### Community 80 - "Instanced Mesh Management"
Cohesion: 0.25
Nodes (7): 2026-07-17 — garbled `Ready â€" press Run` status line (Android only), 2026-07-18 — coloured leftover cut surfaces when re-running without Reset, 2026-07-18 — modal feed corrupted to FMAX after a fixed cycle / M99 call, Bug history — resolved bugs & how they were fixed, C10 — Cycle 209 explicit zero values were ignored, C8 — Cycle 208 used the wrong FAUTO feed and uneven helix infeed, C9 — Short drilling/tapping retracts appeared to teleport

### Community 81 - "Toolpath Parser Tests"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 84 - "Cycle Picker UI"
Cohesion: 0.15
Nodes (7): ctx, fs, parserSource, path, root, TOOLS, vm

### Community 85 - "Cubic Bezier Curve"
Cohesion: 0.29
Nodes (6): Current non-obvious invariants, Edit, build, and release, Product and source layout, Testing before push or release, TNC Sim Android — current project contract, Versioning

### Community 91 - "README.md"
Cohesion: 0.13
Nodes (14): angleCode, angleMatch, appSource, assert, completeMatch, context, fs, indexHtml (+6 more)

### Community 92 - "build.gradle"
Cohesion: 0.18
Nodes (8): assert, chamfer, context, fs, intro, path, root, vm

### Community 94 - "Help Popup UI"
Cohesion: 0.60
Nodes (3): hideHelpPopup(), openHelp(), toggleKpHelp()

### Community 97 - "Android Unit Test"
Cohesion: 0.40
Nodes (5): Approaches tried, in order, Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android), Final resolved state, Hard constraint (kept costing time — read this first), Symptom (as originally reported, translated)

### Community 98 - "Gradle Build Script"
Cohesion: 0.40
Nodes (5): Attempts and fix, C2 — Pure-Z R0 cancellation moved diagonally after an RL/RR contour, Repro contour, Root cause, Symptom

### Community 100 - "Syntax Highlighting Utilities"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

### Community 103 - "UV and Matrix Transforms"
Cohesion: 0.18
Nodes (10): app, assert, controls, fs, index, parser, path, qualityButtons (+2 more)

### Community 104 - "Rs"
Cohesion: 0.50
Nodes (4): Attempts and fix, C1 — Mobile editor focus/scroll jumping during value editing and Learn, Root cause, Symptom

### Community 106 - "ge"
Cohesion: 0.50
Nodes (4): Fix, Learn tab: dead near-black empty strip at the bottom (single-column layout), Root cause, Symptom

### Community 107 - "TNC Sim — Android app"
Cohesion: 0.25
Nodes (7): Build, Disclaimer, License, Project layout, Status, TNC Sim — Android app, What it does

### Community 113 - "Ll"
Cohesion: 0.08
Nodes (14): _a, bs, $c(), dispose(), Et, ft(), intersectObject(), intersectObjects() (+6 more)

### Community 115 - "Copy Constructor Pair"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 116 - "tc"
Cohesion: 0.67
Nodes (3): 2026-07-17 — ported mobile numeric editing and TNC 640 RL/RR corrections, Ported correction, Verification

### Community 117 - "Asset Loader"
Cohesion: 0.06
Nodes (34): 1.0.1 (versionCode 2), 1.0.2 (versionCode 3), 1.0.3 (versionCode 4), 1.0.4 (versionCode 5), 1.0 (versionCode 1), Diagnostic test build (APP_VERSION 1.0.49), Diagnostic test build (APP_VERSION 1.0.50), Diagnostic test build (APP_VERSION 1.0.51) (+26 more)

### Community 118 - "uc"
Cohesion: 0.67
Nodes (3): Accepted fix and verification, C19 — CALL LBL status was blank in the 3D simulation, Symptom and root cause

### Community 123 - "ol"
Cohesion: 0.10
Nodes (12): hl, i(), load(), oc, ol, parse(), parseAnimations(), parseImages() (+4 more)

### Community 124 - "ai"
Cohesion: 0.67
Nodes (3): Attempts and accepted fixes, C16 — Complete Learn correctness, content and visual audit, Symptom and root causes

### Community 127 - "doc-name-header.test.js"
Cohesion: 0.22
Nodes (8): assert, codeEl, core, ctx, fs, path, titleEl, vm

### Community 130 - "zo"
Cohesion: 0.12
Nodes (3): ac, go, tc

### Community 131 - "radius-comp-live-defer.test.js"
Cohesion: 0.22
Nodes (5): assert, ctx, harness, inProgress, unfitCorner

### Community 136 - "Module-split refactor — historical context"
Cohesion: 0.07
Nodes (28): APP_VERSION 1.0.37 — documentation damage control, APP_VERSION 1.0.38 — machining demos and accepted web ports, APP_VERSION 1.0.41 — adaptive Android WebGL compatibility, APP_VERSION 1.0.42 — accepted Learn audit port, APP_VERSION 1.0.43 — accepted shorter tutorial port, APP_VERSION 1.0.44 — Tool Table workflow hardening, APP_VERSION 1.0.45 — HEIDENHAIN cycle, cutting and validator corrections, APP_VERSION 1.0.46 — first tutorial orientation lesson (+20 more)

### Community 137 - "dc"
Cohesion: 0.21
Nodes (3): dc, mc(), pc

### Community 143 - "sim-run-resets-workpiece.test.js"
Cohesion: 0.25
Nodes (6): assert, fs, path, root, source, vm

### Community 144 - "xs"
Cohesion: 0.67
Nodes (3): Attempts and fix, Export (program and Tool Table) did nothing on device, Symptom and cause

### Community 145 - ".equals"
Cohesion: 0.67
Nodes (3): Attempts and fix, C7 — 3D stock updates stalled during machining, Symptom and cause

### Community 146 - ".findNode"
Cohesion: 0.67
Nodes (3): C3 — RND/CHF occasionally inserted at the start of the program, Root cause and resolution, Symptom

### Community 147 - "Rl"
Cohesion: 0.67
Nodes (3): C4 — Placement of a newly inserted block relative to the active line, Original expectation, Resolution note

### Community 150 - "Ll"
Cohesion: 0.67
Nodes (3): C5 — Editor text passed behind mobile control panels, Root cause and fix, Symptom

### Community 151 - "el"
Cohesion: 0.67
Nodes (3): C6 — Measure panel overlapped the mobile BLKFORM control, Root cause and fix, Symptom

### Community 154 - "bind"
Cohesion: 0.25
Nodes (5): bind(), bindSkeletons(), getValue(), parseSkeletons(), setValue()

### Community 156 - ".setCrossOrigin"
Cohesion: 0.18
Nodes (3): ms(), ns(), Wn

### Community 168 - "setFromCamera"
Cohesion: 0.16
Nodes (3): fa, Ga, wh()

## Knowledge Gaps
- **364 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `St` connect `3D Vector Math` to `Three.js Core Engine`, `Buffer Attribute Transforms`, `Bounding Box Math`, `Bounding Box Operations`, `Property Binding Values`, `Quadratic Bezier Curve`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Lt` connect `Vector3 Operations` to `Three.js Core Engine`, `Quaternion Math Operations`, `3D Object Transforms`, `Bounding Box Operations`, `Frustum and Plane Math`, `Matrix3 Math`, `Triangle Geometry Math`, `Buffer Attribute Transforms`, `Bounding Box Math`, `Ray and Sphere Math`, `setFromCamera`, `Render Target Setup`, `Camera Ray Utilities`, `Geometry Transform Helpers`, `Curve Length Mapping`, `.multiplyMatrices`, `Property Binding Values`, `Quadratic Bezier Curve`, `Et`, `Ll`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `vt` connect `WebGL Texture Binding` to `Three.js Core Engine`, `Quaternion Math Operations`, `Geometry Parsing and Colors`, `Clock and Audio Analyzer`, `.fromBufferAttribute`, `Skeleton Bone Binding`, `Bounding Box Operations`, `Triangle Geometry Math`, `Buffer Attribute Transforms`, `Bounding Box Math`, `Ray and Sphere Math`, `Animation Parsing Utils`, `Render Target Setup`, `Camera Ray Utilities`, `Curve Path Building`, `Xn`, `Property Binding Values`, `Quadratic Bezier Curve`, `C4 — Placement of a newly inserted block relative to the active line`, `Ll`, `.setStyle`, `ol`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _364 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.03793574846206425 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.030729359496482783 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.062040816326530614 - nodes in this community are weakly interconnected._