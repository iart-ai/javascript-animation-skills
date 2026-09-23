---
name: soundtrack
description: This skill should be used when the user asks to "add music to the animation", "make the music in code", "synthesize a soundtrack", "compose background music that fits the cuts", "sync the music to the video", "check if the audio lines up with the picture", or "the music is too sudden / startling". Covers a code-synthesized score that lives inside the animation page (Web Audio API, rendered offline to WAV), AI-generated or user-supplied music, and an automatic check that cuts land on the beat without a startling jump in loudness.
version: 0.1.0
---

# Soundtrack

## Default: synthesize it in the page (no key, no files)

Paste `templates/score.js` into the animation page's `<script>` and set:

```js
window.SCORE = ac => buildScore(ac, { dur: DUR, cues: window.CUES });
```

That's all. `render.mjs` (from the `javascript-animation` skill) renders the score offline with `OfflineAudioContext`, writes `<out>.wav` and muxes it into the MP4; the page's live preview plays the same score when clicked. It's a music box arpeggio, a soft pad and bass with a little room, plus a faint chime on each cut.

Options: `bar` (target bar length in seconds; 2.67 ≈ 90 bpm, 3 ≈ 80 bpm for lullabies), `key` (semitone transpose), `tail` (seconds of the final resolving chord), `gain`.

Don't ask the user to choose a music source up front. At delivery, mention in one line that AI-generated music or their own track also work.

## How the music follows the picture

- **Tempo map.** Each scene gets a whole number of bars (tempo flexes per scene, roughly 70-110 bpm), so every cut lands on a downbeat.
- **Mark cuts with harmony, not volume.** Each scene walks home to the dominant (G) and the cut arrives on the tonic (C). A loud accent on a cut (bass + bright chime at once) reads as a jump scare: users flagged a +7 to +10 dB jump as startling; +3 to +5 dB with a chord change reads as a clean edit.
- **Don't thin the opening bar if it's the only bar before the first cut**; a sparse intro followed by the full texture is itself a startle.

## Other sources (only when asked)

- **AI-generated music** (e.g. Lyria via OpenRouter): see `references/ai-music.md`.
- **The user's own track**: mux it with ffmpeg.

With music you don't control, reverse the direction: **the picture follows the music.** Render, mux, run the check, then move the scene boundaries in the page's `SCENES` table by the reported offsets and re-render. This is cheap only if each scene's internal timings are relative to the scene start (`const lt = t - start`), which is why the starter is written that way.

## Always: check it

```bash
node scripts/sync-check.mjs piece.mp4                       # detects cuts in the picture
node scripts/sync-check.mjs piece.mp4 --cues-file piece.cues.json   # or check the declared CUES (incl. in-scene hits)
```

For each event it prints the offset to the nearest strong audio onset and the loudness jump into it. It fails on OFF-BEAT (more than ±100 ms, ~3 frames) or STARTLE (more than +6 dB versus the second before). The opening second is skipped (there's no "before" to compare against). Fix and re-run until it passes.

## Limits

Synthesized in code: music box, piano-like plucks, pads, bells, soft percussion are fine. Realistic voices, orchestras and genre production are not; use AI music or a real track for those.
