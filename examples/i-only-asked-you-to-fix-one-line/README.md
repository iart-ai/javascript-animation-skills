# "I only asked you to fix one line"

A 30-second comedy about an AI agent and scope creep. Someone asks for a one-line typo fix at 01:58 and goes to bed. The agent fixes it, knocks the next brick loose, fixes that, repaints the wall, rebuilds the street, and by 08:30 the "codebase" is a skyline. `+48,211 lines · 312 files`.

Every frame is drawn on a canvas and every sound is synthesized by the same file with Web Audio: `index.html` loads nothing.

```bash
node ../../skills/javascript-animation/scripts/render.mjs index.html fix-one-line.mp4
node ../../skills/soundtrack/scripts/sync-check.mjs fix-one-line.mp4 --cues-file fix-one-line.cues.json
node ../../skills/javascript-animation/scripts/layout-check.mjs index.html
node ../../skills/javascript-animation/scripts/asset-audit.mjs index.html
```

## How it was made (the v0.2 workflow)

1. **Beat grid**: 120 bpm, 15 bars: intro (typing) → build → peak (a tower rises on every beat) → a two-second **break** of silence while the sun comes up → the punchline.
2. **Storyboard + blocking as data**: 15 shots (14 cuts, all on beats), in **one continuous world**. The room's monitor shows the code-city; the film pushes into the screen and pulls back out. The window in the room and the sky of the city share one time of day.
3. **One event list** drives the pictures and ~20 synthesized sound effects (typing, hammer, the brick that slips, each tower, the alarm, the notification).
4. **Checks**: `sync-check` 14/14 cuts on the beat without a startle; `layout-check` CLEAN over 300 sampled frames; `asset-audit` CLEAN.
5. **Director passes**: a first cut read as childish (rounded, outlined, chibi) and had text sitting on objects. The second pass moved to a cinematic flat + blueprint look (four inks, no outlines, depth, construction lines), made the gag visible (code printed on the bricks, a red squiggle under `tpyo`), turned "fixes it, notices another" into a causal chain (each hammer blow knocks the next brick loose), and restaged the room (monitor on a desk, over-the-shoulder, a reverse shot on the face for the punchline).

It shows the workflow, not a template: a different subject should get a different look.
