# Graph Report - android-port  (2026-07-16)

## Corpus Check
- 68 files · ~210,396 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2270 nodes · 4176 edges · 152 communities (75 shown, 77 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ccf6440b`
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
- Buffer Attribute Transforms
- Quaternion Interpolation
- Bounding Box Math
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
- Equality Comparison
- Cycle Picker UI
- Cubic Bezier Curve
- Rl
- Et
- Property Binding Values
- Rs
- Quadratic Bezier Curve
- README.md
- build.gradle
- Android Instrumented Test
- Help Popup UI
- Matrix Multiply Operations
- Android Unit Test
- Gradle Build Script
- Syntax Highlighting Utilities
- Theme and UI Toggles
- Clone Constructor Update Pattern
- UV and Matrix Transforms
- us
- JSON Serializable Clone
- JSON Serializable Clone
- TNC Sim — Android app
- .triangulateShape
- Android Main Activity
- Onboarding Flow
- Mobile Tab Navigation
- Ll
- Copy Constructor Pair
- tc
- Asset Loader
- uc
- ExampleUnitTest
- Text Decode URL Utils
- Module-split refactor — historical context
- Clone Constructor Pair
- Copy Constructor Pair
- Capacitor Build Config
- Android Build Config
- Capacitor Settings Config
- hl
- po
- Test
- Test
- Module-split refactor — historical context
- qo
- .fromBufferAttribute
- hs
- Rs
- uo
- zo
- .setFromMatrixColumn
- rc

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
- `buildScene()` --indirect_call--> `canvas()`  [INFERRED]
  www/core/render3d.js → tests/android-webgl-compat.test.js
- `environment()` --indirect_call--> `fn`  [INFERRED]
  tests/android-webgl-compat.test.js → www/vendor/three.min.js
- `selectCycle()` --references--> `CYCLES`  [EXTRACTED]
  www/core/cycle-picker.js → tests/parser-cycles-audit.test.js
- `buildKeypad()` --indirect_call--> `i()`  [INFERRED]
  www/core/field-editing.js → www/vendor/three.min.js
- `bugCopyReport()` --indirect_call--> `ta`  [INFERRED]
  www/core/bug-report.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (152 total, 77 thin omitted)

### Community 0 - "Three.js Core Engine"
Cohesion: 0.04
Nodes (40): _allocateTargets(), _applyPMREM(), Ba, _blur(), $c(), _cleanup(), compileCubemapShader(), compileEquirectangularShader() (+32 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (28): br(), cr(), dr(), er(), fr(), gr(), Hi(), hr() (+20 more)

### Community 3 - "Code Editor Core"
Cohesion: 0.08
Nodes (31): _applyEditorFs(), applyFix(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), editorClear(), _editorConfirm(), editorFsBy() (+23 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.06
Nodes (7): dt(), $e(), Ke(), mn, Qe(), tn, ut()

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
Nodes (15): co(), eo(), ho(), io(), ja(), ka(), no(), oo() (+7 more)

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (26): applyFeedMode(), applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext() (+18 more)

### Community 17 - "Buffer Attribute Management"
Cohesion: 0.19
Nodes (3): ct(), es(), Xe()

### Community 19 - "Bounding Box Operations"
Cohesion: 0.05
Nodes (43): Approaches tried, in order, Attempts and accepted fixes, Attempts and fix, Attempts and fix, Attempts and fix, Attempts and fix, Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android), Bug history — resolved bugs & how they were fixed (+35 more)

### Community 23 - "Capacitor Package Config"
Cohesion: 0.07
Nodes (27): author, bugs, url, dependencies, @capacitor/android, @capacitor/cli, @capacitor/core, @capacitor/filesystem (+19 more)

### Community 25 - "Camera Projection Setup"
Cohesion: 0.12
Nodes (3): Jl, Kn, vl()

### Community 26 - "CNC Parser Engine"
Cohesion: 0.15
Nodes (19): applyRadiusComp(), buildToolMesh(), _carryPhysicalXY(), evalQExpr(), expandLblLines(), inspectQExpr(), offsetRun(), parseProgram() (+11 more)

### Community 28 - "Geometry Normal Computation"
Cohesion: 0.07
Nodes (16): Da, ei, fi(), gi(), hl, i(), il(), mi() (+8 more)

### Community 30 - "Render Object Lifecycle"
Cohesion: 0.09
Nodes (11): _a, bs, dispose(), Et, ft(), mt(), ni, sl (+3 more)

### Community 31 - "Triangle Geometry Math"
Cohesion: 0.12
Nodes (5): ds(), ge, pc, ps(), setValue()

### Community 33 - "Quaternion Interpolation"
Cohesion: 0.05
Nodes (22): appSource, assert, before, boundaryDirty, BufferAttribute, BufferGeometry, chunkTriangles, context (+14 more)

### Community 34 - "Bounding Box Math"
Cohesion: 0.07
Nodes (26): Attempts, Attempts, Attempts, Attempts, Attempts, Attempts, C12 — Light-theme 3D table grid is too dark, C14 — Revealed hints leak into a newly opened lesson (+18 more)

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 39 - "Matrix4 Decomposition"
Cohesion: 0.06
Nodes (32): 0. The app is ALWAYS single-column/mobile — never desktop side-by-side, 10. `www/index.html` is now split into `core/`/`android/` modules — see "Module map" above, 11. Drop the editor's bottom-tab reservation while the keyboard is open, 12. Resize the 3D renderer from the render loop, not only on window 'resize', 13. The bottom tab bar must NOT animate (no transform transition), 14. Bug lifecycle: TODO.md while open (log every attempt), BUG_HISTORY.md when fixed, 15. Chunked voxel meshing and Android memory limits, 16. Q-value fallbacks must treat 0 as valid (+24 more)

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.10
Nodes (12): ca, fo(), hh, Jr(), li(), _o, os(), po (+4 more)

### Community 42 - "Render Target Setup"
Cohesion: 0.08
Nodes (8): cn, dn, hn, jn(), on, pn, _s(), un

### Community 45 - "Animation Interpolant Update"
Cohesion: 0.13
Nodes (3): jo, wo, xo

### Community 49 - "Block Form Panel UI"
Cohesion: 0.29
Nodes (10): blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal(), insertBlkForm() (+2 more)

### Community 50 - "Bug Report UI"
Cohesion: 0.16
Nodes (3): _bugBuildText(), bugCopyReport(), ta

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.22
Nodes (4): assert, fs, source, vm

### Community 54 - "PMREM Texture Processing"
Cohesion: 0.31
Nodes (5): isAndroidApp(), readSafeMode(), rememberSafeMode(), userAgent(), watchRenderer()

### Community 57 - "3D Scene Rendering"
Cohesion: 0.06
Nodes (39): app, assert, canvas(), environment(), firstCanvas, fs, index, late (+31 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.22
Nodes (12): advance(), placeTool(), segSpeed(), shouldHoldVisibleSegment(), vxBuildGeometryRange(), vxBuildMesh(), vxCut(), vxDisposeObject() (+4 more)

### Community 60 - "Web App Manifest"
Cohesion: 0.33
Nodes (4): bind(), bindSkeletons(), getValue(), parseSkeletons()

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.14
Nodes (11): assert, context, firstCycle208, fs, html, parserSource, path, playbackSource (+3 more)

### Community 65 - "Radius Comp Tests"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "App Input Handling"
Cohesion: 0.24
Nodes (7): applyStockVisibility(), isCycleAnchor(), isLockedLine(), onMove(), onUp(), toggleStockVisibility(), updateStockToggle()

### Community 67 - "Simulation Controls"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 72 - "LOD Object Parsing"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 73 - "String Utility Helpers"
Cohesion: 0.33
Nodes (5): Documentation budget, graphify, Non-negotiables, Start of every session, TNC Sim Android

### Community 74 - "Line3 Geometry Math"
Cohesion: 0.05
Nodes (24): Ah, ao(), ar(), bo, ci, cl, en, fh (+16 more)

### Community 75 - "Xn"
Cohesion: 0.10
Nodes (6): an, Ea(), ln, parseObject(), setFromCamera(), xs

### Community 76 - "M-Code Panel UI"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "Q Parameter Panel UI"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 78 - "Path Curve Building"
Cohesion: 0.36
Nodes (11): _coachEnsureTabFor(), _coachMarkSeen(), _coachPaint(), _coachSeen(), _coachTarget(), learnCoachEnd(), learnCoachMaybeStart(), learnCoachNext() (+3 more)

### Community 81 - "Toolpath Parser Tests"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 84 - "Cycle Picker UI"
Cohesion: 0.06
Nodes (21): ctx, fs, parserSource, path, root, TOOLS, vm, assert (+13 more)

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
Cohesion: 0.29
Nodes (6): Current non-obvious invariants, Edit, build, and release, Product and source layout, Testing before push or release, TNC Sim Android — current project contract, Versioning

### Community 100 - "Syntax Highlighting Utilities"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

### Community 103 - "UV and Matrix Transforms"
Cohesion: 0.20
Nodes (9): app, assert, fs, index, parser, path, qualityButtons, root (+1 more)

### Community 106 - "JSON Serializable Clone"
Cohesion: 0.44
Nodes (3): load(), parse(), parseAnimations()

### Community 107 - "TNC Sim — Android app"
Cohesion: 0.25
Nodes (7): Build, Disclaimer, License, Project layout, Status, TNC Sim — Android app, What it does

### Community 115 - "Copy Constructor Pair"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 117 - "Asset Loader"
Cohesion: 0.12
Nodes (15): 1.0.1 (versionCode 2), 1.0.2 (versionCode 3), 1.0.3 (versionCode 4), 1.0 (versionCode 1), TNC Sim (Android) — Release notes, Unreleased test build (APP_VERSION 1.0.32), Unreleased test build (APP_VERSION 1.0.33), Unreleased test build (APP_VERSION 1.0.35) (+7 more)

### Community 136 - "Module-split refactor — historical context"
Cohesion: 0.20
Nodes (9): APP_VERSION 1.0.37 — documentation damage control, APP_VERSION 1.0.38 — machining demos and accepted web ports, APP_VERSION 1.0.41 — adaptive Android WebGL compatibility, APP_VERSION 1.0.42 — accepted Learn audit port, APP_VERSION 1.0.43 — accepted shorter tutorial port, APP_VERSION 1.0.44 — Tool Table workflow hardening, APP_VERSION 1.0.45 — HEIDENHAIN cycle, cutting and validator corrections, APP_VERSION 1.0.46 — first tutorial orientation lesson (+1 more)

### Community 142 - "hs"
Cohesion: 0.18
Nodes (3): gl, _sceneToCubeUV(), Yl

## Knowledge Gaps
- **257 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+252 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **77 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `Camera Ray Utilities` to `Three.js Core Engine`, `Quaternion Math Operations`, `hl`, `po`, `Geometry Parsing and Colors`, `Spherical Harmonics Math`, `qo`, `3D Object Transforms`, `.fromBufferAttribute`, `Skeleton Bone Binding`, `Rs`, `uo`, `hs`, `Scene Object Traversal`, `zo`, `Buffer Geometry Arrays`, `.setFromMatrixColumn`, `WebGL Parameter Management`, `Camera Projection Setup`, `Frustum and Plane Math`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Triangle Geometry Math`, `Buffer Attribute Transforms`, `Ray and Sphere Math`, `Raycaster Intersection`, `Object Serialization`, `Animation Parsing Utils`, `Bone Transform Updates`, `Render Target Setup`, `Ray Casting Math`, `Bounding Geometry Utils`, `Shadow Map Management`, `Bug Report UI`, `Geometry Transform Helpers`, `Skeleton Management`, `Curve Length Mapping`, `Vector Angle and Events`, `Matrix Column Parsing`, `Buffer Attribute Data`, `Line3 Geometry Math`, `Xn`, `Equality Comparison`, `Cubic Bezier Curve`, `Rl`, `Et`, `Property Binding Values`, `Rs`, `Quadratic Bezier Curve`, `Gradle Build Script`, `Clone Constructor Update Pattern`, `us`, `.triangulateShape`, `Ll`, `Copy Constructor Pair`, `Copy Constructor Pair`, `.getCamera`, `Capacitor Build Config`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `vt` connect `WebGL Texture Binding` to `Three.js Core Engine`, `Geometry Parsing and Colors`, `Clock and Audio Analyzer`, `Skeleton Bone Binding`, `rc`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Triangle Geometry Math`, `Ray and Sphere Math`, `Animation Parsing Utils`, `Camera Ray Utilities`, `Bounding Geometry Utils`, `Vector Angle and Events`, `2D Path Drawing`, `Line3 Geometry Math`, `Line Geometry Utils`, `Vector Normalization`, `Rs`, `Matrix Multiply Operations`, `Clone Constructor Update Pattern`, `us`, `JSON Serializable Clone`, `uc`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Lt` connect `Vector3 Operations` to `Three.js Core Engine`, `Spherical Harmonics Math`, `3D Object Transforms`, `.fromBufferAttribute`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Ray and Sphere Math`, `Render Target Setup`, `Camera Ray Utilities`, `Vector Angle and Events`, `2D Path Drawing`, `Line3 Geometry Math`, `Xn`, `Instanced Mesh Management`, `Vector Normalization`, `Quadratic Bezier Curve`, `us`, `Copy Constructor Pair`, `.getCamera`, `Ah`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.03793574846206425 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.03027027027027027 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.0666049953746531 - nodes in this community are weakly interconnected._