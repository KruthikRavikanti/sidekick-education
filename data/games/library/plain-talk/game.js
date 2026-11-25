// Plain Talk. Skill: work out what a simile or metaphor means instead of reading it word for word.
// Beep the robot pictures exactly what the words say. "The classroom was a zoo" makes Beep
// imagine lions at the desks. The child hands Beep the plain meaning instead.
function translate(o) {
  const said = (stage, k) => stage.get('slot' + k).ids[0] || '';
  const hand = (kind) => o.rows.map((row, k) => ({ drag: kind + k, to: 'slot' + k }));
  const n = o.rows.length, trayY = n * 18 + 12 + (o.helped ? 9 : 0);
  return {
    id: o.id, phase: o.phase, scene: 'space', height: trayY + (n === 1 ? 20 : 34), action: 'Send!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.rows.forEach((row, k) => {
        stage.label({ text: '“' + row.fig + '”', x: 25, y: 13 + k * 18, size: 3.3, card: true });
        stage.zone({ id: 'slot' + k, x: 51, y: 5.5 + k * 18, w: 46, h: 15, look: 'slot', color: 'white', label: 'plain meaning ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'card' });
      });
      const beep = o.helped ? stage.label({ text: '🤖 Tell me what it really means.', x: 50, y: n * 18 + 12, size: 3.4, w: 92, card: true }) : null;
      stage.zone({ id: 'cards', x: 4, y: trayY, w: 92, h: n === 1 ? 16 : 30, look: 'tray', label: 'Meaning cards', showLabel: false, accepts: 'card' });
      const cards = [];
      o.rows.forEach((row, k) => { cards.push(['plain' + k, row.plain]); cards.push(['literal' + k, row.literal]); });
      (n === 1 ? cards : [cards[1], cards[2], cards[0], cards[3]]).forEach(([id, text]) => stage.sprite({ id, text, size: 2.9, kind: 'card', drag: true, zone: 'cards', label: text.replace('\n', ' ') }));
      // The world reacts: handed the word-for-word meaning, Beep pictures something silly.
      if (beep) stage.on('change', () => {
        const silly = o.rows.find((row, k) => said(stage, k).startsWith('literal'));
        beep.set(silly ? '🤖 So I should picture ' + silly.pic + ' ? That seems odd.' : '🤖 Tell me what it really means.');
      });
    },
    check: (stage) => o.rows.every((row, k) => said(stage, k) === 'plain' + k),
    solution: () => hand('plain'),
    mistakes: [{ tag: 'reads_it_literally', when: (stage) => o.rows.every((row, k) => said(stage, k) === 'literal' + k), steps: () => hand('literal'),
      say: 'That is what the words say, not what they mean. The writer is comparing two things. What do they share?' }],
  };
}

const ROWS = {
  smile: { fig: 'Her smile\nwas sunshine.', plain: 'Her smile made\npeople feel happy', literal: 'Her face was\nhot and yellow', pic: '🌞😬' },
  zoo: { fig: 'The classroom\nwas a zoo.', plain: 'The class was\nloud and wild', literal: 'Animals lived\nin the classroom', pic: '🦁🐘🏫' },
  wind: { fig: 'He ran like\nthe wind.', plain: 'He ran\nvery fast', literal: 'He blew\nthrough the trees', pic: '🌬️🌳' },
  ton: { fig: 'My backpack\nweighs a ton.', plain: 'My backpack\nis very heavy', literal: 'My backpack is\n2,000 pounds', pic: '🎒🏋️' },
  thief: { fig: 'Time is\na thief.', plain: 'Time slips away\nbefore you notice', literal: 'A clock stole\nmy things', pic: '⏰🦹' },
  mirror: { fig: 'The lake was\na mirror.', plain: 'The water was\nsmooth and still', literal: 'The lake was\nmade of glass', pic: '🪞🚣' },
  blanket: { fig: 'Snow was a\nwhite blanket.', plain: 'Snow covered\nthe ground', literal: 'A blanket lay\non the grass', pic: '🛏️🌱' },
  music: { fig: 'Her voice\nwas music.', plain: 'Her voice was\nlovely to hear', literal: 'She played\nan instrument', pic: '🎺👄' },
};
// A fresh pair for the last round on every play.
const last = Sidekick.pick([['thief', 'mirror'], ['blanket', 'music']]);

Sidekick.game({
  title: 'Plain Talk',
  emoji: '🤖',
  premise: 'Beep the robot takes every word for real. Hand Beep what each sentence really means.',
  outro: 'Beep gets it! Similes and metaphors compare two things. Ask what the two things share.',
  rounds: [
    translate({ id: 'smile', phase: 'guided', helped: true, rows: [ROWS.smile],
      say: 'Beep does not understand this sentence. Drag the card that says what it really means into the box.',
      hints: ['How is a smile like sunshine?', 'Sunshine makes people feel warm and happy. So did her smile.'],
      win: 'Her smile made people feel happy, like sunshine does.' }),
    translate({ id: 'zoo', phase: 'guided', helped: true, rows: [ROWS.zoo],
      say: 'A metaphor says one thing IS another. What does this one really mean?',
      hints: ['What is a zoo like? Noisy and wild.', 'The class was loud and wild.'],
      win: 'No animals. Just a very noisy class.' }),
    translate({ id: 'wind-and-ton', phase: 'guided', helped: true, rows: [ROWS.wind, ROWS.ton],
      say: 'Two sentences and four cards. Give Beep the real meaning of each.',
      hints: ['Like the wind: what is wind known for?', 'A ton is very heavy. Is the backpack really 2,000 pounds?'],
      win: 'He ran very fast. The backpack is very heavy.' }),
    translate({ id: 'last-message', phase: 'solo', rows: last.map((key) => ROWS[key]),
      say: 'Beep is quiet this time. Hand over the real meaning of both sentences.' }),
  ],
});
