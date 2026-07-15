# Graph Report - tnc-sim-android  (2026-07-15)

## Corpus Check
- 62 files · ~196,715 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2144 nodes · 4029 edges · 154 communities (87 shown, 67 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0cbaf37c`
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
- Instanced Mesh Management
- Toolpath Parser Tests
- Equality Comparison
- Vector Normalization
- Cycle Picker UI
- Cubic Bezier Curve
- Rl
- Et
- rh
- README.md
- build.gradle
- Android Instrumented Test
- Help Popup UI
- Rl
- Gradle Build Script
- Syntax Highlighting Utilities
- Theme and UI Toggles
- Clone Constructor Update Pattern
- UV and Matrix Transforms
- ol
- .y
- TNC Sim — Android app
- Ll
- Android Main Activity
- Onboarding Flow
- Mobile Tab Navigation
- dl
- ic
- Copy Constructor Pair
- tc
- Asset Loader
- ExampleUnitTest
- Wl
- Module-split refactor — historical context
- bind
- ss
- uc
- vl
- Android Build Config
- Capacitor Settings Config
- Do
- Test
- Test
- Module-split refactor — historical context
- go
- hl
- hs
- rc
- Rs
- uo
- Zc
- zo

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
- `_installAndroid3DDiagnostics()` --indirect_call--> `gl`  [INFERRED]
  www/android/app.js → www/vendor/three.min.js
- `bugCopyReport()` --indirect_call--> `ta`  [INFERRED]
  www/core/bug-report.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (154 total, 67 thin omitted)

### Community 0 - "Three.js Core Engine"
Cohesion: 0.03
Nodes (28): Ah, an, Ba, ci, cn, Da, dn, fn (+20 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (22): cr(), dr(), er(), fr(), gr(), Hi(), hr(), ji() (+14 more)

### Community 3 - "Code Editor Core"
Cohesion: 0.08
Nodes (31): _applyEditorFs(), applyFix(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), editorClear(), _editorConfirm(), editorFsBy() (+23 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.08
Nodes (5): dt(), $e(), Qe(), tn, ut()

### Community 7 - "Clock and Audio Analyzer"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 8 - "Learn Tutorial System"
Cohesion: 0.09
Nodes (22): closeLearn(), learnBackToList(), learnCheck(), _learnEndEditorInput(), learnEvalChecks(), learnExit(), learnFinishIntro(), learnFinishLesson() (+14 more)

### Community 10 - "Tool Table Management"
Cohesion: 0.11
Nodes (18): buildToolIntoGroup(), calcToolTimes(), field(), getToolByNum(), getToolColor3(), inferToolType(), onToolImportFile(), renderToolForm() (+10 more)

### Community 11 - "3D Object Transforms"
Cohesion: 0.11
Nodes (18): ao(), co(), eo(), ho(), io(), ja(), ka(), lo() (+10 more)

### Community 12 - "Asset Loading Pipeline"
Cohesion: 0.32
Nodes (3): i(), load(), oc

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (26): applyFeedMode(), applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext() (+18 more)

### Community 17 - "Buffer Attribute Management"
Cohesion: 0.07
Nodes (5): bt, ct(), es(), Xe(), zl

### Community 19 - "Bounding Box Operations"
Cohesion: 0.05
Nodes (40): Approaches tried, in order, Attempts and fix, Attempts and fix, Attempts and fix, Attempts and fix, Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android), Bug history — resolved bugs & how they were fixed, C10 — Cycle 209 explicit zero values were ignored (+32 more)

### Community 20 - "Buffer Geometry Arrays"
Cohesion: 0.05
Nodes (3): Ga, ls(), sn

### Community 23 - "Capacitor Package Config"
Cohesion: 0.07
Nodes (27): author, bugs, url, dependencies, @capacitor/android, @capacitor/cli, @capacitor/core, @capacitor/filesystem (+19 more)

### Community 24 - "WebGL Parameter Management"
Cohesion: 0.12
Nodes (9): ei, fi(), ms(), ns(), rt, update(), wh(), wi() (+1 more)

### Community 26 - "CNC Parser Engine"
Cohesion: 0.16
Nodes (18): applyRadiusComp(), buildToolMesh(), _carryPhysicalXY(), checkRadiusVsTool(), evalQExpr(), expandLblLines(), offsetRun(), parseProgram() (+10 more)

### Community 30 - "Render Object Lifecycle"
Cohesion: 0.09
Nodes (7): _a, bs, dispose(), Et, ft(), Tt, ws()

### Community 31 - "Triangle Geometry Math"
Cohesion: 0.11
Nodes (4): cs, je, jn(), Vs

### Community 33 - "Quaternion Interpolation"
Cohesion: 0.05
Nodes (22): appSource, assert, before, boundaryDirty, BufferAttribute, BufferGeometry, chunkTriangles, context (+14 more)

### Community 34 - "Bounding Box Math"
Cohesion: 0.05
Nodes (38): 0. The app is ALWAYS single-column/mobile — never desktop side-by-side, 10. `www/index.html` is now split into `core/`/`android/` modules — see "Module map" above, 11. Drop the editor's bottom-tab reservation while the keyboard is open, 12. Resize the 3D renderer from the render loop, not only on window 'resize', 13. The bottom tab bar must NOT animate (no transform transition), 14. Bug lifecycle: TODO.md while open (log every attempt), BUG_HISTORY.md when fixed, 15. Chunked voxel meshing and Android memory limits, 16. Q-value fallbacks must treat 0 as valid (+30 more)

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 38 - "Object Serialization"
Cohesion: 0.12
Nodes (4): fa, parseObject(), setFromCamera(), xs

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.08
Nodes (9): ca, el, hh, li(), _o, os(), ps(), qc (+1 more)

### Community 41 - "Bone Transform Updates"
Cohesion: 0.10
Nodes (4): Ea(), qn, _s(), updateMatrixWorld()

### Community 42 - "Render Target Setup"
Cohesion: 0.16
Nodes (15): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), fromCubemap(), fromEquirectangular(), fromScene(), _fromTexture() (+7 more)

### Community 45 - "Animation Interpolant Update"
Cohesion: 0.18
Nodes (3): jo, wo, xo

### Community 47 - "Shadow Map Management"
Cohesion: 0.13
Nodes (4): clone(), kl, ts(), us()

### Community 49 - "Block Form Panel UI"
Cohesion: 0.29
Nodes (10): blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal(), insertBlkForm() (+2 more)

### Community 50 - "Bug Report UI"
Cohesion: 0.16
Nodes (3): _bugBuildText(), bugCopyReport(), ta

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.11
Nodes (6): ds(), ge, setValue(), Si(), ti, uh()

### Community 57 - "3D Scene Rendering"
Cohesion: 0.26
Nodes (13): _applyGridTheme(), _applyRefinedMesh(), buildScene(), _gridColors(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread() (+5 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.22
Nodes (12): advance(), placeTool(), segSpeed(), shouldHoldVisibleSegment(), vxBuildGeometryRange(), vxBuildMesh(), vxCut(), vxDisposeObject() (+4 more)

### Community 60 - "Web App Manifest"
Cohesion: 0.33
Nodes (5): Documentation budget, graphify, Non-negotiables, Start of every session, TNC Sim Android

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.14
Nodes (11): assert, context, firstCycle208, fs, html, parserSource, path, playbackSource (+3 more)

### Community 65 - "Radius Comp Tests"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "App Input Handling"
Cohesion: 0.15
Nodes (14): _android3DDiagContext(), _android3DDiagCopyFallback(), _android3DDiagShow(), _android3DDiagText(), applyStockVisibility(), _attachAndroid3DDiagnostics(), _installAndroid3DDiagnostics(), isCycleAnchor() (+6 more)

### Community 67 - "Simulation Controls"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 69 - "Matrix Column Parsing"
Cohesion: 0.33
Nodes (5): app, assert, fs, path, root

### Community 70 - "Buffer Attribute Data"
Cohesion: 0.24
Nodes (10): compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), constructor(), $h(), Kh(), qh(), setDirection() (+2 more)

### Community 71 - "2D Path Drawing"
Cohesion: 0.12
Nodes (4): bl, dc, mc(), pc

### Community 72 - "LOD Object Parsing"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 73 - "String Utility Helpers"
Cohesion: 0.17
Nodes (3): parseImages(), pl, ul

### Community 74 - "Line3 Geometry Math"
Cohesion: 0.11
Nodes (18): Attempts, Attempts, Attempts, Attempts, C12 — Light-theme 3D table grid is too dark, C14 — Revealed hints leak into a newly opened lesson, C15 — Embedded Android WebView loses the 3D EGL backing, Open bugs (+10 more)

### Community 75 - "Xn"
Cohesion: 0.18
Nodes (7): cl, Jr(), kr(), nr(), qr(), vr(), zr()

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

### Community 82 - "Equality Comparison"
Cohesion: 0.25
Nodes (5): ni, pi(), Xn(), yi(), yn()

### Community 83 - "Vector Normalization"
Cohesion: 0.14
Nodes (3): ac, fh, oi()

### Community 84 - "Cycle Picker UI"
Cohesion: 0.48
Nodes (6): closeCtxPanel(), closeCyclePicker(), openCyclePicker(), selectCycle(), showCycleList(), showCycleParams()

### Community 86 - "Rl"
Cohesion: 0.27
Nodes (6): bindSkeletons(), parse(), parseAnimations(), parseGeometries(), parseShapes(), parseSkeletons()

### Community 87 - "Et"
Cohesion: 0.25
Nodes (3): fo(), mo(), po

### Community 91 - "README.md"
Cohesion: 0.20
Nodes (9): assert, context, fs, path, precise, root, thread, tools (+1 more)

### Community 92 - "build.gradle"
Cohesion: 0.10
Nodes (16): ar(), br(), $c(), en, intersectObject(), intersectObjects(), ir(), Kc() (+8 more)

### Community 94 - "Help Popup UI"
Cohesion: 0.60
Nodes (3): hideHelpPopup(), openHelp(), toggleKpHelp()

### Community 100 - "Syntax Highlighting Utilities"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

### Community 103 - "UV and Matrix Transforms"
Cohesion: 0.20
Nodes (9): app, assert, fs, index, parser, path, qualityButtons, root (+1 more)

### Community 107 - "TNC Sim — Android app"
Cohesion: 0.25
Nodes (7): Build, Disclaimer, License, Project layout, Status, TNC Sim — Android app, What it does

### Community 115 - "Copy Constructor Pair"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 117 - "Asset Loader"
Cohesion: 0.17
Nodes (11): 1.0.1 (versionCode 2), 1.0.2 (versionCode 3), 1.0 (versionCode 1), TNC Sim (Android) — Release notes, Unreleased test build (APP_VERSION 1.0.32), Unreleased test build (APP_VERSION 1.0.33), Unreleased test build (APP_VERSION 1.0.35), Unreleased test build (APP_VERSION 1.0.36) (+3 more)

### Community 136 - "Module-split refactor — historical context"
Cohesion: 0.33
Nodes (5): APP_VERSION 1.0.37 — documentation damage control, APP_VERSION 1.0.38 — machining demos and accepted web ports, APP_VERSION 1.0.39 — Android WebGL diagnostics, APP_VERSION 1.0.40 — Android safe WebGL test, TNC Sim Android — technical changelog

## Knowledge Gaps
- **196 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `St` connect `3D Vector Math` to `Three.js Core Engine`, `Line Geometry Utils`, `Buffer Geometry Arrays`, `Curve Length Mapping`, `Geometry Normal Computation`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `copy()` connect `Camera Ray Utilities` to `Three.js Core Engine`, `Do`, `Geometry Parsing and Colors`, `Spherical Harmonics Math`, `go`, `3D Object Transforms`, `Skeleton Bone Binding`, `hs`, `Object Cloning Utilities`, `Buffer Attribute Management`, `Scene Object Traversal`, `Rs`, `Buffer Geometry Arrays`, `uo`, `zo`, `WebGL Parameter Management`, `Camera Projection Setup`, `Frustum and Plane Math`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Triangle Geometry Math`, `Buffer Attribute Transforms`, `Ray and Sphere Math`, `Raycaster Intersection`, `Object Serialization`, `Matrix4 Decomposition`, `Animation Parsing Utils`, `Bone Transform Updates`, `Render Target Setup`, `Ray Casting Math`, `Shadow Map Management`, `Bug Report UI`, `Buffer Geometry Groups`, `Skeleton Management`, `Vector Angle and Events`, `Scene Graph Management`, `Geometry JSON Parsing`, `2D Path Drawing`, `String Utility Helpers`, `Equality Comparison`, `Vector Normalization`, `Cubic Bezier Curve`, `Et`, `rh`, `build.gradle`, `Rl`, `Clone Constructor Update Pattern`, `.copy`, `Ll`, `dl`, `tc`, `Wl`, `vl`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `vt` connect `WebGL Texture Binding` to `Three.js Core Engine`, `Geometry Parsing and Colors`, `Clock and Audio Analyzer`, `Asset Loading Pipeline`, `hl`, `Skeleton Bone Binding`, `rc`, `Buffer Geometry Arrays`, `WebGL Parameter Management`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Ray and Sphere Math`, `Animation Parsing Utils`, `Camera Ray Utilities`, `Bounding Geometry Utils`, `Shadow Map Management`, `Buffer Geometry Groups`, `Curve Path Building`, `Curve Length Mapping`, `String Utility Helpers`, `Xn`, `Line Geometry Utils`, `Equality Comparison`, `Vector Normalization`, `Et`, `build.gradle`, `Clone Constructor Update Pattern`, `.y`, `ic`, `uc`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.027777777777777776 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.03204565408252853 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._