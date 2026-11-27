// Juice Jug. Skill: add fractions with unlike denominators.
// Two pours of different sizes go into one jug. To label how full it is, the jug needs marks
// that both pours land on: a common denominator. Adding tops and bottoms labels it far too low.
const JX = 12, JW = 26, JY = 10, JH = 48;
const level = (f) => JY + JH * (1 - f);

function jug(o) {
  const [a, b, c, d] = o.mix, sum = a / b + c / d;
  const parts = (stage) => stage.get('parts').value, full = (stage) => stage.get('full').value;
  const label = (n, k) => [{ set: 'parts', value: n }, { set: 'full', value: k }];
  let lcd = b; while (lcd % d) lcd += b;
  return {
    id: o.id, phase: o.phase, scene: 'kitchen', height: 74, action: 'Label it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🍊 {' + a + '/' + b + '} + 🍇 {' + c + '/' + d + '}', x: 72, y: 7, size: 4.6, card: true });
      stage.block({ x: JX, y: JY, w: JW, h: JH, color: 'white', opacity: 0.6, round: 1.5, border: 'night' });
      stage.block({ x: JX, y: level(a / b), w: JW, h: JH * (a / b), color: 'orange', round: 0, z: 2 });
      stage.block({ x: JX, y: level(sum), w: JW, h: JH * (c / d), color: 'grape', round: 0, z: 2 });
      const cover = stage.block({ x: JX, y: JY, w: JW, h: JH, color: '#d9c7a3', round: 1.5, border: 'night', z: 3 });
      if (o.helped) cover.hide(); else stage.label({ text: '🫙', x: JX + JW / 2, y: JY + JH / 2, size: 9, z: 6 });
      const marks = Array.from({ length: 11 }, () => stage.block({ x: JX, y: JY, w: JW, h: 0.5, color: 'night', round: 0, z: 4 }).hide());
      const arrow = stage.label({ text: '', x: JX + JW + 9, y: level(0), size: 3.8 });
      stage.label({ text: 'Split the jug into', x: 74, y: 19, size: 3.3 });
      stage.stepper({ id: 'parts', x: 74, y: 28, min: 2, max: 12, value: 2, format: (v) => v + ' parts' });
      stage.label({ text: 'Parts that are full', x: 74, y: 42, size: 3.3 });
      stage.stepper({ id: 'full', x: 74, y: 51, min: 0, max: 12, value: 0, format: (v) => v + ' full' });
      const note = o.helped ? stage.label({ text: 'Find marks that both juices land on.', x: 50, y: 67, size: 3.4, card: true }) : null;
      // The world reacts: the marks are redrawn and an arrow shows where the label says the juice is.
      const draw = () => {
        const n = parts(stage), k = Math.min(full(stage), n);
        marks.forEach((mark, i) => (i + 1 < n ? mark.set({ y: level((i + 1) / n) - 0.25 }).show() : mark.hide()));
        arrow.set('◀ {' + k + '/' + n + '}').moveTo(JX + JW + 9, level(k / n));
        if (!note) return;
        const lands = (a * n) % b === 0 && (c * n) % d === 0;
        note.set(!lands ? 'These marks do not line up with both juices.' : k / n < sum - 1e-9 ? 'Good marks. The arrow is below the juice.' : k / n > sum + 1e-9 ? 'Good marks. The arrow is above the juice.' : 'The label matches the juice!');
      };
      draw(); stage.on('change', draw);
      stage.data = { cover };
    },
    check: (stage) => full(stage) * b * d === (a * d + c * b) * parts(stage),
    solution: () => label(lcd, (a * lcd) / b + (c * lcd) / d),
    mistakes: [{ tag: 'adds_tops_and_bottoms', when: (stage) => parts(stage) === b + d && full(stage) === a + c, steps: () => label(b + d, a + c),
      say: 'Adding the tops and the bottoms gives {' + (a + c) + '/' + (b + d) + '}, which is less than the orange juice alone. Find parts that both pours fit.' }],
    onWin(stage) { stage.data.cover.hide(); },
  };
}

// A fresh mix for the last round on every play.
const last = Sidekick.pick([[1, 4, 1, 3], [1, 2, 1, 5], [1, 2, 2, 5]]);

Sidekick.game({
  title: 'Juice Jug',
  emoji: '🧃',
  premise: 'Pour two juices into one jug, then label exactly how full it is.',
  outro: 'Labeled! To add fractions, first cut both into the same size parts, then count the parts.',
  rounds: [
    jug({ id: 'half-and-quarter', phase: 'guided', helped: true, mix: [1, 2, 1, 4],
      say: 'Half a jug of orange and a quarter of grape. Split the jug so both land on a mark, then set how many parts are full.',
      hints: ['Try 4 parts. The orange juice fills 2 of them.', '2 parts orange and 1 part grape is 3 parts full.'],
      win: '{1/2} + {1/4} = {2/4} + {1/4} = {3/4}.' }),
    jug({ id: 'half-and-third', phase: 'guided', helped: true, mix: [1, 2, 1, 3],
      say: 'Now a half and a third. Halves and thirds do not line up, so find marks that fit both.',
      hints: ['Both 2 and 3 go into 6.', 'In sixths: 3 parts orange and 2 parts grape.'],
      win: '{1/2} + {1/3} = {3/6} + {2/6} = {5/6}.' }),
    jug({ id: 'thirds-and-sixth', phase: 'guided', helped: true, mix: [2, 3, 1, 6],
      say: 'Two thirds of orange and a sixth of grape. Label the jug.',
      hints: ['Sixths work for both.', '2 thirds is 4 sixths. One more sixth makes 5.'],
      win: '{2/3} + {1/6} = {4/6} + {1/6} = {5/6}.' }),
    jug({ id: 'covered-jug', phase: 'solo', mix: last,
      say: 'This jug is wrapped, so you cannot see the juice. Work out the label for the two pours.' }),
  ],
});
