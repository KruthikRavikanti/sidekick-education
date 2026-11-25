# Sidekick game kit (kit-1)

A game is one JavaScript file. It runs by itself inside a locked frame: no network, no storage,
no links, no access to the page around it. It calls `Sidekick.game({...})` exactly once.
The kit draws the brand, runs the rounds, handles dragging, tapping and the keyboard, gives
hints, keeps score and reports the result. The game supplies the world and the rules.

## The shape of a game

```js
Sidekick.game({
  title: 'Froggy\'s Bridge',        // 3 to 60 characters
  emoji: '🐸',                      // shown on the start card
  premise: 'One or two short sentences that set the mission.',   // 10 to 180 characters
  outro: 'One sentence that says the idea in plain words.',
  rounds: [ /* 2 to 5 guided rounds, then exactly one solo round */ ],
});
```

Each round:

```js
{
  id: 'three-fourths',             // short and unique
  phase: 'guided',                 // 'guided' or 'solo'. The last round is the only solo round.
  say: 'The mission for this round, 34 words or fewer.',
  action: 'Hop!',                  // label on the main button (default "Check")
  scene: 'ocean', height: 80,      // backdrop and stage height in units (40 to 130)
  setup(stage, sk) { /* build the round */ },
  check(stage, sk) { return true; },   // true, false, or { ok: false, mistake: 'tag' }. No side effects.
  solution(stage) { return [ /* steps that win the round */ ]; },
  mistakes: [{                     // the known wrong ways to play this round
    tag: 'adds_the_sides',         // snake_case name of the mistake
    when(stage) { return false; }, // true when the stage shows this mistake
    say: 'What the child sees and what to try. Never "wrong".',   // guided rounds only
    steps(stage) { return [ /* steps that play the mistake */ ]; },
  }],
  hints: ['A nudge.', 'A stronger nudge.'],   // guided rounds: 1 to 3. Solo round: none.
  win: 'One sentence that names what just worked.',   // guided rounds
  onWin(stage, sk) { /* the world celebrates */ },
}
```

Guided rounds let the child explore with help. The solo round is a fresh version with new
numbers or words and no hints, no `win` line, no `autoCheck`, and at least one entry in `mistakes`.
Wrap any fraction in braces to stack it: `'{3/4}'`. All text is plain text.

## The stage

The stage is 100 units wide and `height` units tall. `(0, 0)` is the top left. Sprites, labels
and controls are placed by their center. Zones and blocks are placed by their top left corner.
One unit is about 3.5 px on a small phone and 7.6 px on a tablet, and everything scales with it, so a layout
that fits at one size fits at every size. Anything a child drags or taps must be at least 9.5 units wide and tall.

Layers from back to front: blocks, zones, labels, tracks, controls, sprites. Sprites, zones, labels, blocks and `stage.add` take `z` to change that.

Scenes: `meadow sky kitchen ocean space night desk candy sand forest city paper snow field`.
Colors: `forest lime orange berry cream night sky sun coral mint grape sand white leaf`, or any CSS color.

### Sprites: things

```js
const frog = stage.sprite({ id: 'frog', emoji: '🐸', x: 10, y: 30, size: 10 });
stage.sprite({ id: 'tile1', text: 'ves', size: 5, drag: true, zone: 'pool', kind: 'ending', value: 3, data: { any: 'thing' } });
stage.sprite({ id: 'plank1', shape: 'rect', w: 19, h: 9, color: 'orange', caption: '{1/4}', drag: true, zone: 'pile' });
stage.sprite({ id: 'lamp', emoji: '💡', x: 50, y: 20, size: 10, tap(sprite, sk) { sprite.data.on = !sprite.data.on; } });
```

Looks: `emoji`, `text` (add `plain: true` for bare text), `shape: 'rect' | 'circle'` with `w h color caption`,
or `svg` / `html` with `w h`. Behaviour: `drag: true` (must land in a zone, otherwise it goes back),
`drag: 'free'` (can rest anywhere), `tap(sprite, sk)`. Other options: `zone` (start inside a zone, which
becomes its home), `kind`, `value`, `data`, `label` (spoken name), `z`, `float`, `badge`, `hidden`.

Read: `sprite.id .kind .value .data .x .y .text .emoji .zone` (zone id or null).
Do: `moveTo(x, y)` (animates), `place(zoneId)`, `home()`, `set({ emoji, text, size, value, kind, data })`,
`badge(text)`, `pop()`, `shake()`, `spin()`, `float()`, `hide()`, `show()`, `lock()`, `remove()`.

### Zones: places things can go

```js
stage.zone({ id: 'plate', x: 10, y: 20, w: 30, h: 22, look: 'plate', label: 'Plate', capacity: 4,
  accepts: 'cookie', layout: 'flow', onDrop(sprite, zone, sk) { /* the world reacts */ } });
```

