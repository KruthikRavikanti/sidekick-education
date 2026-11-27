// Longest Carrot. Skill: line up the ends before comparing lengths.
// The carrots hang at different heights, so the one that sticks up highest is not the
// longest. Tapping a carrot stands it on the table. Only then do the tops tell the truth.
const G = 48;

function contest(o) {
  const xs = o.lens.length === 2 ? [32, 68] : [20, 50, 80];
  const longest = o.lens.indexOf(Math.max(...o.lens));
  const tips = o.lens.map((len, i) => G - o.lift[i] - len), trap = tips.indexOf(Math.min(...tips));
  const crown = (i) => ({ drag: 'crown', to: 'spot' + i });
  return {
    id: o.id, phase: o.phase, scene: 'kitchen', height: 82, action: 'Crown it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.block({ x: 0, y: G, w: 100, h: 1.4, color: 'forest', round: 0 });
      stage.sprite({ emoji: '🐰', x: 92, y: 8, size: 9 });
      o.lens.forEach((len, i) => {
        stage.sprite({ id: 'carrot' + i, shape: 'rect', w: 9.5, h: len, color: 'orange', x: xs[i], y: G - o.lift[i] - len / 2, label: 'carrot ' + (i + 1),
          tap(carrot) { carrot.moveTo(xs[i], G - len / 2); } });
        stage.zone({ id: 'spot' + i, x: xs[i] - 8, y: G + 3, w: 16, h: 12, look: 'plate', label: 'under carrot ' + (i + 1), showLabel: false, capacity: 1, accepts: 'crown' });
      });
      stage.zone({ id: 'cushion', x: 38, y: 67, w: 24, h: 12, look: 'tray', color: 'berry', label: 'Crown', showLabel: false, accepts: 'crown' });
      stage.sprite({ id: 'crown', emoji: '👑', size: 8.5, kind: 'crown', drag: true, zone: 'cushion', label: 'crown' });
    },
    check: (stage) => stage.get('crown').zone === 'spot' + longest,
    solution: () => o.lens.map((len, i) => ({ tap: 'carrot' + i })).concat([crown(longest)]),
    mistakes: [{ tag: 'picks_what_sticks_out', when: (stage) => stage.get('crown').zone === 'spot' + trap, steps: () => [crown(trap)],
      say: 'That carrot reaches the highest, but its bottom is up in the air. Tap each carrot to stand it on the table, then look again.' }],
  };
}

// Fresh carrots for the last round. The one that sticks up highest is never the longest.
const last = Sidekick.pick([{ lens: [24, 30, 20], lift: [14, 0, 12] }, { lens: [28, 18, 24], lift: [0, 14, 12] }, { lens: [22, 26, 30], lift: [14, 12, 0] }]);

Sidekick.game({
  title: 'Longest Carrot',
  emoji: '🥕',
  premise: 'Bunny gives a crown to the longest carrot. Stand them on the table to compare fairly.',
  outro: 'Crowned! To compare lengths, line up one end first.',
  rounds: [
    contest({ id: 'two-carrots', phase: 'guided', lens: [22, 28], lift: [14, 0],
      say: 'Which carrot is longer? Tap each carrot to stand it on the table. Then drag the crown under the longer one.',
      hints: ['Tap the carrot that hangs in the air.', 'Now both bottoms are on the table. Which top is higher?'],
      win: 'With both ends on the table, the longer carrot is easy to see.' }),
    contest({ id: 'two-more', phase: 'guided', lens: [30, 22], lift: [0, 14],
      say: 'Two new carrots. Line up their bottoms first, then crown the longer one.',
      hints: ['One carrot is already standing on the table.', 'Drop the other one and compare the tops.'],
      win: 'Lined up at the bottom, the longer one stands taller.' }),
    contest({ id: 'three-carrots', phase: 'guided', lens: [20, 26, 30], lift: [14, 10, 0],
      say: 'Three carrots now. Stand them all on the table and crown the longest.',
      hints: ['Tap every carrot that is floating.', 'The one on the right is the tallest when they all stand.'],
      win: 'All lined up. The longest carrot wins the crown.' }),
    contest({ id: 'last-contest', phase: 'solo', lens: last.lens, lift: last.lift,
      say: 'Last contest. Find the longest carrot and give it the crown.' }),
  ],
});
