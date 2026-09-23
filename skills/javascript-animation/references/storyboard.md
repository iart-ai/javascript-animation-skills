# Storyboard, blocking and the beat grid

Write these before any drawing code. They are data in the page (`BPM`, `SECTIONS`, `SHOTS`, `EVENTS`, blocking constants), not notes: the scenes, the camera and the soundtrack all read them, so picture and sound land together by construction.

The starter already has the skeleton. This is a self-check step: don't stop to ask the user to approve the storyboard. Deliver it with the film (e.g. as `storyboard.md`) so they can point at a shot to change.

## 1. Beat grid

- Pick a tempo from the mood: 70-90 bpm gentle, 110-128 bpm comic or energetic. `b(n)` is the n-th beat in seconds.
- Lay out sections in bars: intro, build, peak, **break**, return, outro. A short silence before the punchline or the payoff is the strongest beat you have.
- Every cut and every visible action sits on a beat or a half beat.

## 2. Shot list

One row per shot. 30 seconds wants roughly 10-20 shots; a 5-8 second shot of one static composition reads as slow.

| # | from–to (beats) | framing | camera move | what happens (the action) | blocking | action lands on | sound | transition |
|---|---|---|---|---|---|---|---|---|
| 3 | 10–16 | extreme close-up | slow push | the robot hammers the misspelled brick straight | robot drops in from above, stays left of the brick | beats 12, 13, 14 | clank ×3, ding | hard cut |

- **Vary framing**: wide, medium, close, extreme close. Scale changes are what makes a short feel cinematic.
- **Keep every shot moving**: a slow push or drift on the camera, plus at least one secondary motion (smoke, blinking lights, a sway). Fully still frames read as a slideshow.
- **Vary transitions**: hard cut, match cut, push into / pull out of an object (a screen, a window, an eye). Save the dip-to-paper for chapter breaks.

## 3. Blocking: one world, many cameras

- Put every character and prop in **one continuous world** with a track over global time (where it is, its pose, its expression). Shots are only cameras looking at that world (`withCamera`). A cut then can't break continuity: the end of one shot is literally the start of the next.
- Continuity rules the world model doesn't give you for free:
  - **Carry something over every cut**: the same object crosses the cut, or the camera pushes into a detail that becomes the next scene.
  - **Screen direction**: something moving right keeps moving right across a cut.
  - **Props, light and time of day persist**: what's in a hand stays in the hand; night doesn't become day without a transition. Share the sky between a window in the room and the world outside.
- **Staging that reads as real**: things rest on surfaces (a monitor on a desk, with a stand), people have feet on the floor, objects don't hover unless that's the joke. Someone at a computer reads best over the shoulder, with the screen facing the camera.

## 4. Story logic

- **Every beat is caused by the previous one.** "Fixes it, then notices another problem" is flat; "fixing it knocks the next brick loose" is a chain the audience feels. Escalation should be causal.
- **Show the metaphor in the picture.** If a wall stands for code, print code on the bricks; mark the misspelled one with a red squiggle. A label next to an unexplained picture doesn't land.
- **Punchlines get their own shot**: a reveal (what happened), then a reverse shot of the reaction (the face). Cut between them on a beat.

## 5. Events

`EVENTS` lists every visible action with a sound: `[[seconds, 'sfxName', arg], ...]`. The scenes trigger the action at the same time; `buildGroove` (soundtrack skill) plays the sound. One list, two readers.

## 6. Check the picture against the storyboard

After the first render, take a still at the action beat of every shot (`render.mjs page.html shot --stills ...`) and read it against its row: is the actor where the blocking says, doing what the row says, and can you tell what just happened? Most "the video doesn't match the script" problems are blocking that was never written into the tracks.
