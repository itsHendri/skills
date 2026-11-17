// Pen themes: turns an Anatomy drawing into a static SVG that looks drawn by hand.
// Nothing is filtered or rasterised, so lines stay sharp at any size: every stroke is real geometry,
// nudged by smooth seeded noise and drawn twice, the way rough.js does it. Tone comes from marks
// (hatching, stipple, halftone dots, engraving lines or a wash) clipped to each face.
export const PEN = { ink: '#1F262D', note: '#4A3FE0', paper: '#F3F6F8' };
// The look Hendri picked: Slate drawing, even hatching over a grey wash, a stippled shadow, notes in Brand ink.
export const WASH = ['#C6D4DB', '#D3DEE4', '#E2E9ED', '#EDF1F4'];
export const TEXTURES = ['even', 'hatch', 'stipple', 'halftone', 'engrave', 'wash', 'mixed'];
let INK = PEN.ink; // the ink of the drawing being made; set per call
// For motion: every stroke carries a class and an index, so a page's CSS can draw it on in order.
// pl = an outline or detail line, pt = a tone mark, pw = a wash, ps = the shadow, nl = a note line, nr = a note ring.
let CLS = 'pl', IDX = 0;

const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const n1 = (v) => Math.round(v * 10) / 10;

function parse(d) {
  const subs = []; let cur = null;
  for (const m of d.matchAll(/([MLZ])|(-?\d*\.?\d+(?:e-?\d+)?)/gi)) {
    if (m[1]) { const c = m[1].toUpperCase(); if (c === 'M') { cur = { pts: [], closed: false, n: [] }; subs.push(cur); } else if (c === 'Z' && cur) cur.closed = true; }
    else if (cur) { cur.n.push(+m[2]); if (cur.n.length === 2) { cur.pts.push(cur.n); cur.n = []; } }
  }
  return subs.filter((s) => s.pts.length > 1);
}
const inside = (x, y, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const bbox = (subs) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const s of subs) for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x0, y0, x1, y1 }; };

// One hand stroke along a polyline: resample, then push each point sideways by slow smooth noise.
function stroke(pts, closed, R, amp, over = 0) {
  const p = closed ? [...pts, pts[0]] : pts.slice(), out = [];
  if (!closed && over) { // a pen overshoots the corner a little
    const ext = (a, b) => { const l = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; return [a[0] + ((a[0] - b[0]) / l) * over, a[1] + ((a[1] - b[1]) / l) * over]; };
    p.unshift(ext(p[0], p[1])); p.push(ext(p[p.length - 1], p[p.length - 2]));
  }
  const ph = [R() * 6.28, R() * 6.28, R() * 6.28], f = [0.011 + R() * 0.006, 0.031 + R() * 0.01, 0.07];
  let len = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const [ax, ay] = p[i], [bx, by] = p[i + 1], l = Math.hypot(bx - ax, by - ay), steps = Math.max(1, Math.ceil(l / 14));
    const nx = -(by - ay) / (l || 1), ny = (bx - ax) / (l || 1);
    for (let k = i ? 1 : 0; k <= steps; k++) {
      const t = k / steps, s = len + l * t;
      const o = amp * (0.6 * Math.sin(s * f[0] + ph[0]) + 0.3 * Math.sin(s * f[1] + ph[1]) + 0.1 * Math.sin(s * f[2] + ph[2]));
      out.push([ax + (bx - ax) * t + nx * o, ay + (by - ay) * t + ny * o]);
    }
    len += l;
  }
  return out.map((q, i) => `${i ? 'L' : 'M'}${n1(q[0])} ${n1(q[1])}`).join('');
}
const hand = (d, R, amp, over) => parse(d).map((s) => stroke(s.pts, s.closed, R, amp, over)).join('');

