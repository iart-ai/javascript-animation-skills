# Gallery: made by an agent from one prompt

Each piece here was made by a fresh agent (Claude Opus 5.5) working only from this pack's skill docs and a one-line request: it didn't open any example, got no follow-up, and the result has no human edits. They come from a test of how varied the pack's output is: the same few requests were run through several versions of the skills, and these were picked for range.

![Three films made by an agent from one prompt each](./gallery.gif)

| Piece | The request | What the agent chose | Checks |
|---|---|---|---|
| [cat-vs-robot-vacuum](./cat-vs-robot-vacuum) | "A 20-second comedy: a cat's feud with a robot vacuum." | Flat cinematic look on a cream and terracotta room, floor-level camera, 1-4 s shots; marimba, woodblock and toms in a cheeky blues at 120 bpm, a sound on every gag, a silent bar before the payoff | asset-audit and layout-check CLEAN; sync 9/10: the cut at 6 s is +6.0 dB, right at the limit, where the full band comes in as the cat wakes |
| [goodnight-stars](./goodnight-stars) | "A 20-second bedtime animation for a 2-year-old: the moon tucks the stars into bed." | Picture-book shapes with soft blush for a toddler, four slow shots; electric piano and a string pad in a dreamy key at 72 bpm | all CLEAN, sync 3/3 |
| [compound-interest](./compound-interest) | "A 20-second explainer: how compound interest grows your savings." | Clean print on a passbook-cream ground, coins stacked per year, a running balance; marimba and woodblock at 96 bpm | all CLEAN, sync 4/4. Numbers check out: $100 at 10% a year is $1,745 after 30 years, against $400 without compounding |

Render any of them:

```bash
node ../../skills/javascript-animation/scripts/render.mjs cat-vs-robot-vacuum/index.html cat.mp4
```

The same request run twice tends to come out similar (the subject decides most of the look); different requests come out different. If you want a particular look, say so in the request.
