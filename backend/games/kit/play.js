/* Sidekick play patterns (kit-1).
   Ten ways to play, each one a complete, tested round: sort, row, fill, pick, build, dial, line, paint, plot, type.
   A game picks a pattern, a world and its own content, and this file turns that into the rounds the kit runs:
   the stage, the live reactions, the rule for winning, a worked solution and the known slips.
   Everything here is written against the public kit API only. See KIT.md, "Play patterns". */
(function () {
  'use strict';
  var root = typeof window !== 'undefined' ? window : globalThis;
  var S = root.Sidekick; if (!S) return;

  // ------------------------------------------------------------------ helpers
  const isArr = Array.isArray;
  const seg = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter() : null;
  const glyphs = (t) => seg ? Array.from(seg.segment(String(t)), (x) => x.segment) : Array.from(String(t));
  const PICTO = /\p{Extended_Pictographic}/u;
  const isIcon = (t) => { const g = glyphs(t); return g.length === 1 && PICTO.test(g[0]); };
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rich = (t) => esc(t).replace(/\{\s*([^{}\/]+?)\s*\/\s*([^{}\/]+?)\s*\}/g, '<span class="sk-frac"><span>$1</span><span>$2</span></span>');
  const toks = (v) => v == null ? [] : isArr(v) ? v.map(String) : (String(v).indexOf('|') >= 0 ? String(v).split('|') : String(v).split(/\s+/)).map((s) => s.trim()).filter(Boolean);
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const nice = (x) => Number(Number(x).toFixed(6));
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const fail = (kind, text) => { throw new Error('play ' + kind + ': ' + text); };
  // estimated width of a string in em
  function em(t) { let w = 0; for (const g of glyphs(String(t).replace(/[{}]/g, ''))) w += PICTO.test(g) ? 1.25 : /[MWmw@%]/.test(g) ? 0.86 : /[A-Z0-9]/.test(g) ? 0.64 : /[iljtf.,'!:;| ]/.test(g) ? 0.32 : 0.56; return w; }
  const estLines = (text, w, size) => Math.max(1, Math.ceil(em(text) * size * 1.1 / Math.max(10, w - 6)));
  // a stable shuffle for guided rounds (the same every play) and a fresh one for the last round
  function mix(list, key) {
    let a = 2166136261; for (const ch of String(key)) { a ^= ch.codePointAt(0); a = Math.imul(a, 16777619); } a >>>= 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const out = list.slice(); for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = out[i]; out[i] = out[j]; out[j] = t; } return out;
  }
  const order = (list, o, solo) => o.keep ? list : solo ? S.shuffle(list) : mix(list, (o.say || '') + list.length);

  // small pictures for tiles: a token that starts with ~ is drawn, e.g. ~pie:1/4 ~bar:2/3 ~ngon:5 ~tri:r ~quad:trap ~ang:60 ~clock:7:30 ~arr:3x4 ~dots:7
  const isFig = (t) => String(t).charAt(0) === '~';
  const FC = { line: '#054a29', fill: '#ffd45c', shade: '#f79256', pale: '#ffffff' };
  const poly = (pts, fill, more) => '<polygon points="' + pts.map((q) => Number(q[0].toFixed(1)) + ',' + Number(q[1].toFixed(1))).join(' ') + '" fill="' + (fill || FC.fill) + '" stroke="' + FC.line + '" stroke-width="4" stroke-linejoin="round" ' + (more || '') + '/>';
  const TAU = 2 * Math.PI;
  const TRI = { e: [[50, 12], [92, 86], [8, 86]], r: [[14, 14], [14, 86], [88, 86]], s: [[10, 84], [94, 84], [66, 22]], i: [[50, 8], [78, 90], [22, 90]], o: [[6, 84], [70, 84], [96, 40]], t: [[50, 30], [62, 70], [38, 70]] };
  const QUAD = { sq: [[16, 16], [84, 16], [84, 84], [16, 84]], rect: [[8, 28], [92, 28], [92, 72], [8, 72]], tall: [[30, 6], [70, 6], [70, 94], [30, 94]], rhomb: [[50, 22], [96, 50], [50, 78], [4, 50]], trap: [[30, 26], [70, 26], [94, 76], [6, 76]], para: [[28, 26], [94, 26], [72, 76], [6, 76]], kite: [[50, 6], [80, 36], [50, 94], [20, 36]], odd: [[12, 20], [80, 12], [92, 70], [30, 88]] };
  function mini(token) {
    const parts = String(token).slice(1).split(':'), name = parts[0], a = parts.slice(1); let out = '';
    const frac = (a[0] || '0/1').split('/').map(Number), n = frac[0], d = frac[1] || 1;
    if (name === 'pie') { if (d === 1) out += '<circle cx="50" cy="50" r="42" fill="' + (n ? FC.shade : FC.pale) + '" stroke="' + FC.line + '" stroke-width="4"/>'; else for (let i = 0; i < d; i++) { const a0 = -Math.PI / 2 + i * TAU / d, a1 = a0 + TAU / d; out += '<path d="M 50 50 L ' + (50 + 42 * Math.cos(a0)).toFixed(1) + ' ' + (50 + 42 * Math.sin(a0)).toFixed(1) + ' A 42 42 0 ' + (d === 1 ? 1 : 0) + ' 1 ' + (50 + 42 * Math.cos(a1)).toFixed(1) + ' ' + (50 + 42 * Math.sin(a1)).toFixed(1) + ' Z" fill="' + (i < n ? FC.shade : FC.pale) + '" stroke="' + FC.line + '" stroke-width="4" stroke-linejoin="round"/>'; } }
    else if (name === 'pieU') { out += '<circle cx="50" cy="50" r="42" fill="' + FC.pale + '" stroke="' + FC.line + '" stroke-width="4"/>'; const cuts = { 2: [[30, 13, 30, 87]], 3: [[26, 15, 26, 85], [44, 8, 44, 92]], 4: [[30, 13, 30, 87], [8, 62, 92, 62]] }[+a[0]] || [[30, 13, 30, 87]]; cuts.forEach((c) => { out += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[2] + '" y2="' + c[3] + '" stroke="' + FC.line + '" stroke-width="4"/>'; }); }
    else if (name === 'bar' || name === 'barU') { const even = name === 'bar', k = even ? d : +a[0], cuts = even ? Array.from({ length: k + 1 }, (_, i) => i / k) : ({ 2: [0, 0.3, 1], 3: [0, 0.2, 0.5, 1], 4: [0, 0.15, 0.4, 0.6, 1] }[k] || [0, 0.3, 1]); for (let i = 0; i < k; i++) out += '<rect x="' + (6 + 88 * cuts[i]).toFixed(1) + '" y="26" width="' + (88 * (cuts[i + 1] - cuts[i])).toFixed(1) + '" height="48" fill="' + ((even ? i < n : i < (+a[1] || 0)) ? FC.shade : FC.pale) + '" stroke="' + FC.line + '" stroke-width="4"/>'; }
    else if (name === 'sq4') { for (let i = 0; i < 4; i++) out += '<rect x="' + (10 + (i % 2) * 40) + '" y="' + (10 + Math.floor(i / 2) * 40) + '" width="40" height="40" fill="' + (i < n ? FC.shade : FC.pale) + '" stroke="' + FC.line + '" stroke-width="4"/>'; }
    else if (name === 'ngon') { const k = +a[0] || 5; out += poly(Array.from({ length: k }, (_, i) => { const t = -Math.PI / 2 + (k % 2 ? 0 : Math.PI / k) + i * TAU / k; return [50 + 42 * Math.cos(t), 52 + 42 * Math.sin(t)]; })); }
    else if (name === 'open') { const k = +a[0] || 3, pts = Array.from({ length: k + 1 }, (_, i) => { const t = -Math.PI / 2 + i * TAU / k; return [50 + 40 * Math.cos(t), 54 + 40 * Math.sin(t)]; }); pts[k] = [(pts[k - 1][0] + pts[0][0] * 1.2) / 2.2, (pts[k - 1][1] + pts[0][1] * 1.2) / 2.2 + 8]; out += '<polyline points="' + pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ') + '" fill="none" stroke="' + FC.line + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>'; }
    else if (name === 'curvy') out += '<path d="M 16 84 L 16 20 Q 96 20 84 84 Z" fill="' + FC.fill + '" stroke="' + FC.line + '" stroke-width="4" stroke-linejoin="round"/>';
    else if (name === 'tri') out += poly(TRI[a[0]] || TRI.e);
    else if (name === 'quad') out += poly(QUAD[a[0]] || QUAD.sq);
    else if (name === 'circle') out += '<circle cx="50" cy="50" r="' + (a[0] === 's' ? 16 : 42) + '" fill="' + FC.fill + '" stroke="' + FC.line + '" stroke-width="4"/>';
    else if (name === 'oval') out += '<ellipse cx="50" cy="50" rx="44" ry="26" fill="' + FC.fill + '" stroke="' + FC.line + '" stroke-width="4"/>';
    else if (name === 'ang') { const t = (+a[0] || 60) * Math.PI / 180, RL = a[1] === 's' ? 40 : 70; out += '<path d="M 44 78 A 26 26 0 ' + (+a[0] > 180 ? 1 : 0) + ' 0 ' + (18 + 26 * Math.cos(t)).toFixed(1) + ' ' + (78 - 26 * Math.sin(t)).toFixed(1) + '" fill="none" stroke="' + FC.shade + '" stroke-width="5"/><line x1="18" y1="78" x2="' + (18 + RL + 4) + '" y2="78" stroke="' + FC.line + '" stroke-width="5" stroke-linecap="round"/><line x1="18" y1="78" x2="' + (18 + RL * Math.cos(t)).toFixed(1) + '" y2="' + (78 - RL * Math.sin(t)).toFixed(1) + '" stroke="' + FC.line + '" stroke-width="5" stroke-linecap="round"/>'; }
    else if (name === 'clock') { const hr = +a[0] || 12, mn = +a[1] || 0, ha = ((hr % 12) + mn / 60) * Math.PI / 6, ma = mn * Math.PI / 30; out += '<circle cx="50" cy="50" r="44" fill="#fff" stroke="' + FC.line + '" stroke-width="4"/>'; for (let i = 1; i <= 12; i++) out += '<text x="' + (50 + 34 * Math.sin(i * Math.PI / 6)).toFixed(1) + '" y="' + (50 - 34 * Math.cos(i * Math.PI / 6)).toFixed(1) + '" font-size="11" font-family="Fredoka, sans-serif" font-weight="600" fill="' + FC.line + '" text-anchor="middle" dominant-baseline="central">' + i + '</text>'; out += '<line x1="50" y1="50" x2="' + (50 + 20 * Math.sin(ha)).toFixed(1) + '" y2="' + (50 - 20 * Math.cos(ha)).toFixed(1) + '" stroke="' + FC.line + '" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="' + (50 + 31 * Math.sin(ma)).toFixed(1) + '" y2="' + (50 - 31 * Math.cos(ma)).toFixed(1) + '" stroke="' + FC.shade + '" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="' + FC.line + '"/>'; }
    else if (name === 'arr') { const rc = (a[0] || '2x3').split('x').map(Number), cell = Math.min(88 / rc[1], 88 / rc[0]); for (let r = 0; r < rc[0]; r++) for (let c = 0; c < rc[1]; c++) out += '<circle cx="' + (50 + (c - (rc[1] - 1) / 2) * cell).toFixed(1) + '" cy="' + (50 + (r - (rc[0] - 1) / 2) * cell).toFixed(1) + '" r="' + (cell * 0.36).toFixed(1) + '" fill="' + FC.shade + '" stroke="' + FC.line + '" stroke-width="2.5"/>'; }
    else if (name === 'dots') { const k = +a[0] || 0; for (let i = 0; i < 10; i++) { const x = 8 + (i % 5) * 17, y = 32 + Math.floor(i / 5) * 18; out += '<rect x="' + x + '" y="' + y + '" width="17" height="18" fill="#fff" stroke="' + FC.line + '" stroke-width="2.5"/>' + (i < k ? '<circle cx="' + (x + 8.5) + '" cy="' + (y + 9) + '" r="5.6" fill="' + FC.shade + '"/>' : ''); } }
    else if (name === 'lines') { const L = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + FC.line + '" stroke-width="5" stroke-linecap="round"/>'; out += a[0] === 'par' ? L(10, 34, 90, 34) + L(10, 66, 90, 66) : a[0] === 'par2' ? L(12, 60, 70, 14) + L(30, 86, 88, 40) : a[0] === 'par3' ? L(10, 34, 90, 34) + L(34, 66, 66, 66) : a[0] === 'perp2' ? L(14, 30, 86, 70) + L(64, 14, 36, 86) + '<path d="M 60 55.6 L 55 64.6 L 46 59.6" fill="none" stroke="' + FC.shade + '" stroke-width="3"/>' : a[0] === 'x2' ? L(10, 40, 90, 52) + L(14, 84, 86, 30) : a[0] === 'perp' ? L(10, 50, 90, 50) + L(50, 10, 50, 90) + '<rect x="50" y="38" width="12" height="12" fill="none" stroke="' + FC.shade + '" stroke-width="3"/>' : L(10, 30, 90, 70) + L(12, 78, 88, 22); }
    else if (name === 'rod') { const tens = +a[0] || 0, ones = +a[1] || 0; for (let i = 0; i < tens; i++) out += '<rect x="' + (6 + i * 10) + '" y="10" width="8" height="80" fill="#b7ce63" stroke="' + FC.line + '" stroke-width="2"/>'; for (let i = 0; i < ones; i++) out += '<rect x="' + (10 + tens * 10 + Math.floor(i / 5) * 11) + '" y="' + (82 - (i % 5) * 11) + '" width="8" height="8" fill="' + FC.shade + '" stroke="' + FC.line + '" stroke-width="2"/>'; }
    else if (name === 'geo') { const kind = a[0] || 'seg', dot = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + FC.line + '"/>', arrow = (x, y, dx, dy) => '<path d="M ' + x + ' ' + y + ' l ' + (-dx * 12 - dy * 7) + ' ' + (-dy * 12 + dx * 7) + ' M ' + x + ' ' + y + ' l ' + (-dx * 12 + dy * 7) + ' ' + (-dy * 12 - dx * 7) + '" stroke="' + FC.line + '" stroke-width="5" fill="none" stroke-linecap="round"/>', u = [0.94, -0.34], x1 = 14, y1 = 66, x2 = 86, y2 = 40;
      if (kind === 'point') out += dot(50, 50); else { out += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + FC.line + '" stroke-width="5" stroke-linecap="round"/>'; if (kind === 'seg') out += dot(x1, y1) + dot(x2, y2); else if (kind === 'ray') out += dot(x1, y1) + arrow(x2, y2, u[0], u[1]); else out += arrow(x2, y2, u[0], u[1]) + arrow(x1, y1, -u[0], -u[1]); } }
    else if (name === 'poly') out += poly(String(a[0] || '').split(';').map((q) => q.split(',').map(Number)));
    else if (name === 'sym') { const shape = a[0] || 'heart', line = a[1] || 'v';
      out += shape === 'heart' ? '<path d="M 50 86 C 10 56 8 26 30 20 C 42 17 50 26 50 34 C 50 26 58 17 70 20 C 92 26 90 56 50 86 Z" fill="' + FC.fill + '" stroke="' + FC.line + '" stroke-width="4" stroke-linejoin="round"/>' : shape === 'circle' ? '<circle cx="50" cy="50" r="36" fill="' + FC.fill + '" stroke="' + FC.line + '" stroke-width="4"/>' : shape === 'tri' ? poly([[50, 14], [80, 84], [20, 84]]) : shape === 'sq' ? poly([[20, 20], [80, 20], [80, 80], [20, 80]]) : shape === 'arrow' ? poly([[50, 12], [84, 46], [62, 46], [62, 86], [38, 86], [38, 46], [16, 46]]) : shape === 'flag' ? poly([[24, 16], [84, 34], [24, 52], [24, 86], [18, 86], [18, 16]]) : poly([[14, 30], [86, 30], [86, 70], [14, 70]]);
      const ends = { v: [50, 4, 50, 96], h: [4, 50, 96, 50], d: [8, 8, 92, 92], e: [92, 8, 8, 92], o: [34, 4, 34, 96], u: [4, 38, 96, 38] }[line] || [50, 4, 50, 96];
      out += '<line x1="' + ends[0] + '" y1="' + ends[1] + '" x2="' + ends[2] + '" y2="' + ends[3] + '" stroke="' + FC.shade + '" stroke-width="5" stroke-dasharray="9 7" stroke-linecap="round"/>'; }
    else if (name === 'sqcut') { const cut = a[0] || 'v', sh = +a[1] || 0, P = { v: [[[14, 14], [50, 14], [50, 86], [14, 86]], [[50, 14], [86, 14], [86, 86], [50, 86]]], h: [[[14, 14], [86, 14], [86, 50], [14, 50]], [[14, 50], [86, 50], [86, 86], [14, 86]]], d: [[[14, 14], [86, 14], [14, 86]], [[86, 14], [86, 86], [14, 86]]], u: [[[14, 14], [36, 14], [36, 86], [14, 86]], [[36, 14], [86, 14], [86, 86], [36, 86]]], t: [[[14, 14], [38, 14], [38, 86], [14, 86]], [[38, 14], [62, 14], [62, 86], [38, 86]], [[62, 14], [86, 14], [86, 86], [62, 86]]], w: [[[14, 14], [86, 14], [86, 38], [14, 38]], [[14, 38], [86, 38], [86, 62], [14, 62]], [[14, 62], [86, 62], [86, 86], [14, 86]]], q: [[[14, 14], [50, 14], [50, 50], [14, 50]], [[50, 14], [86, 14], [86, 50], [50, 50]], [[14, 50], [50, 50], [50, 86], [14, 86]], [[50, 50], [86, 50], [86, 86], [50, 86]]], x: [[[14, 14], [86, 14], [50, 50]], [[86, 14], [86, 86], [50, 50]], [[86, 86], [14, 86], [50, 50]], [[14, 86], [14, 14], [50, 50]]] }[cut];
      (P || []).forEach((q, i) => { out += poly(q, i < sh ? FC.shade : FC.pale); }); }
    else fail('picture', 'unknown picture "' + token + '"');
    return '<div class="skp-fig"><svg viewBox="0 0 100 100">' + out + '</svg></div>';
  }

  // tiles: an emoji, a short word, a small picture or a wrapped card, chosen by what the text is
  function tileSize(t, opt) {
    opt = opt || {};
    if (isFig(t)) { mini(t); const fw = opt.figW || 15; return { type: 'fig', w: fw, h: fw }; }
    if (isIcon(t)) { const s = opt.icon || 10.5; return { type: 'icon', s: s, w: s * 1.18, h: s * 1.18 }; }
    const fs = opt.fs || 4.4, w = Math.max(9.5, em(t) * fs + 5.8);
    const fr = String(t).indexOf('{') >= 0;
    if (w <= (opt.maxW || 40)) return { type: 'text', s: fs, w: w, h: Math.max(9.5, fs * (fr ? 1.75 : 1.05) + 3) };
    const cw = opt.cardW || 44, lines = Math.max(1, Math.ceil(em(t) * 3.7 * 1.12 / (cw - 5.2)));
    return { type: 'card', w: cw, h: Math.max(9.5, lines * 4.45 + 4.4 + (fr ? Math.min(lines, String(t).split('{').length - 1) * 2.4 : 0)) };
  }
  function tile(stage, o) {
    const z = tileSize(o.t, o);
    const base = { id: o.id, x: o.x, y: o.y, drag: o.drag, tap: o.tap, kind: o.kind, value: o.value, data: Object.assign({ t: o.t }, o.data), label: String(o.t).replace(/[{}]/g, ''), z: o.z };
    let sp;
    if (z.type === 'fig') sp = stage.sprite(Object.assign(base, { html: mini(o.t), w: z.w, h: z.h }));
    else if (z.type === 'icon') sp = stage.sprite(Object.assign(base, { emoji: o.t, size: z.s }));
    else if (z.type === 'text') sp = stage.sprite(Object.assign(base, { text: o.t, size: z.s, color: o.color }));
    else { sp = stage.sprite(Object.assign(base, { html: '<div class="skp-card"><span>' + rich(o.t) + '</span></div>', w: z.w, h: z.h })); sp.el.style.height = 'auto'; }
    if (o.zone) { sp.homeZone = o.zone; sp.place(o.zone); }
    return sp;
  }
  function flowH(sizes, innerW, gap) { let x = 0, rowH = 0, total = 0; sizes.forEach((s) => { if (x > 0 && x + s.w > innerW) { total += rowH + gap; x = 0; rowH = 0; } x += s.w + gap; rowH = Math.max(rowH, s.h); }); return total + rowH; }

  // ------------------------------------------------------- pictures and views
  const C = { forest: '#054a29', lime: '#b7ce63', orange: '#f79256', sun: '#ffd45c', sky: '#6ec3f4', coral: '#ff7f6b', cream: '#fff9f0', berry: '#aa6da3', mint: '#7fd8b5', soft: '#d9e2d2', white: '#ffffff' };
  const svg = (W, H, inner) => '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>';
  const T = (x, y, s, text, more) => '<text x="' + nice(x) + '" y="' + nice(y) + '" font-size="' + s + '" font-family="Fredoka, sans-serif" font-weight="600" fill="' + C.forest + '" text-anchor="middle" dominant-baseline="central" ' + (more || '') + '>' + esc(text) + '</text>';
  const R = (x, y, w, h, fill, more) => '<rect x="' + nice(x) + '" y="' + nice(y) + '" width="' + nice(Math.max(0, w)) + '" height="' + nice(Math.max(0, h)) + '" fill="' + fill + '" ' + (more || 'stroke="' + C.forest + '" stroke-width="4"') + '/>';
  const Ln = (x1, y1, x2, y2, w, col, more) => '<line x1="' + nice(x1) + '" y1="' + nice(y1) + '" x2="' + nice(x2) + '" y2="' + nice(y2) + '" stroke="' + (col || C.forest) + '" stroke-width="' + (w || 4) + '" stroke-linecap="round" ' + (more || '') + '/>';
  const fillT = (t, v) => String(t).replace(/\{(\d):2\}/g, (m, k) => String(v[+k]).padStart(2, '0')).replace(/\{(\d|sum|prod|diff|num)\}/g, (m, k) => String(k === 'sum' ? nice(v.reduce((a, b) => a + b, 0)) : k === 'prod' ? nice(v.reduce((a, b) => a * b, 1)) : k === 'diff' ? nice(v[0] - v[1]) : k === 'num' ? v.join('') : v[+k]));
  const fracText = (x, y, n, d, s) => T(x, y - s * 0.62, s, n) + Ln(x - s * 0.6, y, x + s * 0.6, y, 4) + T(x, y + s * 0.62, s, d);
  const linear = (a, b, x) => { x = x || 'x'; const ax = a === 0 ? '' : (a === 1 ? '' : a === -1 ? '−' : String(a).replace('-', '−')) + x; return !ax ? String(b).replace('-', '−') : b === 0 ? ax : ax + (b < 0 ? ' − ' + (-b) : ' + ' + b); };

  const VIEWS = {};
  // words with the dial values dropped in: "{0} tens and {1} ones make {num}"
  VIEWS.text = { h: 17, draw: (v, c) => '<div class="skp-read">' + rich(fillT(c.text || '{0}', v)) + '</div>' };
  // rows and columns of one picture; with one value, a count laid out in rows of `per`
  VIEWS.array = { h: 40, draw(v, c, W, H) {
    const two = v.length > 1, per = c.per || 10, n = two ? v[0] * v[1] : v[0], cols = two ? v[1] : Math.min(Math.max(v[0], 1), per), rows = two ? v[0] : Math.ceil(v[0] / per);
    if (n <= 0) return svg(W, H, '');
    const cell = Math.min(W / cols, H / rows, 150), x0 = (W - cols * cell) / 2, y0 = (H - rows * cell) / 2; let out = '';
    for (let i = 0; i < n; i++) { const x = x0 + (i % cols) * cell, y = y0 + Math.floor(i / cols) * cell; out += c.square ? R(x + 2, y + 2, cell - 4, cell - 4, C[c.color] || C.sky) : T(x + cell / 2, y + cell / 2, nice(cell * 0.76), c.icon || '🟡'); }
    return svg(W, H, out);
  } };
  // one picture per dial, as many of each as the dial says: 3 red and 2 blue
  VIEWS.mix = { h: 30, draw(v, c, W, H) {
    const icons = toks(c.icons); let out = '';
    if (c.cols) { for (let i = 0; i < (c.slots || 0); i++) out += R((W - c.cols * 96) / 2 + (i % c.cols) * 96 + 4, (H - Math.ceil(c.slots / c.cols) * 96) / 2 + Math.floor(i / c.cols) * 96 + 4, 88, 88, C.white, 'rx="14" stroke="' + C.forest + '" stroke-width="3"'); }
    if (c.rows) { const most = Math.max.apply(null, v.concat([c.most || 1])), cell = Math.min(W / most, H / v.length, 96); v.forEach((n, r) => { for (let i = 0; i < n; i++) out += T(cell / 2 + i * cell + (W - most * cell) / 2, (H - v.length * cell) / 2 + (r + 0.5) * cell, nice(cell * 0.76), icons[r % icons.length]); }); return svg(W, H, out); }
    const all = []; (c.pre || []).concat(v).forEach((n, i) => { for (let k = 0; k < n; k++) all.push(icons[i % icons.length]); });
    if (!all.length) return svg(W, H, '');
    const cols = c.cols || Math.max(1, Math.min(all.length, Math.ceil(Math.sqrt(all.length * W / H)))), rows = Math.ceil(all.length / cols), cell = Math.min(W / cols, H / rows, 96);
    const rws = c.slots ? Math.ceil(c.slots / cols) : rows, cl = c.slots ? 96 : cell; all.forEach((icon, i) => { out += T((W - cols * cl) / 2 + (i % cols + 0.5) * cl, (H - rws * cl) / 2 + (Math.floor(i / cols) + 0.5) * cl, nice(cl * 0.7), icon); });
    return svg(W, H, out);
  } };
  // fraction bars: the dials set the top number and the bottom number; `ref` is a bar to compare with
  VIEWS.frac = { h: 30, draw(v, c, W, H) {
    const bars = []; if (c.ref) bars.push({ n: c.ref[0], d: c.ref[1], col: C.sky });
    bars.push({ n: v[0], d: v.length > 1 ? v[1] : c.den, col: C.orange });
    const wholes = c.wholes || Math.max.apply(null, bars.map((b) => Math.max(1, Math.ceil(b.n / Math.max(1, b.d))))), bw = (W - 170) / wholes, bh = Math.min(96, (H - 16) / bars.length - 14); let out = '';
    bars.forEach((b, k) => {
      const y = (H - bars.length * (bh + 14) + 14) / 2 + k * (bh + 14);
      for (let w = 0; w < wholes; w++) { const x = 10 + w * bw; out += R(x, y, bw - 12, bh, C.white); if (b.d >= 1 && b.d <= 30) { const pw = (bw - 12) / b.d; for (let i = 0; i < b.d; i++) out += R(x + i * pw, y, pw, bh, w * b.d + i < b.n ? b.col : C.white, 'stroke="' + C.forest + '" stroke-width="3"'); } }
      if (b.d >= 1) out += fracText(W - 78, y + bh / 2, b.n, b.d, Math.min(40, bh * 0.42));
    });
    return svg(W, H, out);
  } };
  // a tank that fills to the dial value
  VIEWS.tank = { h: 44, draw(v, c, W, H) {
    const cap = c.cap || 10, val = Math.max(0, Math.min(cap, v[0] * (c.per || 1))), tick = c.tick || (cap <= 12 ? 1 : cap / 10), x = W / 2 - 110, top = 16, hgt = H - 44; let out = '';
    out += R(x, top, 220, hgt, C.white) + R(x, top + hgt * (1 - val / cap), 220, hgt * val / cap, C[c.color] || C.sky, 'stroke="none"') + R(x, top, 220, hgt, 'none');
    for (let t = 0; t <= cap + 1e-9; t += tick) { const y = top + hgt * (1 - t / cap); out += Ln(x - 16, y, x + 10, y, 4); if (!c.bare) out += T(x - 50, y, 30, nice(t)); }
    if (c.unit) out += T(x + 290, top + hgt / 2, 32, c.unit);
    if (c.icon) out += T(x + 110, top + hgt + 2, 60, c.icon);
    return svg(W, H, out);
  } };
  // a clock face: dials are the hour and the minutes
  VIEWS.clock = { h: 46, draw(v, c, W, H) {
    const hr = v.length > 1 ? v[0] : (c.hour || 12), mn = v.length > 1 ? v[1] : v[0], cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 12; let out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + C.white + '" stroke="' + C.forest + '" stroke-width="8"/>';
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, big = i % 5 === 0; out += Ln(cx + Math.sin(a) * r * (big ? 0.9 : 0.95), cy - Math.cos(a) * r * (big ? 0.9 : 0.95), cx + Math.sin(a) * r * 0.985, cy - Math.cos(a) * r * 0.985, big ? 5 : 2); }
    for (let n = 1; n <= 12; n++) { const a = n * Math.PI / 6; out += T(cx + Math.sin(a) * r * 0.74, cy - Math.cos(a) * r * 0.74, nice(r * 0.2), n); }
    const ha = ((hr % 12) + mn / 60) * Math.PI / 6, ma = mn * Math.PI / 30;
    out += Ln(cx, cy, cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5, 13, C.forest) + Ln(cx, cy, cx + Math.sin(ma) * r * 0.82, cy - Math.cos(ma) * r * 0.82, 8, C.orange) + '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="' + C.forest + '"/>';
    return svg(W, H, out);
  } };
  // base-ten blocks: flats, rods and cubes for the hundreds, tens and ones dials
  VIEWS.tens = { h: 36, draw(v, c, W, H, live) {
    const vals = v.length === 3 ? v : v.length === 2 ? [0].concat(v) : [0, 0, v[0]]; let out = '', x = 10; const u = 15, top = 14;
    for (let i = 0; i < vals[0]; i++) { out += R(x, top, u * 10, u * 10, C.sun); for (let k = 1; k < 10; k++) out += Ln(x + k * u, top, x + k * u, top + u * 10, 1.5, C.forest) + Ln(x, top + k * u, x + u * 10, top + k * u, 1.5, C.forest); x += u * 10 + 14; }
    for (let i = 0; i < vals[1]; i++) { out += R(x, top, u, u * 10, C.lime); for (let k = 1; k < 10; k++) out += Ln(x, top + k * u, x + u, top + k * u, 1.5, C.forest); x += u + 9; }
    if (vals[1]) x += 10;
    for (let i = 0; i < vals[2]; i++) out += R(x + Math.floor(i / 5) * (u + 8), top + (i % 5) * (u + 8), u, u, C.orange);
    x += Math.ceil(vals[2] / 5) * (u + 8) + 6;
    const total = vals[0] * 100 + vals[1] * 10 + vals[2], tall = top + u * 10 + 14, wide = Math.max(tall * W / H, x + (live || c.total ? 190 : 0));
    if (live || c.total) out += T(wide - 100, top + u * 5, 64, total);
    return '<svg viewBox="0 0 ' + nice(wide) + ' ' + tall + '" preserveAspectRatio="xMinYMid meet">' + out + '</svg>';
  } };
  // an angle that opens to the dial value in degrees
  VIEWS.angle = { h: 40, draw(v, c, W, H) {
    const full = c.full || v[0] > 180, cx = W / 2, cy = full ? H / 2 : H - 34, L = Math.min(W / 2 - 60, full ? H / 2 - 20 : H - 60), a = v[0] * Math.PI / 180, ar = Math.min(70, L * 0.45);
    const ex = cx + Math.cos(a) * L, ey = cy - Math.sin(a) * L; let out = '';
    if (c.protractor) { out += '<path d="M ' + (cx - L) + ' ' + cy + ' A ' + L + ' ' + L + ' 0 0 1 ' + (cx + L) + ' ' + cy + ' Z" fill="rgba(110,195,244,.22)" stroke="' + C.forest + '" stroke-width="4"/>'; for (let t = 0; t <= 180; t += 10) { const r = t * Math.PI / 180, big = t % 30 === 0; out += Ln(cx + Math.cos(r) * L, cy - Math.sin(r) * L, cx + Math.cos(r) * (L - (big ? 22 : 12)), cy - Math.sin(r) * (L - (big ? 22 : 12)), big ? 4 : 2); if (big) { const end = t === 0 || t === 180, up = end ? 26 : 0; out += T(cx + Math.cos(r) * (L - 48), cy - Math.sin(r) * (L - 48) - up, 38, t) + (c.twoScales && !end ? T(cx + Math.cos(r) * (L - 92), cy - Math.sin(r) * (L - 92), 30, 180 - t, 'style="fill:' + C.berry + '"') : ''); } } }
    if (c.ref != null) { const b = c.ref * Math.PI / 180; out += Ln(cx, cy, cx + Math.cos(b) * L, cy - Math.sin(b) * L, 5, C.sky, 'stroke-dasharray="14 12"'); }
    if (v[0] > 0) out += '<path d="M ' + (cx + ar) + ' ' + cy + ' A ' + ar + ' ' + ar + ' 0 ' + (v[0] > 180 ? 1 : 0) + ' 0 ' + nice(cx + Math.cos(a) * ar) + ' ' + nice(cy - Math.sin(a) * ar) + '" fill="none" stroke="' + C.orange + '" stroke-width="8"/>';
    if (v[0] === 90) out += R(cx, cy - 34, 34, 34, 'none', 'stroke="' + C.orange + '" stroke-width="6"');
    out += Ln(cx, cy, cx + L, cy, 8) + Ln(cx, cy, ex, ey, 8) + '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + C.forest + '"/>';
    if (c.icon) out += T(ex, ey, 44, c.icon);
    return svg(W, H, out);
  } };
  // boxes of unit cubes: `d: [long, wide, high]` (a number, or 'x' 'y' 'z' for a dial), or `parts: [[l,w,h], ...]` side by side.
  // `solid: true` draws plain faces (for big boxes), `l: ['5 cm', '3 cm', '2 cm']` labels length, width, height, `calc: true` counts the cubes while exploring.
  VIEWS.cubes = { h: 44, draw(v, c, W, H, live) {
    const pickD = (q, i) => q === 'x' ? v[0] : q === 'y' ? v[1] : q === 'z' ? v[2] : q;
    const parts = (c.parts || [c.d ? c.d.map(pickD) : [v[0], v[1], v[2]]]).map((d) => d.map((q) => Math.max(0, Math.round(Number(q) || 0))));
    const KX = 0.5, KY = 0.36, gap = 0.7, wide = parts.reduce((a, d) => a + d[0] + KX * d[1], 0) + gap * (parts.length - 1), high = Math.max.apply(null, parts.map((d) => d[2] + KY * d[1]));
    const foot = c.l ? 44 : 14, u = Math.min(84, (W - (c.l ? 150 : 60)) / Math.max(1, wide), (H - foot - (c.calc ? 52 : 14)) / Math.max(1, high)), base = H - foot;
    const quad = (pts, fill) => '<path d="M ' + pts.map((q) => nice(q[0]) + ' ' + nice(q[1])).join(' L ') + ' Z" fill="' + fill + '" stroke="' + C.forest + '" stroke-width="' + (c.solid ? 5 : 3) + '" stroke-linejoin="round"/>';
    let out = '', x0 = (W - wide * u) / 2, total = 0;
    parts.forEach((d) => {
      const l = d[0], w = d[1], h = d[2], dx = KX * u, dy = KY * u, top = base - h * u, xr = x0 + l * u; total += l * w * h;
      if (l && w && h) {
        if (c.solid) { out += quad([[x0, base], [xr, base], [xr, top], [x0, top]], C.orange) + quad([[x0, top], [xr, top], [xr + w * dx, top - w * dy], [x0 + w * dx, top - w * dy]], C.sun) + quad([[xr, base], [xr + w * dx, base - w * dy], [xr + w * dx, top - w * dy], [xr, top]], '#e2783c'); }
        else {
          for (let i = 0; i < l; i++) for (let j = 0; j < h; j++) out += quad([[x0 + i * u, base - j * u], [x0 + (i + 1) * u, base - j * u], [x0 + (i + 1) * u, base - (j + 1) * u], [x0 + i * u, base - (j + 1) * u]], C.orange);
          for (let i = 0; i < l; i++) for (let k = 0; k < w; k++) out += quad([[x0 + i * u + k * dx, top - k * dy], [x0 + (i + 1) * u + k * dx, top - k * dy], [x0 + (i + 1) * u + (k + 1) * dx, top - (k + 1) * dy], [x0 + i * u + (k + 1) * dx, top - (k + 1) * dy]], C.sun);
          for (let k = 0; k < w; k++) for (let j = 0; j < h; j++) out += quad([[xr + k * dx, base - j * u - k * dy], [xr + (k + 1) * dx, base - j * u - (k + 1) * dy], [xr + (k + 1) * dx, base - (j + 1) * u - (k + 1) * dy], [xr + k * dx, base - (j + 1) * u - k * dy]], '#e2783c');
        }
        if (c.l && parts.length === 1) { if (c.l[0]) out += T(x0 + l * u / 2, base + 24, 30, c.l[0]); if (c.l[1]) out += T(xr + w * dx / 2 + 44, base - w * dy / 2 + 14, 30, c.l[1]); if (c.l[2]) out += T(x0 - 48, base - h * u / 2, 30, c.l[2]); }
      }
      x0 += (l + KX * w + gap) * u;
    });
    if (c.calc && live) out += T(W / 2, 26, 34, total + (total === 1 ? ' cube' : ' cubes'));
    return svg(W, H, out);
  } };
  // a bar chart: `given` bars are fixed, one more bar per dial
  VIEWS.bars = { h: 46, draw(v, c, W, H, live) {
    const bars = (c.given || []).map((g) => ({ name: String(g[0]), val: g[1], col: C.sky })).concat(v.map((val, i) => ({ name: String((c.names || [])[i] || ''), val: val, col: C.orange })));
    const cap = c.cap || Math.max.apply(null, bars.map((b) => b.val).concat([1])), tick = c.tick || (cap <= 12 ? 1 : cap <= 24 ? 2 : cap <= 60 ? 5 : cap / 10), left = 80, base = H - 66, top = 44, bw = (W - left - 20) / bars.length; let out = '';
    for (let t = 0; t <= cap + 1e-9; t += tick) { const y = base - (base - top) * t / cap; out += Ln(left, y, W - 10, y, 2, C.soft) + (c.bare ? '' : T(left - 34, y, 28, nice(t))); }
    bars.forEach((b, i) => { const hgt = (base - top) * Math.min(b.val, cap) / cap, x = left + i * bw + bw * 0.16; if (c.stack) { for (let k = 0; k < b.val; k++) out += T(x + bw * 0.34, base - (base - top) * (k + 0.5) / cap, Math.min(46, (base - top) / cap * 0.9), '✕', 'fill="' + b.col + '"'); out += T(x + bw * 0.34, base + 34, Math.min(44, bw * 0.42), b.name); return; } out += R(x, base - hgt, bw * 0.68, hgt, b.col) + T(x + bw * 0.34, base + 34, Math.min(44, bw * 0.42), b.name); if (live || c.values) out += T(x + bw * 0.34, base - hgt - 20, 28, b.val); });
    return svg(W, H, out + Ln(left, base, W - 10, base, 5) + Ln(left, base, left, top - 6, 5));
  } };
  // a balance: left pan holds a·x + b, right pan holds c·x + d, and x is the dial
  VIEWS.balance = { h: 42, draw(v, c, W, H, live) {
    const e = c.eq, x = v[0], L = e[0] * x + e[1], Rt = e[2] * x + e[3], tilt = Math.max(-11, Math.min(11, (L - Rt) * (c.gain || 2.5))), cx = W / 2, cy = 70, arm = Math.min(300, W / 2 - 90), a = tilt * Math.PI / 180;
    const lx = cx - Math.cos(a) * arm, ly = cy + Math.sin(a) * arm, rx = cx + Math.cos(a) * arm, ry = cy - Math.sin(a) * arm, pan = (px, py, text, val) => Ln(px, py, px - 70, py + 110, 3) + Ln(px, py, px + 70, py + 110, 3) + '<path d="M ' + (px - 96) + ' ' + (py + 110) + ' Q ' + px + ' ' + (py + 170) + ' ' + (px + 96) + ' ' + (py + 110) + ' Z" fill="' + C.sun + '" stroke="' + C.forest + '" stroke-width="5"/>' + T(px, py + 80, 34, text) + (live ? T(px, py + 196, 30, '= ' + nice(val)) : '');
    return svg(W, H, Ln(cx, cy, cx, H - 40, 12) + Ln(cx - 90, H - 36, cx + 90, H - 36, 14) + Ln(lx, ly, rx, ry, 10) + '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="' + C.orange + '" stroke="' + C.forest + '" stroke-width="5"/>' + pan(lx, ly, c.left || linear(e[0], e[1], c.x), L) + pan(rx, ry, c.right || linear(e[2], e[3], c.x), Rt));
  } };
  // a coordinate plane. fn: line (m, b), quad (a, h, k), abs (a, h, k), exp (a, b), points (x1, y1, x2, y2 ...)
  const FN = { line: (p, x) => p[0] * x + p[1], quad: (p, x) => p[0] * (x - p[1]) * (x - p[1]) + p[2], abs: (p, x) => p[0] * Math.abs(x - p[1]) + p[2], exp: (p, x) => p[0] * Math.pow(p[1], x), sqrt: (p, x) => x - p[1] < 0 ? NaN : p[0] * Math.sqrt(x - p[1]) + p[2], cubic: (p, x) => p[0] * Math.pow(x - p[1], 3) + p[2], sin: (p, x) => p[0] * Math.sin(p[1] * x * Math.PI / 2) + (p[2] || 0), cos: (p, x) => p[0] * Math.cos(p[1] * x * Math.PI / 2) + (p[2] || 0) };
  function plane(c, W, H) {
    const win = c.win || [-6, 6, -6, 6], side = Math.min(W, H) - 56, ox = (W - side) / 2, oy = (H - side) / 2 - 4, sx = side / (win[1] - win[0]), sy = side / (win[3] - win[2]);
    const X = (x) => ox + (x - win[0]) * sx, Y = (y) => oy + (win[3] - y) * sy, every = c.every || ((win[1] - win[0]) <= 10 ? 1 : (win[1] - win[0]) <= 24 ? 2 : (win[1] - win[0]) <= 60 ? 5 : 10); let out = R(ox, oy, side, side, C.white, 'stroke="' + C.soft + '" stroke-width="3"');
    for (let x = Math.ceil(win[0] / every) * every; x <= win[1]; x += every) out += Ln(X(x), oy, X(x), oy + side, 2, C.soft) + (x !== 0 || win[2] >= 0 ? T(X(x), Math.min(oy + side + 20, Math.max(oy, Y(0)) + 20), 22, String(x).replace('-', '−')) : '');
    for (let y = Math.ceil(win[2] / every) * every; y <= win[3]; y += every) out += Ln(ox, Y(y), ox + side, Y(y), 2, C.soft) + (y !== 0 ? T(Math.max(ox - 22, Math.min(ox + side, X(0)) - 22), Y(y), 22, String(y).replace('-', '−')) : '');
    if (win[2] <= 0 && win[3] >= 0) out += Ln(ox, Y(0), ox + side, Y(0), 5);
    if (win[0] <= 0 && win[1] >= 0) out += Ln(X(0), oy, X(0), oy + side, 5);
    return { out: out, X: X, Y: Y, win: win, ox: ox, oy: oy, side: side };
  }
  function curve(pl, fn, p, col, dash) {
    const f = FN[fn]; if (!f) return ''; let d = '', pen = false; const n = 160, w = pl.win;
    for (let i = 0; i <= n; i++) { const x = w[0] + (w[1] - w[0]) * i / n, y = f(p, x); if (!isFinite(y) || y < w[2] - 0.02 || y > w[3] + 0.02) { pen = false; continue; } d += (pen ? ' L ' : ' M ') + nice(pl.X(x)) + ' ' + nice(pl.Y(y)); pen = true; }
    return d ? '<path d="' + d + '" fill="none" stroke="' + (col || C.orange) + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" ' + (dash ? 'stroke-dasharray="14 12"' : '') + '/>' : '';
  }
  VIEWS.graph = { h: 62, w: 66, draw(v, c, W, H, live) {
    const pl = plane(c, W, H), p = (c.pre || []).concat(v), fn = c.fn || 'line'; let out = pl.out;
    (c.also || []).forEach((g) => { out += curve(pl, g[0], g.slice(1), C.sky); });
    if (c.ghost) out += curve(pl, fn, c.ghost, C.sky, true);
    if (fn === 'points') { for (let i = 0; i + 1 < p.length; i += 2) out += '<circle cx="' + nice(pl.X(p[i])) + '" cy="' + nice(pl.Y(p[i + 1])) + '" r="13" fill="' + C.orange + '" stroke="' + C.forest + '" stroke-width="5"/>'; if (c.join && p.length >= 4) out = out.replace('<circle', Ln(pl.X(p[0]), pl.Y(p[1]), pl.X(p[2]), pl.Y(p[3]), 6, C.orange) + '<circle'); }
    else out += curve(pl, fn, p);
    (c.pts || []).forEach((q) => { const hit = fn !== 'points' && FN[fn] && Math.abs(FN[fn](p, q[0]) - q[1]) < 0.02; out += T(pl.X(q[0]), pl.Y(q[1]), 40, live && hit ? '🌟' : '⭐'); if (q[2]) out += T(pl.X(q[0]) + 34, pl.Y(q[1]) - 30, 26, q[2]); });
    (c.dots || []).forEach((q) => { out += '<circle cx="' + nice(pl.X(q[0])) + '" cy="' + nice(pl.Y(q[1])) + '" r="10" fill="' + C.forest + '"/>' + (q[2] ? T(pl.X(q[0]) + 30, pl.Y(q[1]) - 28, 26, q[2]) : ''); });
    return svg(W, H, out);
  } };
  // a small table of values: rows like [['x', 1, 2, 3], ['y', 4, 8, '?']]
  VIEWS.table = { h: 22, draw(v, c) {
    return '<table class="skp-table">' + (c.rows || []).map((row, r) => '<tr>' + row.map((cell, i) => '<' + (i === 0 || c.head ? 'th' : 'td') + '>' + rich(fillT(String(cell), v)) + '</' + (i === 0 || c.head ? 'th' : 'td') + '>').join('') + '</tr>').join('') + '</table>';
  } };
  // a rectangle drawn to scale with its sides labelled: d [w, h], l ['8 cm', '3 cm'], grid shows unit squares
  VIEWS.rect = { h: 34, draw(v, c, W, H) {
    const d = c.d || [Math.max(1, v[0]), Math.max(1, v[1] || v[0])], l = c.l || [], k = Math.min((W - 260) / d[0], (H - 100 - (c.calc ? 40 : 0)) / d[1], c.unit || 999), w = d[0] * k, h = d[1] * k, x = (W - w) / 2, y = (H - h) / 2 + 8; let out = R(x, y, w, h, C[c.color] || C.lime);
    if (c.split) out += R(x + c.split * k, y, w - c.split * k, h, C.sky);
    if (c.grid) { for (let i = 1; i < d[0]; i++) out += Ln(x + i * k, y, x + i * k, y + h, 2); for (let j = 1; j < d[1]; j++) out += Ln(x, y + j * k, x + w, y + j * k, 2); }
    if (c.split) out += Ln(x + c.split * k, y - 8, x + c.split * k, y + h + 8, 7, C.orange);
    if (l[0] != null) out += T(x + w / 2, y - 26, 32, l[0]);
    if (l[1] != null) out += T(x + w + 20 + em(String(l[1])) * 16, y + h / 2, 32, l[1]);
    if (l[2] != null) out += T(x + w / 2, y + h + 26, 32, l[2]);
    if (l[3] != null) out += T(x - 20 - em(String(l[3])) * 16, y + h / 2, 32, l[3]);
    if (c.calc) out += T(W / 2, H - 22, 30, (c.calc === 'area' ? '' : 'around ' + 2 * (d[0] + d[1])) + (c.calc === true ? '   ·   ' : '') + (c.calc === 'around' ? '' : 'inside ' + d[0] * d[1]));
    return svg(W, H, out);
  } };
  // a triangle (or any polygon) with labels: pts in a 0..100 box, sides and angles labelled in order, right marks a square corner
  VIEWS.poly = { h: 40, draw(v, c, W, H) {
    const raw = c.pts || [[10, 90], [90, 90], [10, 20]], k = Math.min((W - 240) / 100, (H - 90) / 100), x0 = (W - 100 * k) / 2, y0 = (H - 100 * k) / 2, P = raw.map((p) => [x0 + p[0] * k, y0 + p[1] * k]), n = P.length;
    const cx = P.reduce((a, p) => a + p[0], 0) / n, cy = P.reduce((a, p) => a + p[1], 0) / n; let out = '<polygon points="' + P.map((p) => nice(p[0]) + ',' + nice(p[1])).join(' ') + '" fill="' + (C[c.color] || C.sun) + '" stroke="' + C.forest + '" stroke-width="6" stroke-linejoin="round"/>';
    const inside = (x, y) => { let hit = false; for (let i = 0, j = n - 1; i < n; j = i++) { if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) hit = !hit; } return hit; };
    (c.sides || []).forEach((text, i) => { if (text == null || text === '') return; const a = P[i], b = P[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; let nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len; if (inside(mx + nx * 6, my + ny * 6)) { nx = -nx; ny = -ny; } out += T(mx + nx * (24 + em(String(text)) * 10), my + ny * 30, 30, text); });
    (c.angles || []).forEach((text, i) => { if (text == null || text === '') return; const a = P[i], dx = cx - a[0], dy = cy - a[1], m = Math.hypot(dx, dy) || 1; out += T(a[0] + dx / m * 54, a[1] + dy / m * 46, 26, text); });
    (c.names || []).forEach((text, i) => { if (!text) return; const a = P[i], dx = a[0] - cx, dy = a[1] - cy, m = Math.hypot(dx, dy) || 1; out += T(a[0] + dx / m * 30, a[1] + dy / m * 30, 30, text); });
    if (c.right != null) { const a = P[c.right], b = P[(c.right + 1) % n], d = P[(c.right + n - 1) % n], u = [(b[0] - a[0]), (b[1] - a[1])], w = [(d[0] - a[0]), (d[1] - a[1])], lu = Math.hypot(u[0], u[1]), lw = Math.hypot(w[0], w[1]), s = 26; out += '<path d="M ' + nice(a[0] + u[0] / lu * s) + ' ' + nice(a[1] + u[1] / lu * s) + ' L ' + nice(a[0] + u[0] / lu * s + w[0] / lw * s) + ' ' + nice(a[1] + u[1] / lu * s + w[1] / lw * s) + ' L ' + nice(a[0] + w[0] / lw * s) + ' ' + nice(a[1] + w[1] / lw * s) + '" fill="none" stroke="' + C.forest + '" stroke-width="4"/>'; }
    return svg(W, H, out);
  } };
  // a circle with a radius, a diameter or a slice marked
  VIEWS.circle = { h: 40, draw(v, c, W, H) {
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 40; let out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (C[c.color] || C.sun) + '" stroke="' + C.forest + '" stroke-width="6"/>';
    if (c.slice != null) { const a = c.slice * Math.PI / 180; out += '<path d="M ' + cx + ' ' + cy + ' L ' + (cx + r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 ' + (c.slice > 180 ? 1 : 0) + ' 0 ' + nice(cx + Math.cos(a) * r) + ' ' + nice(cy - Math.sin(a) * r) + ' Z" fill="' + C.orange + '" stroke="' + C.forest + '" stroke-width="5"/>'; if (c.sliceLabel) out += T(cx + Math.cos(a / 2) * r * 0.5, cy - Math.sin(a / 2) * r * 0.5, 28, c.sliceLabel); }
    if (c.r != null) out += Ln(cx, cy, cx + r, cy, 6) + T(cx + r / 2, cy - 24, 30, c.r);
    if (c.d != null) out += Ln(cx - r, cy, cx + r, cy, 6) + T(cx, cy - 24, 30, c.d);
    return svg(W, H, out + '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="' + C.forest + '"/>');
  } };
  // a still number line with named points: line [min, max, step], pts [[value, 'A'] ...]
  VIEWS.numline = { h: 22, draw(v, c, W, H) {
    const ln = c.line || [0, 10, 1], n = Math.round((ln[1] - ln[0]) / (ln[2] || 1)), every = c.every || Math.max(1, Math.ceil(n / 12)), x0 = 60, w = W - 120, y = H / 2 + 6, X = (val) => x0 + (val - ln[0]) / (ln[1] - ln[0]) * w; let out = Ln(x0 - 30, y, x0 + w + 30, y, 7);
    for (let i = 0; i <= n; i++) { const val = nice(ln[0] + i * (ln[2] || 1)); out += Ln(X(val), y - (i % every ? 12 : 20), X(val), y + (i % every ? 12 : 20), 4); if (i % every === 0 && c.labels !== 'none' && (c.labels !== 'ends' || i === 0 || i === n)) out += T(X(val), y + 46, 28, String(val).replace('-', '−')); }
    (c.pts || []).forEach((p) => { out += '<circle cx="' + nice(X(p[0])) + '" cy="' + y + '" r="13" fill="' + C.orange + '" stroke="' + C.forest + '" stroke-width="5"/>' + (p[1] != null ? T(X(p[0]), y - 44, 30, p[1]) : ''); });
    (v || []).forEach((val) => { if (c.live) out += T(X(val), y - 46, 44, c.icon || '📍'); });
    return svg(W, H, out);
  } };
  // a row of pictures split into equal groups: dials are groups and how many in each
  VIEWS.groups = { h: 34, draw(v, c, W, H, live) {
    const g = Math.max(0, v[0]), each = v.length > 1 ? v[1] : (c.each || 1); if (!g) return svg(W, H, '');
    const gw = Math.min((W - (live ? 110 : 0)) / g, 260), cols = Math.ceil(Math.sqrt(Math.max(each, 1))), rows = Math.ceil(Math.max(each, 1) / cols), cell = Math.min((gw - 30) / cols, (H - 40) / rows, 80); let out = '';
    if (live) out += T(W - 58, H / 2, 44, g * each); for (let k = 0; k < g; k++) { const x = (W - (live ? 110 : 0) - g * gw) / 2 + k * gw; out += R(x + 8, 12, gw - 16, H - 24, C.white, 'rx="24" stroke="' + C.forest + '" stroke-width="4"'); for (let i = 0; i < each; i++) out += T(x + gw / 2 + ((i % cols) - (cols - 1) / 2) * cell, H / 2 + (Math.floor(i / cols) - (rows - 1) / 2) * cell, nice(cell * 0.74), c.icon || '🟡'); }
    return svg(W, H, out);
  } };

  // sticks and clay: a shape with as many sticks as the first dial, and clay balls on as many corners as the second
  VIEWS.ngon = { h: 40, draw(v, c, W, H) {
    const n = Math.max(1, v[0]), balls = v.length > 1 ? v[1] : n, cx = W / 2, cy = H / 2 + (n === 3 ? 26 : 0), r = Math.min(W, H) / 2 - 44, stick = '#b9793d'; let out = '', P = [];
    if (n === 1) P = [[cx - r, cy], [cx + r, cy]]; else if (n === 2) P = [[cx - r, cy - r * 0.5], [cx, cy + r * 0.5], [cx + r, cy - r * 0.5]];
    else P = range(n).map((i) => { const a = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n) + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
    if (n >= 3) out += '<polygon points="' + P.map((q) => nice(q[0]) + ',' + nice(q[1])).join(' ') + '" fill="' + C.sun + '" opacity=".45"/>';
    for (let i = 0; i < (n >= 3 ? n : P.length - 1); i++) { const a = P[i], b = P[(i + 1) % P.length]; out += Ln(a[0], a[1], b[0], b[1], 16, stick); }
    P.slice(0, n >= 3 ? n : P.length).forEach((q, i) => { if (i < balls) out += '<circle cx="' + nice(q[0]) + '" cy="' + nice(q[1]) + '" r="20" fill="' + C.orange + '" stroke="' + C.forest + '" stroke-width="5"/>'; });
    return svg(W, H, out);
  } };
  // an outline to fill with blocks: the dial says how many blocks are placed
  const SQ3 = 0.866, PIECES = {
    hex: range(6).map((k) => [[1, SQ3], [1 + Math.cos(k * Math.PI / 3), SQ3 + Math.sin(k * Math.PI / 3)], [1 + Math.cos((k + 1) * Math.PI / 3), SQ3 + Math.sin((k + 1) * Math.PI / 3)]]),
    rhombus: [[[0.5, 0], [0, SQ3], [1, SQ3]], [[0.5, 0], [1, SQ3], [1.5, 0]]],
    trapezoid: [[[0, SQ3], [1, SQ3], [0.5, 0]], [[0.5, 0], [1, SQ3], [1.5, 0]], [[1, SQ3], [2, SQ3], [1.5, 0]]],
    bigtri: [[[0, 2 * SQ3], [1, 2 * SQ3], [0.5, SQ3]], [[0.5, SQ3], [1, 2 * SQ3], [1.5, SQ3]], [[1, 2 * SQ3], [2, 2 * SQ3], [1.5, SQ3]], [[0.5, SQ3], [1.5, SQ3], [1, 0]]],
    square: [[[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [0, 1]]],
    rect: [[[0, 0], [1, 0], [1, 1], [0, 1]], [[1, 0], [2, 0], [2, 1], [1, 1]]],
    bigsquare: [[[0, 0], [1, 0], [1, 1], [0, 1]], [[1, 0], [2, 0], [2, 1], [1, 1]], [[0, 1], [1, 1], [1, 2], [0, 2]], [[1, 1], [2, 1], [2, 2], [1, 2]]],
  };
  VIEWS.fillshape = { h: 40, draw(v, c, W, H) {
    const gm = /^grid:(\d+)x(\d+)$/.exec(String(c.shape || '')), parts = gm ? [].concat.apply([], range(+gm[2]).map((r) => range(+gm[1]).map((q) => [[q, r], [q + 1, r], [q + 1, r + 1], [q, r + 1]]))) : (PIECES[c.shape] || PIECES.hex), all = [].concat.apply([], parts), xs = all.map((q) => q[0]), ys = all.map((q) => q[1]), x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys), bw = Math.max.apply(null, xs) - x0, bh = Math.max.apply(null, ys) - y0;
    const k = Math.min((W - 300) / bw, (H - 60) / bh), ox = (W - 150 - bw * k) / 2, oy = (H - bh * k) / 2, pt = (q) => nice(ox + (q[0] - x0) * k) + ',' + nice(oy + (q[1] - y0) * k), cols = [C.orange, C.sky, C.lime, C.berry, C.sun, C.coral], n = Math.max(0, v[0]); let out = '';
    parts.forEach((poly, i) => { out += '<polygon points="' + poly.map(pt).join(' ') + '" fill="' + (i < n ? cols[i % cols.length] : C.white) + '" stroke="' + C.forest + '" stroke-width="' + (i < n ? 5 : 3) + '" ' + (i < n ? '' : 'stroke-dasharray="10 10"') + ' stroke-linejoin="round"/>'; });
    if (n > parts.length) out += T(W - 110, H / 2, 34, '+' + (n - parts.length) + ' extra');
    return svg(W, H, out);
  } };
  // coins drawn by look: list 'p n d q', names under each, values on the coins if asked
  VIEWS.coins = { h: 28, draw(v, c, W, H) {
    const kinds = { p: [19, '#c9813f', '1¢'], n: [21.2, '#c3c9cf', '5¢'], d: [17.9, '#dfe3e7', '10¢'], q: [24.3, '#c3c9cf', '25¢'] }, list = toks(c.list), names = toks(c.names), k = Math.min((H - 70) / 24.3, (W - 60) / (list.length * 30)) , gap = (W - 60) / list.length; let out = '';
    list.forEach((code, i) => { const coin = kinds[code] || kinds.p, x = 30 + gap * (i + 0.5), y = (H - 44) / 2 + 4, r = coin[0] * k / 2; out += '<circle cx="' + nice(x) + '" cy="' + nice(y) + '" r="' + nice(r) + '" fill="' + coin[1] + '" stroke="' + C.forest + '" stroke-width="5"/><circle cx="' + nice(x) + '" cy="' + nice(y) + '" r="' + nice(r * 0.8) + '" fill="none" stroke="rgba(5,74,41,.35)" stroke-width="3"/>' + (c.values ? T(x, y, nice(r * 0.6), coin[2]) : '') + (names[i] ? T(x, H - 24, 30, names[i]) : ''); });
    return svg(W, H, out);
  } };

  // measuring with units laid end to end: an object `len` units long, and as many units as the dial (or `sizes` for a still picture)
  VIEWS.units = { h: 30, draw(v, c, W, H) {
    const len = c.len || 5, sizes = c.ruler ? [] : c.sizes || range(Math.max(0, v[0] || 0)).map(() => c.size || 1), span = Math.max(len, sizes.reduce((a, b) => a + b, 0) + (c.gaps || 0) * Math.max(0, sizes.length - 1), c.span || 0) + 0.6, u = (W - 60) / span, x0 = 30; let out = '', x = x0;
    out += R(x0, 34, len * u, 70, C[c.color] || C.sun, 'rx="18" stroke="' + C.forest + '" stroke-width="5"') + (c.icon ? T(x0 + len * u / 2, 70, 52, c.icon) : '');
    sizes.forEach((sz, i) => { out += R(x + 3, 150, sz * u - 6, 56, i % 2 ? C.sky : C.orange, 'rx="14" stroke="' + C.forest + '" stroke-width="4"'); x += sz * u + (c.gaps || 0) * u; });
    if (c.ruler) { const tick = c.tick || 0.5, top = 132; out += R(x0 - 22, top, (span - 0.2) * u + 44, 110, '#fff3c4', 'rx="10" stroke="' + C.forest + '" stroke-width="4"'); for (let t = 0; t <= span - 0.4 + 1e-9; t += tick) { const whole = near(Math.round(t), t), half = near(Math.round(t * 2), t * 2); out += Ln(x0 + t * u, top, x0 + t * u, top + (whole ? 46 : half ? 32 : 20), whole ? 4 : 3); if (whole) out += T(x0 + t * u, top + 76, 30, Math.round(t)); } if (v && v.length) out += T(x0 + v[0] * u, top - 20, 44, '🔻'); out += Ln(x0 + len * u, 30, x0 + len * u, top, 3, C.forest, 'stroke-dasharray="8 8"'); return svg(W, H, out); }
    out += Ln(x0, 120, x0, 226, 3, C.forest, 'stroke-dasharray="8 8"') + Ln(x0 + len * u, 120, x0 + len * u, 226, 3, C.forest, 'stroke-dasharray="8 8"');
    return svg(W, H, out);
  } };

  // a tape (bar) diagram: two rows of segments on one scale. A segment is a number, or 'x' for the first dial, 'y' for the second.
  VIEWS.tape = { h: 34, draw(v, c, W, H, live) {
    const val = (q) => q === 'x' ? v[0] : q === 'y' ? v[1] : q, rows = [c.top || [], c.rep ? range(Math.max(0, Math.min(14, Math.round(v[0] || 0)))).map(() => c.rep) : (c.bottom || [])], sums = rows.map((r) => r.reduce((a, q) => a + Math.max(0, val(q)), 0)), span = Math.max(c.cap || 0, sums[0], sums[1], 1), k = (W - 60) / span, names = c.names || []; let out = '';
    rows.forEach((r, ri) => { let x = 30; const y = 40 + ri * 130, cols = ri ? [C.orange, C.lime, C.berry] : [C.sky, C.sun, C.mint];
      r.forEach((q, i) => { const n = Math.max(0, val(q)), w = n * k, unknown = q === 'x' || q === 'y'; if (w <= 0) return; out += R(x, y, w, 76, unknown ? C.white : cols[i % cols.length], 'rx="10" stroke="' + C.forest + '" stroke-width="5" ' + (unknown ? 'stroke-dasharray="14 10"' : '')); const lab = String(unknown ? (live || c.show ? n : '?') : (c.hide && c.hide[ri] && c.hide[ri][i] ? '?' : n)), fz = Math.min(34, (w - 10) / (lab.length * 0.62)); if (fz >= 17) out += T(x + w / 2, y + 38, nice(fz), lab); x += w; });
      if (names[ri]) out += T(30 + em(String(names[ri])) * 13, y - 20, 26, names[ri]); });
    return svg(W, H, out);
  } };

  function drawView(stage, box, cfg, live, vals, names) {
    const view = VIEWS[cfg.type]; if (!view) fail('view', 'unknown view "' + cfg.type + '"');
    const el = stage.add('<div></div>', { x: box.x, y: box.y, w: box.w, h: box.h, z: 2 }); el.className = 'skp-view' + (cfg.type === 'text' || cfg.type === 'table' ? ' bare' : '');
    const c = names ? Object.assign({ names: names }, cfg) : cfg, W = Math.round(box.w * 10), H = Math.round(box.h * 10);
    const paint = (v) => { el.innerHTML = view.draw(v, c, W, H, live); };
    paint(vals || cfg.v || []); return paint;
  }
  const viewCfg = (v) => v == null ? null : typeof v === 'string' ? { type: v } : v;
  const viewH = (cfg) => cfg.h || (VIEWS[cfg.type] ? VIEWS[cfg.type].h : 30) + (cfg.type === 'table' ? Math.max(0, ((cfg.rows || []).length - 2) * 9) : 0);

  // the top of a round: the cast of the little world, then an optional picture, figure and note card
  function headSize(o, bare) {
    const parts = {}; let h = 0;
    const cast = bare || o.cast === '' || o.cast === false || o.kind === 'type' ? [] : toks(o.cast).filter(isIcon);
    if (o.pic != null) { const size = o.picSize || 7.5, lines = Math.max(1, Math.ceil(em(String(o.pic)) * size * 1.05 / 88)); parts.pic = { size: size, h: lines * size * 1.3 + 1 }; h += parts.pic.h + 1; }
    if (o.fig) { const cfg = viewCfg(o.fig); if (!VIEWS[cfg.type]) fail('fig', 'unknown figure "' + cfg.type + '"'); parts.fig = { cfg: cfg, h: viewH(cfg), w: cfg.w || (VIEWS[cfg.type].w || 80) }; h += parts.fig.h + 1.5; }
    if (o.q != null) { const text = String(o.q), hero = cast.length ? cast[0] : null, w = hero ? 80 : 92, size = o.qSize || (em(text) > 80 ? 3.7 : em(text) <= 9 ? 7 : 4.3), lines = estLines(text, w - 6, size); parts.q = { size: size, w: w, hero: hero, h: Math.max(hero ? 10.5 : 0, lines * size * 1.2 + 3.4) }; h += parts.q.h + 1.5; }
    else if (cast.length && !parts.pic && !parts.fig) { parts.cast = { list: cast.slice(0, 6), h: 11 }; h += 11.5; }
    return { h: h, parts: parts };
  }
  function drawHead(stage, o, head) {
    let y = 2; const p = head.parts;
    if (p.cast) { const n = p.cast.list.length; p.cast.list.forEach((icon, i) => stage.sprite({ id: i ? 'cast' + i : 'hero', emoji: icon, size: i ? 6.6 : 9, x: i ? 26 + (i - 1) * (66 / Math.max(1, n - 2)) + (n === 2 ? 33 : 0) : 9, y: y + (i ? 5.2 + (i % 2) * 1.6 : 5.6), float: !i, z: 3 })); y += 11.5; }
    if (p.pic) { stage.label({ id: 'pic', text: String(o.pic), x: 50, y: y + p.pic.h / 2, w: 94, size: p.pic.size }); y += p.pic.h + 1; }
    if (p.fig) { drawView(stage, { x: 50 - p.fig.w / 2, y: y, w: p.fig.w, h: p.fig.h }, p.fig.cfg, p.fig.cfg.live === true); y += p.fig.h + 1.5; }
    if (p.q) { if (p.q.hero) stage.sprite({ id: 'hero', emoji: p.q.hero, size: 8.6, x: 8, y: y + p.q.h / 2, float: true, z: 3 }); stage.label({ id: 'q', text: String(o.q), x: p.q.hero ? 57 : 50, y: y + p.q.h / 2, w: p.q.w, size: p.q.size, card: true }); y += p.q.h + 1.5; }
    return y;
  }
  // the hero of the world reacts to what just happened
  const cheer = (stage, good) => { const hero = stage.get('hero'); if (hero) { if (good) hero.pop(); else hero.shake(); } };

  // ---------------------------------------------------------------- patterns
  const KINDS = {};

  // SORT: drag each thing into the bin where it belongs
  KINDS.sort = function (o, solo, y0) {
    const bins = toks(o.bins), groups = (o.items || []).map(toks);
    if (bins.length < 2 || bins.length > 4 || groups.length !== bins.length) fail('sort', 'give 2 to 4 bins and one list of items for each');
    let items = []; groups.forEach((g, b) => g.forEach((t) => items.push({ t: t, b: b })));
    if (items.length < 3) fail('sort', 'give at least 3 things to sort');
    items = order(items, o, solo); items.forEach((it, i) => { it.id = 't' + (i + 1); });
    const n = bins.length, binW = (94 - 2 * (n - 1)) / n, cardW = Math.min(o.cardW || 44, binW - 4.4), opt = { cardW: cardW, maxW: Math.min(40, binW - 4), fs: o.fs, figW: o.figW };
    const sizes = items.map((it) => tileSize(it.t, opt)), beltH = flowH(sizes, 90.8, 1.6) + 4.4;
    const big = sizes.slice().sort((a, b) => b.h * b.w - a.h * a.w).slice(0, Math.ceil(items.length * (n === 2 ? 0.7 : 0.6)));
    const binH = Math.max(22, flowH(big, binW - 3.4, 1) + 4.4), yb = y0 + beltH + 8.5, binId = (b) => 'bin' + (b + 1);
    const colors = o.colors ? toks(o.colors) : ['orange', 'sky', 'lime', 'berry'];
    const place = (over) => items.map((it) => ({ drag: it.id, to: binId(over && over[it.id] != null ? over[it.id] : it.b) }));
    return {
      height: yb + binH + 3,
      setup(stage) {
        stage.zone({ id: 'belt', x: 3, y: y0, w: 94, h: beltH, look: o.look || 'cloud', label: 'Things to sort', showLabel: false, layout: 'flow', gap: 1.6, onDrop: (sp) => sp.badge(null) });
        bins.forEach((name, b) => stage.zone({ id: binId(b), x: 3 + b * (binW + 2), y: yb, w: binW, h: binH, look: o.binLook || 'tray', color: colors[b % colors.length], label: name, labelAt: 'top', layout: 'flow', gap: 1,
          onDrop: (sp) => { if (solo) return; const right = sp.data.b === b; sp.badge(right ? '✓' : '?'); if (!right) sp.shake(); cheer(stage, right); } }));
        items.forEach((it) => tile(stage, Object.assign({ id: it.id, t: it.t, zone: 'belt', drag: true, kind: 'item', data: { b: it.b } }, opt)));
      },
      ok: (stage) => items.every((it) => stage.get(it.id).zone === binId(it.b)),
      steps: () => place(),
      trap(what) {
        if (!isArr(what)) fail('sort', 'a trap is [item, bin]');
        const b = typeof what[1] === 'number' ? what[1] : bins.indexOf(String(what[1])), it = items.find((x) => x.t === String(what[0]) && x.b !== b);
        if (!it || b < 0 || b >= n) fail('sort', 'trap item "' + what[0] + '" or its bin was not found');
        return { when: (stage) => stage.get(it.id).zone === binId(b), steps: () => place({ [it.id]: b }) };
      },
    };
  };

  // ROW: build a row in the right order from tiles (spell a word, order numbers, order the steps)
  KINDS.row = function (o, solo, y0) {
    const want = toks(o.seq), extra = toks(o.extra), seqs = [want].concat((o.also || []).map(toks));
    if (want.length < 2) fail('row', 'the row needs at least 2 tiles');
    let tiles = order(want.concat(extra).map((t) => ({ t: t })), o, solo);
    if (same(tiles.map((x) => x.t).slice(0, want.length), want)) tiles.push(tiles.shift());
    tiles.forEach((x, i) => { x.id = 't' + (i + 1); });
    const trapSeq = (v) => v === 'reverse' ? want.slice().reverse() : toks(v);
    const longest = Math.max.apply(null, seqs.concat(['trap', 'trap2', 'trap3'].filter((k) => o[k] != null).map((k) => trapSeq(o[k]))).map((s) => s.length));
    const short = tiles.every((x) => isIcon(x.t) || isFig(x.t) || em(x.t) <= 2.6), opt = { fs: o.fs || (short ? 6 : 4.4), cardW: o.cardW || 88, maxW: 46, figW: o.figW };
    const sizes = tiles.map((x) => tileSize(x.t, opt)), maxW = Math.max.apply(null, sizes.map((s) => s.w)), maxH = Math.max.apply(null, sizes.map((s) => s.h));
    const nSlots = o.slots || longest, slotW = maxW + 2.4, slots = o.mode ? o.mode === 'slots' : (short && nSlots * slotW + (nSlots - 1) <= 94), labels = toks(o.labels);
    const areaH = slots ? maxH + 3.4 + (labels.length ? 6 : 0) : Math.max(14, flowH(sizes, 90.8, 1.6) + 5), bankY = y0 + areaH + 5, bankH = flowH(sizes, 90.8, 1.6) + 4.6;
    const x0 = 50 - (nSlots * slotW + (nSlots - 1)) / 2;
    const now = (stage) => { if (!slots) return stage.get('strip').sprites.map((sp) => sp.data.t); const out = range(nSlots).map((i) => { const sp = stage.get('s' + (i + 1)).sprites[0]; return sp ? sp.data.t : null; }); while (out.length && out[out.length - 1] == null) out.pop(); return out; };
    const stepsFor = (seq) => { const used = {}; return seq.map((t, i) => { const x = tiles.find((y) => y.t === t && !used[y.id]); if (!x) fail('row', 'there is no tile "' + t + '"'); used[x.id] = 1; return slots ? { drag: x.id, to: 's' + (i + 1) } : { drag: x.id, to: 'strip', at: [0.985, 0.985] }; }); };
    seqs.forEach(stepsFor);
    return {
      height: bankY + bankH + 3,
      setup(stage) {
        if (slots) range(nSlots).forEach((i) => { stage.zone({ id: 's' + (i + 1), x: x0 + i * (slotW + 1), y: y0, w: slotW, h: maxH + 3.4, look: 'slot', label: 'Place ' + (i + 1), showLabel: false, layout: 'grid', cols: 1, rows: 1, capacity: 1, swap: true }); if (labels[i]) stage.label({ text: labels[i], x: x0 + i * (slotW + 1) + slotW / 2, y: y0 + maxH + 6.6, size: 3 }); });
        else stage.zone({ id: 'strip', x: 3, y: y0, w: 94, h: areaH, look: 'slot', label: 'Build it here', showLabel: false, layout: 'flow', gap: 1.6 });
        stage.zone({ id: 'bank', x: 3, y: bankY, w: 94, h: bankH, look: o.look || 'cloud', label: 'Tiles', showLabel: false, layout: 'flow', gap: 1.6 });
        tiles.forEach((x) => tile(stage, Object.assign({ id: x.id, t: x.t, zone: 'bank', drag: true, kind: 'tile' }, opt)));
        let good = 0; if (!solo) stage.on('change', () => { let g = 0; tiles.forEach((x) => stage.get(x.id).badge(null)); if (slots) range(nSlots).forEach((i) => { const sp = stage.get('s' + (i + 1)).sprites[0]; if (sp && sp.data.t === want[i]) { sp.badge('✓'); g += 1; } }); else stage.get('strip').sprites.forEach((sp, i) => { if (sp.data.t === want[i]) { sp.badge('✓'); g += 1; } }); if (g !== good) cheer(stage, g > good); good = g; });
      },
      ok: (stage) => { const cur = now(stage); return seqs.some((s) => same(cur, s)); },
      steps: () => stepsFor(want),
      trap(what) { const seq = trapSeq(what); if (seqs.some((s) => same(s, seq))) fail('row', 'a trap cannot be the answer'); stepsFor(seq); return { when: (stage) => same(now(stage), seq), steps: () => stepsFor(seq) }; },
    };
  };

  // FILL: drag a tile into each open place (finish the sentence, match the pair, complete the equation)
  KINDS.fill = function (o, solo, y0) {
    const rows = (o.rows || []).map((r) => ({ p: String(r[0]), a: [].concat(r[1]).map(String) }));
    if (!rows.length || rows.length > 5) fail('fill', 'give 1 to 5 rows');
    let tiles = order(rows.map((r) => ({ t: r.a[0] })).concat(toks(o.extra).map((t) => ({ t: t }))), o, solo);
    if (tiles.length < 3) fail('fill', 'give at least 3 tiles so there is a real choice');
    tiles.forEach((x, i) => { x.id = 't' + (i + 1); });
    const opt = { cardW: o.cardW || 44, maxW: 44, fs: o.fs, figW: o.figW }, sizes = tiles.map((x) => tileSize(x.t, opt)), tw = Math.max.apply(null, sizes.map((s) => s.w)), th = Math.max.apply(null, sizes.map((s) => s.h));
    const n = rows.length, colW = 94 / n, slotH = th + 3.4;
    const figP = rows.some((r) => isFig(r.p)), top = figP ? 23 : 16;
    const mode = o.layout || (n >= 2 && rows.every((r) => isIcon(r.p) || isFig(r.p) || em(r.p) <= 3.4) && colW - 2 >= tw + 2.4 ? 'cols' : tw <= 27.5 ? 'side' : 'stack');
    const psize = o.pSize || 3.9, geo = []; let y = y0;
    if (mode === 'cols') { rows.forEach((r, i) => geo.push({ px: 3 + i * colW + colW / 2, py: y0 + top / 2 - 0.5, sx: 3 + i * colW + 1, sy: y0 + top, sw: colW - 2 })); y = y0 + top + slotH; }
    else rows.forEach((r) => {
      const pw = mode === 'side' ? 60 : 92, ps = /[A-Za-z0-9]/.test(r.p) ? psize : 6.4, ph = isFig(r.p) ? 15 : estLines(r.p, pw - 2, ps) * ps * 1.2 + 3.4;
      if (mode === 'side') { const rh = Math.max(ph, slotH); geo.push({ px: 3 + pw / 2, py: y + rh / 2, pw: pw, ps: ps, sx: 65, sy: y + (rh - slotH) / 2, sw: 32 }); y += rh + 2.2; }
      else { const sw = Math.min(94, tw + 5); geo.push({ px: 50, py: y + ph / 2, pw: pw, ps: ps, sx: 50 - sw / 2, sy: y + ph + 1, sw: sw }); y += ph + slotH + 3.4; }
    });
    const bankY = y + 3, bankH = flowH(sizes, 90.8, 1.6) + 4.6, at = (stage, i) => { const sp = stage.get('slot' + (i + 1)).sprites[0]; return sp ? sp.data.t : null; };
    const stepsFor = (over) => { const used = {}, out = [], take = (t) => { const x = tiles.find((q) => q.t === t && !used[q.id]); if (x) used[x.id] = 1; return x; };
      rows.forEach((r, i) => { if (over && over[i] != null) { const x = take(over[i]); if (!x) fail('fill', 'there is no tile "' + over[i] + '"'); out.push({ drag: x.id, to: 'slot' + (i + 1) }); } });
      rows.forEach((r, i) => { if (over && over[i] != null) return; const x = take(r.a[0]); if (x) out.push({ drag: x.id, to: 'slot' + (i + 1) }); });
      return out; };
    return {
      height: bankY + bankH + 3,
      setup(stage) {
        rows.forEach((r, i) => {
          const g = geo[i];
          if (mode === 'cols') { if (isFig(r.p)) stage.sprite({ id: 'p' + (i + 1), html: mini(r.p), w: 20, h: 20, x: g.px, y: g.py, label: 'picture ' + (i + 1) }); else if (isIcon(r.p)) stage.sprite({ id: 'p' + (i + 1), emoji: r.p, size: 11, x: g.px, y: g.py }); else stage.label({ id: 'p' + (i + 1), text: r.p, x: g.px, y: g.py, size: 6, card: true }); }
          else if (isFig(r.p)) stage.sprite({ id: 'p' + (i + 1), html: mini(r.p), w: 14, h: 14, x: g.px, y: g.py, label: 'picture ' + (i + 1) });
          else stage.label({ id: 'p' + (i + 1), text: r.p, x: g.px, y: g.py, w: g.pw, size: g.ps, card: true });
          stage.zone({ id: 'slot' + (i + 1), x: g.sx, y: g.sy, w: g.sw, h: slotH, look: 'slot', label: 'Place ' + (i + 1), showLabel: false, layout: 'grid', cols: 1, rows: 1, capacity: 1, swap: true });
        });
        stage.zone({ id: 'bank', x: 3, y: bankY, w: 94, h: bankH, look: o.look || 'cloud', label: 'Tiles', showLabel: false, layout: 'flow', gap: 1.6 });
        tiles.forEach((x) => tile(stage, Object.assign({ id: x.id, t: x.t, zone: 'bank', drag: true, kind: 'tile' }, opt)));
        let good = 0; stage.on('change', () => {
          let g = 0; tiles.forEach((x) => stage.get(x.id).badge(null));
          rows.forEach((r, i) => { const t = at(stage, i); if (mode !== 'cols' && r.p.indexOf('___') >= 0) stage.get('p' + (i + 1)).set(r.p.replace('___', t == null ? '___' : t)); if (!solo && t != null && r.a.indexOf(t) >= 0) { stage.get('slot' + (i + 1)).sprites[0].badge('✓'); g += 1; } });
          if (!solo && g !== good) cheer(stage, g > good); good = g;
        });
      },
      ok: (stage) => rows.every((r, i) => r.a.indexOf(at(stage, i)) >= 0),
      steps: () => stepsFor(),
      trap(what) {
        if (!isArr(what)) fail('fill', 'a trap is [row number from 0, tile]');
        const i = what[0], t = String(what[1]); if (!rows[i] || rows[i].a.indexOf(t) >= 0) fail('fill', 'trap row ' + i + ' cannot take "' + t + '"');
        stepsFor({ [i]: t });
        return { when: (stage) => at(stage, i) === t, steps: () => stepsFor({ [i]: t }) };
      },
    };
  };

  // PICK: tap every one that fits (and leave the rest)
  KINDS.pick = function (o, solo, y0) {
    const yes = toks(o.yes), no = toks(o.no);
    if (!yes.length || yes.length + no.length < 4) fail('pick', 'give at least 4 things, with at least one that fits');
    let items = order(yes.map((t) => ({ t: t, y: true })).concat(no.map((t) => ({ t: t, y: false }))), o, solo);
    items.forEach((x, i) => { x.id = 't' + (i + 1); });
    const opt = { cardW: o.cardW || (items.some((x) => em(x.t) > 30) ? 92 : 45), maxW: 44, fs: o.fs, icon: o.icon || 11, figW: o.figW }, sizes = items.map((x) => tileSize(x.t, opt));
    const fieldH = flowH(sizes, 92, 2.2) + 4, noteH = solo ? 0 : 8, byT = (t) => items.find((x) => x.t === t);
    const on = (stage, x) => !!stage.get(x.id).data.on;
    const taps = (want) => items.filter((x) => want(x)).map((x) => ({ tap: x.id }));
    return {
      height: y0 + fieldH + noteH + 3,
      setup(stage) {
        stage.zone({ id: 'field', x: 2, y: y0, w: 96, h: fieldH, look: 'ghost', label: 'Choices', showLabel: false, layout: 'flow', gap: 2.2, pad: 1 });
        const note = solo ? null : stage.label({ id: 'note', text: 'Found 0 of ' + yes.length, x: 50, y: y0 + fieldH + 4, size: 3.6, card: true });
        items.forEach((x) => tile(stage, Object.assign({ id: x.id, t: x.t, zone: 'field', kind: 'choice', data: { y: x.y },
          tap: (sp) => { sp.data.on = !sp.data.on; sp.el.classList.toggle('skp-on', sp.data.on); sp.badge(sp.data.on ? '✓' : null); if (!solo && sp.data.on) { if (!x.y) sp.shake(); cheer(stage, x.y); } if (note) note.set('Found ' + items.filter((q) => q.y && on(stage, q)).length + ' of ' + yes.length); } }, opt)));
      },
      ok: (stage) => items.every((x) => on(stage, x) === x.y),
      steps: () => taps((x) => x.y),
      trap(what) {
        const plus = [], minus = [], one = String(what), list = isArr(what) ? what.map(String) : (byT(one) || (one.charAt(0) === '-' && byT(one.slice(1)))) ? [one] : toks(what); list.forEach((w) => { const neg = w.charAt(0) === '-' && byT(w.slice(1)) && !byT(w), x = byT(neg ? w.slice(1) : w); if (!x) fail('pick', 'trap "' + w + '" is not one of the choices'); (neg ? minus : plus).push(x); });
        if (plus.some((x) => x.y) || minus.some((x) => !x.y)) fail('pick', 'a trap adds one that does not fit, or leaves out (-) one that does');
        const want = (x) => plus.indexOf(x) >= 0 || (x.y && minus.indexOf(x) < 0);
        if (!items.some(want)) fail('pick', 'the trap leaves nothing picked');
        return { when: (stage) => plus.every((x) => on(stage, x)) && (!minus.length || items.every((x) => on(stage, x) === want(x))), steps: () => taps(want) };
      },
    };
  };

  // BUILD: move pieces from the piles to make an amount
  function choose(types, stock, goal, count) {
    const idx = types.map((_, i) => i).sort((a, b) => Math.abs(types[b].v) - Math.abs(types[a].v)), pos = types.every((t) => t.v > 0), out = types.map(() => 0);
    const go = (k, left, used) => {
      if (k === idx.length) return Math.abs(left) < 1e-9 && (count == null || used === count);
      const i = idx[k], v = types[i].v; let top = stock[i]; if (pos) top = Math.min(top, Math.floor(left / v + 1e-9)); if (count != null) top = Math.min(top, count - used);
      for (let n = top; n >= 0; n--) { out[i] = n; if (go(k + 1, left - n * v, used + n)) return true; }
      out[i] = 0; return false;
    };
    return go(0, goal, 0) ? out.slice() : null;
  }
  KINDS.build = function (o, solo, y0) {
    const types = (o.pile || []).map((p) => isArr(p) ? { t: String(p[0]), v: p[1] == null ? 1 : p[1], n: p[2] || 1 } : { t: String(p), v: 1, n: 1 });
    const goals = [].concat(o.goal), names = toks(o.plates), total = types.reduce((a, t) => a + t.n, 0), P = goals.length;
    if (!types.length || types.length > 4 || total > 30 || P < 1 || P > 3 || goals.some((g) => typeof g !== 'number')) fail('build', 'give 1 to 4 piles (30 pieces at most) and 1 to 3 goals');
    const counts = o.count == null ? goals.map(() => null) : [].concat(o.count);
    const opt = { icon: total > 14 ? 8.6 : 10.5, fs: o.fs || 4.4, maxW: 30 }, sz = types.map((t) => tileSize(t.t, opt));
    const avail = 94 - 2 * (types.length - 1), share = types.map((t, i) => Math.max(sz[i].w + 6, Math.min(t.n, 7) * (sz[i].w + 1) + 4)), sumShare = share.reduce((a, b) => a + b, 0);
    const pileW = share.map((s) => sumShare > avail ? avail * s / sumShare : s), fixW = pileW.reduce((a, b) => a + b, 0) + 2 * (types.length - 1), scale = 1;
    const pileH = Math.max.apply(null, types.map((t, i) => flowH(range(t.n).map(() => sz[i]), pileW[i] * scale - 3.4, 1) + 4.4));
    const plateW = (94 - 2 * (P - 1)) / P, all = []; types.forEach((t, i) => range(t.n).forEach(() => all.push(sz[i])));
    const plateH = Math.max(20, flowH(all.slice().sort((a, b) => b.w - a.w).slice(0, Math.ceil(all.length * (P === 1 ? 0.75 : 0.6))), plateW - 3.4, 1) + 4.4), yp = y0 + pileH + 9;
    const fmt = (v) => { if (o.den) { const k = Math.round(v * o.den), neg = k < 0 ? '−' : '', w = Math.floor(Math.abs(k) / o.den), r = Math.abs(k) % o.den; return neg + ((w || !r ? w + (r ? ' ' : '') : '') + (r ? '{' + r + '/' + o.den + '}' : '')); } const t = String(nice(v)).replace('-', '−'); return o.unit ? (String(o.unit).indexOf('#') >= 0 ? String(o.unit).replace('#', t) : t + o.unit) : t; };
    const plan = (gs, cs) => { const stock = types.map((t) => t.n), next = types.map(() => 0), out = [];
      for (let j = 0; j < P; j++) { const pick = choose(types, stock, gs[j], cs[j]); if (!pick) return null; pick.forEach((k, i) => { for (let q = 0; q < k; q++) { out.push({ drag: 'p' + (i + 1) + '_' + (next[i] + 1), to: 'plate' + (j + 1) }); next[i] += 1; } stock[i] -= k; }); }
      return out; };
    const solution = plan(goals, counts); if (!solution || !solution.length) fail('build', 'the piles cannot make the goal ' + goals.join(', '));
    const sums = (stage) => range(P).map((j) => stage.get('plate' + (j + 1)).sum()), cnts = (stage) => range(P).map((j) => stage.get('plate' + (j + 1)).count);
    const hit = (stage, gs, cs) => { const s = sums(stage), c = cnts(stage); return gs.every((g, j) => near(s[j], g) && (cs[j] == null || c[j] === cs[j])); };
    return {
      height: yp + plateH + 3,
      setup(stage) {
        let x = 3 + (94 - fixW) / 2;
        types.forEach((t, i) => { const w = pileW[i] * scale; stage.zone({ id: 'pile' + (i + 1), x: x, y: y0, w: w, h: pileH, look: o.look || 'cloud', label: 'Pile ' + (i + 1), showLabel: false, layout: 'flow', gap: 1, accepts: 'k' + i }); x += w + 2 * scale;
          range(t.n).forEach((k) => { const sp = tile(stage, Object.assign({ id: 'p' + (i + 1) + '_' + (k + 1), t: t.t, zone: 'pile' + (i + 1), drag: true, kind: 'k' + i, value: t.v }, opt)); if (o.badges && isIcon(t.t)) sp.badge(fmt(t.v)); }); });
        range(P).forEach((j) => stage.zone({ id: 'plate' + (j + 1), x: 3 + j * (plateW + 2), y: yp, w: plateW, h: plateH, look: o.plateLook || 'tray', color: ['orange', 'sky', 'lime'][j], label: names[j] || (solo ? 'Goal' : fmt(0)), showLabel: !solo || !!names[j], labelAt: 'top', layout: 'flow', gap: 1 }));
        if (!solo) { const show = () => sums(stage).forEach((s, j) => stage.get('plate' + (j + 1)).setLabel((names[j] ? names[j] + ': ' : '') + (o.show === 'count' ? cnts(stage)[j] : fmt(s)))); stage.on('change', show); show(); }
      },
      ok: (stage) => hit(stage, goals, counts),
      steps: () => solution,
      trap(what) {
        const obj = what && typeof what === 'object' && !isArr(what), gs = obj ? [].concat(what.sum != null ? what.sum : goals) : [].concat(what), cs = obj && what.count != null ? [].concat(what.count) : goals.map(() => null);
        while (gs.length < P) gs.push(goals[gs.length]); while (cs.length < P) cs.push(null);
        const steps = plan(gs, cs); if (!steps || !steps.length) fail('build', 'the piles cannot make the trap ' + gs.join(', '));
        if (gs.every((g, j) => near(g, goals[j])) && cs.every((c, j) => c == null || counts[j] == null || c === counts[j]) && counts.every((c) => c == null)) fail('build', 'a trap cannot be the answer');
        return { when: (stage) => hit(stage, gs, cs), steps: () => steps };
      },
    };
  };

  // DIAL: set one to three dials and watch the picture change
  KINDS.dial = function (o, solo, y0) {
    const dials = (o.dials || []).map((d) => isArr(d) ? { label: d[0], min: d[1], max: d[2], step: d[3] || 1, start: d[4] != null ? d[4] : d[1], unit: d[5], den: d[6] } : Object.assign({ step: 1, start: d.min }, d));
    const mixed = (v, den) => { const k = Math.round(v * den), w = Math.trunc(k / den), r = Math.abs(k % den); return (k < 0 ? '−' : '') + (r ? (Math.abs(w) ? Math.abs(w) + ' ' : '') + r + '/' + den : String(Math.abs(w))); };
    const ans = [].concat(o.ans), alts = [ans].concat((o.also || []).map((a) => [].concat(a))), n = dials.length;
    if (n < 1 || n > 3 || ans.length !== n) fail('dial', 'give 1 to 3 dials and one answer for each');
    dials.forEach((d, i) => { alts.forEach((a) => { if (a[i] < d.min || a[i] > d.max || !near(Math.round((a[i] - d.min) / d.step) * d.step + d.min, a[i])) fail('dial', 'answer ' + a[i] + ' is not on dial ' + (i + 1)); }); if (Math.abs(ans[i] - d.start) / d.step > 60) fail('dial', 'answer is too many steps from the start'); });
    if (alts.some((a) => a.every((v, i) => near(v, dials[i].start)))) fail('dial', 'the dials start on the answer');
    if (dials.reduce((a, d) => a * (Math.round((d.max - d.min) / d.step) + 1), 1) < 5) fail('dial', 'the dials need at least 5 settings between them');
    const cfg = viewCfg(o.view) || { type: 'text', text: n === 1 ? '{0}' : n === 2 ? '{0}  ·  {1}' : '{0}  ·  {1}  ·  {2}' }, vh = viewH(cfg), vw = cfg.w || (VIEWS[cfg.type] && VIEWS[cfg.type].w) || 94;
    const pos = n === 1 ? [[50, 0]] : n === 2 ? [[26, 0], [74, 0]] : [[26, 0], [74, 0], [50, 1]], yd = y0 + vh + 3, rowH = 19, vals = (stage) => range(n).map((i) => stage.get('d' + (i + 1)).value);
    const eq = (cur, a) => a.every((v, i) => near(cur[i], v)), setAll = (a) => a.map((v, i) => ({ set: 'd' + (i + 1), value: v })).filter((s, i) => !near(s.value, dials[i].start));
    return {
      height: yd + (n === 3 ? 2 : 1) * rowH + 2,
      setup(stage) {
        const paint = drawView(stage, { x: 50 - vw / 2, y: y0, w: vw, h: vh }, cfg, !solo, dials.map((d) => d.start), dials.map((d) => d.label));
        dials.forEach((d, i) => { const x = pos[i][0], y = yd + pos[i][1] * rowH; if (d.label) stage.label({ text: d.label, x: x, y: y + 2.4, size: 3.2, card: true });
          stage.stepper({ id: 'd' + (i + 1), x: x, y: y + 11.6, min: d.min, max: d.max, step: d.step, value: d.start, unit: d.unit, format: (o.blind || d.blind) ? () => '↻' : d.den ? (v) => mixed(v, d.den) : d.unit ? null : (v) => String(nice(v)).replace('-', '−') }); });
        stage.on('change', () => paint(vals(stage)));
      },
      ok: (stage) => { const cur = vals(stage); return alts.some((a) => eq(cur, a)); },
      steps: () => setAll(ans),
      trap(what) { const t = [].concat(what); if (t.length !== n || alts.some((a) => eq(t, a))) fail('dial', 'a trap needs one value per dial and cannot be the answer'); const steps = setAll(t); if (!steps.length) fail('dial', 'the dials start on the trap'); return { when: (stage) => eq(vals(stage), t), steps: () => steps }; },
    };
  };

  // LINE: slide the marker along the number line
  KINDS.line = function (o, solo, y0) {
    const L = o.line || [0, 10, 1], min = L[0], max = L[1], step = L[2] || 1, count = Math.round((max - min) / step), ans = [].concat(o.ans), m = ans.length;
    const from = o.from != null ? [].concat(o.from) : ans.map(() => min), onLine = (v) => v >= min - 1e-6 && v <= max + 1e-6 && Math.abs(Math.round((v - min) / step) * step + min - v) < 1e-5;
    if (count < 3 || count > 120 || m < 1 || m > 2 || !ans.every(onLine) || !from.every(onLine)) fail('line', 'the answer must sit on a line of 3 to 120 steps');
    if (ans.every((a, i) => Math.abs(a - from[i]) < 1e-5)) fail('line', 'the marker starts on the answer');
    const kinds = String(o.fmt || '').split(':'), den = +kinds[1] || 0;
    const fmt = (v) => { if (kinds[0] === 'clock') { const t = (+kinds[1] || 12) * 60 + Math.round(v), hh = Math.floor(t / 60) % 12 || 12; return hh + ':' + String(t % 60).padStart(2, '0'); } if (kinds[0] === 'frac' || kinds[0] === 'mixed') { const k = Math.round(v * den), w = Math.trunc(k / den), r = Math.abs(k % den); if (!r) return String(w).replace('-', '−'); return kinds[0] === 'mixed' && w ? String(w).replace('-', '−') + ' {' + r + '/' + den + '}' : '{' + String(k).replace('-', '−') + '/' + den + '}'; } return (o.pre || '') + String(nice(v)).replace('-', '−') + (o.unit || ''); };
    const every = L[3] || [1, 2, 4, 5, 10, 20, 25, 50].find((e) => count / e <= (den ? 8 : 10)) || 50, icons = [o.icon || '📍', o.icon2 || '🚩'], ty = y0 + 17;
    const srt = (list) => o.pair ? list.slice().sort((a, b) => a - b) : list, cur = (stage) => range(m).map((i) => stage.get('m' + (i + 1)).value), eq = (c, a) => { const x = srt(c), y = srt(a); return y.every((v, i) => Math.abs(x[i] - v) < 1e-5); };
    const slides = (a) => a.map((v, i) => ({ slide: 'm' + (i + 1), value: v })).filter((s, i) => Math.abs(s.value - from[i]) > 1e-5);
    return {
      height: ty + 14 + (solo && !o.readout ? 0 : 9) + 3,
      setup(stage) {
        const track = stage.track({ id: 'line', x: 8, y: ty, w: 84, min: min, max: max, step: step, labelEvery: every, labels: o.labels, format: o.labels ? null : (v, i) => i % every ? '' : fmt(v) });
        (o.marks || []).forEach((mk) => { if (isIcon(String(mk[1]))) stage.sprite({ emoji: String(mk[1]), size: 6.5, x: track.at(mk[0]), y: ty - 6 }); else stage.label({ text: String(mk[1]), x: track.at(mk[0]), y: ty - 5.5, size: 3.4, card: true }); });
        range(m).forEach((i) => stage.marker({ id: 'm' + (i + 1), track: track, value: from[i], emoji: icons[i], size: 9.5, dy: -7.5, label: 'Marker ' + (i + 1) }));
        if (!solo || o.readout) { const note = stage.label({ id: 'note', text: '', x: 50, y: ty + 17, size: 4, card: true }), show = () => note.set(cur(stage).map((v, i) => icons[i] + ' ' + fmt(v)).join('     ')); stage.on('change', show); show(); }
      },
      ok: (stage) => eq(cur(stage), ans),
      steps: () => slides(ans),
      trap(what) { const t = [].concat(what); if (t.length !== m || !t.every(onLine) || eq(t, ans)) fail('line', 'a trap must be a different spot on the line'); const steps = slides(t); if (!steps.length) fail('line', 'the marker starts on the trap'); return { when: (stage) => eq(cur(stage), t), steps: () => steps }; },
    };
  };

  // PAINT: fill squares on a grid (an amount, a rectangle, or exact squares)
  KINDS.paint = function (o, solo, y0) {
    const cols = o.grid[0], rows = o.grid[1], pre = o.pre || [], key = (c) => c[0] + ',' + c[1], preSet = {}; pre.forEach((c) => { preSet[key(c)] = 1; });
    const cell = o.cell || Math.max(4.6, Math.min(9, Math.floor((90 / cols - 0.5) * 10) / 10, Math.floor((84 / rows - 0.5) * 10) / 10)), gw = cols * cell + (cols - 1) * 0.5 + 2.6, gh = rows * cell + (rows - 1) * 0.5 + 2.6;
    const free = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!preSet[c + ',' + r]) free.push([c, r]);
    const mode = o.cells ? 'cells' : o.rect ? 'rect' : 'need';
    if (mode === 'need' && (typeof o.need !== 'number' || o.need < 1 || o.need > free.length)) fail('paint', 'need must be between 1 and the open squares');
    const block = (d) => { const out = []; for (let r = 0; r < d[1]; r++) for (let c = 0; c < d[0]; c++) out.push([c, r]); return out; };
    const cellsFor = (t) => mode === 'cells' ? t : mode === 'rect' ? block(t[0] <= cols && t[1] <= rows ? t : [t[1], t[0]]) : free.slice(0, t);
    const test = (stage, t) => { const g = stage.get('g'); if (mode === 'need') return g.count - pre.length === t; if (mode === 'rect') { const b = g.rect(); return !!b && ((b.cols === t[0] && b.rows === t[1]) || (!o.strict && b.cols === t[1] && b.rows === t[0])); } return g.count - pre.length === t.length && t.every((c) => g.isOn(c[0], c[1])); };
    const target = mode === 'cells' ? o.cells : mode === 'rect' ? o.rect : o.need;
    if (mode === 'rect' && !((target[0] <= cols && target[1] <= rows) || (target[1] <= cols && target[0] <= rows))) fail('paint', 'the rectangle does not fit the grid');
    return {
      height: y0 + gh + (solo && !o.readout ? 0 : 9) + 3,
      setup(stage) {
        stage.grid({ id: 'g', x: 50, y: y0 + gh / 2, cols: cols, rows: rows, cell: cell, color: o.color || 'orange', emoji: o.icon, filled: pre, locked: pre });
        if (!solo || o.readout) { const note = stage.label({ id: 'note', text: '', x: 50, y: y0 + gh + 5, size: 4, card: true }), show = () => note.set((o.noun || 'Painted') + ': ' + (stage.get('g').count - pre.length)); stage.on('change', show); show(); }
      },
      ok: (stage) => test(stage, target),
      steps: () => [{ paint: 'g', cells: cellsFor(target) }],
      trap(what) { const cells = cellsFor(what); if (!cells.length) fail('paint', 'the trap paints nothing'); if (mode === 'need' ? what === target : mode === 'rect' ? (same(what, target) || (!o.strict && what[0] === target[1] && what[1] === target[0])) : false) fail('paint', 'a trap cannot be the answer'); return { when: (stage) => test(stage, what), steps: () => [{ paint: 'g', cells: cells }] }; },
    };
  };

  // PLOT: tap points on a coordinate grid
  KINDS.plot = function (o, solo, y0) {
    const ax = o.axes || [0, 8, 0, 8], nx = ax[1] - ax[0] + 1, ny = ax[3] - ax[2] + 1;
    if (nx < 3 || nx > 9 || ny < 3 || ny > 9) fail('plot', 'each axis can show 3 to 9 whole numbers');
    const pitch = Math.min(10, 88 / nx), left = 50 - (nx * pitch) / 2 + 2, top = y0 + 1, X = (x) => left + (x - ax[0] + 0.5) * pitch, Y = (y) => top + (ax[3] - y + 0.5) * pitch;
    const id = (p) => 'pt' + (p[0] - ax[0]) + '_' + (p[1] - ax[2]), inside = (p) => p[0] >= ax[0] && p[0] <= ax[1] && p[1] >= ax[2] && p[1] <= ax[3];
    const given = o.given || [], isGiven = (x, y) => given.some((g) => g[0] === x && g[1] === y), ans = o.ans || [], alts = [ans].concat(o.also || []);
    if (!ans.length || !ans.every((p) => inside(p) && !isGiven(p[0], p[1]))) fail('plot', 'every answer point must be on the grid and not already drawn');
    const picked = (stage) => { const out = []; for (let y = ax[2]; y <= ax[3]; y++) for (let x = ax[0]; x <= ax[1]; x++) { const sp = stage.get(id([x, y])); if (sp && sp.data.on) out.push([x, y]); } return out; };
    const match = (stage, pts) => { const cur = picked(stage); return cur.length === pts.length && pts.every((p) => cur.some((q) => q[0] === p[0] && q[1] === p[1])); };
    const gh = ny * pitch + 7;
    return {
      height: top + gh + ((solo && !o.readout) || o.quiet ? 0 : 9) + 3,
      setup(stage) {
        const W = Math.round(nx * pitch * 10), H = Math.round(ny * pitch * 10), u = pitch * 10, px = (x) => (x - ax[0] + 0.5) * u, py = (y) => (ax[3] - y + 0.5) * u; let back = R(0, 0, W, H, C.white, 'rx="26" stroke="' + C.soft + '" stroke-width="4"');
        for (let x = ax[0]; x <= ax[1]; x++) back += Ln(px(x), u * 0.3, px(x), H - u * 0.3, x === 0 ? 6 : 2, x === 0 ? C.forest : C.soft) + T(px(x), ax[2] <= 0 && ax[3] >= 0 && ax[2] !== 0 ? py(0) + 30 : H + 26, 26, String(x).replace('-', '−'));
        for (let y = ax[2]; y <= ax[3]; y++) back += Ln(u * 0.3, py(y), W - u * 0.3, py(y), y === 0 ? 6 : 2, y === 0 ? C.forest : C.soft) + (y !== 0 || ax[0] === 0 ? T(ax[0] <= 0 && ax[1] >= 0 && ax[0] !== 0 ? px(0) - 28 : -26, py(y), 26, String(y).replace('-', '−')) : '');
        (o.segs || []).forEach((s) => { back += Ln(px(s[0]), py(s[1]), px(s[2]), py(s[3]), 6, C.sky); });
        given.forEach((g) => { back += g[2] && isIcon(String(g[2])) ? T(px(g[0]), py(g[1]), nice(u * 0.8), g[2]) : '<circle cx="' + px(g[0]) + '" cy="' + py(g[1]) + '" r="16" fill="' + C.sky + '" stroke="' + C.forest + '" stroke-width="5"/>' + (g[2] ? T(px(g[0]) + 34, py(g[1]) - 32, 28, g[2]) : ''); });
        const el = stage.add('<div></div>', { x: left, y: top, w: nx * pitch, h: ny * pitch, z: 1 }); el.style.pointerEvents = 'none'; el.style.overflow = 'visible';
        const draw = () => { const cur = picked(stage); let over = ''; if (o.join && cur.length >= 2) { const s = o.join === 'path' ? cur : cur.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); for (let i = 0; i + 1 < s.length; i++) over += Ln(px(s[i][0]), py(s[i][1]), px(s[i + 1][0]), py(s[i + 1][1]), 7, C.orange); if (o.join === 'shape' && s.length > 2) over += Ln(px(s[s.length - 1][0]), py(s[s.length - 1][1]), px(s[0][0]), py(s[0][1]), 7, C.orange); } el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:100%;display:block;overflow:visible">' + back + over + '</svg>'; };
        const note = (solo && !o.readout) || o.quiet ? null : stage.label({ id: 'note', text: 'Tap a point', x: 50, y: top + gh + 5, size: 3.8, card: true });
        for (let y = ax[2]; y <= ax[3]; y++) for (let x = ax[0]; x <= ax[1]; x++) { if (isGiven(x, y)) continue;
          stage.sprite({ id: id([x, y]), html: '<div class="skp-dot"></div>', w: pitch, h: pitch, x: X(x), y: Y(y), label: 'Point ' + x + ', ' + y, z: 6,
            tap: (sp) => { sp.data.on = !sp.data.on; sp.el.classList.toggle('skp-on', sp.data.on); draw(); if (note) { const cur = picked(stage); note.set(cur.length ? cur.map((p) => '(' + String(p[0]).replace('-', '−') + ', ' + String(p[1]).replace('-', '−') + ')').join('  ') : 'Tap a point'); } } }); }
        draw();
      },
      ok: (stage) => alts.some((a) => match(stage, a)),
      steps: () => ans.map((p) => ({ tap: id(p) })),
      trap(what) { if (!isArr(what) || !what.length || !what.every((p) => isArr(p) && inside(p) && !isGiven(p[0], p[1]))) fail('plot', 'a trap is a list of points on the grid'); if (alts.some((a) => what.length === a.length && what.every((p) => a.some((q) => q[0] === p[0] && q[1] === p[1])))) fail('plot', 'a trap cannot be the answer'); return { when: (stage) => match(stage, what), steps: () => what.map((p) => ({ tap: id(p) })) }; },
    };
  };

  // TYPE: key in a number and send it
  KINDS.type = function (o, solo, y0) {
    const ans = String(o.ans), also = [ans].concat((o.also || []).map(String)), all = also.concat(['trap', 'trap2', 'trap3'].filter((k) => o[k] != null).map((k) => String(o[k])));
    const keys = all.some((t) => t.indexOf('/') >= 0) ? 'fraction' : all.some((t) => t.indexOf('.') >= 0) ? 'decimal' : null, maxLength = o.maxLength || (keys ? 7 : 6);
    const num = (t) => { const p = String(t).split('/'); return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(t); };
    all.forEach((t) => { if (!/^[0-9./]+$/.test(t) || t.length > maxLength || !isFinite(num(t))) fail('type', '"' + t + '" cannot be typed on the keypad'); });
    const cfg = viewCfg(o.view), vh = cfg ? viewH(cfg) : 0, is = (stage, t) => { const kp = stage.get('k'); if (!kp.value) return false; return o.exact ? kp.value === String(t) : near(kp.number, num(t)); };
    return {
      height: y0 + Math.max(60, vh) + 3,
      setup(stage) {
        const kp = stage.keypad({ id: 'k', x: cfg ? 79 : 50, y: y0 + 30, keys: keys, prefix: o.pre, suffix: o.unit, maxLength: maxLength, label: 'Number pad' });
        if (cfg) { const paint = drawView(stage, { x: 2, y: y0 + Math.max(0, (60 - vh) / 2), w: 56, h: vh }, cfg, !solo, [0]); stage.on('change', () => paint([isFinite(kp.number) ? kp.number : 0])); }
        else if (o.icon !== '') { stage.sprite({ id: 'pal', emoji: o.icon || '🤖', size: 15, x: 13, y: y0 + 30, float: true }); stage.sprite({ id: 'pal2', emoji: o.icon2 || '✨', size: 9, x: 88, y: y0 + 14 }); }
      },
      ok: (stage) => also.some((t) => is(stage, t)),
      steps: () => [{ type: 'k', text: ans }],
      trap(what) { const t = String(what); if (also.some((a) => o.exact ? a === t : near(num(a), num(t)))) fail('type', 'a trap cannot be the answer'); return { when: (stage) => is(stage, t), steps: () => [{ type: 'k', text: t }] }; },
      onWin(stage) { const pal = stage.get('pal'); if (pal) pal.spin(); },
    };
  };

  // ------------------------------------------------------------- the builder
  const GAME_KEYS = ['title', 'emoji', 'premise', 'outro', 'rounds', 'finale'];
  function makeRound(o, phase, index) {
    const solo = phase === 'solo', make = KINDS[o.kind];
    if (!make) fail('game', 'unknown kind "' + o.kind + '"');
    let head = headSize(o), p = make(o, solo, 2 + head.h); const mistakes = [];
    if (p.height > 130.5 && (head.parts.cast || (head.parts.q && head.parts.q.hero))) { head = headSize(o, true); p = make(o, solo, 2 + head.h); }
    if (p.height > 130.5) fail(o.kind, 'this round is too tall for the stage (' + Math.round(p.height) + ' of 130). Use fewer or shorter pieces.');
    ['', '2', '3'].forEach((n) => {
      const what = o['trap' + n]; if (what == null) return;
      const m = p.trap(what), tag = String(o['tag' + n] || (o.tag || 'mix_up') + (n ? '_' + n : ''));
      mistakes.push({ tag: tag, when: (stage) => !p.ok(stage) && m.when(stage), steps: m.steps, say: String(o['why' + n] || [].concat(o.hints || o.hint || [])[0] || 'Not yet. Look again and try something different.') });
    });
    const round = { id: String(o.id || (solo ? 'your-turn' : 'explore-' + (index + 1))), phase: phase, say: String(o.say || ''), action: o.action || 'Check', scene: o.scene, height: Math.max(40, Math.ceil(p.height)),
      setup(stage, sk) { drawHead(stage, o, head); p.setup(stage, sk); },
      check(stage) { if (p.ok(stage)) return true; for (const m of mistakes) if (m.when(stage)) return { ok: false, mistake: m.tag }; return false; },
      solution: (stage) => p.steps(stage), mistakes: mistakes };
    if (!solo) { round.hints = [].concat(o.hints || o.hint || []).map(String).slice(0, 3); if (!round.hints.length) fail('game', 'a guided round needs a hint'); round.win = String(o.win || 'You got it!'); }
    else if (o.win) round.win = String(o.win);
    round.onWin = (stage, sk) => { const hero = stage.get('hero'); if (hero) hero.spin(); if (p.onWin) p.onWin(stage, sk); };
    return round;
  }
  // Sidekick.play(spec) turns a short description into a whole game for Sidekick.game().
  function play(spec) {
    if (!spec || !isArr(spec.rounds) || spec.rounds.length < 3 || spec.rounds.length > 6) fail('game', 'a game has 3 to 6 rounds');
    const shared = {}; Object.keys(spec).forEach((k) => { if (GAME_KEYS.indexOf(k) < 0) shared[k] = spec[k]; });
    if (shared.cast == null && spec.emoji && isIcon(spec.emoji)) shared.cast = spec.emoji;
    const last = spec.rounds.length - 1;
    return { title: spec.title, emoji: spec.emoji, premise: spec.premise, outro: spec.outro, finaleEmoji: spec.finale,
      rounds: spec.rounds.map((r, i) => { let o = Object.assign({}, shared, r); if (isArr(o.alt)) { o = Object.assign(o, S.pick(o.alt)); } delete o.alt; return makeRound(o, i === last ? 'solo' : 'guided', i); }) };
  }
  // One pattern round for a hand-written game: Sidekick.play.round({ kind: 'sort', phase: 'guided', ... })
  play.round = (o) => makeRound(o, o.phase === 'solo' ? 'solo' : 'guided', o.index || 0);
  play.kinds = Object.keys(KINDS); play.views = Object.keys(VIEWS);
  S.play = play;
})();
