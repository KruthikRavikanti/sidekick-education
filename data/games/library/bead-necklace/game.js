// Bead Necklace. Skill: find the part of a pattern that repeats and keep it going.
// A necklace repeats the same little group of beads over and over. To add the next beads
// the child has to find that group. Just copying the last bead breaks the pattern.
function necklace(o) {
  const unit = o.unit, shown = unit.concat(unit), want = unit.slice(0, o.blanks), lastBead = shown[shown.length - 1];
  const colors = unit.filter((bead, i) => unit.indexOf(bead) === i);
  const on = (stage, i) => stage.get('next' + i).texts()[0] || '';
  const string = (beads) => { const used = {}; return beads.map((bead, i) => { used[bead] = (used[bead] || 0) + 1; return { drag: 'bead' + colors.indexOf(bead) + '-' + used[bead], to: 'next' + i }; }); };
  const copy = want.map(() => lastBead);
  const px = (i) => 8 + i * 10.4;
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: 62, action: 'Clasp it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.block({ x: 2, y: 17.6, w: 96, h: 0.8, color: 'night', round: 0 });
      shown.forEach((bead, i) => stage.sprite({ emoji: bead, x: px(i), y: 18, size: 8.2 }));
      // With help on, each repeating group sits on its own colored mat.
      if (o.helped) [0, 1].forEach((g) => stage.block({ x: px(g * unit.length) - 4.9, y: 11, w: unit.length * 10.4 - 0.6, h: 14, color: g ? 'sun' : 'sky', opacity: 0.55, round: 3 }));
      want.forEach((bead, i) => stage.zone({ id: 'next' + i, x: px(shown.length + i) - 5, y: 12, w: 10, h: 12, look: 'slot', color: 'white', label: 'next bead ' + (i + 1), showLabel: false, capacity: 1, swap: true, accepts: 'bead' }));
      stage.zone({ id: 'box', x: 4, y: 34, w: 92, h: 24, look: 'tray', label: 'Bead box', showLabel: false, accepts: 'bead' });
      for (let n = 1; n <= 3; n++) colors.forEach((bead, c) => stage.sprite({ id: 'bead' + c + '-' + n, emoji: bead, size: 8.2, kind: 'bead', drag: true, zone: 'box', label: 'bead' }));
    },
    check: (stage) => want.every((bead, i) => on(stage, i) === bead),
    solution: () => string(want),
    mistakes: copy.join() === want.join() ? [] : [{ tag: 'copies_the_last_bead', when: (stage) => copy.every((bead, i) => on(stage, i) === bead), steps: () => string(copy),
      say: 'Those just copy the last bead. Look for the little group that repeats, then start that group again.' }],
  };
}

// A fresh necklace for the last round on every play.
const last = Sidekick.pick([['🔵', '🔵', '🟡'], ['🟢', '🔴', '🟡'], ['🔴', '🔵', '🔵']]);

Sidekick.game({
  title: 'Bead Necklace',
  emoji: '📿',
  premise: 'Each necklace repeats a little group of beads. Add the beads that come next.',
  outro: 'Beautiful! A pattern has a part that repeats. Find that part and you can keep it going forever.',
  rounds: [
    necklace({ id: 'red-blue', phase: 'guided', helped: true, unit: ['🔴', '🔵'], blanks: 2,
      say: 'Red, blue, red, blue. The colored mats show the group that repeats. Drag the next two beads onto the string.',
      hints: ['Each mat holds one red and one blue.', 'Start the group again: red, then blue.'],
      win: 'Red, blue, again and again.' }),
    necklace({ id: 'yellow-green-green', phase: 'guided', helped: true, unit: ['🟡', '🟢', '🟢'], blanks: 3,
      say: 'This group has three beads. Find it on the mats, then add the next three.',
      hints: ['The group is yellow, green, green.', 'It starts again with yellow.'],
      win: 'Yellow, green, green. The group repeats.' }),
    necklace({ id: 'three-colors', phase: 'guided', helped: true, unit: ['🔴', '🟡', '🔵'], blanks: 3,
      say: 'Three different colors now. What comes next?',
      hints: ['Read one mat out loud: red, yellow, blue.', 'Then say it again for the next three beads.'],
      win: 'Red, yellow, blue, over and over.' }),
    necklace({ id: 'last-necklace', phase: 'solo', unit: last, blanks: 3,
      say: 'No mats this time. Find the group that repeats and add the next three beads.' }),
  ],
});
