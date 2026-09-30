# Lower third

An 8-second name strap for interview footage, with a transparent background: the panel wipes open, the name and role slide in, it holds, and it clears. Silent. `index.html` (19 KB) loads nothing; it is the starter with `LOOK.ground = 'none'`.

Render it to WebM with alpha and drop it on a track above your footage (or into OBS as a Media Source):

```bash
node ../../skills/javascript-animation/scripts/render.mjs index.html lower-third.webm
node ../../skills/javascript-animation/scripts/render.mjs index.html sheet.jpg --sheet .5   # see-through areas show as a checkerboard
node ../../skills/javascript-animation/scripts/layout-check.mjs index.html
node ../../skills/javascript-animation/scripts/asset-audit.mjs index.html
```

For Premiere, which doesn't read WebM alpha, convert to ProRes 4444:

```bash
ffmpeg -c:v libvpx-vp9 -i lower-third.webm -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le lower-third.mov
```

Change `NAME` and `ROLE` in the page for your own guest.