Options: `look` (`tray plate box basket slot ghost cloud`), `color`, `label`, `labelAt` (`'top'`, `'in'`, or below),
`showLabel: false`, `layout` (`flow row grid stack free`), `align` (`start center end`), `cols`, `rows`, `gap`, `pad`,
`capacity`, `swap: true` (a full zone hands back what it held), `accepts` (a kind, a list of kinds, or
`(sprite, zone) => boolean`), `onDrop`, `onReject`.

Read: `zone.sprites` (in order), `zone.count`, `zone.ids`, `zone.has(spriteOrId)`, `zone.kinds()`, `zone.values()`,
`zone.texts()`, `zone.sum(keyOrFn)`, `zone.countOf(kind)`. Do: `zone.setLabel(text)`, `zone.clear()`.

### Controls

```js
stage.stepper({ id: 'hops', x: 50, y: 60, min: 0, max: 12, value: 0, step: 1, format: (v) => v + ' hops' });  // .value  .set(v)
stage.keypad({ id: 'total', x: 80, y: 46, prefix: '$', keys: 'decimal' });   // .value (text)  .number  .set(text)   keys: 'fraction' adds "/"
stage.choice({ id: 'pick', x: 50, y: 60, w: 80, options: ['3', { id: 'b', text: 'four', emoji: '🍎' }] });   // .value  .set(id)
stage.grid({ id: 'mold', x: 50, y: 40, cols: 4, rows: 3, cell: 10, color: 'orange' });   // paint by tapping or sliding
//   .count  .isOn(c, r)  .cells()  .rect() -> { cols, rows, c, r } or null  .rowCount(r)  .colCount(c)  .set(cells, true)  .clear(true)
//   options: emoji, filled: [[c, r]], locked: [[c, r]], paint: false (display only)
const line = stage.track({ id: 'line', x: 10, y: 40, w: 80, min: 0, max: 1, step: 1 / 4, format: (v, i) => i + '/4' });   // .at(value)
stage.marker({ id: 'flag', track: 'line', value: 0, emoji: '🚩' });   // .value  .setValue(v). Snaps to the track's steps.
stage.button({ id: 'pour', text: 'Pour', x: 50, y: 60, onTap(sk, button) { /* ... */ } });   // .taps
```

A keypad is 38 units wide and 58 tall. A stepper is about 40 by 14, wider with long text. A choice chip is at least 11 tall.
Keep controls clear of each other and of anything a child needs to see.

### Scenery, text and custom drawing

```js
stage.label({ id: 'sign', text: 'Berry at {3/4}', x: 50, y: 8, size: 5, card: true });   // .set(text)  .moveTo(x, y)  .hide()  .show()
const water = stage.block({ x: 0, y: 40, w: 100, h: 30, color: 'sky', round: 2 });        // .set({ x, y, w, h, color })  .hide()  .show()
stage.add('<svg viewBox="0 0 10 10">...</svg>', { x: 10, y: 10, w: 20, h: 20, id: 'gear', onTap(sk) {} });   // any SVG or HTML
stage.burst(50, 30, ['⭐', '✨']);   // a little celebration at a point
```

### Reacting

```js
stage.on('change', () => { /* runs after every drag, tap, step, key or paint */ });
sk.after(600, () => {});    sk.every(1000, () => {});    sk.say('A line under the stage.');    sk.confetti();
sk.pick(list)  sk.shuffle(list)  sk.int(1, 6)  sk.rand()  sk.gcd(a, b)  sk.frac(3, 4) // '{3/4}'
Sidekick.pick(list)  Sidekick.shuffle(list)  Sidekick.int(a, b)   // the same helpers, before Sidekick.game(), for fresh numbers
stage.get(id)   stage.all(kind)   stage.H   // height
```

## Steps: how the robot plays

`solution` and each mistake's `steps` return a list of steps. The robot performs them with a real pointer.

```js
{ drag: 'plank1', to: 'bridge' }            { drag: 'coin', toXY: [40, 30] }      { drag: 'plank1', home: true }
{ tap: 'lamp', times: 2 }                   { choose: 'pick', option: 'b' }       { set: 'hops', value: 5 }
{ type: 'total', text: '24' }               { paint: 'mold', cells: [[0, 0], [1, 0]] }   { erase: 'mold', cells: [[0, 0]] }
{ slide: 'flag', value: 0.75 }              { wait: 300 }
```

## What the robot proves before anyone plays

1. The game starts, and every round opens without an error.
2. No round is already solved before the child does anything.
3. Playing `solution` wins every round, and a clean run ends with the solo round right on the first try.
4. Playing each mistake's `steps` makes its own `when` true, does not win, and reports its `tag`.
5. Random play cannot win the solo round more than a third of the time.
6. Nothing is cut off, overlapping or too small on a phone or a tablet.
7. No network request, no navigation, no script error.

## Not available inside the frame

`fetch`, `XMLHttpRequest`, `WebSocket`, `import`, `eval`, `new Function`, cookies and storage, `location`, `navigator`,
`postMessage`, `parent`, `alert`, links, forms, text inputs, `setInterval` (use `sk.every`), endless loops, and any URL.
Game CSS (optional) may not use `url()`, `@import` or `position: fixed`.
