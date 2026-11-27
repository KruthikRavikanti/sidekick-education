// Comma Cart. Skill: use commas to separate the items in a list.
// The shopping robot buys exactly what the list says. With no commas, "pens tape glue" is one
// strange thing. Tapping a word puts a comma after it and the robot's cart splits apart.
const bare = (word) => word.replace(/[.,]/g, '');

function list(o) {
  const words = o.sentence.split(' '), and = words.indexOf('and');
  const needed = words.map((w, i) => i >= o.first && i < and - 1), allowed = words.map((w, i) => i >= o.first && i < and);
  const on = (stage, i) => stage.get('w' + i).data.comma;
  const taps = (want) => want.map((yes, i) => (yes ? { tap: 'w' + i } : null)).filter(Boolean);
  const stray = (stage) => words.some((w, i) => on(stage, i) && !allowed[i]);
  const missing = (stage) => words.some((w, i) => needed[i] && !on(stage, i));
  const slips = [{ tag: 'comma_where_none_belongs', when: (stage) => stray(stage), steps: () => taps(words.map((w, i) => allowed[i] || i === and)),
    say: 'A comma landed where the list does not need one. Commas go after the items, not after "and".' }];
  if (needed.filter(Boolean).length > 1) slips.push({ tag: 'leaves_out_commas', when: (stage) => !stray(stage) && missing(stage) && words.some((w, i) => on(stage, i)), steps: () => taps(words.map((w, i) => i === o.first)),
    say: 'Some items are still stuck together. Every item in the list needs its own comma.' });
  return {
    id: o.id, phase: o.phase, scene: 'city', height: o.helped ? 62 : 48, action: 'Go shopping!', say: o.say, hints: o.hints || [], win: o.win || '', mistakes: slips,
    setup(stage) {
      stage.sprite({ id: 'robot', emoji: '🛒', x: 8, y: 9, size: 10 });
      const gap = Math.min(16, 92 / words.length);
      const cart = o.helped ? stage.label({ text: '', x: 50, y: 50, size: 3.3, w: 94, card: true }) : null;
      // The world reacts: the robot splits the list wherever it finds a comma.
      const read = () => {
        if (!cart) return;
        const groups = []; let now = [];
        words.forEach((w, i) => { if (i < o.first) return; if (i === and) { if (now.length) groups.push(now); now = []; return; } if (i > and + 1) return; now.push(bare(w)); if (on(stage, i)) { groups.push(now); now = []; } });
        if (now.length) groups.push(now);
        cart.set('🤖 My list: ' + groups.map((g, k) => (k + 1) + '. ' + g.join(' ')).join('   '));
      };
      words.forEach((w, i) => stage.sprite({ id: 'w' + i, text: w, size: 3.6, x: 50 + (i - (words.length - 1) / 2) * gap, y: 30, label: 'word ' + bare(w), data: { comma: false },
        tap(tile) { tile.data.comma = !tile.data.comma; tile.set({ text: tile.data.comma ? w + ',' : w }).pop(); read(); } }));
      read();
    },
    check: (stage) => !stray(stage) && !missing(stage),
    solution: () => taps(allowed),
  };
}

// A fresh list for the last round on every play.
const last = Sidekick.pick([{ sentence: 'Pack socks shoes hats and maps.', first: 1 }, { sentence: 'I like red blue pink and gold.', first: 2 }, { sentence: 'Sam Ana Lee and Jo ran.', first: 0 }]);

Sidekick.game({
  title: 'Comma Cart',
  emoji: '🛒',
  premise: 'The shopping robot buys exactly what the list says. Tap a word to put a comma after it.',
  outro: 'Cart filled! Commas keep the items in a list apart: pens, tape, glue, and paper.',
  rounds: [
    list({ id: 'milk-eggs-bread', phase: 'guided', helped: true, sentence: 'Buy milk eggs and bread.', first: 1,
      say: 'The robot thinks "milk eggs" is one thing! Tap a word to add a comma after it and split the list.',
      hints: ['Tap milk.', 'Milk, eggs, and bread. Three separate things.'],
      win: 'Milk, eggs, and bread. Three things in the cart.' }),
    list({ id: 'pens-tape-glue', phase: 'guided', helped: true, sentence: 'Bring pens tape glue and paper.', first: 1,
      say: 'Four things to buy. Add commas until the robot counts four items.',
      hints: ['Every item before "and" gets a comma.', 'Pens, tape, glue, and paper.'],
      win: 'Pens, tape, glue, and paper.' }),
    list({ id: 'dogs-cats-birds', phase: 'guided', helped: true, sentence: 'Dogs cats and birds sing.', first: 0,
      say: 'This list is at the start of the sentence. Split it into three animals.',
      hints: ['The word sing is not part of the list.', 'Dogs, cats, and birds sing.'],
      win: 'Dogs, cats, and birds sing.' }),
    list({ id: 'last-list', phase: 'solo', sentence: last.sentence, first: last.first,
      say: 'The robot will not show its list this time. Put a comma after every word that needs one.' }),
  ],
});
