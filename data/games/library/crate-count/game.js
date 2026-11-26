// Crate Count. Skill: combine like terms, and only like terms.
// An x is a sealed crate with an unknown number of apples inside. A plain number is loose
// apples. Crates add to crates and apples add to apples. A crate and an apple are not two crates.
const draw = (boxes, dots) => '📦'.repeat(boxes) + (boxes && dots ? '  ' : '') + '🍎'.repeat(dots);

function dock(o) {
  // o.terms like [[3, 'x'], [2, ''], [4, 'x'], [5, '']]
  const boxes = o.terms.filter((t) => t[1]).reduce((s, t) => s + t[0], 0), dots = o.terms.filter((t) => !t[1]).reduce((s, t) => s + t[0], 0);
  const written = o.terms.map((t) => (t[1] ? (t[0] === 1 ? '' : t[0]) + 'x' : t[0])).join(' + ');
  const x = (stage) => stage.get('x').value, n = (stage) => stage.get('n').value;
  const set = (a, b) => [{ set: 'x', value: a }, { set: 'n', value: b }];
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: o.helped ? 78 : 62, action: 'Ship it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: written, x: 50, y: 8, size: 5.6, card: true });
      stage.label({ text: o.helped ? o.terms.map((t) => (t[1] ? '📦'.repeat(t[0]) : '🍎'.repeat(t[0]))).join('  ') : '📦 = x     🍎 = 1', x: 50, y: 20, size: o.helped ? 3.6 : 4, w: 94 });
      stage.label({ text: 'crates (x)', x: 27, y: 31, size: 3.3, card: true });
      stage.stepper({ id: 'x', x: 27, y: 41, min: 0, max: 20, value: 0, format: (v) => v + 'x' });
      stage.label({ text: 'loose apples', x: 73, y: 31, size: 3.3, card: true });
      stage.stepper({ id: 'n', x: 73, y: 41, min: 0, max: 20, value: 0, format: (v) => '+ ' + v });
      stage.label({ text: '', id: 'answer', x: 50, y: 54, size: 4.6, card: true });
      // The world reacts: the answer is drawn as crates and apples, to compare with the dock above.
      const yours = o.helped ? stage.label({ text: '', x: 50, y: 67, size: 3.6, w: 94 }) : null;
      const show = () => { stage.get('answer').set('= ' + x(stage) + 'x + ' + n(stage)); if (yours) yours.set(draw(Math.min(x(stage), 16), Math.min(n(stage), 16)) || 'Your crates and apples show here.'); };
      show(); stage.on('change', show);
    },
    check: (stage) => x(stage) === boxes && n(stage) === dots,
    solution: () => set(boxes, dots),
    mistakes: !dots ? [] : [{ tag: 'combines_unlike_terms', when: (stage) => x(stage) === boxes + dots && n(stage) === 0, steps: () => set(boxes + dots, 0),
      say: 'That turned loose apples into crates. Only crates add to crates: ' + boxes + 'x. The ' + dots + ' apples stay apples.' }],
  };
}

// A fresh dock for the last round on every play.
const last = Sidekick.pick([[[2, 'x'], [6, ''], [5, 'x'], [1, '']], [[4, 'x'], [3, ''], [1, 'x'], [2, '']], [[3, 'x'], [4, ''], [3, 'x'], [2, '']]]);

Sidekick.game({
  title: 'Crate Count',
  emoji: '📦',
  premise: 'Each x is a sealed crate of apples. Tidy the dock by counting crates and loose apples separately.',
  outro: 'Shipped! Like terms combine: x with x, numbers with numbers. 3x + 2 can never become 5x.',
  rounds: [
    dock({ id: 'two-terms', phase: 'guided', helped: true, terms: [[2, 'x'], [3, 'x']],
      say: 'The dock has 2 crates and 3 more crates. Set the dials to write that more simply.',
      hints: ['Crates add to crates.', '2x + 3x = 5x, and no loose apples.'],
      win: '2x + 3x = 5x.' }),
    dock({ id: 'crates-and-apples', phase: 'guided', helped: true, terms: [[3, 'x'], [2, '']],
      say: 'Now 3 crates and 2 loose apples. Can they be added together? Match the picture.',
      hints: ['A crate is not an apple.', 'It stays 3x + 2.'],
      win: '3x + 2 stays 3x + 2. They are not like terms.' }),
    dock({ id: 'four-terms', phase: 'guided', helped: true, terms: [[3, 'x'], [2, ''], [4, 'x'], [5, '']],
      say: 'A messy dock with four terms. Count the crates, then count the loose apples.',
      hints: ['Crates: 3 and 4.', 'Apples: 2 and 5.'],
      win: '3x + 2 + 4x + 5 = 7x + 7.' }),
    dock({ id: 'last-dock', phase: 'solo', terms: last,
      say: 'No picture of the dock this time. Write the expression in its simplest form.' }),
  ],
});
