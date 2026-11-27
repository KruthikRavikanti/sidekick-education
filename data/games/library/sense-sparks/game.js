// Sense Sparks. Skill: find the words that make you feel, hear, smell, taste or see something.
// Tapping a word tests it. A sense word lights up with the sense it wakes. A plain describing
// word like "new" or "last" gives no spark, even though it also describes.
const bare = (word) => word.replace(/[.,!]/g, '');

function line(o) {
  const words = o.sentence.split(' '), spark = (i) => o.senses[bare(words[i])];
  const lit = (stage, i) => stage.get('w' + i).data.on;
  const taps = (want) => words.map((w, i) => (want(i) ? { tap: 'w' + i } : null)).filter(Boolean);
  const all = (stage, want) => words.every((w, i) => lit(stage, i) === want(i));
  const plain = words.findIndex((w) => bare(w) === o.plain);
  return {
    id: o.id, phase: o.phase, scene: 'night', height: o.helped ? 56 : 44, action: 'Spark!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '👂 ✋ 👃 👅 👀', x: 50, y: 8, size: 5.6, card: true });
      const gap = Math.min(16, 92 / words.length);
      const note = o.helped ? stage.label({ text: 'Tap a word to test it for a spark.', x: 50, y: 46, size: 3.4, w: 92, card: true }) : null;
      words.forEach((w, i) => stage.sprite({ id: 'w' + i, text: w, size: 3.6, x: 50 + (i - (words.length - 1) / 2) * gap, y: 27, label: 'word ' + bare(w), data: { on: false },
        tap(tile) {
          tile.data.on = !tile.data.on;
          tile.badge(!tile.data.on ? '' : o.helped ? (spark(i) || '❔') : '✨').pop();
          if (note) note.set(!tile.data.on ? 'Tap a word to test it for a spark.' : spark(i) ? spark(i) + ' ' + bare(w) + ' wakes up a sense.' : '❔ ' + bare(w) + ' does not tell how it feels, sounds, smells, tastes or looks.');
        } }));
    },
    check: (stage) => all(stage, (i) => !!spark(i)),
    solution: () => taps((i) => !!spark(i)),
    mistakes: [{ tag: 'picks_any_describing_word', when: (stage) => all(stage, (i) => !!spark(i) || i === plain), steps: () => taps((i) => !!spark(i) || i === plain),
      say: '"' + o.plain + '" describes, but it does not wake up a sense. Keep only the words you can feel, hear, smell, taste or see.' }],
  };
}

// A fresh sentence for the last round on every play.
const last = Sidekick.pick([
  { sentence: 'Her other shoe was squeaky.', senses: { squeaky: '👂' }, plain: 'other' },
  { sentence: 'Three sticky plums smelled sour.', senses: { sticky: '✋', sour: '👃' }, plain: 'Three' },
  { sentence: 'My own blanket feels fuzzy.', senses: { fuzzy: '✋' }, plain: 'own' },
]);

Sidekick.game({
  title: 'Sense Sparks',
  emoji: '✨',
  premise: 'Some words wake up your senses. Tap the words in each sentence that give a spark.',
  outro: 'Sparks everywhere! Sense words tell how something feels, sounds, smells, tastes or looks.',
  rounds: [
    line({ id: 'itchy', phase: 'guided', helped: true, sentence: 'My new socks feel itchy.', senses: { itchy: '✋' }, plain: 'new',
      say: 'Tap a word to test it. Which word tells how the socks feel on your skin?',
      hints: ['Try new. Does it tell how the socks feel?', 'Itchy is something you feel.'],
      win: 'Itchy! You can almost feel it.' }),
    line({ id: 'sweet', phase: 'guided', helped: true, sentence: 'The last cookie was sweet.', senses: { sweet: '👅' }, plain: 'last',
      say: 'Find the word that wakes up your tongue.',
      hints: ['Last tells which cookie, not how it tastes.', 'Sweet is a taste.'],
      win: 'Sweet is a taste word.' }),
    line({ id: 'bees', phase: 'guided', helped: true, sentence: 'Two loud bees buzzed past.', senses: { loud: '👂', buzzed: '👂' }, plain: 'Two',
      say: 'This sentence has two words for your ears. Find both.',
      hints: ['Two tells how many. That is not a sense.', 'Loud and buzzed are both things you hear.'],
      win: 'Loud and buzzed. You can hear those bees.' }),
    line({ id: 'last-line', phase: 'solo', sentence: last.sentence, senses: last.senses, plain: last.plain,
      say: 'No sense pictures this time. Tap every word that wakes up a sense, and only those.' }),
  ],
});
