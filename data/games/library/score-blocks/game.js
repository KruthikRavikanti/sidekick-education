// Score Blocks. Skill: zero holds a place in a three-digit number.
// The number the child types is built from hundreds, tens and ones blocks as they type.
// Leaving out the zero in "four hundred six" builds 46: four thin tens instead of four big hundreds.
const digits = (n) => [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];

function score(o) {
  const typed = (stage) => stage.get('score').number;
  const [h, t, u] = digits(o.n);
  const dropsZero = t === 0 ? h * 10 + u : h * 10 + t, spellsItOut = t === 0 ? h * 1000 + u : h * 1000 + t * 10;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'score', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'night', height: 76, action: 'Light it up!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: o.words, x: 31, y: 8, size: 4.1, card: true });
      stage.block({ x: 2, y: 15, w: 57, h: 58, color: 'white', round: 3, opacity: 0.14 });
      const flats = Array.from({ length: 9 }, (_, i) => stage.block({ x: 4 + (i % 5) * 10.8, y: 17 + Math.floor(i / 5) * 10.8, w: 9.8, h: 9.8, color: 'sky', round: 1, border: 'night', z: 2 }));
      const rods = Array.from({ length: 9 }, (_, i) => stage.block({ x: 4 + i * 3.4, y: 41, w: 2.4, h: 12, color: 'lime', round: 0.6, border: 'night', z: 2 }));
      const cubes = Array.from({ length: 9 }, (_, i) => stage.block({ x: 4 + i * 4, y: 57, w: 3, h: 3, color: 'orange', round: 0.6, border: 'night', z: 2 }));
      const note = stage.label({ text: '', x: 30, y: 67, size: 3.8, color: 'white' });
      stage.keypad({ id: 'score', x: 80, y: 44, maxLength: 4, label: 'Type the score' });
      // The world reacts: the blocks show what the typed number is really worth.
      const build = () => {
        const n = typed(stage) || 0, big = n > 999, [hh, tt, uu] = digits(big ? 0 : n);
        flats.forEach((b, i) => (i < hh ? b.show() : b.hide()));
        rods.forEach((b, i) => (i < tt ? b.show() : b.hide()));
        cubes.forEach((b, i) => (i < uu ? b.show() : b.hide()));
        note.set(big ? 'That is in the thousands. Too many blocks!' : o.hidden || !n ? '' : hh + ' hundreds, ' + tt + ' tens, ' + uu + ' ones');
      };
      build(); stage.on('change', build);
    },
    check: (stage) => typed(stage) === o.n,
    solution: () => [{ type: 'score', text: String(o.n) }],
    mistakes: [
      wrong('drops_the_zero', dropsZero, 'That built ' + dropsZero + '. The score needs ' + h + ' hundreds. Put a 0 in the place that is empty.'),
      wrong('writes_each_part_whole', spellsItOut, 'That number is in the thousands. The hundreds, tens and ones share just three places.'),
    ],
  };
}

const NAMES = { 503: 'five hundred three', 708: 'seven hundred eight', 604: 'six hundred four', 307: 'three hundred seven', 902: 'nine hundred two' };
// A fresh score for the last round on every play.
const last = Sidekick.pick([503, 708, 604, 307, 902]);

Sidekick.game({
  title: 'Score Blocks',
  emoji: '🕹️',
  premise: 'The arcade board needs each score in digits. Type it and watch the blocks build your number.',
  outro: 'High score! When a place is empty, a 0 holds it so the other digits stay where they belong.',
  rounds: [
    score({ id: 'no-zero', phase: 'guided', n: 352, words: 'three hundred fifty-two',
      say: 'Type the score three hundred fifty-two. Watch the blocks build as you type.',
      hints: ['Three hundreds first.', 'Then fifty is 5 tens, and 2 ones.'],
      win: '3 hundreds, 5 tens, 2 ones make 352.' }),
    score({ id: 'zero-tens', phase: 'guided', n: 406, words: 'four hundred six',
      say: 'Now type four hundred six. There are no tens in this score.',
      hints: ['You need 4 big hundred blocks.', 'No tens, so a 0 goes in the middle: 4, 0, 6.'],
      win: '4 hundreds, 0 tens, 6 ones make 406.' }),
    score({ id: 'zero-ones', phase: 'guided', n: 290, words: 'two hundred ninety',
      say: 'Type two hundred ninety. Which place is empty this time?',
      hints: ['Ninety is 9 tens.', 'No ones, so a 0 goes at the end: 2, 9, 0.'],
      win: '2 hundreds, 9 tens, 0 ones make 290.' }),
    score({ id: 'last-score', phase: 'solo', n: last, words: NAMES[last], hidden: true,
      say: 'Last score: ' + NAMES[last] + '. The block counter is off, so check the blocks yourself.' }),
  ],
});