// Marks that fill a box; the caller clips them to the face.
function lines(bb, angle, gap, R, bow = 1.2, loose = 1) {
  const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2, r = Math.hypot(bb.x1 - bb.x0, bb.y1 - bb.y0) / 2 + 6;
  const a = (angle * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx; let d = '';
  for (let t = -r; t < r; t += gap * (1 - 0.2 * loose + R() * 0.4 * loose)) {
    const lift = R() * 0.3 * r * loose, x0 = cx + nx * t - dx * (r - lift * R()), y0 = cy + ny * t - dy * (r - lift * R()), x1 = cx + nx * t + dx * r, y1 = cy + ny * t + dy * r;
    const b = (R() - 0.5) * 2 * bow;
    d += `M${n1(x0)} ${n1(y0)}Q${n1((x0 + x1) / 2 + nx * b)} ${n1((y0 + y1) / 2 + ny * b)} ${n1(x1)} ${n1(y1)}`;
  }
  return d;
}
function dots(bb, gap, rad, R, { jitter = 1, angle = 0 } = {}) {
  const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2, r = Math.hypot(bb.x1 - bb.x0, bb.y1 - bb.y0) / 2 + gap;
  const a = (angle * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); let out = '';
  for (let u = -r; u < r; u += gap) for (let v = -r; v < r; v += gap) {
    const ju = u + (R() - 0.5) * gap * jitter, jv = v + (R() - 0.5) * gap * jitter, x = cx + ju * c - jv * s, y = cy + ju * s + jv * c;
    if (x < bb.x0 - 2 || x > bb.x1 + 2 || y < bb.y0 - 2 || y > bb.y1 + 2) continue;
    out += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(rad * (jitter ? 0.8 + R() * 0.4 : 1))}"/>`;
  }
  return out;
}
const P = (d, w, o = 1) => `<path class="${CLS}" pathLength="1" style="--i:${IDX++}" d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o < 1 ? ` opacity="${o}"` : ''}/>`;

// level 0 is the face turned furthest from the light, 3 the lightest side.
function tone(texture, level, bb, R) {
  const D = (g, r, o) => `<g fill="${INK}">${dots(bb, g, r, R, o)}</g>`;
  switch (texture) {
    // even: tidy, evenly spaced hatching, crossed on the darkest face and turned the other way on the light ones
    case 'even': return P(lines(bb, level < 2 ? 38 : -52, [5, 5, 8, 13][level], R, 0.5, 0.12), [1.1, 1.2, 1.1, 0.9][level]) + (level === 0 ? P(lines(bb, -52, 5, R, 0.5, 0.12), 1.1) : '');
    case 'hatch': return P(lines(bb, 38, [5, 7, 10, 15][level], R), 1.1) + (level === 0 ? P(lines(bb, -48, 7, R), 1) : '');
    case 'stipple': return D([4.2, 5.6, 7.5, 11][level], 1, { jitter: 1 });
    case 'halftone': return D(9, [3.3, 2.6, 1.9, 1.2][level], { jitter: 0, angle: 45 });
    case 'engrave': return P(lines(bb, 90, [3.6, 5.2, 7.5, 11][level], R, 0.5), [1.3, 1.1, 1, 0.9][level]);
    case 'wash': return `<rect x="${n1(bb.x0 - 2)}" y="${n1(bb.y0 - 2)}" width="${n1(bb.x1 - bb.x0 + 4)}" height="${n1(bb.y1 - bb.y0 + 4)}" fill="${INK}" opacity="${[0.42, 0.3, 0.2, 0.11][level]}"/>`;
    default: return level === 0 ? P(lines(bb, 38, 5.5, R), 1.1) + P(lines(bb, -48, 8, R), 1) : level === 1 ? P(lines(bb, 38, 7.5, R), 1.1) : level === 2 ? D(6.5, 1, { jitter: 1 }) : D(11, 0.9, { jitter: 1 });
  }
}

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const has = (tag, name) => new RegExp(`\\s${name}(=|\\s|/?>)`).test(tag);

