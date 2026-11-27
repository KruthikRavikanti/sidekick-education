// Germ Lab. Skill: an exponent counts repeated multiplication, so 3 to the 4th is 3 x 3 x 3 x 3.
// Every split, each germ becomes "base" germs. The exponent is how many splits happen.
// Multiplying the base by the exponent gives a dish with far too few germs.
const UP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'];
const chain = (base, n) => Array.from({ length: n + 1 }, (_, i) => Math.pow(base, i)).join(' → ');

// Rounds 1 and 2: choose how many times the germs split.
function grow(o) {
  const splits = (stage) => stage.get('splits').value;
  return {
    id: o.id, phase: 'guided', scene: 'night', height: 62, action: 'Grow!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      stage.label({ text: '🧫 Each split, every germ becomes ' + o.base + '. Goal: ' + Math.pow(o.base, o.power) + ' germs', x: 50, y: 8, size: 3.5, w: 92, card: true });
      const dish = stage.label({ text: '', x: 50, y: 24, size: 4.6, card: true });
      const name = stage.label({ text: '', x: 50, y: 36, size: 4.2, card: true });
      stage.stepper({ id: 'splits', x: 50, y: 50, min: 1, max: 5, value: 1, format: (v) => v + (v === 1 ? ' split' : ' splits') });
      // The world reacts: the dish shows every generation, and the short way to write it.
      const show = () => { const n = splits(stage); dish.set('🦠 ' + chain(o.base, n)); name.set(Array.from({ length: n }, () => o.base).join(' × ') + ' = ' + o.base + UP[n] + ' = ' + Math.pow(o.base, n)); };
      show(); stage.on('change', show);
    },
    check: (stage) => splits(stage) === o.power,
    solution: () => [{ set: 'splits', value: o.power }],
    mistakes: [],
  };
}

// Rounds 3 and 4: read the exponent and say how many germs there will be.
function count(o) {
  const answer = Math.pow(o.base, o.power), typed = (stage) => stage.get('germs').number;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'germs', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'night', height: 76, action: 'Grow!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🧫 ' + o.base + UP[o.power], x: 30, y: 14, size: 9, card: true });
      stage.label({ text: 'Each split, every germ\nbecomes ' + o.base + '. Splits: ' + o.power, x: 30, y: 32, size: 3.4, card: true });
      const dish = stage.label({ text: o.helped ? '🦠 ' + chain(o.base, o.power).replace(/\d+$/, '?') : '🦠 ?', x: 30, y: 50, size: 3.6, card: true });
      stage.keypad({ id: 'germs', x: 80, y: 44 });
      stage.data = { dish };
    },
    check: (stage) => typed(stage) === answer,
    solution: () => [{ type: 'germs', text: String(answer) }],
    mistakes: [wrong('multiplies_base_by_exponent', o.base * o.power, o.base + ' × ' + o.power + ' is not what the little number means. It says to multiply ' + o.base + ' by itself, ' + o.power + ' times over.')],
    onWin(stage) { stage.data.dish.set('🦠 ' + chain(o.base, o.power)); },
  };
}

// A fresh dish for the last round on every play.
const last = Sidekick.pick([{ base: 3, power: 4 }, { base: 2, power: 5 }, { base: 4, power: 3 }, { base: 5, power: 3 }]);

Sidekick.game({
  title: 'Germ Lab',
  emoji: '🦠',
  premise: 'Germs multiply by splitting. Use exponents to say how many will fill the dish.',
  outro: 'The dish is full! An exponent tells how many times to multiply the base by itself.',
  rounds: [
    grow({ id: 'two-cubed', base: 2, power: 3,
      say: 'One germ splits in 2, again and again. Set the number of splits so the dish holds 8 germs.',
      hints: ['Watch the chain: 1, 2, 4...', 'Three splits: 2 × 2 × 2 = 8.'],
      win: '2 × 2 × 2 = 2³ = 8.' }),
    grow({ id: 'three-fourth', base: 3, power: 4,
      say: 'These germs split in 3. How many splits make 81 germs?',
      hints: ['Each split multiplies by 3.', '3 × 3 × 3 × 3 = 81. That is four splits.'],
      win: '3 × 3 × 3 × 3 = 3⁴ = 81.' }),
    count({ id: 'five-squared', phase: 'guided', helped: true, base: 5, power: 2,
      say: 'The dish is labeled 5². These germs split in 5, twice. Type how many germs there will be.',
      hints: ['5² means 5 × 5.', 'Follow the chain: 1, 5, then what?'],
      win: '5² = 5 × 5 = 25.' }),
    count({ id: 'last-dish', phase: 'solo', base: last.base, power: last.power,
      say: 'The chain is hidden. Read the label on the dish and type how many germs it will hold.' }),
  ],
});
