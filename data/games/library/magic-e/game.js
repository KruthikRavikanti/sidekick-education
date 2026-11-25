// Magic E. Skill: tell a long vowel from a short one.
// A silent e on the end makes the vowel say its own name: kit becomes kite, cap becomes cape.
// Dragging the e on or off changes the word, and the picture beside it changes too.
const WORDS = { cap: ['🧢', '🦸'], kit: ['🧰', '🪁'], tub: ['🛁', '🧪'], pin: ['📌', '🌲'], can: ['🥫', '🦯'], cub: ['🐻', '🧊'] };

function spell(o) {
  const hasE = (stage, k) => stage.get('e' + k).zone === 'end' + k;
  const move = (wantE) => o.rows.map((row, k) => (wantE(row) === (row.from === 'long') ? null : { drag: 'e' + k, to: (wantE(row) ? 'end' : 'pocket') + k })).filter(Boolean);
  const all = (stage, wantE) => o.rows.every((row, k) => hasE(stage, k) === wantE(row));
  const single = o.rows.length === 1;
  return {
    id: o.id, phase: o.phase, scene: 'night', height: single ? 44 : o.rows.length * 20 + 8, action: 'Abracadabra!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.rows.forEach((row, k) => {
        const y = single ? 20 : 13 + k * 20, pics = WORDS[row.base];
        stage.label({ text: 'Make ' + pics[row.make === 'long' ? 1 : 0], x: 13, y, size: 5.4, card: true });
        stage.label({ text: row.base, x: 39, y, size: 6.4, card: true });
        stage.zone({ id: 'end' + k, x: 47, y: y - 6, w: 11, h: 12, look: 'slot', color: 'white', label: 'end of ' + row.base, showLabel: false, capacity: 1, accepts: 'e' + k });
        stage.zone({ id: 'pocket' + k, x: 83, y: y - 6, w: 13, h: 12, look: 'tray', color: 'berry', label: 'spare e', showLabel: false, capacity: 1, accepts: 'e' + k });
        stage.sprite({ id: 'e' + k, text: 'e', size: 5.2, color: 'berry', kind: 'e' + k, drag: true, zone: (row.from === 'long' ? 'end' : 'pocket') + k, label: 'silent e' });
        if (!o.helped) return;
        // The world reacts: the picture shows the word as it is spelled right now.
        const now = stage.label({ text: '', x: 69, y, size: 5.4 });
        const show = () => now.set('= ' + pics[hasE(stage, k) ? 1 : 0]);
        show(); stage.on('change', show);
      });
    },
    check: (stage) => all(stage, (row) => row.make === 'long'),
    solution: () => move((row) => row.make === 'long'),
    mistakes: single ? [] : [
      { tag: 'e_on_every_word', when: (stage) => all(stage, () => true), steps: () => move(() => true), say: 'Not every word needs the e. Say each one: does the vowel say its own name?' },
      { tag: 'no_e_anywhere', when: (stage) => all(stage, () => false), steps: () => move(() => false), say: 'Some of these need the e. With no e the vowel is short, like the u in tub.' },
    ],
  };
}

// Fresh words for the last round on every play: some need the e and some must lose it.
const last = Sidekick.pick([
  [{ base: 'tub', make: 'long', from: 'short' }, { base: 'pin', make: 'short', from: 'long' }, { base: 'cub', make: 'long', from: 'short' }],
  [{ base: 'can', make: 'short', from: 'long' }, { base: 'kit', make: 'long', from: 'short' }, { base: 'cap', make: 'short', from: 'long' }],
  [{ base: 'pin', make: 'long', from: 'short' }, { base: 'cub', make: 'short', from: 'long' }, { base: 'tub', make: 'long', from: 'short' }],
]);

Sidekick.game({
  title: 'Magic E',
  emoji: '✨',
  premise: 'A silent e at the end changes a word. Add it or take it away to make the picture.',
  outro: 'Magic! With the e the vowel says its name: kite. Without it the vowel is short: kit.',
  rounds: [
    spell({ id: 'kite', phase: 'guided', helped: true, rows: [{ base: 'kit', make: 'long', from: 'short' }],
      say: 'The word says kit. Drag the magic e onto the end and watch the picture. Can you make a kite?',
      hints: ['Drag the e into the box after kit.', 'K-i-t-e. Now the i says its name: kite.'],
      win: 'Kit became kite. The e made the i say its name.' }),
    spell({ id: 'cap', phase: 'guided', helped: true, rows: [{ base: 'cap', make: 'short', from: 'long' }],
      say: 'This says cape. We need a cap to wear. Take the magic e away.',
      hints: ['Drag the e off the end.', 'Without the e the a is short: cap.'],
      win: 'Cape became cap. No e, short a.' }),
    spell({ id: 'tube-and-pin', phase: 'guided', helped: true, rows: [{ base: 'tub', make: 'long', from: 'short' }, { base: 'pin', make: 'short', from: 'long' }],
      say: 'Two words. Make a tube, and make a pin. One needs the e and one does not.',
      hints: ['Tube has a long u, so it needs the e.', 'Pin has a short i. Take the e off pine.'],
      win: 'Tube with an e. Pin with no e.' }),
    spell({ id: 'three-spells', phase: 'solo', rows: last,
      say: 'The pictures of your words are hidden now. Add or remove each e to spell what the card shows.' }),
  ],
});
