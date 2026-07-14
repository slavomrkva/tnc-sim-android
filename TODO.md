# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs

## 3D stock updates can stall during machining
**Reported:** 2026-07-13 on web; same full-grid rebuild architecture existed in
Android. **Repro:** run repeated cuts through the default 100×100×20 stock,
especially at High quality.

### Symptom
Workpiece refreshes can interrupt the tool animation while Marching Cubes scans,
allocates and uploads the entire voxel mesh after each changed segment.

### Attempts
- Attempt 1 — web profiling isolated pauses above 50 ms to the stock rebuild;
  toolpath-only playback did not show them.
- Attempt 2 — web v0.830 introduced 32×32-cell XY chunk rebuilds with an exact
  geometry regression and was accepted by the user as working very well.
- Attempt 3 — Android 1.0.31 ports the same chunking, recursive Measure
  raycasting and group-safe disposal. It adds Low/Default/High profiles and uses
  conservative WebView budgets of 12 million live and 32 million Refine voxels.
  Automated parser, geometry and profile tests pass; a debug APK is produced.

### Status
Implementation is complete. Keep this entry open until the 1.0.31 APK is
verified on a real Android device, then move it to `BUG_HISTORY.md`.

<!-- Template for a new bug (copy below "Open bugs"):

## <short title> — <one-line symptom>
**Reported:** <date>. **Repro:** <steps / device / only-on-device?>
### Symptom
<verbatim if possible>
### Attempts
- Attempt 1 — <what / hypothesis>: <result on device>.
- Attempt 2 — …
### Status
<current best understanding / next thing to try>
-->