// svg: an Anatomy figure. floor: optional path of the object's footprint on the ground, for a cast shadow.
export function pen(svg, { texture = 'even', seed = 7, id = 'p', floor = '', shadow: shadowKind = 'stipple', ink = PEN.ink, ramp = null, wash = WASH, part = 'all', wobble = 1, loose = texture === 'mixed' } = {}) {
  // part: 'base' leaves the lit part out, 'lit' draws only the lit part, so the two can be layered and the lit part moved.
  const LIT = /<g[^>]*data-lit[^>]*>[\s\S]*?<\/g>/g;
  if (part === 'base') svg = svg.replace(LIT, '');
  if (part === 'lit') { svg = svg.replace(/(<svg[^>]*>)[\s\S]*(<\/svg>)/, (m, a, b) => a + (m.match(LIT) || []).join('') + b); floor = ''; }
  INK = ink; CLS = 'pl'; IDX = 0;
  const R = rng(seed); let lit = [], clip = 0; const all = [];
  const fill = (d, level) => { const subs = parse(d); if (!subs.length) return ''; const c = `${id}c${clip++}`; if (ramp) INK = ramp[level]; CLS = 'pt'; const marks = tone(texture, level, bbox(subs), R); INK = ink; CLS = 'pl'; return `<clipPath id="${c}"><path d="${d}"/></clipPath><g clip-path="url(#${c})">${marks}</g>`; };
  const body = svg.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<(\/?)(g|path|circle|text)\b([^>]*)>/g, (tag, close, name) => {
    if (name === 'g') { if (close) lit.pop(); else lit.push(has(tag, 'data-lit')); return !close && /iso-dots/.test(tag) ? tag.replace('<g', `<g fill="${INK}"`) : tag; }
    if (close || name !== 'path') return tag;
    const cls = attr(tag, 'class') || '', d = attr(tag, 'd') || '', isLit = lit[lit.length - 1];
    if (/iso-halo/.test(cls)) return '';
    if (/iso-fill|iso-top/.test(cls)) return `<path d="${d}" fill="${PEN.paper}" stroke="${PEN.paper}" stroke-width="0.6"/>`;
    if (/iso-shade/.test(cls)) { const level = isLit ? 0 : +attr(tag, 'data-shade') || 0, under = wash ? wash[level] : PEN.paper; return `<path d="${d}" fill="${PEN.paper}"/><path class="pw" d="${d}" fill="${under}" stroke="${under}" stroke-width="0.6"/>` + fill(d, level); }
    if (/iso-line/.test(cls)) {
      const edge = /iso-edge/.test(cls), toneName = attr(tag, 'data-tone') || 'lo';
      const w = edge ? (isLit ? 4.2 : 2.4) : toneName === 'hi' ? 2 : toneName === 'mid' ? 1.5 : 1.1;
      if (edge) all.push(...parse(d));
      return P(hand(d, R, (edge ? 0.9 : 0.6) * wobble, edge ? 2.5 : 0), w, toneName === 'lo' || toneName === 'faint' ? 0.7 : 1) + (edge ? P(hand(d, R, 1.5 * wobble, 4), 1, 0.55) : '');
    }
    return tag;
  });
  const bb = bbox(all.length ? all : [{ pts: [[0, 0], [1, 1]] }]);
  // loose strokes around the object, like the pen finding the shape
  let extra = '';
  if (loose) for (const [x, y0, y1, k] of [[bb.x0 - 26, bb.y0 + 60, bb.y1 - 40, -18], [bb.x0 - 44, bb.y0 + 120, bb.y1 - 10, -26], [bb.x1 + 24, bb.y0 + 30, bb.y1 - 90, 18], [bb.x1 + 42, bb.y0 + 90, bb.y1 - 60, 24]])
    extra += P(`M${n1(x)} ${n1(y0)}Q${n1(x + k)} ${n1((y0 + y1) / 2)} ${n1(x + k * 0.2)} ${n1(y1)}`, 1, 0.45);
  const sil = [...svg.matchAll(/class="iso-fill" d="([^"]+)"/g)].flatMap((m) => parse(m[1]).map((q) => q.pts));
  const stippled = () => { const fp = parse(floor), fb = bbox(fp), R = rng(1); let d = ''; for (let x = fb.x0; x < fb.x1; x += 5.2) for (let y = fb.y0; y < fb.y1; y += 5.2) { const px = x + (R() - 0.5) * 5.2, py = y + (R() - 0.5) * 5.2; if (fp.some((q) => inside(px, py, q.pts)) && !sil.some((q) => inside(px, py, q))) d += `M${n1(px)} ${n1(py)}h0`; } return `<path class="ps" d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>`; };
  const shadow = floor ? shadowKind === 'stipple' ? stippled() : (() => { const c = `${id}s`; return `<clipPath id="${c}"><path d="${floor}"/></clipPath><g clip-path="url(#${c})" opacity="0.85">${shadowKind === 'stipple' ? `<g fill="${INK}">${dots(bbox(parse(floor)), 5.2, 1.1, R, { jitter: 1 })}</g>` : P(lines(bbox(parse(floor)), 8, 6, R, 0.8), 1)}</g>`; })() : '';
  return body.replace(/(<svg[^>]*>)/, `$1${shadow}${extra}`);
}

