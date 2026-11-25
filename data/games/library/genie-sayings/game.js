// Genie Sayings. Skill: tell a saying (nonliteral language) from words that mean just what they say.
// The genie grants whatever lands in the lamp, word for word. Drop "it is raining cats and dogs"
// in there and pets fall from the sky. Sayings belong in the speech bubble instead.
function lamp(o) {
  const home = (item) => (item.pic ? 'saying' : 'real');
  const send = (where) => o.items.map((item, i) => ({ drag: 'card' + i, to: where(item) }));
  const allAt = (stage, where) => o.items.every((item, i) => stage.get('card' + i).zone === where(item));
  return {
    id: o.id, phase: o.phase, scene: 'sand', height: 82, action: 'Rub the lamp!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const genie = stage.label({ text: o.helped ? '🧞 I grant whatever lands in my lamp, word for word.' : '🧞 💤', x: 50, y: 7, size: 3.4, w: 92, card: true });
      stage.zone({ id: 'real', x: 3, y: 18, w: 45, h: 28, look: 'box', color: 'sun', label: '🪔 Happening for real', labelAt: 'top', accepts: 'card' });
      stage.zone({ id: 'saying', x: 52, y: 18, w: 45, h: 28, look: 'cloud', label: '💬 Just a saying', labelAt: 'top', accepts: 'card' });
      stage.zone({ id: 'pile', x: 4, y: 53, w: 92, h: 25, look: 'tray', label: 'Things people said', showLabel: false, accepts: 'card' });
      o.items.forEach((item, i) => stage.sprite({ id: 'card' + i, text: item.t, size: 2.9, kind: 'card', drag: true, zone: 'pile', label: item.t.replace('\n', ' ') }));
      // The world reacts: a saying dropped in the lamp comes true, word for word.
      if (o.helped) stage.on('change', () => {
        const granted = o.items.find((item, i) => item.pic && stage.get('card' + i).zone === 'real');
        const plain = o.items.find((item, i) => !item.pic && stage.get('card' + i).zone === 'saying');
        genie.set(granted ? '🧞 As you wish! ' + granted.pic + ' Wait, was that only a saying?' : plain ? '🧞 "' + plain.t.replace('\n', ' ') + '" means just what it says.' : '🧞 I grant whatever lands in my lamp, word for word.');
      });
    },
    check: (stage) => allAt(stage, home),
    solution: () => send(home),
    mistakes: [{ tag: 'reads_sayings_literally', when: (stage) => allAt(stage, () => 'real'), steps: () => send(() => 'real'),
      say: 'Some of these are sayings. The words paint a picture, but they mean something else.' }],
  };
}

// Fresh cards for the last round on every play.
const last = Sidekick.pick([
  [{ t: 'Break\na leg!', pic: '🦵💥' }, { t: 'I broke\nmy pencil' }, { t: 'Zip\nyour lips', pic: '🤐' }, { t: 'Zip up\nyour coat' }],
  [{ t: 'It cost an arm\nand a leg', pic: '💪🦵💰' }, { t: 'I hurt\nmy arm' }, { t: 'She is under\nthe weather', pic: '🌧️🙍' }, { t: 'It is cold\noutside' }],
]);

Sidekick.game({
  title: 'Genie Sayings',
  emoji: '🧞',
  premise: 'The genie takes every word for real. Keep the sayings out of the lamp!',
  outro: 'Phew! A saying does not mean exactly what its words say. Raining cats and dogs just means raining hard.',
  rounds: [
    lamp({ id: 'cats-and-dogs', phase: 'guided', helped: true, items: [{ t: 'It is raining\ncats and dogs', pic: '🐱🐶☔' }, { t: 'My socks\nare wet' }],
      say: 'Drag each card to the lamp if it is really happening, or to the bubble if it is just a saying.',
      hints: ['Are pets really falling from the sky?', 'Raining cats and dogs is a saying. Wet socks are real.'],
      win: 'It is raining hard, not raining pets!' }),
    lamp({ id: 'green-thumb', phase: 'guided', helped: true, items: [{ t: 'Dad has a\ngreen thumb', pic: '🟢👍' }, { t: 'The bus\nis late' }, { t: 'I am\nall ears', pic: '👂👂👂' }],
      say: 'Three cards. Which ones would be very strange if the genie made them real?',
      hints: ['A green thumb means being good with plants.', 'All ears means listening closely.'],
      win: 'Two sayings and one plain fact.' }),
    lamp({ id: 'piece-of-cake', phase: 'guided', helped: true, items: [{ t: 'That test was\na piece of cake', pic: '🍰📝' }, { t: 'We ate cake\nat the party' }, { t: 'Hold your\nhorses!', pic: '🐴🐴✋' }, { t: 'The dog\nis barking' }],
      say: 'Careful: two cards talk about cake. Only one of them is about real cake.',
      hints: ['A piece of cake can mean something was easy.', 'Hold your horses means wait a moment.'],
      win: 'The test was easy. The party had real cake.' }),
    lamp({ id: 'sleeping-genie', phase: 'solo', items: last,
      say: 'The genie is asleep and will not show you. Sort these four cards before he wakes up.' }),
  ],
});
