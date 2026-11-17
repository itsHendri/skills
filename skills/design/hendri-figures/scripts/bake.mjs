// Turns an Anatomy drawing (styled by CSS classes) into a static SVG with every style written
// on the element, in Hendri's colours. Slides and image tags show SVGs without stylesheets.
export const THEMES = {
  // line: pure Blueprint. Every face is page grey, so only the lines draw the object.
  line: { paper: '#F3F6F8', top: '#F3F6F8', shade: ['#F3F6F8', '#F3F6F8', '#F3F6F8', '#F3F6F8'], litTop: '#F3F6F8', litShade: '#F3F6F8' },
  // tone: the same lines with three brand greys on the faces and a white top.
  tone: { paper: '#F3F6F8', top: '#FFFFFF', shade: ['#C6D4DB', '#D3DEE4', '#DFE7EB', '#E9EEF1'], litTop: '#FFFFFF', litShade: '#E6E4FF' },
  // pen: the ballpoint look of the blog drawings. One blue ink, hatching instead of grey, a slight hand wobble.
  pen: {
    paper: '#F3F6F8', top: '#F3F6F8', shade: ['url(#pen-h0)', 'url(#pen-h1)', 'url(#pen-h2)', 'url(#pen-h3)'], litTop: 'url(#pen-h3)', litShade: 'url(#pen-h0)',
    ink: { hi: '#26308F', mid: '#26308F', lo: '#5A63B8', faint: '#8F96D1', lit: '#26308F' },
    weight: { hi: 2.6, mid: 1.8, lo: 1.3, faint: 1.1, lit: 5 }, pen: true,
  },
};
export const INK = { hi: '#1F262D', mid: '#40525E', lo: '#9FB0BA', faint: '#C6D4DB', lit: '#574CFF' };
// Stroke widths in px at slide scale (a figure box is 1616 by 580).
export const WEIGHT = { hi: 3, mid: 2, lo: 1.5, faint: 1.5, lit: 5 };

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const has = (tag, name) => new RegExp(`\\s${name}(=|\\s|/?>)`).test(tag);

export function bake(svg, theme = 'line') {
  const T = THEMES[theme], ink = T.ink || INK, weight = T.weight || WEIGHT, edges = [];
  let lit = [];
  const out = svg.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<(\/?)(g|path|circle|text)\b([^>]*)>/g, (tag, close, name) => {
    if (name === 'g') { if (close) lit.pop(); else lit.push(has(tag, 'data-lit')); if (!close && /iso-dots/.test(tag)) return tag.replace('<g', `<g fill="${ink.mid}"`); return tag; }
    if (close) return tag;
    const cls = attr(tag, 'class') || '', isLit = lit[lit.length - 1];
    const set = (s) => tag.replace(/\s*\/?>$/, ` ${s}${tag.trimEnd().endsWith('/>') ? '/>' : '>'}`);
    if (/iso-fill/.test(cls)) return set(`fill="${T.paper}" stroke="none"`);
    if (/iso-halo/.test(cls)) return '';
    if (/iso-shade/.test(cls)) { const f = isLit ? T.litShade : T.shade[+attr(tag, 'data-shade') || 0]; return set(`fill="${f}" stroke="${f.startsWith('url') ? T.paper : f}" stroke-width="0.6"`); }
    if (/iso-top/.test(cls)) { const f = isLit ? T.litTop : T.top; return set(`fill="${f}" stroke="${f.startsWith('url') ? T.paper : f}" stroke-width="0.6"`); }
    if (/iso-line/.test(cls)) {
      let tone = attr(tag, 'data-tone') || 'lo';
      if (isLit && /iso-edge/.test(cls)) tone = 'lit';
      const dash = has(tag, 'data-dashed') ? ' stroke-dasharray="12 10"' : has(tag, 'data-dotted') ? ' stroke-dasharray="1 8"' : '';
      const done = set(`fill="none" stroke="${ink[tone] || ink.lo}" stroke-width="${weight[tone] || 1.5}" stroke-linecap="round" stroke-linejoin="round"${dash}`);
      if (T.pen && /iso-edge/.test(cls)) edges.push(done.replace(/stroke-width="[^"]*"/, 'stroke-width="1.1"'));
      return done;
    }
    if (/iso-face-text/.test(cls)) return set(`fill="${ink.mid}" font-family="'Fragment Mono','Courier New',monospace"`);
    return tag;
  });
  if (!T.pen) return out;
  // Hatching, densest on the faces turned furthest from the light, and two wobble filters:
  // the drawing is displaced a little, and the outlines are drawn a second time, displaced differently.
  const hatch = (id, gap, angle, cross, w = 1.1) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${gap}" height="${gap}" patternTransform="rotate(${angle})"><rect width="${gap}" height="${gap}" fill="${T.paper}"/><path d="M0 ${gap / 2}H${gap}${cross ? `M${gap / 2} 0V${gap}` : ''}" stroke="${ink.hi}" stroke-width="${w}" stroke-linecap="round"/></pattern>`;
  const wobble = (id, seed, scale) => `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  const defs = `<defs>${hatch('pen-h0', 5, 38, true)}${hatch('pen-h1', 5, 38, false, 1.2)}${hatch('pen-h2', 8, -52, false)}${hatch('pen-h3', 13, -52, false, 0.9)}${wobble('pen-w1', 3, 3.5)}${wobble('pen-w2', 11, 6)}</defs>`;
  return out.replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/, (m, open, body, end) => `${open}${defs}<g filter="url(#pen-w1)">${body}</g><g filter="url(#pen-w2)" opacity="0.55">${edges.join('')}</g>${end}`);
}
