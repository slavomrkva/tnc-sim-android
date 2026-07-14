# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1898 nodes · 3770 edges · 133 communities (66 shown, 67 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.52)
- Token cost: 5,449 input · 1,212 output

## Graph Freshness
- Built from commit: `ca0c87e1`
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
- Shape Extraction Utils
- M-Code Panel UI
- Q Parameter Panel UI
- Path Curve Building
- Line Geometry Utils
- Instanced Mesh Management
- Toolpath Parser Tests
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
- Polygon Geometry Utils
- Curve Interpolation
- Text Decode URL Utils
- Copy Constructor Pair
- Clone Constructor Pair
- Copy Constructor Pair
- Core Sync Script

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

### Community 0 - "Three.js Core Engine"
Cohesion: 0.03
Nodes (34): an, Ba, bo, ci, compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), Da (+26 more)

### Community 1 - "WebGL Texture Binding"
Cohesion: 0.03
Nodes (24): ar(), cr(), dr(), fr(), gr(), hr(), ir(), kr() (+16 more)

### Community 3 - "Code Editor Core"
Cohesion: 0.07
Nodes (33): _applyEditorFs(), applyFix(), computeBlockNumbers(), deleteCurrentLine(), deleteLineN(), _downloadTextFile(), editorClear(), _editorConfirm() (+25 more)

### Community 5 - "Geometry Parsing and Colors"
Cohesion: 0.06
Nodes (7): dt(), $e(), Ke(), mn, Qe(), tn, ut()

### Community 7 - "Clock and Audio Analyzer"
Cohesion: 0.07
Nodes (5): bc, getInput(), getOutput(), ic, Lc

### Community 8 - "Learn Tutorial System"
Cohesion: 0.10
Nodes (19): closeLearn(), learnBackToList(), learnCheck(), _learnEndEditorInput(), learnEvalChecks(), learnExit(), learnFinishLesson(), learnNav() (+11 more)

### Community 9 - "Spherical Harmonics Math"
Cohesion: 0.06
Nodes (10): $c(), ec, ge, il(), intersectObject(), intersectObjects(), Kc(), mt() (+2 more)

### Community 10 - "Tool Table Management"
Cohesion: 0.11
Nodes (18): buildToolIntoGroup(), calcToolTimes(), field(), getToolByNum(), getToolColor3(), inferToolType(), onToolImportFile(), renderToolForm() (+10 more)

### Community 11 - "3D Object Transforms"
Cohesion: 0.10
Nodes (18): ao(), co(), eo(), ho(), io(), ja(), ka(), lo() (+10 more)

### Community 12 - "Asset Loading Pipeline"
Cohesion: 0.12
Nodes (10): bindSkeletons(), load(), oc, ol, parse(), parseAnimations(), parseImages(), parseSkeletons() (+2 more)

### Community 15 - "Object Cloning Utilities"
Cohesion: 0.09
Nodes (7): clone(), copy(), cs, hs, qn, uo(), Vs

### Community 16 - "Field Editing UI"
Cohesion: 0.15
Nodes (25): applySug(), buildKeypad(), _cancelMobileFocus(), enterFieldMode(), enterFieldModeOnLine(), exitFieldMode(), fieldNext(), fieldPrev() (+17 more)

### Community 17 - "Buffer Attribute Management"
Cohesion: 0.08
Nodes (5): bt, ct(), es(), qc, Xe()

### Community 23 - "Capacitor Package Config"
Cohesion: 0.08
Nodes (23): @capacitor/android, @capacitor/cli, @capacitor/core, author, bugs, url, dependencies, @capacitor/android (+15 more)

### Community 24 - "WebGL Parameter Management"
Cohesion: 0.14
Nodes (13): br(), ei, fi(), gi(), i(), mi(), pi(), update() (+5 more)

### Community 25 - "Camera Projection Setup"
Cohesion: 0.12
Nodes (3): Jl, Kn, vl()

### Community 26 - "CNC Parser Engine"
Cohesion: 0.16
Nodes (18): applyRadiusComp(), buildToolMesh(), _carryPhysicalXY(), checkRadiusVsTool(), evalQExpr(), expandLblLines(), offsetRun(), parseProgram() (+10 more)

