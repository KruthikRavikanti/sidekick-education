// Snack Machine. Skill: a function gives exactly one output for each input.
// A snack machine works if each button always gives the same snack. Two buttons may give the
// same snack. One button that gives two different snacks is broken.
const text = (pairs) => pairs.map((p) => p[0] + ' → ' + p[1]).join('\n');
const works = (pairs) => pairs.every((p) => pairs.every((q) => q[0] !== p[0] || q[1] === p[1]));
const shares = (pairs) => pairs.some((p, i) => pairs.some((q, j) => i !== j && q[1] === p[1] && q[0] !== p[0]));
const M = {
  plain: [['A', '🍎'], ['B', '🍌'], ['C', '🍇']], shared: [['A', '🍎'], ['B', '🍌'], ['C', '🍎']], broken: [['A', '🍎'], ['A', '🍌'], ['B', '🍇']],
  allSame: [['A', '🥨'], ['B', '🥨'], ['C', '🥨']], broken2: [['A', '🥤'], ['B', '🍪'], ['B', '🥨']], plain2: [['A', '🍪'], ['B', '🥤'], ['C', '🥨']],
  shared2: [['A', '🧃'], ['B', '🧃'], ['C', '🍿']], broken3: [['A', '🍿'], ['B', '🧃'], ['A', '🍫']],
};

function row(o) {
  const machines = o.keys.map((key) => M[key]), n = machines.length;
  const on = (stage, i) => stage.get('machine' + i).data.on;
  const taps = (want) => machines.map((m, i) => (want(m) ? { tap: 'machine' + i } : null)).filter(Boolean);
  const all = (stage, want) => machines.every((m, i) => on(stage, i) === want(m));
  const strict = (m) => works(m) && !shares(m);
  return {
    id: o.id, phase: o.phase, scene: 'city', height: o.helped ? 66 : 54, action: 'Open shop!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🥤 Tap every machine that works', x: 50, y: 7, size: 3.8, card: true });
      const note = o.helped ? stage.label({ text: 'Tap a machine to test its buttons.', x: 50, y: 56, size: 3.3, w: 92, card: true }) : null;
      machines.forEach((m, i) => stage.sprite({ id: 'machine' + i, text: text(m), size: 3.6, x: 50 + (i - (n - 1) / 2) * 24, y: 31, label: 'machine ' + (i + 1), data: { on: false },
        tap(tile) {
          tile.data.on = !tile.data.on; tile.badge(tile.data.on ? '✅' : '');
          const twice = m.find((p) => m.some((q) => q[0] === p[0] && q[1] !== p[1]));
          if (note) note.set(twice ? 'Button ' + twice[0] + ' gives two different snacks. You never know what you will get.' : shares(m) ? 'Every button gives one snack. Two buttons sharing a snack is fine.' : 'Every button gives exactly one snack.');
        } }));
    },
    check: (stage) => all(stage, works),
    solution: () => taps(works),
    mistakes: machines.some(strict) && machines.some((m) => works(m) && shares(m)) ? [{ tag: 'repeated_outputs_break_the_rule', when: (stage) => all(stage, strict), steps: () => taps(strict),
      say: 'A machine where two buttons give the same snack still works. Only a button with two different snacks is a problem.' }] : [],
  };
}

// Fresh machines for the last round on every play.
const last = Sidekick.pick([['shared2', 'broken2', 'plain2', 'allSame'], ['broken3', 'shared', 'plain', 'shared2']]);

Sidekick.game({
  title: 'Snack Machine',
  emoji: '🥤',
  premise: 'A good snack machine gives one sure snack for each button. Pick the machines that work.',
  outro: 'Open for business! A function gives exactly one output for each input. Outputs may repeat.',
  rounds: [
    row({ id: 'two-machines', phase: 'guided', helped: true, keys: ['plain', 'broken'],
      say: 'Each machine lists its buttons and snacks. Tap a machine to test it. Mark the one that works.',
      hints: ['Look for a button that appears twice.', 'In the second machine, button A gives two different snacks.'],
      win: 'One snack per button. That machine works.' }),
    row({ id: 'shared-snack', phase: 'guided', helped: true, keys: ['shared', 'broken2', 'plain2'],
      say: 'Three machines. In one, two buttons give the same snack. Does that machine still work?',
      hints: ['Press A, get an apple. Press C, get an apple. No surprise there.', 'Only the machine with a two-snack button is broken.'],
      win: 'Two buttons can share a snack. Two machines work.' }),
    row({ id: 'all-same', phase: 'guided', helped: true, keys: ['allSame', 'broken3', 'shared2', 'plain'],
      say: 'Four machines. One gives pretzels for every button. Test them all.',
      hints: ['A pretzel every time is still one sure snack per button.', 'Find the single machine with a button listed twice.'],
      win: 'Three of them work. Only the two-snack button breaks a machine.' }),
    row({ id: 'last-row', phase: 'solo', keys: last,
      say: 'The tester is off. Mark every machine that gives exactly one snack per button.' }),
  ],
});