// A callout in the pen's hand: a dot on the part, a slightly wobbly leader, and the label spot.
export function leader(from, to, seed = 3, { ink = PEN.ink, width = 2.2 } = {}) {
  const R = rng(seed); INK = ink;
  return `<circle cx="${n1(from[0])}" cy="${n1(from[1])}" r="4.5" fill="${ink}"/>` + P(stroke([from, to], false, R, 1.4), width);
}

// A free hand-drawn line through points, for callouts, boxes and arrows around a figure.
export function handLine(pts, { seed = 3, amp = 1.2, ink = PEN.ink, width = 2.2, closed = false } = {}) {
  INK = ink;
  return P(stroke(pts, closed, rng(seed), amp), width);
}

// The note style Hendri picked: a curved hand-drawn line from the label to the part, ending in an open ring.
// A paper-coloured stroke under the line and a paper fill in the ring keep both readable over hatching.
// The geometry of one note line, for pages that animate it themselves: the path and where the ring sits.
export function noteLine(from, to, { seed = 3, bend = 0.14, flip = false } = {}) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]), k = len * bend * (flip ? -1 : 1);
  const mx = (from[0] + to[0]) / 2 - ((to[1] - from[1]) / len) * k, my = (from[1] + to[1]) / 2 + ((to[0] - from[0]) / len) * k, pts = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([(1 - u) ** 2 * to[0] + 2 * u * (1 - u) * mx + u * u * from[0], (1 - u) ** 2 * to[1] + 2 * u * (1 - u) * my + u * u * from[1]]); }
  return { d: stroke(pts, false, rng(seed), 0.8), ring: [n1(from[0]), n1(from[1])] };
}
export function note(from, to, { seed = 3, ink = '#4A3FE0', bend = 0.14, flip = false } = {}) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]), k = len * bend * (flip ? -1 : 1);
  const mx = (from[0] + to[0]) / 2 - ((to[1] - from[1]) / len) * k, my = (from[1] + to[1]) / 2 + ((to[0] - from[0]) / len) * k, pts = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([(1 - u) ** 2 * to[0] + 2 * u * (1 - u) * mx + u * u * from[0], (1 - u) ** 2 * to[1] + 2 * u * (1 - u) * my + u * u * from[1]]); }
  CLS = 'nl'; INK = PEN.paper; const under = P(stroke(pts, false, rng(seed), 0.8), 7);
  INK = ink; const line = P(stroke(pts, false, rng(seed), 0.8), 2.4); CLS = 'pl';
  // order matters: the halo goes under the line, so the line runs right up to the ring
  return under + `<circle cx="${n1(from[0])}" cy="${n1(from[1])}" r="11" fill="${PEN.paper}"/>` + line + `<circle class="nr" cx="${n1(from[0])}" cy="${n1(from[1])}" r="7" fill="${PEN.paper}" stroke="${ink}" stroke-width="2.4"/>`;
}

// True when two note lines would cross. Give it the same [from, to] pairs the notes use; run it before exporting.
export function notesCross(pairs) {
  const ccw = (a, b, c) => (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
  const hit = (a, b, c, d) => ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  for (let i = 0; i < pairs.length; i++) for (let j = i + 1; j < pairs.length; j++) if (hit(pairs[i][0], pairs[i][1], pairs[j][0], pairs[j][1])) return [i, j];
  return null;
}
