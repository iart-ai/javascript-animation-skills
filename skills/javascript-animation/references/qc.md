# Self-check before delivering

The agent runs this; the user never sees it. Open the contact sheet (`render.mjs page.html sheet.jpg --sheet 1`; it steps off scene cuts so dip frames don't look like blank ones) and go down the list. Fix, render stills of the changed frames, and check again.

## Frames

- [ ] No blank or near-blank frames except the intended dips at cuts.
- [ ] Every scene reads in one second: can you say what's happening from the thumbnail alone?
- [ ] Text fits its box, doesn't overlap a face or a key object, and every glyph renders (monospace fonts swap missing glyphs silently: `≈` showed up as `=`). Non-Latin text uses a CJK font stack.
- [ ] Labels that type on: the box grows with the text (a full-width box with two letters in it looks broken).

## Shapes and figures

- [ ] Each shape reads as the thing it is. Few-point polygons read as signs (a pentagon hand, a box torso); rebuild them from rounded forms.
- [ ] Silhouettes read: a pose that looks like something else (a baby on its tummy that reads as a caterpillar) needs a different angle, not more detail.
- [ ] Nothing floats: heads sit on necks/shoulders, props touch the hand or mouth that holds them (place props from anchor points).
- [ ] Draw order is right: nothing covers a face; back hair is behind the body.
- [ ] A recurring character looks the same in every scene.

## Motion

- [ ] Line boil is ~7.5 changes/s (every 4 frames), not every frame.
- [ ] Endings hold: the last line appears after motion has settled.
- [ ] Loops: frame 0 and the last frame match.

## Facts and assets

- [ ] Every fact on screen has a source you can name.
- [ ] `node scripts/asset-audit.mjs page.html` prints CLEAN.
- [ ] If there's a soundtrack: `node ../soundtrack/scripts/sync-check.mjs out.mp4` passes (on the beat, no startle).
- [ ] Private material (family photos, names) stays local and out of anything published.
