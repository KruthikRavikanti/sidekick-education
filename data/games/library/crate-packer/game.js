// Crate Packer. Skill: volume is layers of cubes, length times width times height.
// A crate is packed one layer at a time. Each layer holds length times width cubes, and
// there is one layer for each unit of height. Adding the three sides orders far too few.
const X0 = 9, BASE = 64;

function crate(o) {
  const V = o.l * o.w * o.h, typed = (stage) => stage.get('cubes').number;
  const C = Math.min(7, 46 / (o.h * o.w + o.h * 0.7), 30 / o.l);   // small crates are drawn bigger
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'cubes', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 80, action: 'Pack!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '📦 ' + o.l + ' long, ' + o.w + ' wide, ' + o.h + ' tall', x: 31, y: 7, size: 3.8, card: true });
      const cubes = [];
      for (let layer = 0; layer < o.h; layer++) {
        const y = BASE - (layer + 1) * (o.w * C + 2.2);
        stage.block({ x: X0 - 0.6, y: y - 0.6, w: o.l * C + 1.2, h: o.w * C + 1.2, color: 'white', opacity: o.helped ? 0.7 : 0.35, round: 0.8, border: 'night' });
        if (o.helped) stage.label({ text: 'layer ' + (layer + 1), x: X0 + o.l * C + 9, y: y + (o.w * C) / 2, size: 3 });
        for (let r = 0; r < o.w; r++) for (let c = 0; c < o.l; c++) cubes.push(stage.block({ x: X0 + c * C + 0.2, y: y + r * C + 0.2, w: C - 0.4, h: C - 0.4, color: layer % 2 ? 'orange' : 'sun', round: 0.5, border: 'night', z: 3 }).hide());
      }
      const note = stage.label({ text: '', x: 31, y: 72, size: 3.6, card: true }).hide();
      stage.keypad({ id: 'cubes', x: 80, y: 46 });
      const pack = (n) => cubes.forEach((cube, i) => (i < n ? cube.show() : cube.hide()));
      // The world reacts: the cubes ordered are packed in, bottom layer first.
      if (o.helped) stage.on('change', () => {
        const n = typed(stage) || 0; pack(n);
        if (!n) note.hide(); else note.set(n > V ? (n - V) + ' cubes do not fit' : n < V ? 'The crate is not full yet' : 'Packed tight!').show();
      });
      stage.data = { pack };
    },
    check: (stage) => typed(stage) === V,
    solution: () => [{ type: 'cubes', text: String(V) }],
    mistakes: [
      wrong('adds_the_sides', o.l + o.w + o.h, 'Adding the three sides does not count cubes. One layer holds ' + o.l + ' × ' + o.w + ', and there are ' + o.h + ' layers.'),
      wrong('counts_one_layer', o.l * o.w, 'That fills one layer. The crate is ' + o.h + ' layers tall.'),
    ],
    onWin(stage) { stage.data.pack(V); },
  };
}

// A fresh crate for the last round on every play.
const last = Sidekick.pick([{ l: 4, w: 3, h: 3 }, { l: 5, w: 3, h: 2 }, { l: 3, w: 3, h: 4 }, { l: 5, w: 2, h: 4 }]);

Sidekick.game({
  title: 'Crate Packer',
  emoji: '📦',
  premise: 'Pack each crate full of cubes, one layer at a time. Order exactly enough.',
  outro: 'All packed! Volume is the cubes in one layer times the number of layers: length × width × height.',
  rounds: [
    crate({ id: 'small-crate', phase: 'guided', helped: true, l: 3, w: 2, h: 2,
      say: 'This crate is 3 long, 2 wide and 2 tall. Type how many cubes fill it and watch them pack in.',
      hints: ['One layer is 3 by 2. That is 6 cubes.', 'There are 2 layers of 6.'],
      win: '3 × 2 × 2 = 12 cubes.' }),
    crate({ id: 'tall-crate', phase: 'guided', helped: true, l: 4, w: 2, h: 3,
      say: 'A taller crate: 4 long, 2 wide, 3 tall. How many cubes?',
      hints: ['One layer holds 4 × 2 = 8.', '3 layers of 8.'],
      win: '4 × 2 × 3 = 24 cubes.' }),
    crate({ id: 'long-crate', phase: 'guided', helped: true, l: 5, w: 2, h: 2,
      say: 'This one is 5 long, 2 wide and 2 tall. Fill it exactly.',
      hints: ['5 × 2 = 10 in one layer.', '2 layers of 10.'],
      win: '5 × 2 × 2 = 20 cubes.' }),
    crate({ id: 'last-crate', phase: 'solo', l: last.l, w: last.w, h: last.h,
      say: 'The cubes stay on the truck until you order. This crate is ' + last.l + ' long, ' + last.w + ' wide and ' + last.h + ' tall. How many cubes?' }),
  ],
});
