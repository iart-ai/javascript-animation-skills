---
name: javascript-animation
description: This skill should be used when the user asks to "draw every frame in JavaScript", "make an animation with no image assets", "animate this in code / on a canvas", "make a hand-drawn style animated video", "turn this into a short animated film", "make an animated explainer drawn in code", "make an animated story / picture book of my photos", or "make a zero-asset animation like the Opus 5.5 ones". Produces a single self-contained HTML file whose frames are computed on an HTML canvas (seekable, deterministic), renders it to MP4, and self-checks the result. Pairs with the soundtrack skill for code-synthesized music. NOT for charts from data (use chart-animation), pure text motion (use kinetic-typography), or 3D/WebGL (use threejs-animation / shader-glsl from webgl-animation-skills).
version: 0.1.0
---

# JavaScript Animation (every frame drawn in code)

Make short animated films where every pixel is computed: no images, no fonts to load, no libraries. One HTML file holds the whole piece; a headless browser seeks it frame by frame into an MP4.

## Model

Built and tested with Claude Opus 5.5; drawing quality depends heavily on the model. The self-check below needs image input: if the current model can't see images, say so to the user and treat visual verification as not done. Other models are untested; if the result looks crude, say that a stronger model is likely to help rather than claim it's the best possible.

## Default flow: don't stop to ask

Run straight through. Pick sensible defaults and mention alternatives at delivery. Ask *before* starting only if there is no subject at all (e.g. "make an animation", nothing else).

1. **Read the brief.** Infer the form (story, explainer, poem, loop, interactive page), length (default 30-45 s) and aspect (default 1080x1080) from what the user said. On-screen text is in the language the user wrote the brief in; make it bilingual only if they ask or the audience clearly is. `references/forms.md` has a short structure for each form.
2. **Derive the look from the subject.** Write two or three sentences on why this subject gets this line, palette and texture, then pick the primitives that express it (`references/techniques.md`). Never reuse the look of the bundled example or a previous piece by default: two different subjects should not come out looking alike. If the user points at someone else's piece ("like that viral one"), borrow its techniques, never its characters, story or compositions.
3. **Storyboard in time.** A scene list with start times; one idea per scene; 4-8 s per scene. Export the scene boundaries as `window.CUES` (the soundtrack and the checks read them). A hard cut inside a scene (one image replaced by another without the dip) is a cut too: list it in CUES so the music lands on it.
4. **Build from `templates/starter.html`.** Copy it, replace the placeholder palette, write one function per scene; each scene gets local time (0 at its own start), so cuts can move later without touching scene code. Keep the contract: `draw(frame)` is a pure function of the frame number. Use `rng(seed)` / `hash2()`, never `Math.random` or `Date`.
5. **Self-check, then render** (next section). Fix and re-check until clean.
6. **Deliver:** the MP4 and the HTML (it plays live in a browser; clicking starts the sound). Then, in one or two lines, offer what can change: another look, AI music instead of synthesized, different length.

For music, use the `soundtrack` skill (default: synthesized in the page with Web Audio, no key needed).

## Self-check (the agent does this; the user never sees it)

```bash
node scripts/render.mjs piece.html sheet.jpg --sheet 1        # one frame per second, stepping off cuts
node scripts/render.mjs piece.html shot --stills 90,300,610   # specific moments
node scripts/render.mjs piece.html piece.mp4                  # full render (+ soundtrack if the page has one)
node scripts/asset-audit.mjs piece.html                       # proves zero-asset: exit 1 if anything is loaded or embedded
```

Open the contact sheet and go through `references/qc.md` item by item: blank frames, text overflow and missing glyphs, shapes that read as the wrong thing, detached or floating parts, draw order, props off their anchors. Render stills of the frames you change instead of re-rendering the whole film each time.

## Only if triggered

| When | Do |
|---|---|
| A character appears in more than one scene | Before the scenes, render the character alone (expressions + poses) and check it yourself against `references/character.md`. Characters expose anchor points (mouth, hands) so props attach to them. |
| The user supplied photos of real people, pets or places | Build the character from the photos with the extraction method in `references/character.md`. Photos stay local: never upload them or put them in anything published. |
| It's a real-person piece and the user is present | At delivery (not before), offer to use photos of key props or people to make it more theirs. |
| On-screen text is not Latin (Chinese, Japanese...) | Use a CJK font stack; check every glyph renders (monospace fonts silently swap missing glyphs, e.g. `≈` became `=`). |
| The page will be published as a web page | Deliver the HTML; keep the live preview loop and the click-to-play audio. |

## Rules that prevent the common failures

- **Pure function of time.** No `requestAnimationFrame` state, no CSS animations, no accumulated physics: compute each frame from `t` alone, or the render and the preview disagree.
- **Boil, don't jitter.** Change the wobble seed every 4 frames (`BOIL`), not every frame. Every frame reads as noise; ~7.5 changes a second reads as hand-drawn.
- **Rounded forms for bodies.** Build figures from ellipses and rounded rectangles. Raw polygons with few points read as signs (a pentagon hand, a box torso).
- **Pick the angle that makes the pose read.** A long body with stubby limbs from the side reads as a caterpillar; the same pose from the front (foreshortened) reads as a baby on its tummy.
- **Draw back to front, explicitly.** Back hair, then body, then neck, then face, then front hair. Most "something covers the face" bugs are draw order.
- **Hit points on cuts.** Scene cuts dip to paper for ~0.3 s; music lands its changes there (see `soundtrack`).

## Files

- `templates/starter.html`: drawing library (ink primitives, illustration primitives, labels, paper, filtered layers) and an empty two-scene skeleton.
- `scripts/render.mjs`: MP4 / stills / contact sheet. `window.CUES` and `window.SCORE` are optional: on a full render it writes `<out>.cues.json` and muxes the SCORE soundtrack (no SCORE = silent MP4). Needs an even canvas size.
- `scripts/asset-audit.mjs`: static scan + live network check for anything loaded or embedded.
- `references/techniques.md`: tested drawing techniques (ink, spot-color print, single-line engraving, words as shapes, marker fills, illustration shapes).
- `references/forms.md`: structure notes per form.
- `references/character.md`: only when there's a character.
- `references/qc.md`: the self-check list.

Requirements: Node 18+, ffmpeg, Chrome (or `npx playwright install chromium`), and `npm i playwright-core` in the folder you run the scripts from (your project, not the skill folder).
