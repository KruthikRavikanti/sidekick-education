// Puppy Yard. Skill: area is length times width, perimeter is all four sides added up.
// Fence panels go around the edge. Grass squares cover the inside. Order the wrong one and
// the yard shows it: a gap the puppy escapes through, or bare dirt, or a pile left over.
const X0 = 10, Y0 = 17, CELL = 6;

function yard(o) {
  const P = 2 * o.l + 2 * o.w, A = o.l * o.w, need = o.job === 'fence' ? P : A, other = o.job === 'fence' ? A : P;
  const typed = (stage) => stage.get('order').number;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'order', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'meadow', height: 76, action: 'Build!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.block({ x: X0, y: Y0, w: o.l * CELL, h: o.w * CELL, color: '#c9a273', round: 0.5, border: 'night' });
      stage.label({ text: o.l + ' m', x: X0 + (o.l * CELL) / 2, y: Y0 - 5, size: 4, card: true });
      stage.label({ text: o.w + ' m', x: 4.6, y: Y0 + (o.w * CELL) / 2, size: 3.4, card: true });
      const grass = [], panels = [];
      for (let r = 0; r < o.w; r++) for (let c = 0; c < o.l; c++) {
        if (o.helped) stage.block({ x: X0 + c * CELL, y: Y0 + r * CELL, w: CELL, h: CELL, color: 'white', opacity: 0.12, border: 'night', round: 0, z: 2 });
        grass.push(stage.block({ x: X0 + c * CELL + 0.3, y: Y0 + r * CELL + 0.3, w: CELL - 0.6, h: CELL - 0.6, color: 'leaf', round: 0.6, z: 3 }).hide());
      }
      const panel = (x, y, flat) => panels.push(stage.block({ x: flat ? x + 0.4 : x - 0.8, y: flat ? y - 0.8 : y + 0.4, w: flat ? CELL - 0.8 : 1.6, h: flat ? 1.6 : CELL - 0.8, color: 'orange', round: 0.4, z: 5 }).hide());
      for (let c = 0; c < o.l; c++) panel(X0 + c * CELL, Y0, true);
      for (let r = 0; r < o.w; r++) panel(X0 + o.l * CELL, Y0 + r * CELL, false);
      for (let c = o.l - 1; c >= 0; c--) panel(X0 + c * CELL, Y0 + o.w * CELL, true);
      for (let r = o.w - 1; r >= 0; r--) panel(X0, Y0 + r * CELL, false);
      stage.sprite({ id: 'pup', emoji: '🐶', x: X0 + (o.l * CELL) / 2, y: Y0 + (o.w * CELL) / 2, size: 7, z: 12 });
      const note = stage.label({ text: o.job === 'fence' ? '🪵 fence panels' : '🟩 grass squares', x: 30, y: 66, size: 3.6, card: true });
      stage.keypad({ id: 'order', x: 80, y: 44 });
      const pieces = o.job === 'fence' ? panels : grass, what = o.job === 'fence' ? 'panels' : 'squares';
      const build = (n) => pieces.forEach((piece, i) => (i < n ? piece.show() : piece.hide()));
      // The world reacts: what was ordered is laid down, piece by piece.
      if (o.helped) stage.on('change', () => {
        const n = typed(stage) || 0; build(n);
        note.set(!n ? (o.job === 'fence' ? '🪵 fence panels' : '🟩 grass squares') : n > need ? (n - need) + ' ' + what + ' left over'
          : n < need ? (o.job === 'fence' ? 'A gap! The puppy can get out.' : 'Bare dirt is still showing.') : 'A perfect fit!');
      });
      stage.data = { build };
    },
    check: (stage) => typed(stage) === need,
    solution: () => [{ type: 'order', text: String(need) }],
    mistakes: [
      wrong('swaps_area_and_perimeter', other, o.job === 'fence'
        ? o.l + ' × ' + o.w + ' counts the squares inside. A fence goes around: add all four sides.'
        : 'Adding the sides gives the distance around. Grass covers the inside: ' + o.l + ' rows of ' + o.w + '.'),
      wrong('adds_two_sides', o.l + o.w, 'That is only two sides of the yard. Think about the whole job.'),
    ],
    onWin(stage) { stage.data.build(need); stage.get('pup').pop(); },
  };
}

// A fresh job for the last round: sometimes a fence, sometimes grass.
const last = Sidekick.pick([{ job: 'fence', l: 8, w: 4 }, { job: 'grass', l: 6, w: 5 }, { job: 'fence', l: 7, w: 5 }, { job: 'grass', l: 8, w: 3 }]);
const lastSay = last.job === 'fence'
  ? 'Last yard: ' + last.l + ' m by ' + last.w + ' m. How many 1 m fence panels go all the way around?'
  : 'Last yard: ' + last.l + ' m by ' + last.w + ' m. How many 1 m grass squares cover the whole inside?';

Sidekick.game({
  title: 'Puppy Yard',
  emoji: '🐶',
  premise: 'Build yards for the puppies. Fence goes around the edge and grass covers the inside.',
  outro: 'Happy puppies! Around the edge is perimeter. Covering the inside is area.',
  rounds: [
    yard({ id: 'first-fence', phase: 'guided', job: 'fence', l: 6, w: 2, helped: true,
      say: 'This yard is 6 m by 2 m. Each fence panel is 1 m long. Type how many panels go all the way around.',
      hints: ['Walk around the edge: 6, then 2, then 6, then 2.', '6 + 2 + 6 + 2 = 16.'],
      win: '6 + 2 + 6 + 2 = 16 panels. That is the perimeter.' }),
    yard({ id: 'first-grass', phase: 'guided', job: 'grass', l: 5, w: 4, helped: true,
      say: 'Now grass. This yard is 5 m by 4 m. Each grass square is 1 m wide. How many squares cover it?',
      hints: ['Count one row, then count the rows.', '4 rows of 5 squares is 4 × 5.'],
      win: '5 × 4 = 20 squares. That is the area.' }),
    yard({ id: 'second-grass', phase: 'guided', job: 'grass', l: 7, w: 3, helped: true,
      say: 'A long yard: 7 m by 3 m. Order the grass squares to cover all of it.',
      hints: ['3 rows of 7.', '7 × 3 = 21.'],
      win: '7 × 3 = 21 squares cover the yard.' }),
    yard({ id: 'last-yard', phase: 'solo', job: last.job, l: last.l, w: last.w, say: lastSay }),
  ],
});
