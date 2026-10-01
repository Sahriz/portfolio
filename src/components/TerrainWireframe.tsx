'use client';

import { useEffect, useRef } from 'react';

// A faint wireframe of low-poly terrain, drawn behind every page and visible
// only in the side margins (globals.css masks it out over the content column
// and hides it on screens too narrow to have margins). It is the hero's
// terrain reduced to its triangle edges: texture for the page edges, never
// something to look at. Plain 2D canvas, no WebGL.

const CELL = 42; // px between mesh vertices
const JITTER = 0.27; // how far a vertex strays from its grid position, in cells
const RELIEF = 42; // px a vertex is pushed up at the top of a "hill"
const PARALLAX = 0.2; // mesh scroll speed relative to the page
const FRAME_MS = 1000 / 120; // frame-rate cap; in practice it runs at the display's refresh rate
const MIN_WIDTH = 1280; // matches the CSS: below this there is no margin to draw in

/** Stable pseudo-random number in [0, 1) for a grid coordinate. */
function hash(ix: number, iy: number, salt: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Smooth rolling "height" in [0, 1] at a world position, drifting with time. */
function height(x: number, y: number, t: number) {
  const h =
    Math.sin(x * 0.0041 + t * 0.11) +
    Math.sin(y * 0.0052 - t * 0.08) +
    Math.sin((x + y) * 0.0029 + t * 0.05);
  return h / 6 + 0.5;
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

      // Only the margins are ever visible, so only those columns are drawn.
      const column = Math.min(width, 72 * 16);
      const margin = (width - column) / 2 + 32;
      const cols = Math.ceil(margin / CELL) + 1;
      const offset = reducedMotion.matches ? 0 : window.scrollY * PARALLAX;
      const firstRow = Math.floor(offset / CELL) - 1;
      const rows = Math.ceil(height_ / CELL) + 3;

      // Vertex position on screen for grid coordinate (ix, iy). `side` mirrors
      // the mesh so both margins are built outward from their screen edge.
      const vertex = (ix: number, iy: number, side: number) => {
        const wx = (ix + (hash(ix, iy, side) - 0.5) * 2 * JITTER) * CELL;
        const wy = (iy + (hash(ix, iy, side + 9) - 0.5) * 2 * JITTER) * CELL;
        const h = height(wx + side * 4000, wy, seconds);
        const x = side === 0 ? wx : width - wx;
        return { x, y: wy - offset - (h - 0.5) * 2 * RELIEF, h };
      };

      ctx.strokeStyle = colour;
      ctx.fillStyle = colour;
      ctx.lineWidth = 1;

      for (let side = 0; side < 2; side++) {
        for (let iy = firstRow; iy < firstRow + rows; iy++) {
          for (let ix = -1; ix < cols; ix++) {
            const a = vertex(ix, iy, side);
            const b = vertex(ix + 1, iy, side);
            const c = vertex(ix, iy + 1, side);
            const d = vertex(ix + 1, iy + 1, side);

            // Each cell contributes its top edge, left edge and one diagonal;
            // the neighbours supply the rest, so no edge is drawn twice.
            // Higher ground is drawn brighter, like lit ridges.
            ctx.globalAlpha = 0.05 + 0.2 * ((a.h + b.h + c.h) / 3) ** 2;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            // Alternate the diagonal so the triangles don't all lean one way.
            if ((ix + iy) % 2 === 0) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(d.x, d.y);
            } else {
              ctx.moveTo(b.x, b.y);
              ctx.lineTo(c.x, c.y);
            }
            ctx.stroke();

            // A node on every vertex: bigger and brighter the higher it sits.
            ctx.globalAlpha = 0.22 + 0.6 * a.h * a.h;
            ctx.beginPath();
            ctx.arc(a.x, a.y, 1.1 + 1.5 * a.h, 0, Math.PI * 2);
            ctx.fill();
            // The peaks also get a soft halo.
            if (a.h > 0.7) {
              ctx.globalAlpha = 0.16 * ((a.h - 0.7) / 0.3);
              ctx.beginPath();
              ctx.arc(a.x, a.y, 6, 0, Math.PI * 2);
              ctx.fill();
            }
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
