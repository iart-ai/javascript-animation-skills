---
name: soundtrack
description: This skill should be used when the user asks to "add music to the animation", "make the music in code", "synthesize a soundtrack", "compose background music that fits the cuts", "sync the music to the video", "check if the audio lines up with the picture", or "the music is too sudden / startling". Covers a code-synthesized score that lives inside the animation page (Web Audio API, rendered offline to WAV), AI-generated or user-supplied music, and an automatic check that cuts land on the beat without a startling jump in loudness.
version: 0.2.0
---

# Soundtrack

## Two templates

- `templates/groove.js` (**default for anything with actions**: stories, comedy, explainers with steps): a beat grid with sections, percussion (kick, clap, hats), bass, pads, a lead, a deliberate **break**, and ~20 synthesized sound effects. It reads the page's `BPM`, `SECTIONS` and `EVENTS`, the same data the picture uses, so every action has its sound on the same frame.
  `window.SCORE = ac => buildGroove(ac, { dur: DUR, bpm: BPM, sections: SECTIONS, events: EVENTS });`
- `templates/score.js` (gentle pieces: lullabies, ambient, poems): music box, pad and bass with a tempo map that lands each cut on a downbeat, no percussion.

## Default: synthesize it in the page (no key, no files)

Paste `templates/score.js` into the animation page's `<script>`, before the live-preview block at the bottom (the starter marks the spot), and set:

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
- **No extra accent on the cut's downbeat.** Even the normal downbeat accent (louder bass + first note) tipped short pieces over +6 dB, because the bar before is decaying. The chord change is enough.
- **Hard cuts inside a scene count.** Put them in `window.CUES` too, so they get the same downbeat.
- **Give the eye something to lock onto.** Legato music with no percussion has no accents for cuts to land on. With a steady groove, accents are part of the rhythm and don't startle (the check compares against the last few seconds, not an isolated quiet moment).
- **Bring layers in one or two per bar.** Kick and bass entering together after a quiet intro measured +11 dB (startle); staggered by a bar, +3.5 dB.
- **Use a break.** Cutting everything to silence for a bar before the payoff is the strongest beat in a short. `sync-check` accepts a cut into silence as on the beat.

## Other sources (only when asked)

- **AI-generated music** (e.g. Lyria via OpenRouter): see `references/ai-music.md`.
- **The user's own track**: mux it with ffmpeg.

With music you don't control, reverse the direction: **the picture follows the music.** Render, mux, run the check, then move the scene boundaries in the page's `SCENES` table by the reported offsets and re-render. This is cheap because each scene function receives local time (0 at its own start), as the starter is written: moving a boundary never touches scene code.

## Always: check it

```bash
node scripts/sync-check.mjs piece.mp4                       # detects cuts in the picture
node scripts/sync-check.mjs piece.mp4 --cues-file piece.cues.json   # or check the declared CUES (incl. in-scene hits)
```

For each event it prints the offset to the nearest strong audio onset and the loudness jump into it. It fails on OFF-BEAT (more than ±100 ms, ~3 frames) or STARTLE (more than +6 dB versus the second before). The opening second and the final fade are skipped (no "before" to compare against; a fade-out is not a cut). "Strong" means prominent among the onsets within ±2 s, so accents in quiet passages still count; a cut into silence counts as landing; music returning after a break is compared with the typical level of the last 4 s. A video with no audio stream is reported as such. Fix and re-run until it passes.

## Limits

Synthesized in code: music box, piano-like plucks, pads, bells, soft percussion are fine. Realistic voices, orchestras and genre production are not; use AI music or a real track for those.
