'use client';

import { useEffect, useRef } from 'react';

// A faint wireframe of low-poly terrain, drawn behind every page. Cards and
// other solid surfaces sit on top of it, so it shows in the side margins and
// in the gaps between them; globals.css dims it across the content column,
// where text sits directly on it, and hides it on small screens. It is the
// hero's terrain reduced to its triangle edges: texture, never something to
// look at. Plain 2D canvas, no WebGL.

const CELL = 42; // px between mesh vertices
const JITTER = 0.27; // how far a vertex strays from its grid position, in cells
const RELIEF = 22; // px a vertex is pushed up at the top of a "hill"
const PARALLAX = 0.2; // mesh scroll speed relative to the page
const FRAME_MS = 1000 / 120; // frame-rate cap; in practice it runs at the display's refresh rate
// How much a vertex's height decides how strongly it is drawn (lines, node
// size and brightness, halo):
//    1  taller = brighter and bigger (the default)
//    0  height makes no difference, everything is drawn the same
//   -1  reversed: the valleys are highlighted and the peaks fade
// Values in between soften the effect; beyond +-1 (try 2 or -2) exaggerate it.
const HEIGHT_HIGHLIGHT = 0.8;
// Scales every node and its halo. 1 was the original size, which read as
// blobs on a dense mesh.
const NODE_SIZE = 0.4;
const MIN_WIDTH = 768; // matches the CSS: hidden on phones, where it would only be clutter

/** Stable pseudo-random number in [0, 1) for a grid coordinate. */
function hash(ix: number, iy: number, salt: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Smooth 2D value noise in [0, 1]: random values on a lattice, blended between. */
function noise(x: number, y: number, salt: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Smoothstep weights, so the blend has no creases at the lattice lines.
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const top = hash(ix, iy, salt) * (1 - u) + hash(ix + 1, iy, salt) * u;
  const bottom = hash(ix, iy + 1, salt) * (1 - u) + hash(ix + 1, iy + 1, salt) * u;
  return top * (1 - v) + bottom * v;
}

const HILL = 150; // px across one broad hill
const BUMP = 25; // px across the smaller bumps on top of the hills

/**
 * Terrain height in [0, 1] at a world position: a height map seen from above,
 * with hills and hollows scattered in both directions. Two layers of noise,
 * each sliding slowly so the landscape drifts over time.
 */
function height(x: number, y: number, t: number) {
  const hills = noise(x / HILL + t * 0.02, y / HILL - t * 0.015, 3);
  const bumps = noise(x / BUMP - t * 0.03, y / BUMP + t * 0.025, 7);
  const h = hills * 0.7 + bumps * 0.3;
  // Blended noise bunches up around 0.5; stretch it to use the whole range.
  return Math.min(1, Math.max(0, (h - 0.5) * 1.9 + 0.5));
}

/** A vertex's highlight strength in [0, 1], from its height and HEIGHT_HIGHLIGHT. */
function emphasis(h: number) {
  const e = 0.5 + (h - 0.5) * HEIGHT_HIGHLIGHT;
  return Math.min(1, Math.max(0, e));
}

export default function TerrainWireframe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height_ = 0;
    let colour = 'rgb(140 220 255)';
    let raf = 0;
    let last = 0;
    // Per-frame vertex buffers, reused so drawing allocates nothing.
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let es = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height_ = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height_ * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // The line colour is the site accent, which differs per theme.
    const readColour = () => {
      colour = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || colour;
    };

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, width, height_);
      if (width < MIN_WIDTH) return;

      const cols = Math.ceil(width / CELL) + 2;
      const offset = reducedMotion.matches ? 0 : window.scrollY * PARALLAX;
      const firstRow = Math.floor(offset / CELL) - 1;
      const rows = Math.ceil(height_ / CELL) + 3;

      // Work out every vertex once per frame: screen position plus highlight
      // strength. One extra row and column, so each cell can reach its
      // right-hand and lower neighbours.
      const stride = cols + 2;
      const count = stride * (rows + 1);
      if (xs.length < count) {
        xs = new Float32Array(count);
        ys = new Float32Array(count);
        es = new Float32Array(count);
      }
      for (let r = 0; r <= rows; r++) {
        const iy = firstRow + r;
        for (let q = 0; q < stride; q++) {
          const ix = q - 1;
          const wx = (ix + (hash(ix, iy, 0) - 0.5) * 2 * JITTER) * CELL;
          const wy = (iy + (hash(ix, iy, 9) - 0.5) * 2 * JITTER) * CELL;
          const h = height(wx, wy, seconds);
          const i = r * stride + q;
          xs[i] = wx;
          // Height only moves the vertex; `es` is what decides how it is drawn.
          ys[i] = wy - offset - (h - 0.5) * 2 * RELIEF;
          es[i] = emphasis(h);
        }
      }

      ctx.strokeStyle = colour;
      ctx.fillStyle = colour;
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < stride - 1; q++) {
          const a = r * stride + q;
          const b = a + 1;
          const c = a + stride;
          const d = c + 1;

          // Each cell contributes its top edge, left edge and one diagonal;
          // the neighbours supply the rest, so no edge is drawn twice.
          // Highlighted ground is drawn brighter, like lit ridges.
          ctx.globalAlpha = 0.05 + 0.2 * ((es[a] + es[b] + es[c]) / 3) ** 2;
          ctx.beginPath();
          ctx.moveTo(xs[b], ys[b]);
          ctx.lineTo(xs[a], ys[a]);
          ctx.lineTo(xs[c], ys[c]);
          // Alternate the diagonal so the triangles don't all lean one way.
          if ((q + r + firstRow) % 2 === 0) {
            ctx.moveTo(xs[a], ys[a]);
            ctx.lineTo(xs[d], ys[d]);
          } else {
            ctx.moveTo(xs[b], ys[b]);
            ctx.lineTo(xs[c], ys[c]);
          }
          ctx.stroke();

          // A node on every vertex: bigger and brighter the more it is highlighted.
          const e = es[a];
          ctx.globalAlpha = 0.22 + 0.6 * e * e;
          ctx.beginPath();
          ctx.arc(xs[a], ys[a], (1.1 + 1.5 * e) * NODE_SIZE, 0, Math.PI * 2);
          ctx.fill();
          // The most highlighted ones also get a soft halo.
          if (e > 0.7) {
            ctx.globalAlpha = 0.16 * ((e - 0.7) / 0.3);
            ctx.beginPath();
            ctx.arc(xs[a], ys[a], 6 * NODE_SIZE, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now / 1000);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      readColour();
      if (reducedMotion.matches) {
        draw(0); // one static frame, no drift and no parallax
      } else if (!document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };

    const onResize = () => {
      resize();
      if (reducedMotion.matches) draw(0);
    };

    // The theme toggle swaps a class on <html>; pick up the new accent.
    const themeObserver = new MutationObserver(() => {
      readColour();
      if (reducedMotion.matches) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    resize();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', start);
      reducedMotion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="terrain-wireframe" />;
}
