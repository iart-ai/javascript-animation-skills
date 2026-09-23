#!/usr/bin/env node
// render.mjs: seek-render a canvas animation page to MP4, stills, or a contact sheet.
//
// The page must expose:  window.draw(frame)  window.FRAMES  window.FPS
// and optionally:        window.CUES = [seconds, ...]   (scene cuts / hit points for the soundtrack)
//                        window.SCORE = ac => {...}     (Web Audio soundtrack; rendered offline and muxed in)
// It is loaded with ?render so it can skip its own preview loop.
//
// Usage:
//   node render.mjs page.html out.mp4                  full render (H.264, yuv420p)
//   node render.mjs page.html shot --stills 0,150,300  -> shot-0000.jpg shot-0150.jpg ...
//   node render.mjs page.html sheet.jpg --sheet [1]    one frame every N seconds, tiled into one image
// If the page defines CUES, they are also written to <out>.cues.json.
// If the page defines SCORE, the full render also writes <out>.wav and muxes it into the MP4.
//
// Needs: node >= 18, `npm i playwright-core`, ffmpeg, and Chrome installed
// (or run `npx playwright install chromium` once).
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, rmSync, renameSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

// resolve playwright from the skill folder, else from the project you run it in (where you `npm i playwright-core`)
async function loadChromium() {
  for (const name of ['playwright-core', 'playwright']) {
    try { return (await import(name)).chromium; } catch {}
    try { return createRequire(process.cwd() + '/')(name).chromium; } catch {}
  }
  throw new Error('playwright-core not found: run `npm i playwright-core` in this folder');
}
const chromium = await loadChromium();

const args = process.argv.slice(2);
const [pagePath, out] = args;
const opt = name => { const i = args.indexOf(name); return i < 0 ? undefined : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
if (!pagePath || !out) { console.error('usage: node render.mjs page.html <out> [--stills f1,f2] [--sheet [seconds]]'); process.exit(1); }

let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('file://' + resolve(pagePath) + '?render');
const info = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return { FRAMES: window.FRAMES, FPS: window.FPS, CUES: window.CUES, w: c?.width, h: c?.height, hasDraw: typeof window.draw === 'function', hasScore: typeof window.SCORE === 'function' };
});
if (!info.hasDraw || !info.FRAMES || !info.FPS) { console.error('page must define window.draw(frame), window.FRAMES and window.FPS', errors); process.exit(1); }
if (info.w % 2 || info.h % 2) console.warn(`warning: canvas ${info.w}x${info.h} has an odd side; libx264 needs even dimensions`);

const grab = f => page.evaluate(f => { window.draw(f); return document.querySelector('canvas').toDataURL('image/jpeg', 0.93).split(',')[1]; }, f);
const jpg = async f => Buffer.from(await grab(f), 'base64');
// for contact sheets: stamp the timestamp in the browser (ffmpeg drawtext is missing from many builds)
const stamped = async (f, fps) => Buffer.from(await page.evaluate(([f, fps]) => {
  window.draw(f); const src = document.querySelector('canvas'), c = document.createElement('canvas');
  c.width = src.width; c.height = src.height; const x = c.getContext('2d'); x.drawImage(src, 0, 0);
  const s = Math.round(src.width / 16); x.fillStyle = 'rgba(0,0,0,.65)'; x.fillRect(0, 0, s * 3.1, s * 1.3);
  x.fillStyle = '#fff'; x.font = `700 ${Math.round(s * .8)}px monospace`; x.textBaseline = 'middle'; x.fillText((f / fps).toFixed(2) + 's', s * .25, s * .66);
  return c.toDataURL('image/jpeg', .9).split(',')[1];
}, [f, fps]), 'base64');

if (Array.isArray(info.CUES)) writeFileSync(out.replace(/\.[^.]+$/, '') + '.cues.json', JSON.stringify(info.CUES));

if (opt('--stills')) {
  for (const f of String(opt('--stills')).split(',').map(Number)) {
    const file = `${out}-${String(f).padStart(4, '0')}.jpg`; writeFileSync(file, await jpg(f)); console.log(file);
  }
} else if (opt('--sheet')) {
  const every = opt('--sheet') === true ? 1 : Number(opt('--sheet'));
  // sample every N seconds, but step off scene cuts: a frame inside the dip-to-paper looks blank
  const near = t => (info.CUES || []).find(c => Math.abs(t - c) < .35);
  const frames = []; for (let t = 0; t * info.FPS < info.FRAMES; t += every) { const c = near(t); frames.push(Math.min(info.FRAMES - 1, Math.round((c !== undefined ? c + .45 : t) * info.FPS))); }
  const dir = mkdtempSync(join(tmpdir(), 'sheet-'));
  for (let i = 0; i < frames.length; i++) writeFileSync(join(dir, `f${String(i).padStart(4, '0')}.jpg`), await stamped(frames[i], info.FPS));
  const cols = Math.ceil(Math.sqrt(frames.length)), rows = Math.ceil(frames.length / cols), tw = 360;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, 'f%04d.jpg'),
    '-vf', `scale=${tw}:-2,tile=${cols}x${rows}`,
    '-frames:v', '1', out]);
  rmSync(dir, { recursive: true });
  console.log(`contact sheet: ${frames.length} frames (every ${every}s) -> ${out}`);
} else {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(info.FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < info.FRAMES; f++) {
    if (!ff.stdin.write(await jpg(f))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (info.FPS * 5) === 0) console.log(`frame ${f}/${info.FRAMES}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(`rendered ${info.FRAMES} frames @ ${info.FPS}fps -> ${out}`);
  if (info.hasScore) {
    // render the page's Web Audio score offline (deterministic, faster than real time) -> 16-bit WAV
    const wav64 = await page.evaluate(async secs => {
      const SR = 48000, ac = new OfflineAudioContext(2, Math.ceil(SR * secs), SR);
      window.SCORE(ac);
      const buf = await ac.startRendering(), n = buf.length, L = buf.getChannelData(0), R = buf.getChannelData(1);
      let peak = 1e-9; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
      const g = .89 / peak, dv = new DataView(new ArrayBuffer(44 + n * 4)), w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
      w(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
      dv.setUint32(24, SR, true); dv.setUint32(28, SR * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, n * 4, true);
      for (let i = 0; i < n; i++) { dv.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i] * g)) * 32767, true); dv.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i] * g)) * 32767, true); }
      const bytes = new Uint8Array(dv.buffer); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(bin);
    }, info.FRAMES / info.FPS);
    const wav = out.replace(/\.[^.]+$/, '') + '.wav', silent = out + '.silent.mp4';
    writeFileSync(wav, Buffer.from(wav64, 'base64'));
    renameSync(out, silent);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out]);
    rmSync(silent);
    console.log(`soundtrack (window.SCORE) -> ${wav}, muxed into ${out}`);
  }
}
if (errors.length) console.warn('page errors:', errors);
await browser.close();
