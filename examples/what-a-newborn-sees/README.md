# What a newborn sees

A 42-second explainer on why babies stare at black-and-white cards. Every frame is drawn on a canvas and the soundtrack is synthesized by the same file with Web Audio: `index.html` (28 KB) loads nothing.

Open `index.html` in a browser to watch it live (click to start the sound), or render it:

```bash
node ../../skills/javascript-animation/scripts/render.mjs index.html what-a-newborn-sees.mp4
node ../../skills/soundtrack/scripts/sync-check.mjs what-a-newborn-sees.mp4
node ../../skills/javascript-animation/scripts/asset-audit.mjs index.html
```

It shows the pack's defaults, not a template to copy: a different subject should get a different look.

## Sources for the facts on screen

- Newborn visual acuity around 20/400; sharpest focus at about 20-30 cm: [American Academy of Ophthalmology](https://www.aao.org/eye-health/tips-prevention/baby-vision-development-first-year), [All About Vision](https://www.allaboutvision.com/eye-care/parents-kids/infant-vision/).
- Newborn foveal cones are 30-50% of adult length and loosely packed, which limits spatial and chromatic vision: Banks & Bennett (1988), [J. Opt. Soc. Am. A 5(12)](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-5-12-2059).
- Low contrast sensitivity as the critical immaturity of infant vision: Brown (2009), [Optometry and Vision Science](https://onlinelibrary.wiley.com/doi/10.1097/OPX.0b013e3181a72980).
