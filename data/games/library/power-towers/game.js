// Power Towers. Skill: when multiplying powers of the same base, add the exponents. When dividing, subtract.
// A power is a tower of the same factor. Multiplying two towers stacks them, so the heights
// add. Dividing knocks blocks off, so the heights subtract. The heights never multiply.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = (n) => String(n).split('').map((d) => SUP[d]).join('');
const tower = (base, n) => Array.from({ length: n }, () => base).join('·') || '1';

function build(o) {
  const answer = o.op === '×' ? o.a + o.b : o.a - o.b, other = o.op === '×' ? o.a * o.b : o.a / o.b, e = (stage) => stage.get('height').value;
  return {
    id: o.id, phase: o.phase, scene: 'city', height: o.helped ? 72 : 52, action: 'Stack!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: o.base + sup(o.a) + ' ' + o.op + ' ' + o.base + sup(o.b) + ' = ' + o.base + '?', x: 50, y: 10, size: 6.4, card: true });
      stage.stepper({ id: 'height', x: 50, y: 28, min: 0, max: 12, value: 0, format: (v) => o.base + sup(v) });
      stage.label({ text: 'Set the exponent of the answer', x: 50, y: 40, size: 3.2 });
      if (!o.helped) return;
      // The world reacts: both sides are written out as towers of factors to compare.
      stage.label({ text: '(' + tower(o.base, o.a) + ') ' + o.op + ' (' + tower(o.base, o.b) + ')', x: 50, y: 51, size: 3.6, w: 94, card: true });
      const yours = stage.label({ text: '', x: 50, y: 63, size: 3.6, w: 94, card: true });
      const show = () => yours.set('yours: ' + tower(o.base, e(stage)) + '   (' + e(stage) + ' factors)');
      show(); stage.on('change', show);
    },
    check: (stage) => e(stage) === answer,
    solution: () => [{ set: 'height', value: answer }],
    mistakes: Number.isInteger(other) && other !== answer && other <= 12 ? [{ tag: 'multiplies_the_exponents', when: (stage) => e(stage) === other, steps: () => [{ set: 'height', value: other }],
      say: o.op === '×' ? 'Count the factors: ' + o.a + ' of them and ' + o.b + ' more. Stacking towers adds their heights.' : 'Dividing cancels ' + o.b + ' of the ' + o.a + ' factors. Take the heights away, do not divide them.' }] : [],
  };
}

// A fresh pair of towers for the last round on every play.
const last = Sidekick.pick([{ base: 3, a: 2, b: 5, op: '×' }, { base: 5, a: 3, b: 3, op: '×' }, { base: 2, a: 4, b: 2, op: '×' }, { base: 10, a: 8, b: 2, op: '÷' }]);

Sidekick.game({
  title: 'Power Towers',
  emoji: '🗼',
  premise: 'Each power is a tower of the same factor. Stack or cut towers and name the new height.',
  outro: 'Stacked! Same base: multiply by adding exponents, divide by subtracting them.',
  rounds: [
    build({ id: 'stack', phase: 'guided', helped: true, base: 2, a: 3, b: 4, op: '×',
      say: '2³ is three 2s and 2⁴ is four 2s. Multiply them: how many 2s are there in all? Set the exponent.',
      hints: ['Count the factors in both towers.', 'Three and four make seven.'],
      win: '2³ × 2⁴ = 2⁷. The exponents add.' }),
    build({ id: 'stack-again', phase: 'guided', helped: true, base: 5, a: 2, b: 3, op: '×',
      say: 'Stack 5² on 5³. What is the exponent of the answer?',
      hints: ['Two factors and three factors.', '2 + 3 = 5, not 2 × 3.'],
      win: '5² × 5³ = 5⁵.' }),
    build({ id: 'cut', phase: 'guided', helped: true, base: 2, a: 6, b: 2, op: '÷',
      say: 'Now divide. 2⁶ ÷ 2² cancels two of the six factors. How many are left?',
      hints: ['Six factors, take two away.', '6 − 2 = 4.'],
      win: '2⁶ ÷ 2² = 2⁴. The exponents subtract.' }),
    build({ id: 'last-tower', phase: 'solo', base: last.base, a: last.a, b: last.b, op: last.op,
      say: 'The towers are not written out for you now. Set the exponent of the answer.' }),
  ],
});
