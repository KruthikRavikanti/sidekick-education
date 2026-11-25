/* Sidekick game kit (kit-1).
 *
 * This file runs only inside the locked game frame. A generated game is plain
 * JavaScript that calls Sidekick.game({...}); the kit supplies the brand, the
 * stage, dragging, the round flow, hints, scoring and the report back to the app.
 * The same hooks the kit exposes on window.__SK are what the robot player drives.
 */
(function () {
  'use strict';
  var KIT = 'kit-1';
  var INIT = window.__SK_INIT || {};
  var root = document.getElementById('sk-root');
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var PALETTE = { forest: '#054a29', lime: '#b7ce63', orange: '#f79256', berry: '#aa6da3', cream: '#fff9f0', night: '#1c1b22',
    sky: '#6ec3f4', sun: '#ffd45c', coral: '#ff7f6b', mint: '#7fd8b5', grape: '#8a6fe8', sand: '#f4dfb5', white: '#ffffff',
    leaf: '#58b368', border: '#e8e4d4', muted: '#5c7060' };
  var SCENES = ['meadow', 'sky', 'kitchen', 'ocean', 'space', 'night', 'desk', 'candy', 'sand', 'forest', 'city', 'paper', 'snow', 'field'];

  // ------------------------------------------------------------ small helpers
  function post(type, data) {
    var message = { sidekick: KIT, type: type };
    for (var key in data || {}) message[key] = data[key];
    try { window.parent.postMessage(message, '*'); } catch (_) { /* no parent in tests */ }
  }
  function h(tag, cls, text) { var el = document.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; }
  function esc(text) { return String(text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // Kid-facing text is escaped. {3/4} becomes a stacked fraction.
  function rich(text) {
    return esc(text == null ? '' : text)
      .replace(/\{\s*([^{}\/]{1,12}?)\s*\/\s*([^{}\/]{1,12}?)\s*\}/g, '<span class="sk-frac"><span>$1</span><span>$2</span></span>')
      .replace(/\n/g, '<br>');
  }
  function plain(text) { return String(text == null ? '' : text).replace(/\{\s*([^{}\/]+?)\s*\/\s*([^{}\/]+?)\s*\}/g, '$1/$2'); }
  function color(name) { return PALETTE[name] || name; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hash(text) { var x = 2166136261; for (var i = 0; i < text.length; i++) { x ^= text.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  // ------------------------------------------------------------------- stage
  function Stage(game) {
    this.game = game; this.H = 70; this.locked = false;
    this.sprites = {}; this.zones = {}; this.widgets = {}; this.handles = {}; this.tracks = {};
    this.listeners = []; this.timers = []; this.picked = null; this.counter = 0; this.dirty = false;
    var el = this.el = h('div', 'sk-stage');
    el.setAttribute('role', 'application'); el.setAttribute('aria-label', 'Game stage');
    var st = this;
    el.addEventListener('click', function (event) { if (event.target === el && st.picked) st._release(st.picked); });
    this.size(70);
  }
  Stage.prototype._auto = function (prefix) { this.counter += 1; return prefix + this.counter; };
  Stage.prototype.size = function (height) { this.H = clamp(Number(height) || 70, 40, 130); this.el.style.aspectRatio = '100 / ' + this.H; return this; };
  Stage.prototype.scene = function (name) {
    var el = this.el; SCENES.forEach(function (s) { el.classList.remove('sk-scene-' + s); });
    if (SCENES.indexOf(name) >= 0) el.classList.add('sk-scene-' + name); else if (name) el.style.background = String(name);
    return this;
  };
  Stage.prototype.unit = function () { return this.el.getBoundingClientRect().width / 100 || 1; };
  Stage.prototype.toUnits = function (clientX, clientY) { var r = this.el.getBoundingClientRect(), u = r.width / 100 || 1; return { x: (clientX - r.left) / u, y: (clientY - r.top) / u }; };
  Stage.prototype.toClient = function (x, y) { var r = this.el.getBoundingClientRect(), u = r.width / 100 || 1; return { x: r.left + x * u, y: r.top + y * u }; };
  Stage.prototype.on = function (name, fn) { if (name === 'change' && typeof fn === 'function') this.listeners.push(fn); return this; };
  Stage.prototype.changed = function () {
    this.dirty = true;
    if (this.notifying) return;
    this.notifying = true;
    try { for (var i = 0; i < this.listeners.length; i++) this.listeners[i](this); }
    catch (error) { this.notifying = false; this.game.fail(error); return; }
    this.notifying = false;
    this.game.onChange();
  };
  Stage.prototype.get = function (id) { return this.sprites[id] || this.zones[id] || this.widgets[id] || this.tracks[id] || null; };
  Stage.prototype.all = function (kind) { var out = []; for (var id in this.sprites) if (!kind || this.sprites[id].kind === kind) out.push(this.sprites[id]); return out; };
  Stage.prototype.lock = function (value) { this.locked = value !== false; if (this.locked && this.picked) this._pick(null); return this; };
  Stage.prototype.after = function (ms, fn) { var st = this; var t = setTimeout(function () { try { fn(); } catch (error) { st.game.fail(error); } }, reduced ? Math.min(ms, 60) : ms); this.timers.push(function () { clearTimeout(t); }); return t; };
  Stage.prototype.every = function (ms, fn) { var st = this; var t = setInterval(function () { try { fn(); } catch (error) { st.game.fail(error); } }, Math.max(100, ms)); this.timers.push(function () { clearInterval(t); }); return t; };
  Stage.prototype.destroy = function () { this.timers.forEach(function (stop) { stop(); }); this.timers = []; this.listeners = []; if (this.el.parentNode) this.el.parentNode.removeChild(this.el); };
  Stage.prototype.handle = function (id, el, kind, ref) { el.setAttribute('data-sk-id', id); this.handles[id] = { id: id, el: el, kind: kind || 'tap', ref: ref || null }; return el; };
  // Any custom element (SVG, canvas, HTML) can join the stage. Give it an id and onTap to make it playable and testable.
  Stage.prototype.add = function (el, opts) {
    opts = opts || {}; var st = this;
    if (typeof el === 'string') { var box = h('div'); box.innerHTML = el; el = box; }
    el.style.position = 'absolute';
    if (opts.x != null) { el.style.left = 'calc(' + opts.x + ' * 1cqw)'; el.style.top = 'calc(' + (opts.y || 0) + ' * 1cqw)'; }
    if (opts.w != null) el.style.width = 'calc(' + opts.w + ' * 1cqw)';
    if (opts.h != null) el.style.height = 'calc(' + opts.h + ' * 1cqw)';
    el.style.zIndex = opts.z != null ? opts.z : 1;
    if (opts.id && typeof opts.onTap === 'function') {
      el.setAttribute('role', 'button'); el.tabIndex = 0; el.style.cursor = 'pointer';
      if (opts.label) el.setAttribute('aria-label', plain(opts.label));
      var fire = function () { if (st.locked) return; try { opts.onTap(st.game.sk); } catch (error) { st.game.fail(error); } };
      el.addEventListener('click', fire);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
      this.handle(opts.id, el, 'tap');
    } else if (opts.id) el.setAttribute('data-sk-id', opts.id);
    this.el.appendChild(el); return el;
  };
  // A plain coloured block for scenery, bars and fill levels. set({x, y, w, h, color}) animates.
  Stage.prototype.block = function (o) {
    o = o || {}; var el = h('div'), st = this, state = { x: o.x || 0, y: o.y || 0, w: o.w != null ? o.w : 10, h: o.h != null ? o.h : 10 };
    el.style.cssText = 'pointer-events:none;transition:left .35s ease,top .35s ease,width .35s ease,height .35s ease,background .25s,opacity .25s;';
    el.style.zIndex = o.z != null ? o.z : 1;
    el.style.borderRadius = (o.round != null ? o.round : 1.5) + 'cqw';
    if (o.border) el.style.border = '.5cqw solid ' + color(o.border);
    if (o.opacity != null) el.style.opacity = o.opacity;
    function paint() { el.style.left = 'calc(' + state.x + ' * 1cqw)'; el.style.top = 'calc(' + state.y + ' * 1cqw)'; el.style.width = 'calc(' + Math.max(0, state.w) + ' * 1cqw)'; el.style.height = 'calc(' + Math.max(0, state.h) + ' * 1cqw)'; }
    var api = { id: o.id || st._auto('block'), el: el, get x() { return state.x; }, get y() { return state.y; }, get w() { return state.w; }, get h() { return state.h; },
      set: function (next) { ['x', 'y', 'w', 'h'].forEach(function (k) { if (next[k] != null) state[k] = Number(next[k]); }); if (next.color) el.style.background = color(next.color); if (next.opacity != null) el.style.opacity = next.opacity; paint(); return api; },
      hide: function () { el.style.opacity = 0; return api; }, show: function () { el.style.opacity = o.opacity != null ? o.opacity : 1; return api; } };
    el.style.background = color(o.color || 'lime'); paint(); el.setAttribute('data-sk-id', api.id); this.widgets[api.id] = api; this.el.appendChild(el); return api;
  };
  Stage.prototype.burst = function (x, y, items) {
    if (reduced) return;
    items = items && items.length ? items : ['✨', '⭐', '✨'];
    for (var i = 0; i < 9; i++) {
      var bit = h('div', 'sk-fx', items[i % items.length]);
      this.el.appendChild(bit);
      var angle = (Math.PI * 2 * i) / 9 + 0.3, dist = 9 + (i % 3) * 4;
      var from = 'translate(calc(' + x + ' * 1cqw - 50%), calc(' + y + ' * 1cqw - 50%)) scale(.4)';
      var to = 'translate(calc(' + (x + Math.cos(angle) * dist) + ' * 1cqw - 50%), calc(' + (y + Math.sin(angle) * dist) + ' * 1cqw - 50%)) scale(1.1)';
      var anim = bit.animate([{ transform: from, opacity: 1 }, { transform: to, opacity: 0 }], { duration: 700, easing: 'ease-out' });
      anim.onfinish = (function (node) { return function () { if (node.parentNode) node.parentNode.removeChild(node); }; })(bit);
    }
  };

  // ------------------------------------------------------------------ sprites
  function Sprite(stage, o) {
    this.stage = stage; this.id = o.id || stage._auto('sprite');
    this.kind = o.kind || null; this.data = o.data || {}; this.size = o.size || 10;
    this.value = o.value != null ? o.value : null;
    this.zoneRef = null; this.track = null; this.locked = false; this.mode = o.drag || false;
    var el = this.el = h('div', 'sk-sprite');
    this._paint(o);
    this.homeX = this.x = Number(o.x) || 0; this.homeY = this.y = Number(o.y) || 0;
    el.style.zIndex = o.z != null ? o.z : 10; this.homeZone = null;
    el.setAttribute('aria-label', plain(o.label || o.text || o.caption || o.kind || o.emoji || this.id));
    this._place(true);
    stage.el.appendChild(el);
    stage.sprites[this.id] = this;
    var sp = this;
    if (o.drag) { el.classList.add('sk-drag'); el.tabIndex = 0; el.setAttribute('role', 'button'); stage._enableDrag(this); stage.handle(this.id, el, 'drag', this); }
    if (typeof o.tap === 'function') {
      el.classList.add('sk-tap'); el.tabIndex = 0; el.setAttribute('role', 'button');
      var fire = function () { if (stage.locked || sp.locked) return; try { o.tap(sp, stage.game.sk); } catch (error) { stage.game.fail(error); } };
      el.addEventListener('click', fire);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
      if (!o.drag) stage.handle(this.id, el, 'tap', this);
    }
    if (!o.drag && typeof o.tap !== 'function') { el.setAttribute('data-sk-id', this.id); el.style.pointerEvents = 'none'; el.setAttribute('role', 'img'); }
    if (o.float) el.classList.add('sk-float');
    if (o.badge != null) this.badge(o.badge);
    if (o.hidden) el.classList.add('sk-hidden');
  }
  Sprite.prototype._paint = function (o) {
    var el = this.el;
    ['sk-emoji', 'sk-text', 'sk-shape', 'sk-custom', 'circle', 'plain'].forEach(function (c) { el.classList.remove(c); });
    if (o.emoji != null) { el.classList.add('sk-emoji'); el.textContent = o.emoji; this.emoji = o.emoji; }
    else if (o.text != null) { el.classList.add('sk-text'); if (o.plain) el.classList.add('plain'); el.innerHTML = rich(o.text); this.text = String(o.text); if (o.color) el.style.setProperty('--tc', color(o.color)); if (o.size == null && !this._sized) this.size = 4.4; }
    else if (o.shape) { el.classList.add('sk-shape'); if (o.shape === 'circle') el.classList.add('circle'); el.style.setProperty('--w', o.w || this.size); el.style.setProperty('--h', o.h || o.w || this.size); el.style.setProperty('--c', color(o.color || 'orange')); el.innerHTML = o.caption != null ? rich(o.caption) : ''; if (o.size == null && !this._sized) this.size = 3.6; }
    else if (o.svg != null || o.html != null) { el.classList.add('sk-custom'); el.style.setProperty('--w', o.w || this.size); el.style.setProperty('--h', o.h || o.w || this.size); el.innerHTML = o.svg != null ? o.svg : o.html; }
    this._sized = true;
    el.style.setProperty('--s', this.size);
  };
  Sprite.prototype._place = function (jump) {
    var el = this.el;
    if (jump) { el.classList.add('sk-nomove'); }
    el.style.setProperty('--x', this.x.toFixed(3)); el.style.setProperty('--y', this.y.toFixed(3));
    if (jump) { void el.offsetWidth; if (!el.classList.contains('sk-held')) el.classList.remove('sk-nomove'); }
  };
  Sprite.prototype._w = function () { return this.el.offsetWidth / this.stage.unit(); };
  Sprite.prototype._h = function () { return this.el.offsetHeight / this.stage.unit(); };
  Object.defineProperty(Sprite.prototype, 'zone', { get: function () { return this.zoneRef ? this.zoneRef.id : null; } });
  Sprite.prototype.moveTo = function (x, y, opts) { this.x = clamp(Number(x), -20, 120); this.y = clamp(Number(y), -20, this.stage.H + 20); this._place(opts && opts.jump); return this; };
  Sprite.prototype.setHome = function (x, y) { this.homeX = x; this.homeY = y; return this; };
  Sprite.prototype.place = function (zoneId, index) {
    var zone = typeof zoneId === 'string' ? this.stage.zones[zoneId] : zoneId;
    if (!zone) return this;
    if (this.zoneRef && this.zoneRef !== zone) this.zoneRef._remove(this);
    zone._add(this, index); return this;
  };
  Sprite.prototype.home = function () {
    var homeZone = this.homeZone && this.stage.zones[this.homeZone];
    if (homeZone) { if (this.zoneRef !== homeZone) { if (this.zoneRef) this.zoneRef._remove(this); homeZone._add(this); } else homeZone._layout(); return this; }
    if (this.zoneRef) this.zoneRef._remove(this); this.moveTo(this.homeX, this.homeY); return this;
  };
  Sprite.prototype.set = function (o) {
    if (o.data) for (var key in o.data) this.data[key] = o.data[key];
    if (o.value !== undefined) this.value = o.value;
    if (o.kind !== undefined) this.kind = o.kind;
    if (o.size != null) { this.size = o.size; this.el.style.setProperty('--s', o.size); }
    if (o.emoji != null || o.text != null || o.shape || o.svg != null || o.html != null) this._paint(o);
    if (o.label) this.el.setAttribute('aria-label', plain(o.label));
    if (this.zoneRef) this.zoneRef._layout();
    return this;
  };
  Sprite.prototype.badge = function (text) {
    var b = this.el.querySelector('.sk-badge');
    if (text == null || text === '') { if (b) b.parentNode.removeChild(b); return this; }
    if (!b) { b = h('span', 'sk-badge'); this.el.appendChild(b); }
    b.textContent = text; return this;
  };
  Sprite.prototype.pop = function () { restart(this.el, 'sk-pop'); return this; };
  Sprite.prototype.shake = function () { restart(this.el, 'sk-shake'); return this; };
  Sprite.prototype.spin = function () { restart(this.el, 'sk-spin'); return this; };
  Sprite.prototype.float = function (on) { this.el.classList.toggle('sk-float', on !== false); return this; };
  Sprite.prototype.hide = function () { this.el.classList.add('sk-hidden'); return this; };
  Sprite.prototype.show = function () { this.el.classList.remove('sk-hidden'); return this; };
  Sprite.prototype.lock = function (value) { this.locked = value !== false; return this; };
  Sprite.prototype.front = function () { var st = this.stage; st.topZ = (st.topZ || 10) + 1; if (st.topZ > 48) st.topZ = 11; this.el.style.zIndex = st.topZ; return this; };
  Sprite.prototype.remove = function () {
    if (this.zoneRef) this.zoneRef._remove(this);
    if (this.stage.picked === this) this.stage._pick(null);
    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    delete this.stage.sprites[this.id]; delete this.stage.handles[this.id];
  };

  Stage.prototype.sprite = function (o) { o = o || {}; if (o.id && this.sprites[o.id]) this.sprites[o.id].remove(); var sp = new Sprite(this, o); if (o.zone && this.zones[o.zone]) { sp.homeZone = o.zone; sp.place(o.zone); } return sp; };

  // -------------------------------------------------------------------- zones
  function Zone(stage, o) {
    this.stage = stage; this.id = o.id || stage._auto('zone');
    this.x = Number(o.x) || 0; this.y = Number(o.y) || 0; this.w = Number(o.w) || 20; this.h = Number(o.h) || 16;
    this.layout = o.layout || 'flow'; this.cols = o.cols || 0; this.rows = o.rows || 0;
    this.capacity = o.capacity != null ? o.capacity : Infinity; this.accepts = o.accepts || null;
    this.pad = o.pad != null ? o.pad : 1.6; this.gap = o.gap != null ? o.gap : 1; this.onDrop = o.onDrop || null; this.onReject = o.onReject || null; this.swap = !!o.swap;
    this.sprites = []; this.data = o.data || {}; this.kind = o.kind || null;
    var el = this.el = h('div', 'sk-zone sk-zone-' + (o.look || 'tray'));
    ['x', 'y', 'w', 'h'].forEach(function (key) { el.style.setProperty('--' + key, this[key]); }, this);
    if (o.color) el.style.setProperty('--zc', color(o.color));
    el.setAttribute('role', 'group'); el.setAttribute('aria-label', plain(o.label || this.id)); el.tabIndex = 0;
    el.style.zIndex = o.z != null ? o.z : 2; this.align = o.align || 'center';
    if (o.label && o.showLabel !== false) { var tag = h('span', 'sk-zone-label' + (o.labelAt === 'top' ? ' top' : o.labelAt === 'in' ? ' in' : '')); tag.innerHTML = rich(o.label); el.appendChild(tag); this.labelEl = tag; }
    var zone = this;
    var drop = function () { if (stage.picked && !stage.locked) stage._dropInto(stage.picked, zone, null, true); };
    el.addEventListener('click', drop);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } });
    stage.el.insertBefore(el, stage.el.firstChild);
    stage.zones[this.id] = this;
    stage.handles[this.id] = { id: this.id, el: el, kind: 'zone', ref: this };
    el.setAttribute('data-sk-id', this.id);
  }
  Object.defineProperty(Zone.prototype, 'count', { get: function () { return this.sprites.length; } });
  Object.defineProperty(Zone.prototype, 'ids', { get: function () { return this.sprites.map(function (s) { return s.id; }); } });
  Zone.prototype.has = function (sprite) { var id = typeof sprite === 'string' ? sprite : sprite.id; return this.sprites.some(function (s) { return s.id === id; }); };
  Zone.prototype.kinds = function () { return this.sprites.map(function (s) { return s.kind; }); };
  Zone.prototype.values = function () { return this.sprites.map(function (s) { return s.value; }); };
  Zone.prototype.texts = function () { return this.sprites.map(function (s) { return s.text != null ? s.text : s.emoji; }); };
  Zone.prototype.sum = function (key) { return this.sprites.reduce(function (total, s) { var v = typeof key === 'function' ? key(s) : key ? s.data[key] : s.value; return total + (Number(v) || 0); }, 0); };
  Zone.prototype.countOf = function (kind) { return this.sprites.filter(function (s) { return s.kind === kind; }).length; };
  Zone.prototype.setLabel = function (text) { if (this.labelEl) this.labelEl.innerHTML = rich(text); this.el.setAttribute('aria-label', plain(text)); return this; };
  Zone.prototype.clear = function () { var z = this; this.sprites.slice().forEach(function (s) { if (s.homeZone === z.id) s.homeZone = null; s.home(); }); return this; };
  Zone.prototype._canTake = function (sprite) {
    if (this.has(sprite)) return true;
    if (this.sprites.length >= this.capacity && !(this.swap && this.sprites.some(function (s) { return !!s.mode; }))) return false;
    if (typeof this.accepts === 'function') { try { return !!this.accepts(sprite, this); } catch (_) { return false; } }
    if (Array.isArray(this.accepts)) return this.accepts.indexOf(sprite.kind) >= 0;
    if (typeof this.accepts === 'string') return sprite.kind === this.accepts;
    return true;
  };
  Zone.prototype._add = function (sprite, index) {
    var at = this.sprites.indexOf(sprite); if (at >= 0) this.sprites.splice(at, 1);
    if (index == null || index > this.sprites.length) index = this.sprites.length;
    this.sprites.splice(index, 0, sprite); sprite.zoneRef = this; sprite.front(); this._layout();
  };
  Zone.prototype._remove = function (sprite) { var at = this.sprites.indexOf(sprite); if (at >= 0) this.sprites.splice(at, 1); if (sprite.zoneRef === this) sprite.zoneRef = null; this._layout(); };
  Zone.prototype._layout = function () {
    var n = this.sprites.length, z = this; if (!n || this.layout === 'free') return;
    var innerW = this.w - this.pad * 2, innerH = this.h - this.pad * 2;
    if (this.layout === 'grid') {
      var cols = this.cols || Math.ceil(Math.sqrt(Math.max(n, isFinite(this.capacity) ? this.capacity : n)));
      var rows = this.rows || Math.ceil(Math.max(n, isFinite(this.capacity) ? this.capacity : n) / cols);
      this.sprites.forEach(function (s, i) { s.moveTo(z.x + z.pad + innerW * ((i % cols) + 0.5) / cols, z.y + z.pad + innerH * (Math.floor(i / cols) + 0.5) / rows); });
      return;
    }
    if (this.layout === 'stack') {
      var step = Math.min(innerH / n, this.sprites[0]._h() + this.gap);
      this.sprites.forEach(function (s, i) { s.moveTo(z.x + z.w / 2, z.y + z.h / 2 + (i - (n - 1) / 2) * step); });
      return;
    }
    // flow / row: measured widths, wrapping, centred
    var lines = [[]], width = 0;
    this.sprites.forEach(function (s) {
      var w = s._w();
      if (lines[lines.length - 1].length && width + w > innerW && z.layout !== 'row') { lines.push([]); width = 0; }
      lines[lines.length - 1].push({ s: s, w: w, h: s._h() }); width += w + z.gap;
    });
    var heights = lines.map(function (line) { return Math.max.apply(null, line.map(function (item) { return item.h; })); });
    var total = heights.reduce(function (a, b) { return a + b; }, 0) + this.gap * (lines.length - 1);
    var squeeze = total > innerH ? innerH / total : 1, y = this.y + this.h / 2 - (total * squeeze) / 2;
    lines.forEach(function (line, li) {
      var lw = line.reduce(function (a, item) { return a + item.w; }, 0) + z.gap * (line.length - 1);
      var tight = lw > innerW ? innerW / lw : 1, x = z.align === 'start' ? z.x + z.pad : z.align === 'end' ? z.x + z.w - z.pad - lw * tight : z.x + z.w / 2 - (lw * tight) / 2;
      line.forEach(function (item) { item.s.moveTo(x + (item.w * tight) / 2, y + (heights[li] * squeeze) / 2); x += (item.w + z.gap) * tight; });
      y += (heights[li] + z.gap) * squeeze;
    });
  };
  Zone.prototype._indexAt = function (pt, sprite) {
    if (!pt || (this.layout !== 'row' && this.layout !== 'flow')) return null;
    var index = 0; this.sprites.forEach(function (s) { if (s !== sprite && (s.y < pt.y - s._h() / 2 || (Math.abs(s.y - pt.y) <= s._h() / 2 + 2 && s.x < pt.x))) index += 1; });
    return index;
  };
  Stage.prototype.zone = function (o) { return new Zone(this, o || {}); };

  // ----------------------------------------------------------- drag and place
  Stage.prototype._zoneAt = function (pt, sprite) {
    var best = null, bestArea = Infinity, margin = 2.5;
    for (var id in this.zones) {
      var z = this.zones[id];
      if (pt.x >= z.x - margin && pt.x <= z.x + z.w + margin && pt.y >= z.y - margin && pt.y <= z.y + z.h + margin) {
        var area = z.w * z.h; if (area < bestArea) { best = z; bestArea = area; }
      }
    }
    return best;
  };
  Stage.prototype._hover = function (zone) { if (this.hover === zone) return; if (this.hover) this.hover.el.classList.remove('sk-over'); this.hover = zone; if (zone) zone.el.classList.add('sk-over'); };
  Stage.prototype._pick = function (sprite) {
    if (this.picked) this.picked.el.classList.remove('sk-picked');
    this.picked = sprite || null;
    if (sprite) { sprite.el.classList.add('sk-picked'); sprite.front(); }
    for (var id in this.zones) this.zones[id].el.classList.toggle('sk-target', !!sprite && this.zones[id]._canTake(sprite));
  };
  Stage.prototype._release = function (sprite) { // picked sprite, tap on empty stage: send it home
    this._pick(null);
    if (sprite.mode !== 'free' && !sprite.track) { var before = sprite.zoneRef; sprite.home(); if (sprite.zoneRef !== before) this.changed(); }
  };
  Stage.prototype._dropInto = function (sprite, zone, pt, fromTap) {
    var previous = sprite.zoneRef;
    this._pick(null); this._hover(null);
    if (!zone._canTake(sprite)) { sprite.shake(); if (previous) previous._layout(); else if (!fromTap) sprite.home(); if (typeof zone.onReject === 'function') { try { zone.onReject(sprite, zone, this.game.sk); } catch (error) { this.game.fail(error); } } return false; }
    if (previous && previous !== zone) previous._remove(sprite);
    if (zone.swap && !zone.has(sprite) && zone.sprites.length >= zone.capacity) { var out = zone.sprites.filter(function (s) { return !!s.mode; }).pop(); if (out) { if (out.homeZone === zone.id) out.homeZone = null; out.home(); } }
    zone._add(sprite, zone._indexAt(pt, sprite));
    if (zone.layout === 'free' && pt) sprite.moveTo(clamp(pt.x, zone.x + 2, zone.x + zone.w - 2), clamp(pt.y, zone.y + 2, zone.y + zone.h - 2));
    sprite.pop();
    if (typeof zone.onDrop === 'function') { try { zone.onDrop(sprite, zone, this.game.sk); } catch (error) { this.game.fail(error); return false; } }
    this.changed(); return true;
  };
  Stage.prototype._drop = function (sprite, pt, start) {
    this._hover(null);
    if (sprite.track) { sprite.value = sprite.track.nearest(pt.x); sprite.moveTo(sprite.track.at(sprite.value), sprite.track.y + sprite.trackDy); sprite.pop(); this.changed(); return; }
    var zone = this._zoneAt(pt, sprite);
    if (zone) { this._dropInto(sprite, zone, pt, false); return; }
    if (sprite.mode === 'free') { if (sprite.zoneRef) sprite.zoneRef._remove(sprite); sprite.moveTo(clamp(pt.x, 3, 97), clamp(pt.y, 3, this.H - 3)); this.changed(); return; }
    var before = sprite.zoneRef; sprite.home(); if (sprite.zoneRef !== before) this.changed();
  };
  Stage.prototype._enableDrag = function (sprite) {
    var st = this, el = sprite.el, start = null;
    el.addEventListener('pointerdown', function (e) {
      if (st.locked || sprite.locked || e.button > 0) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ }
      start = { px: e.clientX, py: e.clientY, x: sprite.x, y: sprite.y, moved: false, id: e.pointerId };
    });
    el.addEventListener('pointermove', function (e) {
      if (!start || e.pointerId !== start.id) return;
      var dx = e.clientX - start.px, dy = e.clientY - start.py, u = st.unit();
      if (!start.moved && Math.hypot(dx, dy) < 7) return;
      if (!start.moved) { start.moved = true; st._pick(null); sprite.front(); el.classList.add('sk-held', 'sk-nomove'); }
      if (sprite.track) { sprite.x = clamp(start.x + dx / u, sprite.track.x, sprite.track.x + sprite.track.w); }
      else { sprite.x = clamp(start.x + dx / u, 2, 98); sprite.y = clamp(start.y + dy / u, 2, st.H - 2); }
      sprite._place(false);
      if (!sprite.track) { var z = st._zoneAt(st.toUnits(e.clientX, e.clientY), sprite); st._hover(z && z._canTake(sprite) ? z : null); }
    });
    var end = function (e) {
      if (!start || e.pointerId !== start.id) return;
      var s = start; start = null;
      try { el.releasePointerCapture(e.pointerId); } catch (_) { /* already released */ }
      if (!s.moved) { if (e.type === 'pointerup' && !sprite.track) { if (st.picked === sprite) st._pick(null); else st._pick(sprite); } return; }
      el.classList.remove('sk-held', 'sk-nomove');
      if (e.type === 'pointercancel') { sprite.moveTo(s.x, s.y); st._hover(null); return; }
      st._drop(sprite, st.toUnits(e.clientX, e.clientY), s);
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', function (e) {
      if (st.locked || sprite.locked) return;
      if (sprite.track && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); sprite.value = sprite.track.step(sprite.value, e.key === 'ArrowRight' ? 1 : -1); sprite.moveTo(sprite.track.at(sprite.value), sprite.y); st.changed(); return; }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (st.picked === sprite) st._pick(null); else st._pick(sprite); }
      else if (e.key === 'Escape') st._pick(null);
      else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); var before = sprite.zoneRef; sprite.home(); if (sprite.zoneRef !== before) st.changed(); }
    });
  };

  // ------------------------------------------------------- labels and widgets
  Stage.prototype.label = function (o) {
    o = o || {}; var el = h('div', 'sk-label' + (o.card ? ' card' : '') + (o.w ? ' wrap' : ''));
    el.style.setProperty('--x', o.x || 0); el.style.setProperty('--y', o.y || 0); el.style.setProperty('--s', o.size || 4);
    if (o.w) el.style.setProperty('--w', o.w);
    if (o.color) el.style.setProperty('--lc', color(o.color));
    el.style.zIndex = o.z != null ? o.z : 3;
    el.innerHTML = rich(o.text); this.el.appendChild(el);
    var api = { id: o.id || this._auto('label'), el: el, text: String(o.text == null ? '' : o.text),
      set: function (text) { api.text = String(text); el.innerHTML = rich(text); return api; },
      moveTo: function (x, y) { el.style.setProperty('--x', x); el.style.setProperty('--y', y); return api; },
      hide: function () { el.style.visibility = 'hidden'; return api; }, show: function () { el.style.visibility = ''; return api; } };
    el.setAttribute('data-sk-id', api.id); this.widgets[api.id] = api; return api;
  };
  Stage.prototype.button = function (o) {
    o = o || {}; var st = this, el = h('button', 'sk-btn'); el.type = 'button';
    el.style.setProperty('--x', o.x || 0); el.style.setProperty('--y', o.y || 0); el.style.setProperty('--s', o.size || 4);
    if (o.color) el.style.setProperty('--c', color(o.color)); if (o.textColor) el.style.setProperty('--fc', color(o.textColor));
    el.innerHTML = rich(o.text || ''); if (o.label) el.setAttribute('aria-label', plain(o.label));
    var api = { id: o.id || this._auto('button'), el: el, taps: 0, set: function (text) { el.innerHTML = rich(text); return api; }, enable: function (on) { el.disabled = on === false; return api; } };
    el.addEventListener('click', function () { if (st.locked) return; api.taps += 1; try { if (typeof o.onTap === 'function') o.onTap(st.game.sk, api); } catch (error) { st.game.fail(error); } });
    this.handle(api.id, el, 'tap', api); this.widgets[api.id] = api; this.el.appendChild(el); return api;
  };
  Stage.prototype.stepper = function (o) {
    o = o || {}; var st = this, box = h('div', 'sk-widget sk-stepper');
    box.style.setProperty('--x', o.x || 0); box.style.setProperty('--y', o.y || 0);
    var min = o.min != null ? o.min : 0, max = o.max != null ? o.max : 20, step = o.step || 1;
    var minus = h('button', '', '−'), plus = h('button', '', '+'), out = h('output'); minus.type = plus.type = 'button';
    minus.setAttribute('aria-label', 'Less'); plus.setAttribute('aria-label', 'More'); minus.setAttribute('data-sk-part', 'minus'); plus.setAttribute('data-sk-part', 'plus');
    var api = { id: o.id || this._auto('stepper'), el: box, value: o.value != null ? o.value : min, min: min, max: max, step: step,
      set: function (v, silent) { v = clamp(Math.round(v / step) * step, min, max); if (v === api.value) return api; api.value = v; show(); if (!silent) st.changed(); return api; } };
    function show() { out.textContent = typeof o.format === 'function' ? o.format(api.value) : String(api.value) + (o.unit ? ' ' + o.unit : ''); }
    minus.addEventListener('click', function () { if (!st.locked) api.set(api.value - step); }); plus.addEventListener('click', function () { if (!st.locked) api.set(api.value + step); });
    if (o.label) box.appendChild(h('small', '', plain(o.label)));
    box.appendChild(minus); box.appendChild(out); box.appendChild(plus); show();
    this.handle(api.id, box, 'stepper', api); this.widgets[api.id] = api; this.el.appendChild(box); return api;
  };
  Stage.prototype.choice = function (o) {
    o = o || {}; var st = this, box = h('div', 'sk-widget sk-choice' + (o.layout === 'col' ? ' col' : ''));
    box.style.setProperty('--x', o.x || 50); box.style.setProperty('--y', o.y || 0); box.style.setProperty('--w', o.w || 80);
    box.setAttribute('role', 'group'); if (o.label) box.setAttribute('aria-label', plain(o.label));
    var api = { id: o.id || this._auto('choice'), el: box, value: o.multi ? [] : null, options: (o.options || []).map(function (opt) { return typeof opt === 'object' ? opt : { id: String(opt), text: String(opt) }; }),
      set: function (id, silent) {
        if (o.multi) { var at = api.value.indexOf(id); if (at >= 0) api.value.splice(at, 1); else api.value.push(id); } else api.value = id;
        Array.prototype.forEach.call(box.children, function (chip) { var on = o.multi ? api.value.indexOf(chip.getAttribute('data-sk-option')) >= 0 : chip.getAttribute('data-sk-option') === api.value; chip.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        if (!silent) { try { if (typeof o.onPick === 'function') o.onPick(id, st.game.sk, api); } catch (error) { st.game.fail(error); return api; } st.changed(); }
        return api;
      } };
    api.options.forEach(function (opt) {
      var chip = h('button', 'sk-chip'); chip.type = 'button'; chip.innerHTML = rich((opt.emoji ? opt.emoji + ' ' : '') + (opt.text != null ? opt.text : ''));
      chip.setAttribute('data-sk-option', String(opt.id)); chip.setAttribute('aria-pressed', 'false');
      chip.addEventListener('click', function () { if (!st.locked) api.set(String(opt.id)); });
      box.appendChild(chip);
    });
    this.handle(api.id, box, 'choice', api); this.widgets[api.id] = api; this.el.appendChild(box); return api;
  };
  Stage.prototype.keypad = function (o) {
    o = o || {}; var st = this, box = h('div', 'sk-widget sk-keypad');
    box.style.setProperty('--x', o.x || 50); box.style.setProperty('--y', o.y || 0);
    var out = h('output'); box.appendChild(out);
    var extra = o.keys === 'fraction' ? '/' : o.keys === 'decimal' ? '.' : null, maxLength = o.maxLength || (extra ? 7 : 5);
    var api = { id: o.id || this._auto('keypad'), el: box, value: '',
      get number() { return parseNumber(api.value); },
      set: function (text, silent) { api.value = String(text).slice(0, maxLength); out.textContent = api.value ? (o.prefix || '') + api.value + (o.suffix || '') : ''; if (!silent) st.changed(); return api; } };
    out.setAttribute('data-empty', (o.prefix || '') + '?' + (o.suffix || ''));
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', extra || '', '0', '⌫'].forEach(function (key) {
      var b = h('button', 'sk-key' + (key === '⌫' || key === extra ? ' alt' : ''), key); b.type = 'button';
      if (!key) { b.style.visibility = 'hidden'; b.disabled = true; }
      b.setAttribute('data-sk-key', key === '⌫' ? 'back' : key); if (key === '⌫') b.setAttribute('aria-label', 'Erase');
      b.addEventListener('click', function () { if (st.locked) return; if (key === '⌫') api.set(api.value.slice(0, -1)); else if (api.value.length < maxLength) api.set(api.value + key); });
      box.appendChild(b);
    });
    if (o.label) box.setAttribute('aria-label', plain(o.label));
    this.handle(api.id, box, 'keypad', api); this.widgets[api.id] = api; this.el.appendChild(box); return api;
  };
  function parseNumber(text) {
    text = String(text == null ? '' : text).trim(); if (!text) return NaN;
    var parts = text.split('/'); if (parts.length === 2) { var d = Number(parts[1]); return d ? Number(parts[0]) / d : NaN; }
    return parts.length === 1 ? Number(text) : NaN;
  }
  Stage.prototype.grid = function (o) {
    o = o || {}; var st = this, cols = o.cols || 5, rows = o.rows || 4, box = h('div', 'sk-widget sk-grid');
    box.style.setProperty('--x', o.x || 50); box.style.setProperty('--y', o.y || 35); box.style.setProperty('--cell', o.cell || 7);
    box.style.gridTemplateColumns = 'repeat(' + cols + ', auto)'; if (o.color) box.style.setProperty('--c', color(o.color));
    var cells = [], on = {}, api = { id: o.id || this._auto('grid'), el: box, cols: cols, rows: rows,
      get count() { return Object.keys(on).length; },
      isOn: function (c, r) { return !!on[c + ',' + r]; },
      cells: function () { return Object.keys(on).map(function (key) { return key.split(',').map(Number); }); },
      set: function (list, silent) { on = {}; (list || []).forEach(function (cell) { on[cell[0] + ',' + cell[1]] = true; }); paintAll(); if (!silent) st.changed(); return api; },
      clear: function (silent) { return api.set([], silent); },
      // {cols, rows, c, r} when the painted cells form one solid rectangle, else null
      rect: function () {
        var list = api.cells(); if (!list.length) return null;
        var cs = list.map(function (p) { return p[0]; }), rs = list.map(function (p) { return p[1]; });
        var c0 = Math.min.apply(null, cs), c1 = Math.max.apply(null, cs), r0 = Math.min.apply(null, rs), r1 = Math.max.apply(null, rs);
        return (c1 - c0 + 1) * (r1 - r0 + 1) === list.length ? { cols: c1 - c0 + 1, rows: r1 - r0 + 1, c: c0, r: r0 } : null;
      },
      rowCount: function (r) { var n = 0; for (var c = 0; c < cols; c++) if (on[c + ',' + r]) n += 1; return n; },
      colCount: function (c) { var n = 0; for (var r = 0; r < rows; r++) if (on[c + ',' + r]) n += 1; return n; } };
    var fixed = {}; (o.locked || []).forEach(function (cell) { fixed[cell[0] + ',' + cell[1]] = true; });
    function paint(cell) { var key = cell.getAttribute('data-sk-cell'), lit = !!on[key]; cell.classList.toggle('on', lit); cell.textContent = lit && o.emoji ? o.emoji : ''; cell.setAttribute('aria-pressed', lit ? 'true' : 'false'); }
    function paintAll() { cells.forEach(paint); }
    function apply(cell, value) { var key = cell.getAttribute('data-sk-cell'); if (fixed[key] || !!on[key] === value) return false; if (value) on[key] = true; else delete on[key]; paint(cell); return true; }
    var painting = null;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var cell = h('button', 'sk-cell'); cell.type = 'button'; cell.setAttribute('data-sk-cell', c + ',' + r); cell.setAttribute('aria-label', 'Row ' + (r + 1) + ', column ' + (c + 1));
      if (fixed[c + ',' + r]) cell.classList.add('locked');
      cells.push(cell); box.appendChild(cell);
    }
    (o.filled || []).forEach(function (cell) { on[cell[0] + ',' + cell[1]] = true; });
    paintAll();
    box.addEventListener('pointerdown', function (e) {
      var cell = e.target.closest ? e.target.closest('.sk-cell') : null; if (!cell || st.locked || o.paint === false) return;
      e.preventDefault(); painting = { value: !on[cell.getAttribute('data-sk-cell')], changed: false };
      if (apply(cell, painting.value)) painting.changed = true;
    });
    box.addEventListener('pointermove', function (e) {
      if (!painting) return; var target = document.elementFromPoint(e.clientX, e.clientY), cell = target && target.closest ? target.closest('.sk-cell') : null;
      if (cell && box.contains(cell) && apply(cell, painting.value)) painting.changed = true;
    });
    var stop = function () { if (!painting) return; var changed = painting.changed; painting = null; if (changed) st.changed(); };
    window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', stop);
    this.timers.push(function () { window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop); });
    box.addEventListener('keydown', function (e) { var cell = e.target.closest ? e.target.closest('.sk-cell') : null; if (!cell || st.locked || o.paint === false) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (apply(cell, !on[cell.getAttribute('data-sk-cell')])) st.changed(); } });
    this.handle(api.id, box, 'grid', api); this.widgets[api.id] = api; this.el.appendChild(box); return api;
  };
  // A number line. Markers snap to its steps.
  Stage.prototype.track = function (o) {
    o = o || {}; var el = h('div', 'sk-track'); var min = o.min != null ? o.min : 0, max = o.max != null ? o.max : 10, step = o.step || 1;
    var api = { id: o.id || this._auto('track'), el: el, x: o.x != null ? o.x : 10, y: o.y != null ? o.y : 40, w: o.w || 80, min: min, max: max, stepSize: step,
      at: function (value) { return api.x + ((value - min) / (max - min)) * api.w; },
      nearest: function (x) { var raw = min + ((x - api.x) / api.w) * (max - min); var snapped = Math.round((raw - min) / step) * step + min; return Number(clamp(snapped, min, max).toFixed(6)); },
      step: function (value, direction) { return Number(clamp(value + direction * step, min, max).toFixed(6)); } };
    el.style.setProperty('--x', api.x); el.style.setProperty('--y', api.y); el.style.setProperty('--w', api.w);
    var labelEvery = o.labelEvery || 1, count = Math.round((max - min) / step);
    for (var i = 0; i <= count; i++) {
      var value = Number((min + i * step).toFixed(6)), tick = h('span', 'sk-tick' + (i % labelEvery ? ' minor' : ''));
      tick.style.left = ((i / count) * 100) + '%';
      var text = typeof o.format === 'function' ? o.format(value, i) : o.labels === 'none' ? '' : (o.labels === 'ends' && i !== 0 && i !== count) ? '' : (i % labelEvery ? '' : String(value));
      if (text !== '' && text != null) { var span = h('span'); span.innerHTML = rich(text); tick.appendChild(span); }
      el.appendChild(tick);
    }
    this.el.appendChild(el); this.tracks[api.id] = api; el.setAttribute('data-sk-id', api.id); return api;
  };
  Stage.prototype.marker = function (o) {
    o = o || {}; var track = typeof o.track === 'string' ? this.tracks[o.track] : o.track;
    var value = o.value != null ? o.value : track.min, dy = o.dy != null ? o.dy : -6;
    var sp = this.sprite({ id: o.id, emoji: o.emoji || '📍', text: o.text, size: o.size || 9, x: track.at(value), y: track.y + dy, drag: o.drag === false ? false : true, label: o.label || 'Marker', kind: o.kind, z: 20 });
    sp.track = track; sp.trackDy = dy; sp.value = value;
    if (this.handles[sp.id]) this.handles[sp.id].kind = 'marker';
    sp.setValue = function (v) { sp.value = track.nearest(track.at(v)); sp.moveTo(track.at(sp.value), track.y + dy); return sp; };
    return sp;
  };

  // --------------------------------------------------------------- the game
  function Game(def) {
    this.def = def || {}; this.rounds = Array.isArray(this.def.rounds) ? this.def.rounds : [];
    this.index = -1; this.stage = null; this.records = []; this.log = []; this.screen = 'intro'; this.failed = null;
    this.startedAt = Date.now(); this.random = rng(INIT.seed != null ? INIT.seed : hash(String(this.def.title || 'game')));
    var game = this;
    this.sk = {
      rand: function () { return game.random(); },
      int: function (a, b) { return a + Math.floor(game.random() * (b - a + 1)); },
      pick: function (list) { return list[Math.floor(game.random() * list.length)]; },
      shuffle: function (list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(game.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
      after: function (ms, fn) { return game.stage ? game.stage.after(ms, fn) : null; },
      every: function (ms, fn) { return game.stage ? game.stage.every(ms, fn) : null; },
      say: function (text, tone) { game.feedback(text, tone || 'tip'); },
      confetti: function () { game.confetti(); },
      frac: function (n, d) { return '{' + n + '/' + d + '}'; },
      gcd: gcd, parse: parseNumber, color: color,
      get round() { return { index: game.index, phase: game.round ? game.round.phase : null, attempts: game.record ? game.record.attempts : 0 }; },
      get stage() { return game.stage; }
    };
    this.build();
    post('ready', { manifest: this.manifest() });
    this.showIntro();
  }
  Game.prototype.manifest = function () {
    var def = this.def;
    return { kit: KIT, title: String(def.title || ''), premise: String(def.premise || ''), outro: String(def.outro || ''),
      rounds: this.rounds.map(function (r) {
        return { id: String(r.id || ''), phase: r.phase, say: String(r.say || ''), action: String(r.action || 'Check'), win: String(r.win || ''), autoCheck: !!r.autoCheck,
          hints: (r.hints || []).map(String), hasSetup: typeof r.setup === 'function', hasCheck: typeof r.check === 'function', hasSolution: typeof r.solution === 'function' || Array.isArray(r.solution),
          mistakes: (r.mistakes || []).map(function (m) { return { tag: String(m.tag || ''), say: String(m.say || ''), hasWhen: typeof m.when === 'function', hasSteps: typeof m.steps === 'function' || Array.isArray(m.steps) }; }) };
      }) };
  };
  Game.prototype.build = function () {
    var game = this; root.textContent = '';
    this.live = h('div', 'sk-sr'); this.live.setAttribute('aria-live', 'polite'); root.appendChild(this.live);
    this.intro = h('div', 'sk-card'); root.appendChild(this.intro);
    this.play = h('div'); this.play.hidden = true; root.appendChild(this.play);
    var top = h('div', 'sk-top'); this.phase = h('span', 'sk-phase'); this.dots = h('div', 'sk-dots'); top.appendChild(this.phase); top.appendChild(this.dots); this.play.appendChild(top);
    this.rounds.forEach(function () { game.dots.appendChild(h('span', 'sk-dot')); });
    var say = h('div', 'sk-say'); var guide = h('div', 'sk-guide'); guide.setAttribute('aria-hidden', 'true'); this.mission = h('div', 'sk-mission'); say.appendChild(guide); say.appendChild(this.mission); this.play.appendChild(say);
    this.wrap = h('div', 'sk-stage-wrap'); this.play.appendChild(this.wrap);
    var bar = h('div', 'sk-bar');
    this.checkButton = h('button', 'sk-check', 'Check'); this.checkButton.type = 'button'; this.checkButton.setAttribute('data-sk-id', 'sk-check');
    this.hintButton = h('button', 'sk-hint', '💡 Hint'); this.hintButton.type = 'button'; this.hintButton.hidden = true; this.hintButton.setAttribute('data-sk-id', 'sk-hint');
    this.back = h('div', 'sk-back'); this.back.setAttribute('data-sk-id', 'sk-feedback');
    bar.appendChild(this.checkButton); bar.appendChild(this.hintButton); bar.appendChild(this.back); this.play.appendChild(bar);
    this.checkButton.addEventListener('click', function () { game.pressMain(); });
    this.hintButton.addEventListener('click', function () { game.hint(); });
    this.final = h('div', 'sk-card'); this.final.hidden = true; root.appendChild(this.final);
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { post('resize', { height: Math.ceil(root.getBoundingClientRect().height) + 8 }); }); ro.observe(root); }
  };
  Game.prototype.event = function (kind, data) { var entry = { kind: kind, at: Date.now() - this.startedAt }; for (var key in data || {}) entry[key] = data[key]; this.log.push(entry); if (this.log.length > 400) this.log.shift(); post('event', { event: entry }); };
  Game.prototype.feedback = function (text, tone) { this.back.className = 'sk-back' + (tone ? ' ' + tone : ''); this.back.innerHTML = rich(text || ''); this.live.textContent = plain(text || ''); };
  Game.prototype.showIntro = function () {
    var game = this, def = this.def; this.screen = 'intro'; this.intro.textContent = '';
    var art = h('div', 'sk-art', def.emoji || '🎮'); var title = h('h1'); title.innerHTML = rich(def.title || 'Game'); var p = h('p'); p.innerHTML = rich(def.premise || '');
    var go = h('button', 'sk-check next', 'Play'); go.type = 'button'; go.setAttribute('data-sk-id', 'sk-start');
    go.addEventListener('click', function () { game.start(); });
    this.intro.appendChild(art); this.intro.appendChild(title); if (def.premise) this.intro.appendChild(p); this.intro.appendChild(go);
  };
  Game.prototype.start = function () { if (this.failed || this.screen !== 'intro') return; this.intro.hidden = true; this.play.hidden = false; this.event('start', {}); this.goto(0); };
  Game.prototype.goto = function (index) {
    if (this.failed) return;
    var round = this.rounds[index]; if (!round) return this.finish();
    this.intro.hidden = true; this.final.hidden = true; this.play.hidden = false; this.screen = 'round';
    if (this.stage) this.stage.destroy();
    this.index = index; this.round = round;
    this.record = { id: String(round.id || index), phase: round.phase, attempts: 0, hints: 0, solved: false, firstTry: null, mistakes: [] };
    this.records[index] = this.record;
    var solo = round.phase === 'solo';
    this.phase.textContent = solo ? 'Your turn' : "Let's explore"; this.phase.className = 'sk-phase' + (solo ? ' solo' : '');
    Array.prototype.forEach.call(this.dots.children, function (dot, i) { dot.className = 'sk-dot' + (i < index ? ' done' : i === index ? ' now' : ''); });
    this.mission.innerHTML = rich(round.say || '');
    this.feedback('', '');
    this.checkButton.textContent = round.action || 'Check'; this.checkButton.className = 'sk-check'; this.checkButton.hidden = !!round.autoCheck; this.checkButton.disabled = true;
    this.hintButton.hidden = true; this.hintIndex = 0;
    var stage = this.stage = new Stage(this);
    stage.size(round.height || this.def.height || 70); stage.scene(round.scene || this.def.scene || '');
    this.wrap.textContent = ''; this.wrap.appendChild(stage.el);
    try { if (typeof round.setup === 'function') round.setup(stage, this.sk); } catch (error) { return this.fail(error); }
    stage.dirty = false;
    var game = this;
    if (!solo && (round.hints || []).length) { var idle = setTimeout(function () { if (game.record && !game.record.solved && game.round === round) game.hintButton.hidden = false; }, 25000); stage.timers.push(function () { clearTimeout(idle); }); }
    this.event('round', { index: index, id: this.record.id, phase: round.phase });
  };
  Game.prototype.onChange = function () {
    if (this.screen !== 'round' || this.record.solved) return;
    this.checkButton.disabled = false;
    if (this.round.autoCheck && this.round.phase !== 'solo') { var ok = false; try { var res = this.round.check(this.stage, this.sk); ok = res === true || !!(res && res.ok === true); } catch (error) { return this.fail(error); } if (ok) this.win(); }
  };
  Game.prototype.pressMain = function () {
    if (this.failed || this.screen !== 'round') return;
    if (this.record.solved || this.record.gaveUp) return this.goto(this.index + 1);
    this.check();
  };
  Game.prototype.check = function () {
    var round = this.round, record = this.record, stage = this.stage, res, ok;
    try { res = round.check(stage, this.sk); } catch (error) { return this.fail(error); }
    ok = res === true || !!(res && res.ok === true);
    record.attempts += 1;
    if (record.firstTry === null) record.firstTry = ok;
    if (ok) { this.event('check', { index: this.index, ok: true, attempt: record.attempts }); return this.win(); }
    var tag = res && typeof res === 'object' && res.mistake ? String(res.mistake) : null, say = null;
    (round.mistakes || []).some(function (m) { try { if (typeof m.when === 'function' && m.when(stage, this.sk)) { tag = tag || String(m.tag || ''); say = m.say || null; return true; } } catch (_) { /* a detector must never break play */ } return false; }, this);
    if (tag && record.mistakes.indexOf(tag) < 0) record.mistakes.push(tag);
    this.event('check', { index: this.index, ok: false, attempt: record.attempts, mistake: tag });
    restart(this.checkButton, 'sk-shake');
    if (round.phase === 'solo') {
      this.feedback(record.attempts >= 3 ? 'Good trying. You can keep going or finish here.' : 'Not yet. Take another look and try again.', 'try');
      if (record.attempts >= 3) { record.gaveUp = true; this.checkButton.textContent = 'Finish'; this.checkButton.className = 'sk-check next'; }
    } else {
      this.feedback(say || 'Not yet. Look again and try something different.', 'try');
      if ((round.hints || []).length) this.hintButton.hidden = false;
    }
  };
  Game.prototype.win = function () {
    var record = this.record, round = this.round, last = this.index === this.rounds.length - 1;
    record.solved = true; record.gaveUp = false; this.stage.lock();
    this.feedback(round.win || 'You got it!', 'good');
    this.hintButton.hidden = true;
    this.checkButton.hidden = false; this.checkButton.disabled = false; this.checkButton.textContent = last ? 'Finish' : 'Next'; this.checkButton.className = 'sk-check next';
    this.stage.burst(50, this.stage.H / 2, ['⭐', '✨', '🎉']);
    this.event('solved', { index: this.index, attempts: record.attempts, hints: record.hints });
    if (typeof round.onWin === 'function') { try { round.onWin(this.stage, this.sk); } catch (error) { this.fail(error); } }
  };
  Game.prototype.hint = function () {
    var hints = this.round.hints || []; if (!hints.length || this.round.phase === 'solo') return;
    var text = hints[Math.min(this.hintIndex, hints.length - 1)]; this.hintIndex += 1; this.record.hints += 1;
    this.feedback(text, 'tip'); this.event('hint', { index: this.index, n: this.record.hints });
  };
  Game.prototype.result = function () {
    var solo = null; this.records.forEach(function (r) { if (r && r.phase === 'solo') solo = r; });
    return { rounds: this.records.filter(Boolean).map(function (r) { return { id: r.id, phase: r.phase, attempts: r.attempts, hints: r.hints, solved: r.solved, firstTry: r.firstTry, mistakes: r.mistakes.slice(0, 6) }; }),
      solo: solo ? { solved: solo.solved, firstTry: solo.firstTry === true, attempts: solo.attempts, mistakes: solo.mistakes.slice(0, 6) } : null,
      ms: Date.now() - this.startedAt };
  };
  Game.prototype.finish = function () {
    var game = this, def = this.def; this.screen = 'final';
    if (this.stage) { this.stage.destroy(); this.stage = null; }
    this.play.hidden = true; this.final.hidden = false; this.final.textContent = '';
    var art = h('div', 'sk-art', def.finaleEmoji || '🎉'); var title = h('h1', '', 'You did it!'); var p = h('p'); p.innerHTML = rich(def.outro || 'You finished ' + (def.title || 'the game') + '.');
    var done = h('button', 'sk-check', 'All done'); done.type = 'button'; done.setAttribute('data-sk-id', 'sk-done');
    done.addEventListener('click', function () { post('done', {}); });
    this.final.appendChild(art); this.final.appendChild(title); this.final.appendChild(p); this.final.appendChild(done);
    this.confetti();
    post('finish', { result: this.result() });
    this.event('finish', {});
  };
  Game.prototype.confetti = function () {
    if (reduced) return; var colors = ['#b7ce63', '#f79256', '#aa6da3', '#6ec3f4', '#ffd45c', '#ff7f6b'];
    for (var i = 0; i < 36; i++) {
      var bit = h('div'); bit.style.cssText = 'position:fixed;top:-12px;width:10px;height:14px;border-radius:3px;pointer-events:none;z-index:999;left:' + ((i * 37) % 100) + '%;background:' + colors[i % colors.length];
      document.body.appendChild(bit);
      var anim = bit.animate([{ transform: 'translateY(0) rotate(0deg)', opacity: 1 }, { transform: 'translateY(' + (360 + (i % 5) * 60) + 'px) rotate(' + (300 + i * 20) + 'deg)', opacity: 0 }], { duration: 1500 + (i % 6) * 160, delay: (i % 9) * 40, easing: 'cubic-bezier(.2,.6,.4,1)' });
      anim.onfinish = (function (node) { return function () { if (node.parentNode) node.parentNode.removeChild(node); }; })(bit);
    }
  };
  Game.prototype.fail = function (error) {
    if (this.failed) return; this.failed = String(error && error.message ? error.message : error).slice(0, 300);
    if (this.stage) this.stage.lock();
    root.textContent = '';
    var card = h('div', 'sk-card'); card.appendChild(h('div', 'sk-art', '🧩')); card.appendChild(h('h1', '', 'This game needs a little fix.')); card.appendChild(h('p', '', 'Let’s head back and try something else.'));
    root.appendChild(card);
    post('error', { message: this.failed });
  };

  // ------------------------------------------------ hooks for the robot player
  function centerOf(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function lowLevel(game, step) {
    var st = game.stage, out = [];
    if (!step || typeof step !== 'object') throw new Error('step must be an object');
    if (step.wait != null) return [{ type: 'wait', ms: Math.min(Number(step.wait) || 0, 1500) }];
    if (!st) throw new Error('no active round');
    if (step.drag != null) {
      var sp = st.sprites[step.drag]; if (!sp || !st.handles[step.drag]) throw new Error('no draggable "' + step.drag + '"');
      var from = centerOf(sp.el), to;
      if (step.to != null) { var z = st.zones[step.to]; if (!z) throw new Error('no zone "' + step.to + '"'); var at = step.at || ((z.layout === 'row' || z.layout === 'flow') ? [0.94, 0.5] : [0.5, 0.5]); to = st.toClient(z.x + z.w * at[0], z.y + z.h * at[1]); }
      else if (step.toXY) to = st.toClient(step.toXY[0], step.toXY[1]);
      else if (step.home) to = st.toClient(sp.homeX, sp.homeY);
      else throw new Error('drag needs "to", "toXY" or "home"');
      return [{ type: 'drag', from: from, to: to }];
    }
    if (step.slide != null) { var m = st.sprites[step.slide]; if (!m || !m.track) throw new Error('no marker "' + step.slide + '"'); var c = centerOf(m.el); return [{ type: 'drag', from: c, to: { x: st.toClient(m.track.at(Number(step.value)), 0).x, y: c.y } }]; }
    if (step.tap != null) { var hd = st.handles[step.tap] || null, el = hd ? hd.el : root.querySelector('[data-sk-id="' + String(step.tap).replace(/"/g, '') + '"]'); if (!el) throw new Error('nothing to tap called "' + step.tap + '"'); var times = Math.max(1, Math.min(20, step.times || 1)); for (var i = 0; i < times; i++) out.push({ type: 'click', at: centerOf(el), id: String(step.tap) }); return out; }
    if (step.choose != null) { var ch = st.widgets[step.choose]; if (!ch) throw new Error('no choice "' + step.choose + '"'); var chip = ch.el.querySelector('[data-sk-option="' + String(step.option).replace(/"/g, '') + '"]'); if (!chip) throw new Error('choice "' + step.choose + '" has no option "' + step.option + '"'); return [{ type: 'click', at: centerOf(chip) }]; }
    if (step.set != null) { var sv = st.widgets[step.set]; if (!sv || sv.step == null) throw new Error('no stepper "' + step.set + '"'); var diff = Math.round((Number(step.value) - sv.value) / sv.step), part = sv.el.querySelector('[data-sk-part="' + (diff > 0 ? 'plus' : 'minus') + '"]'); for (var k = 0; k < Math.min(60, Math.abs(diff)); k++) out.push({ type: 'click', at: centerOf(part) }); return out; }
    if (step.type != null) { var kp = st.widgets[step.type]; if (!kp) throw new Error('no keypad "' + step.type + '"'); var back = kp.el.querySelector('[data-sk-key="back"]'); for (var b = 0; b < kp.value.length; b++) out.push({ type: 'click', at: centerOf(back) }); String(step.text).split('').forEach(function (key) { var keyEl = kp.el.querySelector('[data-sk-key="' + key.replace(/"/g, '') + '"]'); if (!keyEl || keyEl.disabled) throw new Error('keypad "' + step.type + '" has no key "' + key + '"'); out.push({ type: 'click', at: centerOf(keyEl) }); }); return out; }
    if (step.paint != null || step.erase != null) { var gid = step.paint != null ? step.paint : step.erase, g = st.widgets[gid]; if (!g || !g.isOn) throw new Error('no grid "' + gid + '"'); (step.cells || []).forEach(function (cell) { var want = step.paint != null; if (g.isOn(cell[0], cell[1]) === want) return; var cellEl = g.el.querySelector('[data-sk-cell="' + cell[0] + ',' + cell[1] + '"]'); if (!cellEl) throw new Error('grid "' + gid + '" has no cell ' + cell); out.push({ type: 'click', at: centerOf(cellEl) }); }); return out; }
    throw new Error('unknown step ' + JSON.stringify(step).slice(0, 80));
  }
  function randomStep(game, r) {
    var st = game.stage; if (!st) return null; var list = [];
    for (var id in st.handles) { var hd = st.handles[id]; if (hd.kind !== 'zone' && hd.el.isConnected && !(hd.ref && hd.ref.locked)) list.push(hd); }
    if (!list.length) return null;
    var hd2 = list[Math.floor(r() * list.length)], zones = Object.keys(st.zones);
    if (hd2.kind === 'drag') return (zones.length && r() > 0.15) ? { drag: hd2.id, to: zones[Math.floor(r() * zones.length)] } : { drag: hd2.id, home: true };
    if (hd2.kind === 'marker') { var t = hd2.ref.track, n = Math.round((t.max - t.min) / t.stepSize); return { slide: hd2.id, value: t.min + Math.floor(r() * (n + 1)) * t.stepSize }; }
    if (hd2.kind === 'stepper') { var s = hd2.ref, steps = Math.round((s.max - s.min) / s.step); return { set: hd2.id, value: s.min + Math.floor(r() * (steps + 1)) * s.step }; }
    if (hd2.kind === 'keypad') return { type: hd2.id, text: String(Math.floor(r() * 100)) };
    if (hd2.kind === 'choice') { var opts = hd2.ref.options; return opts.length ? { choose: hd2.id, option: String(opts[Math.floor(r() * opts.length)].id) } : null; }
    if (hd2.kind === 'grid') { var g = hd2.ref, cells = [], count = 1 + Math.floor(r() * 6); for (var i = 0; i < count; i++) cells.push([Math.floor(r() * g.cols), Math.floor(r() * g.rows)]); return r() > 0.25 ? { paint: hd2.id, cells: cells } : { erase: hd2.id, cells: cells }; }
    return { tap: hd2.id };
  }
  var current = null;
  window.__SK = {
    kit: KIT,
    manifest: function () { return current ? current.manifest() : null; },
    state: function () { var g = current; if (!g) return null; return { screen: g.screen, index: g.index, failed: g.failed, solved: !!(g.record && g.record.solved), attempts: g.record ? g.record.attempts : 0, dirty: !!(g.stage && g.stage.dirty), checkHidden: g.checkButton.hidden, checkDisabled: g.checkButton.disabled, feedback: g.back.textContent, hintHidden: g.hintButton.hidden, log: g.log.slice(-60), result: g.result() }; },
    goto: function (index) { current.records = []; current.goto(index); },
    steps: function (kind, j) { var g = current, r = g.round, src = kind === 'solution' ? r.solution : ((r.mistakes || [])[j] || {}).steps; var out = typeof src === 'function' ? src(g.stage, g.sk) : src; if (!Array.isArray(out)) throw new Error(kind + ' steps must be an array'); return JSON.parse(JSON.stringify(out)); },
    peek: function () { var g = current; if (!g.round || !g.stage) return false; var res = g.round.check(g.stage, g.sk); return res === true || !!(res && res.ok === true); },
    mistakeMatches: function (j) { var g = current, m = (g.round.mistakes || [])[j]; return !!(m && typeof m.when === 'function' && m.when(g.stage, g.sk)); },
    plan: function (step) { return lowLevel(current, step); },
    randomStep: function (seed) { return randomStep(current, rng(seed)); },
    layout: function () {
      var g = current, st = g.stage, issues = [], view = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > view + 1) issues.push('page is wider than the screen');
      if (st) { var sr = st.el.getBoundingClientRect(); for (var id in st.handles) { var hd = st.handles[id]; if (hd.kind === 'zone' || !hd.el.isConnected) continue; var r = hd.el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; var seen = Math.max(0, Math.min(r.right, sr.right) - Math.max(r.left, sr.left)) * Math.max(0, Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) / (r.width * r.height); if (seen < 0.05) issues.push('"' + id + '" is off the stage'); else if (seen < 0.85) issues.push('"' + id + '" is cut off by the edge of the stage'); else if (Math.min(r.width, r.height) < 30) issues.push('"' + id + '" is too small to tap (' + Math.round(Math.min(r.width, r.height)) + 'px)'); } }
      if (st) {
        var boxes = []; for (var wid in st.handles) { var w = st.handles[wid]; if (!w.el.isConnected || ['stepper', 'keypad', 'choice', 'grid'].indexOf(w.kind) < 0 && !w.el.classList.contains('sk-btn')) continue; boxes.push({ id: wid, r: w.el.getBoundingClientRect() }); }
        for (var a = 0; a < boxes.length; a++) for (var b = a + 1; b < boxes.length; b++) {
          var ra = boxes[a].r, rb = boxes[b].r, ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (ox > 6 && oy > 6) issues.push('"' + boxes[a].id + '" overlaps "' + boxes[b].id + '"');
        }
      }
      return issues;
    }
  };

  var topRandom = rng(INIT.seed != null ? INIT.seed : 12345);
  window.Sidekick = {
    version: KIT,
    // Seeded helpers for picking fresh numbers before the rounds are written down.
    rand: function () { return topRandom(); },
    int: function (a, b) { return a + Math.floor(topRandom() * (b - a + 1)); },
    pick: function (list) { return list[Math.floor(topRandom() * list.length)]; },
    shuffle: function (list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(topRandom() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
    game: function (def) {
      if (current) throw new Error('Sidekick.game() may only be called once');
      current = new Game(def); return current.sk;
    }
  };
  window.addEventListener('error', function (event) { if (current) current.fail(event.error || event.message); else post('error', { message: String(event.message || 'script error').slice(0, 300) }); });
  window.addEventListener('unhandledrejection', function (event) { if (current) current.fail(event.reason || 'promise rejected'); });
  setInterval(function () { post('heartbeat', {}); }, 1000);
})();