### Community 30 - "Render Object Lifecycle"
Cohesion: 0.12
Nodes (6): _a, bs, dispose(), ft(), Tt, ws()

### Community 37 - "Measure Tool UI"
Cohesion: 0.21
Nodes (11): addItem(), clearMeasure(), deleteMeasureItem(), handleMeasureClick(), makeLine(), makeSphere(), renderMeasureOverlay(), setMeasureMode() (+3 more)

### Community 38 - "Object Serialization"
Cohesion: 0.12
Nodes (3): ac, go, tc

### Community 40 - "Animation Parsing Utils"
Cohesion: 0.16
Nodes (7): ca, Jr(), mo(), _o, os(), qr(), uh()

### Community 41 - "Bone Transform Updates"
Cohesion: 0.13
Nodes (3): _s(), _sceneToCubeUV(), updateMatrixWorld()

### Community 42 - "Render Target Setup"
Cohesion: 0.12
Nodes (8): cn, dn, fn, hn, jn(), on, pn, un

### Community 45 - "Animation Interpolant Update"
Cohesion: 0.15
Nodes (3): jo, wo, xo

### Community 47 - "Shadow Map Management"
Cohesion: 0.17
Nodes (3): kl, ni, us()

### Community 49 - "Block Form Panel UI"
Cohesion: 0.29
Nodes (10): blkCommitVal(), blkConfirmStep(), blkKeyDown(), blkNextStep(), blkSetShape(), blkStepRel(), blkUpdateVal(), insertBlkForm() (+2 more)

### Community 50 - "Bug Report UI"
Cohesion: 0.16
Nodes (3): _bugBuildText(), bugCopyReport(), ta

### Community 51 - "Geometry Transform Helpers"
Cohesion: 0.14
Nodes (5): constructor(), setDirection(), Si(), ti, wh()

### Community 52 - "Buffer Geometry Groups"
Cohesion: 0.19
Nodes (3): en, li(), yn()

### Community 54 - "PMREM Texture Processing"
Cohesion: 0.22
Nodes (13): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), fromCubemap(), fromEquirectangular(), fromScene(), _fromTexture() (+5 more)

### Community 57 - "3D Scene Rendering"
Cohesion: 0.30
Nodes (11): _applyRefinedMesh(), buildScene(), hide3DError(), _hideRefineIndicator(), init3D(), _runRefineMainThread(), _scene3dBgColor(), show3DError() (+3 more)

### Community 58 - "2D View Controls"
Cohesion: 0.27
Nodes (7): draw2dFull(), onResize(), resize2d(), resizeToDisplay(), sc2d(), switchView(), tf2d()

### Community 59 - "Voxel Cutting Simulation"
Cohesion: 0.23
Nodes (6): advance(), placeTool(), segSpeed(), vxBuildMesh(), vxInit(), vxRebuildMesh()

### Community 60 - "Web App Manifest"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, id, name, orientation, screenshots (+3 more)

### Community 64 - "Shape and Font Parsing"
Cohesion: 0.18
Nodes (3): cl, ds(), ps()

### Community 65 - "Radius Comp Tests"
Cohesion: 0.24
Nodes (10): assert, context, fs, near(), path, point(), segment(), source (+2 more)

### Community 66 - "App Input Handling"
Cohesion: 0.27
Nodes (7): applyStockVisibility(), isCycleAnchor(), isLockedLine(), onMove(), onUp(), toggleStockVisibility(), updateStockToggle()

### Community 67 - "Simulation Controls"
Cohesion: 0.25
Nodes (5): ensurePrepared(), onReset(), onRun(), onStep(), prepare()

### Community 68 - "Geometry JSON Parsing"
Cohesion: 0.18
Nodes (3): Al, parseGeometries(), parseShapes()

### Community 73 - "String Utility Helpers"
Cohesion: 0.20
Nodes (9): er(), Hi(), ji(), ki(), nr(), qi(), tr(), vi() (+1 more)

### Community 76 - "M-Code Panel UI"
Cohesion: 0.42
Nodes (7): _mCommit(), _mDescFor(), _mManualDescUpdate(), _mPanelConfirm(), openMPanel(), openMPanelEdit(), _replaceMOnLine()

