// Party Hats. Skill: compare two groups by matching them one to one.
// A group that is spread out looks bigger, but matching one hat to one pup shows the truth:
// whichever group has some left over has more.
const PUP_Y = 22, HAT_Y = 9;
const spread = (n, from, to) => Array.from({ length: n }, (_, i) => (n === 1 ? (from + to) / 2 : from + ((to - from) * i) / (n - 1)));

// Rounds 1 to 3: put one hat on each pup, then say which group has more.
function party(o) {
  const answer = o.pups > o.hats ? 'pups' : o.hats > o.pups ? 'hats' : 'same';
  const worn = (stage) => Array.from({ length: o.pups }, (_, i) => stage.get('head' + (i + 1)).count).reduce((a, b) => a + b, 0);
  const dressUp = () => Array.from({ length: Math.min(o.pups, o.hats) }, (_, i) => ({ drag: 'hat' + (i + 1), to: 'head' + (i + 1) }));
  return {
    id: o.id, phase: 'guided', scene: 'meadow', height: 74, action: 'Party time!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      spread(o.pups, o.pupFrom, o.pupTo).forEach((x, i) => {
        stage.sprite({ emoji: '🐶', x, y: PUP_Y, size: 9 });
        stage.zone({ id: 'head' + (i + 1), x: x - 5.5, y: HAT_Y - 5.5, w: 11, h: 11, look: 'slot', color: 'white', label: 'Pup ' + (i + 1), showLabel: false, capacity: 1, accepts: 'hat' });
      });
      stage.zone({ id: 'box', x: o.boxX, y: 34, w: o.boxW, h: 13, look: 'basket', label: 'Hat box', showLabel: false, layout: 'row', accepts: 'hat' });
      for (let i = 1; i <= o.hats; i++) stage.sprite({ id: 'hat' + i, emoji: '🎩', size: 8, kind: 'hat', drag: true, zone: 'box', label: 'hat ' + i });
      stage.choice({ id: 'more', x: 50, y: 60, w: 96, options: [{ id: 'pups', text: 'More pups', emoji: '🐶' }, { id: 'same', text: 'The same' }, { id: 'hats', text: 'More hats', emoji: '🎩' }] });
    },
    check: (stage) => worn(stage) === Math.min(o.pups, o.hats) && stage.get('more').value === answer,
    solution: () => dressUp().concat([{ choose: 'more', option: answer }]),
    mistakes: [{
      tag: 'judges_by_space', when: (stage) => stage.get('more').value === o.trap, steps: () => dressUp().concat([{ choose: 'more', option: o.trap }]),
      say: 'It looks that way because of the space it takes up. Match one hat to one pup and see what is left over.',
    }],
  };
}

// Last round: three tables, no dragging. The spread-out group is never the bigger one.
function tables(sets) {
  const rows = sets.map((s, i) => Object.assign({ y: 6 + i * 26, answer: s.a > s.b ? 'a' : s.b > s.a ? 'b' : 'same' }, s));
  const pick = (key) => rows.map((row, i) => ({ choose: 'row' + (i + 1), option: row[key] }));
  return {
    id: 'three-tables', phase: 'solo', scene: 'meadow', height: 84, action: 'Party time!',
    say: 'Three more tables. No moving this time. For each one, tap which group has more.',
    setup(stage) {
      rows.forEach((row, i) => {
        stage.block({ x: 2, y: row.y - 3, w: 96, h: 25, color: 'white', round: 3, opacity: 0.55 });
        spread(row.a, row.aFrom, row.aTo).forEach((x) => stage.sprite({ emoji: row.aEmoji, x, y: row.y + 2, size: 5.4 }));
        spread(row.b, row.bFrom, row.bTo).forEach((x) => stage.sprite({ emoji: row.bEmoji, x, y: row.y + 2, size: 5.4 }));
        stage.choice({ id: 'row' + (i + 1), x: 50, y: row.y + 13.5, w: 94, options: [{ id: 'a', text: 'more', emoji: row.aEmoji }, { id: 'same', text: 'the same' }, { id: 'b', text: 'more', emoji: row.bEmoji }] });
      });
    },
    check: (stage) => rows.every((row, i) => stage.get('row' + (i + 1)).value === row.answer),
    solution: () => pick('answer'),
    mistakes: [{ tag: 'judges_by_space', when: (stage) => rows.every((row, i) => stage.get('row' + (i + 1)).value === row.trap), steps: () => pick('trap'), say: '' }],
  };
}

// Fresh tables on every play. In each row "trap" is the group that only looks bigger.
const last = Sidekick.pick([
  [{ a: 5, b: 4, aEmoji: '🐱', bEmoji: '🧶', aFrom: 6, aTo: 30, bFrom: 46, bTo: 94, trap: 'b' },
   { a: 3, b: 6, aEmoji: '🐰', bEmoji: '🥕', aFrom: 6, aTo: 44, bFrom: 60, bTo: 94, trap: 'a' },
   { a: 4, b: 4, aEmoji: '🐻', bEmoji: '🍯', aFrom: 6, aTo: 48, bFrom: 68, bTo: 92, trap: 'a' }],
  [{ a: 4, b: 6, aEmoji: '🐸', bEmoji: '🪰', aFrom: 6, aTo: 46, bFrom: 60, bTo: 94, trap: 'a' },
   { a: 5, b: 5, aEmoji: '🐵', bEmoji: '🍌', aFrom: 6, aTo: 34, bFrom: 48, bTo: 94, trap: 'b' },
   { a: 6, b: 5, aEmoji: '🐭', bEmoji: '🧀', aFrom: 6, aTo: 38, bFrom: 50, bTo: 94, trap: 'b' }],
]);

Sidekick.game({
  title: 'Party Hats',
  emoji: '🎩',
  premise: 'Every pup wants a party hat. Match them up to see which group has more.',
  outro: 'Party time! Match one to one, and the group with some left over has more.',
  rounds: [
    party({ id: 'spread-pups', pups: 4, hats: 5, pupFrom: 10, pupTo: 90, boxX: 30, boxW: 46, trap: 'pups',
      say: 'The pups stand far apart. Drag one hat onto each pup. Then tap which group has more.',
      hints: ['Put one hat above each pup.', 'One hat is left in the box. So there are more hats.'],
      win: 'Every pup has a hat and one hat is left. More hats!' }),
    party({ id: 'crowded-pups', pups: 6, hats: 4, pupFrom: 22, pupTo: 78, boxX: 4, boxW: 92, trap: 'hats',
      say: 'Now the pups are close together and the hats lie far apart. Match them up again.',
      hints: ['Give out all 4 hats, one to a pup.', 'Two pups have no hat. So there are more pups.'],
      win: 'Two pups are still waiting. More pups!' }),
    party({ id: 'same-number', pups: 5, hats: 5, pupFrom: 8, pupTo: 92, boxX: 32, boxW: 48, trap: 'pups',
      say: 'One more table. Give each pup a hat and see if anything is left over.',
      hints: ['Hand out every hat.', 'No hat is left and no pup is waiting.'],
      win: 'Nothing left over on either side. The same!' }),
    tables(last),
  ],
});
