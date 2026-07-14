# Graph Report - tnc-sim0106C  (2026-07-14)

## Corpus Check
- 62 files · ~202,054 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2077 nodes · 3960 edges · 148 communities (86 shown, 62 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce86a489`
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
- Animation Parsing Utils
- Bone Transform Updates
- Render Target Setup
- Ray Casting Math
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
- Buffer Attribute Data
- 2D Path Drawing
- LOD Object Parsing
- String Utility Helpers
- Line3 Geometry Math
- Shape Extraction Utils
- M-Code Panel UI
- Q Parameter Panel UI
- Path Curve Building
- Line Geometry Utils
- Instanced Mesh Management
- Toolpath Parser Tests
- Equality Comparison
- Cycle Picker UI
- Cubic Bezier Curve
- Spline Curve Operations
- Spaced Points Curve
- Property Binding Values
- Quadratic Bezier Curve
- Linear Curve Segment
- Catmull Rom Curve
- Android Instrumented Test
- Help Popup UI
- Euler Rotation Clone
- Android Unit Test
- Gradle Build Script
- Syntax Highlighting Utilities
- Theme and UI Toggles
- Clone Constructor Update Pattern
- UV and Matrix Transforms
- Object Bounding Box
- JSON Serializable Clone
- JSON Serializable Clone
- Loader Options Handler
- Light Power Dispose
- Android Main Activity
- Onboarding Flow
- Mobile Tab Navigation
- Constructor Dispose Pattern
- Copy Constructor Pair
- Copy Constructor Pair
- Copy Constructor Pair
- Asset Loader
- Curve Interpolation
- Text Decode URL Utils
- Clone Constructor Pair
- Copy Constructor Pair
- Core Sync Script
- go
- tc
- ts
- Module-split refactor — historical context
- README.md

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
- `bugCopyReport()` --indirect_call--> `ta`  [INFERRED]
  www/core/bug-report.js → www/vendor/three.min.js
- `buildKeypad()` --indirect_call--> `i()`  [INFERRED]
  www/core/field-editing.js → www/vendor/three.min.js

## Import Cycles
- None detected.

## Communities (148 total, 62 thin omitted)

### Community 0 - "Three.js Core Engine"
Cohesion: 0.03
Nodes (42): _allocateTargets(), _applyPMREM(), Ba, _blur(), _cleanup(), er(), fromCubemap(), fromEquirectangular() (+34 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (24): br(), cr(), dr(), fr(), gr(), hl, hr(), ir() (+16 more)

### Community 3 - "Code Editor Core"
Cohesion: 0.07
Nodes (33): _applyEditorFs(), applyFix(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), _downloadTextFile(), editorClear(), _editorConfirm() (+25 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.07
Nodes (6): dt(), $e(), Ke(), Qe(), tn, ut()

### Community 7 - "Clock and Audio Analyzer"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 8 - "Learn Tutorial System"
Cohesion: 0.09
Nodes (22): closeLearn(), learnBackToList(), learnCheck(), _learnEndEditorInput(), learnEvalChecks(), learnExit(), learnFinishIntro(), learnFinishLesson() (+14 more)

### Community 9 - "Spherical Harmonics Math"
Cohesion: 0.22
Nodes (7): $c(), intersectObject(), intersectObjects(), Kc(), mt(), sl, _t

### Community 10 - "Tool Table Management"
Cohesion: 0.11
Nodes (18): buildToolIntoGroup(), calcToolTimes(), field(), getToolByNum(), getToolColor3(), inferToolType(), onToolImportFile(), renderToolForm() (+10 more)

### Community 11 - "3D Object Transforms"
Cohesion: 0.11
Nodes (17): co(), eo(), ho(), io(), ja(), ka(), lo(), no() (+9 more)

### Community 12 - "Asset Loading Pipeline"
Cohesion: 0.30
Nodes (3): i(), load(), oc

### Community 14 - "Animation Action Control"
Cohesion: 0.05
Nodes (4): jo, Ko, nc, xc

### Community 15 - "Object Cloning Utilities"
Cohesion: 0.10
Nodes (8): as(), copy(), cs, parseObject(), _sceneToCubeUV(), setFromCamera(), Vs, xs

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (25): applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext(), fieldPrev() (+17 more)

### Community 17 - "Buffer Attribute Management"
Cohesion: 0.10
Nodes (4): bt, ct(), es(), Xe()

### Community 23 - "Capacitor Package Config"
Cohesion: 0.08
Nodes (23): @capacitor/android, @capacitor/cli, @capacitor/core, author, bugs, url, dependencies, @capacitor/android (+15 more)

### Community 24 - "WebGL Parameter Management"
Cohesion: 0.13
Nodes (8): ei, fi(), Mh, ns(), rt, update(), wi(), Wn

### Community 26 - "CNC Parser Engine"
Cohesion: 0.16
Nodes (18): applyRadiusComp(), buildToolMesh(), _carryPhysicalXY(), checkRadiusVsTool(), evalQExpr(), expandLblLines(), offsetRun(), parseProgram() (+10 more)

### Community 28 - "Geometry Normal Computation"
Cohesion: 0.08
Nodes (14): ao(), ar(), bo, ci, cl, Da, ds(), en (+6 more)

### Community 30 - "Render Object Lifecycle"
Cohesion: 0.09
Nodes (7): _a, bs, dispose(), Et, ft(), Tt, ws()

### Community 31 - "Triangle Geometry Math"
Cohesion: 0.09
Nodes (3): ge, ht(), je

### Community 33 - "Quaternion Interpolation"
Cohesion: 0.05
Nodes (22): appSource, assert, before, boundaryDirty, BufferAttribute, BufferGeometry, chunkTriangles, context (+14 more)

### Community 36 - "Raycaster Intersection"
Cohesion: 0.19
Nodes (3): an, ln, mn

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.10
Nodes (11): ca, hh, Jr(), li(), _o, os(), qc, qr() (+3 more)

### Community 42 - "Render Target Setup"
Cohesion: 0.07
Nodes (9): cn, dn, ec, fn, hn, jn(), on, pn (+1 more)

### Community 47 - "Shadow Map Management"
Cohesion: 0.17
Nodes (3): clone(), kl, us()

### Community 49 - "Block Form Panel UI"
Cohesion: 0.29
Nodes (10): blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal(), insertBlkForm() (+2 more)

### Community 51 - "Geometry Transform Helpers"
Cohesion: 0.24
Nodes (10): compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), constructor(), $h(), Kh(), qh(), setDirection() (+2 more)

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.22
Nodes (5): ni, pi(), Xn(), yi(), yn()

### Community 54 - "PMREM Texture Processing"
Cohesion: 0.06
Nodes (31): Approaches tried, in order, Attempts and fix, Attempts and fix, Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android), Bug history — resolved bugs & how they were fixed, C1 — Mobile editor focus/scroll jumping during value editing and Learn, C2 — Pure-Z R0 cancellation moved diagonally after an RL/RR contour, C3 — RND/CHF occasionally inserted at the start of the program (+23 more)

### Community 57 - "3D Scene Rendering"
Cohesion: 0.30
Nodes (11): _applyRefinedMesh(), buildScene(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread(), _scene3dBgColor(), show3DError() (+3 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.22
Nodes (12): advance(), placeTool(), segSpeed(), shouldHoldVisibleSegment(), vxBuildGeometryRange(), vxBuildMesh(), vxCut(), vxDisposeObject() (+4 more)

### Community 60 - "Web App Manifest"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 62 - "Vector Angle and Events"
Cohesion: 0.06
Nodes (31): 0. The app is ALWAYS single-column/mobile — never desktop side-by-side, 10. `www/index.html` is now split into `core/`/`android/` modules — see "Module map" above, 11. Drop the editor's bottom-tab reservation while the keyboard is open, 12. Resize the 3D renderer from the render loop, not only on window 'resize', 13. The bottom tab bar must NOT animate (no transform transition), 14. Bug lifecycle: TODO.md while open (log every attempt), BUG_HISTORY.md when fixed, 15. Chunked voxel meshing and Android memory limits, 1. `applicationId` must stay `org.tncsim.twa` forever (+23 more)

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.14
Nodes (11): assert, context, firstCycle208, fs, html, parserSource, path, playbackSource (+3 more)

### Community 65 - "Radius Comp Tests"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "App Input Handling"
Cohesion: 0.27
Nodes (7): applyStockVisibility(), isCycleAnchor(), isLockedLine(), onMove(), onUp(), toggleStockVisibility(), updateStockToggle()

### Community 67 - "Simulation Controls"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 71 - "2D Path Drawing"
Cohesion: 0.08
Nodes (5): bl, dc, mc(), pc, zl

### Community 73 - "String Utility Helpers"
Cohesion: 0.17
Nodes (4): ol, parseImages(), setTexturePath(), ul

### Community 74 - "Line3 Geometry Math"
Cohesion: 0.18
Nodes (10): 3D stock updates can stall during machining, Attempts, Attempts, Open bugs, <short title> — <one-line symptom>, Status, Status, Symptom (+2 more)

### Community 75 - "Shape Extraction Utils"
Cohesion: 0.24
Nodes (6): bindSkeletons(), parse(), parseAnimations(), parseGeometries(), parseShapes(), parseSkeletons()

### Community 76 - "M-Code Panel UI"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "Q Parameter Panel UI"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 78 - "Path Curve Building"
Cohesion: 0.40
Nodes (10): _coachMarkSeen(), _coachPaint(), _coachSeen(), _coachTarget(), learnCoachEnd(), learnCoachMaybeStart(), learnCoachNext(), learnCoachPrev() (+2 more)

### Community 81 - "Toolpath Parser Tests"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 84 - "Cycle Picker UI"
Cohesion: 0.48
Nodes (6): closeCtxPanel(), closeCyclePicker(), openCyclePicker(), selectCycle(), showCycleList(), showCycleParams()

### Community 88 - "Property Binding Values"
Cohesion: 0.20
Nodes (5): bind(), getValue(), setValue(), Si(), ti

### Community 93 - "Android Instrumented Test"
Cohesion: 0.60
Nodes (3): ExampleInstrumentedTest, Test, RunWith

### Community 94 - "Help Popup UI"
Cohesion: 0.60
Nodes (3): hideHelpPopup(), openHelp(), toggleKpHelp()

### Community 98 - "Gradle Build Script"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 100 - "Syntax Highlighting Utilities"
Cohesion: 1.00
Nodes (3): _synEscHtml(), _synHighlightLine(), _synLineWithColor()

### Community 103 - "UV and Matrix Transforms"
Cohesion: 0.20
Nodes (9): app, assert, fs, index, parser, path, qualityButtons, root (+1 more)

### Community 115 - "Copy Constructor Pair"
Cohesion: 0.25
Nodes (7): Build, Disclaimer, License, Project layout, Status, TNC Sim — Android app, What it does

### Community 116 - "Copy Constructor Pair"
Cohesion: 0.25
Nodes (3): fo(), mo(), po

### Community 117 - "Asset Loader"
Cohesion: 0.29
Nodes (6): 1.0.1 (versionCode 2), 1.0.2 (versionCode 3), 1.0 (versionCode 1), TNC Sim (Android) — Release notes, Unreleased test build (APP_VERSION 1.0.32), Unreleased test build (APP_VERSION 1.0.33)

### Community 120 - "Text Decode URL Utils"
Cohesion: 0.40
Nodes (4): graphify, Non-negotiables, Start of every session, TNC Sim Android

## Knowledge Gaps
- **151 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `Object Cloning Utilities` to `Three.js Core Engine`, `Quaternion Math Operations`, `go`, `tc`, `Geometry Parsing and Colors`, `ts`, `3D Object Transforms`, `Skeleton Bone Binding`, `Animation Action Control`, `Buffer Attribute Management`, `Scene Object Traversal`, `Bounding Box Operations`, `Buffer Geometry Arrays`, `WebGL Parameter Management`, `Camera Projection Setup`, `Frustum and Plane Math`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Triangle Geometry Math`, `Bounding Box Math`, `Ray and Sphere Math`, `Raycaster Intersection`, `Object Serialization`, `Matrix4 Decomposition`, `Animation Parsing Utils`, `Bone Transform Updates`, `Render Target Setup`, `Ray Casting Math`, `Camera Ray Utilities`, `Bounding Geometry Utils`, `Shadow Map Management`, `Buffer Geometry Groups`, `Skeleton Management`, `Curve Length Mapping`, `Scene Graph Management`, `Geometry JSON Parsing`, `2D Path Drawing`, `LOD Object Parsing`, `Line Geometry Utils`, `Instanced Mesh Management`, `Equality Comparison`, `Cubic Bezier Curve`, `Spline Curve Operations`, `Spaced Points Curve`, `Triangle Point Set`, `Quadratic Bezier Curve`, `Linear Curve Segment`, `Catmull Rom Curve`, `Euler Rotation Clone`, `Clone Constructor Update Pattern`, `Object Bounding Box`, `Light Power Dispose`, `Copy Constructor Pair`, `Copy Constructor Pair`, `Copy Constructor Pair`, `Copy Constructor Pair`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `At` connect `Quaternion Math Operations` to `Three.js Core Engine`, `Buffer Attribute Transforms`, `Animation Action Control`, `Render Object Lifecycle`, `Triangle Geometry Math`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `Lc` connect `Clock and Audio Analyzer` to `Three.js Core Engine`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.03036935704514364 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.028538812785388126 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.06471631205673758 - nodes in this community are weakly interconnected._