### Community 77 - "Q Parameter Panel UI"
Cohesion: 0.36
Nodes (6): closeQPopup(), openQParamPanel(), openQPopup(), qPanelConfirm(), qPanelSetVal(), renderQParamPanel()

### Community 81 - "Toolpath Parser Tests"
Cohesion: 0.25
Nodes (6): assert, context, fs, path, source, vm

### Community 84 - "Cycle Picker UI"
Cohesion: 0.48
Nodes (6): closeCtxPanel(), closeCyclePicker(), openCyclePicker(), selectCycle(), showCycleList(), showCycleParams()

### Community 88 - "Property Binding Values"
Cohesion: 0.40
Nodes (3): bind(), getValue(), setValue()

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

## Knowledge Gaps
- **41 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `Object Cloning Utilities` to `Three.js Core Engine`, `Quaternion Math Operations`, `Geometry Parsing and Colors`, `Spherical Harmonics Math`, `3D Object Transforms`, `Skeleton Bone Binding`, `Buffer Attribute Management`, `Scene Object Traversal`, `Bounding Box Operations`, `Buffer Geometry Arrays`, `Animation Mixer Actions`, `WebGL Parameter Management`, `Camera Projection Setup`, `Frustum and Plane Math`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Triangle Geometry Math`, `Quaternion Interpolation`, `Bounding Box Math`, `Ray and Sphere Math`, `Raycaster Intersection`, `Object Serialization`, `Matrix4 Decomposition`, `Bone Transform Updates`, `Render Target Setup`, `Ray Casting Math`, `Camera Ray Utilities`, `Bounding Geometry Utils`, `Shadow Map Management`, `Bug Report UI`, `Buffer Geometry Groups`, `Curve Path Building`, `Skeleton Management`, `Curve Length Mapping`, `Vector Angle and Events`, `Shape and Font Parsing`, `Geometry JSON Parsing`, `LOD Object Parsing`, `Line3 Geometry Math`, `Shape Extraction Utils`, `Line Geometry Utils`, `Instanced Mesh Management`, `Cubic Bezier Curve`, `Spline Curve Operations`, `Spaced Points Curve`, `Triangle Point Set`, `Quadratic Bezier Curve`, `Linear Curve Segment`, `Catmull Rom Curve`, `Euler Rotation Clone`, `Clone Constructor Update Pattern`, `Copy Constructor Pair`, `Copy Constructor Pair`, `Copy Constructor Pair`, `Copy Constructor Pair`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `vt` connect `WebGL Texture Binding` to `Three.js Core Engine`, `Geometry Parsing and Colors`, `Clock and Audio Analyzer`, `Spherical Harmonics Math`, `Asset Loading Pipeline`, `Skeleton Bone Binding`, `Object Cloning Utilities`, `Buffer Attribute Management`, `WebGL Parameter Management`, `Geometry Normal Computation`, `Render Object Lifecycle`, `Buffer Attribute Transforms`, `Ray and Sphere Math`, `Animation Parsing Utils`, `Camera Ray Utilities`, `Bounding Geometry Utils`, `Shadow Map Management`, `Geometry Transform Helpers`, `Buffer Geometry Groups`, `Curve Path Building`, `Skeleton Management`, `Shape and Font Parsing`, `Buffer Attribute Data`, `String Utility Helpers`, `Vector Normalization`, `Clone Constructor Update Pattern`, `Loader Options Handler`, `Copy Constructor Pair`, `Asset Loader`, `Text Decode URL Utils`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `i()` connect `WebGL Parameter Management` to `Three.js Core Engine`, `Shape and Font Parsing`, `WebGL Texture Binding`, `Buffer Attribute Data`, `Matrix4 Decomposition`, `String Utility Helpers`, `Bone Transform Updates`, `3D Object Transforms`, `Asset Loading Pipeline`, `Loader Options Handler`, `Field Editing UI`, `Geometry Transform Helpers`, `Buffer Geometry Groups`, `Geometry Normal Computation`, `Triangle Geometry Math`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Three.js Core Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.031388329979879274 - nodes in this community are weakly interconnected._
- **Should `WebGL Texture Binding` be split into smaller, more focused modules?**
  _Cohesion score 0.029399585921325053 - nodes in this community are weakly interconnected._
- **Should `Quaternion Math Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.06560283687943262 - nodes in this community are weakly interconnected._