// Bridge Words. Skill: use linking words like because, since and so to join an opinion to its reason.
// Each idea stands on its own cliff. The right linking word is the plank that lets a reader walk
// from one to the other. "And" just sets two ideas side by side without saying why.
function bridges(o) {
  const word = (stage, k) => stage.get('gap' + k).texts()[0] || '';
  const lay = (words) => words.map((w, k) => ({ drag: 'p-' + w, to: 'gap' + k }));
  const n = o.rows.length, trayY = n * 24 + 14;
  return {
    id: o.id, phase: o.phase, scene: 'sky', height: trayY + 18 + (o.helped ? 10 : 0), action: 'Cross!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.rows.forEach((row, k) => {
        const y = 14 + k * 24;
        stage.block({ x: 0, y: y + 7, w: 37, h: 3, color: 'leaf', round: 0 }); stage.block({ x: 63, y: y + 7, w: 37, h: 3, color: 'leaf', round: 0 });
        stage.label({ text: row.left, x: 19, y, size: 3.3, card: true });
        stage.zone({ id: 'gap' + k, x: 38.5, y: y - 6, w: 23, h: 12, look: 'slot', color: 'white', label: 'bridge ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'plank' });
        stage.label({ text: row.right, x: 81, y, size: 3.3, card: true });
      });
      stage.zone({ id: 'planks', x: 6, y: trayY, w: 88, h: 14, look: 'tray', label: 'Linking words', showLabel: false, accepts: 'plank' });
      o.planks.forEach((w) => stage.sprite({ id: 'p-' + w, text: w, size: 3.8, color: 'orange', kind: 'plank', drag: true, zone: 'planks', label: w }));
      // The world reacts: the whole sentence is read back with the plank in place.
      const voice = o.helped ? stage.label({ text: '📣 ...', x: 50, y: trayY + 21, size: 3.4, w: 92, card: true }) : null;
      if (voice) stage.on('change', () => voice.set('📣 ' + o.rows.map((row, k) => row.left.replace('\n', ' ') + ' ' + (word(stage, k) || '...') + ' ' + row.right.replace('\n', ' ') + '.').join(' ')));
    },
    check: (stage) => o.rows.every((row, k) => row.want.includes(word(stage, k))),
    solution: () => lay(o.rows.map((row) => row.want.find((w) => o.planks.includes(w)))),
    mistakes: [{ tag: 'strings_ideas_with_and', when: (stage) => word(stage, 0) === 'and', steps: () => [{ drag: 'p-and', to: 'gap0' }],
      say: '"And" only puts the two ideas next to each other. Pick the word that shows one is the reason for the other.' }],
  };
}

// Fresh bridges for the last round on every play: one needs a reason word, one needs a result word.
const last = Sidekick.pick([
  [{ left: 'Recess should\nbe longer', right: 'kids need\nto move', want: ['because', 'since'] }, { left: 'Books teach\nnew things', right: 'we should\nread a lot', want: ['so', 'therefore'] }],
  [{ left: 'Bikes are\nthe best', right: 'they are fast\nand fun', want: ['because', 'since'] }, { left: 'Sugar hurts\nyour teeth', right: 'we should\neat less candy', want: ['so', 'therefore'] }],
]);

Sidekick.game({
  title: 'Bridge Words',
  emoji: '🌉',
  premise: 'Two ideas stand on two cliffs. Lay down the linking word that joins them.',
  outro: 'Everyone crossed! Because and since point to a reason. So and therefore point to what follows.',
  rounds: [
    bridges({ id: 'dogs', phase: 'guided', helped: true, rows: [{ left: 'Dogs are\ngreat pets', right: 'they are\nloyal', want: ['because', 'since'] }], planks: ['and', 'because'],
      say: 'One cliff has an opinion. The other has the reason. Drag a linking word between them and listen.',
      hints: ['Which word tells WHY dogs are great pets?', 'Dogs are great pets because they are loyal.'],
      win: 'Because links the opinion to its reason.' }),
    bridges({ id: 'rain', phase: 'guided', helped: true, rows: [{ left: 'It rained\nall day', right: 'we played\ninside', want: ['so', 'therefore'] }], planks: ['but', 'so', 'and'],
      say: 'This time the first cliff is the reason and the second is what happened next.',
      hints: ['Which word means "and that is why"?', 'It rained all day, so we played inside.'],
      win: 'So shows what happened because of the rain.' }),
    bridges({ id: 'trees', phase: 'guided', helped: true, rows: [{ left: 'We should\nplant trees', right: 'they give\nus shade', want: ['because', 'since'] }], planks: ['since', 'and', 'but'],
      say: 'Another opinion and its reason. Because is missing today. Which word does the same job?',
      hints: ['One of these means the same as because.', 'We should plant trees since they give us shade.'],
      win: 'Since can link a reason too.' }),
    bridges({ id: 'two-bridges', phase: 'solo', rows: last, planks: ['and', 'so', 'but', 'because'],
      say: 'Two bridges and four planks. Nobody reads them back. Lay the word that fits each bridge.' }),
  ],
});
