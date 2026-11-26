// Vowel Teams. Skill: read vowel teams like oa, ai and ea as one long sound.
// Two vowels walk together and the first one says its name: b-oa-t is boat. Put a single
// short vowel in the middle instead and you have built a different word: bot.
const ROWS = {
  boat: { make: '⛵', a: 'b', z: 't', team: 'oa', one: 'o', other: '🤖' },
  rain: { make: '🌧️', a: 'r', z: 'n', team: 'ai', one: 'a', other: '🏃' },
  coat: { make: '🧥', a: 'c', z: 't', team: 'oa', one: 'o', other: '🛏️' },
  meat: { make: '🥩', a: 'm', z: 't', team: 'ea', one: 'e', other: '🤝' },
  pail: { make: '🪣', a: 'p', z: 'l', team: 'ai', one: 'a', other: '👫' },
  bead: { make: '📿', a: 'b', z: 'd', team: 'ea', one: 'e', other: '🛏️' },
  road: { make: '🛣️', a: 'r', z: 'd', team: 'oa', one: 'o', other: '🎣' },
};

function build(o) {
  const rows = o.words.map((key) => ROWS[key]), single = rows.length === 1;
  const inside = (stage, k) => stage.get('mid' + k).ids[0] || '';
  const fill = (kind) => rows.map((row, k) => ({ drag: kind + k, to: 'mid' + k }));
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: single ? 42 : rows.length * 20 + 8, action: 'Read it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      rows.forEach((row, k) => {
        const y = single ? 20 : 13 + k * 20;
        stage.label({ text: 'Make ' + row.make, x: 12, y, size: 5, card: true });
        stage.label({ text: row.a, x: 30, y, size: 6.4, card: true });
        stage.zone({ id: 'mid' + k, x: 34.5, y: y - 6, w: 14, h: 12, look: 'slot', color: 'white', label: 'middle of word ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'v' + k });
        stage.label({ text: row.z, x: 53, y, size: 6.4, card: true });
        stage.zone({ id: 'bench' + k, x: 70, y: y - 6, w: 27, h: 12, look: 'tray', label: 'vowels', showLabel: false, accepts: 'v' + k });
        const tiles = [['one' + k, row.one], ['team' + k, row.team]];
        (k % 2 ? tiles.reverse() : tiles).forEach(([id, text]) => stage.sprite({ id, text, size: 4.6, color: 'berry', kind: 'v' + k, drag: true, zone: 'bench' + k, label: text.split('').join(' ') }));
        if (!o.helped) return;
        // The world reacts: the picture shows the word that is really spelled.
        const now = stage.label({ text: '', x: 62, y, size: 5.2 });
        stage.on('change', () => now.set(inside(stage, k) === 'team' + k ? '= ' + row.make : inside(stage, k) === 'one' + k ? '= ' + row.other : ''));
      });
    },
    check: (stage) => rows.every((row, k) => inside(stage, k) === 'team' + k),
    solution: () => fill('team'),
    mistakes: [{ tag: 'reads_team_as_one_short_vowel', when: (stage) => rows.every((row, k) => inside(stage, k) === 'one' + k), steps: () => fill('one'),
      say: 'One vowel alone makes a short sound: ' + rows[0].a + rows[0].one + rows[0].z + '. This word needs two vowels working as a team.' }],
  };
}

// Fresh words for the last round on every play.
const last = Sidekick.pick([['coat', 'pail', 'bead'], ['road', 'meat', 'rain'], ['pail', 'road', 'bead']]);

Sidekick.game({
  title: 'Vowel Teams',
  emoji: '⛵',
  premise: 'Two vowels can team up to make one long sound. Drop the right middle into each word.',
  outro: 'Team work! In oa, ai and ea the first vowel says its name: boat, rain, meat.',
  rounds: [
    build({ id: 'boat', phase: 'guided', helped: true, words: ['boat'],
      say: 'We need the word boat. Drag a vowel tile into the middle and see what you made.',
      hints: ['Try o by itself. What word is that?', 'B-oa-t. The o says its name: boat.'],
      win: 'B-oa-t spells boat. With just o it was bot!' }),
    build({ id: 'rain', phase: 'guided', helped: true, words: ['rain'],
      say: 'Now make the word rain. One tile makes ran. The other makes rain.',
      hints: ['Rain has a long a sound.', 'A and i team up: r-ai-n.'],
      win: 'R-ai-n spells rain.' }),
    build({ id: 'coat-meat', phase: 'guided', helped: true, words: ['coat', 'meat'],
      say: 'Two words to build. Each one needs its vowel team.',
      hints: ['Coat has a long o. Meat has a long e.', 'C-oa-t and m-ea-t.'],
      win: 'Coat and meat. Two vowel teams.' }),
    build({ id: 'three-words', phase: 'solo', words: last,
      say: 'The pictures of your words are hidden. Build all three words the cards ask for.' }),
  ],
});
