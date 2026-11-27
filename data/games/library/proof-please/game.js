// Proof Please. Skill: support each reason with a fact or detail.
// A reason on its own is just a claim. The inspector only stamps a reason that has a fact
// or example under it. Saying the reason again in other words is not proof.
const CASES = {
  garden: { opinion: 'Our school should have a garden.', rows: [['Gardens teach\nscience', 'Kids measure plants\nas they sprout', 'Science is\nvery important'], ['Gardens give\nhealthy food', 'Fresh peas go to\nthe lunchroom', 'Healthy food\nis good for you']] },
  library: { opinion: 'The library should open on Sundays.', rows: [['Families are\nfree on Sundays', 'Most parents work\nMonday to Saturday', 'Sunday is a\nday to be free'], ['Kids need\nquiet places', 'It has 20 desks\nand no TV noise', 'Quiet is\nreally nice']] },
  bikes: { opinion: 'Our town needs more bike lanes.', rows: [['Bike lanes keep\nriders safe', 'Crashes fell by half\non Oak Street', 'Being safe\nmatters a lot'], ['Biking is\ngood exercise', 'A 20 minute ride\nworks heart and legs', 'Exercise is\na good thing']] },
  pets: { opinion: 'Every class should have a pet.', rows: [['Pets teach\nresponsibility', 'Students take turns\nfeeding it each day', 'Being responsible\nis important'], ['Pets calm\npeople down', 'Petting a rabbit\nslows your heartbeat', 'Feeling calm\nis nice']] },
};

function inspect(o) {
  const rows = CASES[o.topic].rows.slice(0, o.count || 2), n = rows.length, trayY = 16 + n * 19 + (o.helped ? 10 : 0);
  const under = (stage, k) => stage.get('proof' + k).ids[0] || '';
  const give = (kind) => rows.map((row, k) => ({ drag: kind + k, to: 'proof' + k }));
  return {
    id: o.id, phase: o.phase, scene: 'city', height: trayY + (n === 1 ? 19 : 32), action: 'Stamp it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '📣 ' + CASES[o.topic].opinion, x: 50, y: 7, size: 3.6, w: 92, card: true });
      rows.forEach((row, k) => {
        stage.label({ text: row[0], x: 24, y: 23 + k * 19, size: 3.2, card: true });
        stage.zone({ id: 'proof' + k, x: 49, y: 15 + k * 19, w: 48, h: 16, look: 'slot', color: 'white', label: 'proof for reason ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'card' });
      });
      const voice = o.helped ? stage.label({ text: '🔍 Show me a fact or an example for each reason.', x: 50, y: 18 + n * 19, size: 3.3, w: 92, card: true }) : null;
      stage.zone({ id: 'cards', x: 4, y: trayY, w: 92, h: n === 1 ? 16 : 29, look: 'tray', label: 'Cards', showLabel: false, accepts: 'card' });
      const cards = [];
      rows.forEach((row, k) => { cards.push(['vague' + k, row[2]]); cards.push(['fact' + k, row[1]]); });
      (n === 1 ? cards : [cards[1], cards[2], cards[3], cards[0]]).forEach(([id, text]) => stage.sprite({ id, text, size: 2.8, kind: 'card', drag: true, zone: 'cards', label: text.replace('\n', ' ') }));
      // The world reacts: the inspector says what kind of card is sitting under the reason.
      if (voice) stage.on('change', () => {
        const now = rows.map((row, k) => under(stage, k));
        voice.set(now.some((id) => id.startsWith('vague')) ? '🔍 That just says the reason again. Where is the proof?'
          : now.some((id, k) => id.startsWith('fact') && id !== 'fact' + k) ? '🔍 That is a fact, but it belongs to the other reason.' : '🔍 Show me a fact or an example for each reason.');
      });
    },
    check: (stage) => rows.every((row, k) => under(stage, k) === 'fact' + k),
    solution: () => give('fact'),
    mistakes: [{ tag: 'reason_without_support', when: (stage) => rows.every((row, k) => under(stage, k) === 'vague' + k), steps: () => give('vague'),
      say: 'Those cards only repeat the reasons. Support needs something you could check: a number, a fact, an example.' }],
  };
}

// A fresh opinion for the last round on every play.
const last = Sidekick.pick(['bikes', 'pets']);

Sidekick.game({
  title: 'Proof Please',
  emoji: '🔍',
  premise: 'The inspector stamps only reasons that come with proof. Put a fact under each reason.',
  outro: 'Stamped! A strong reason comes with a fact, a number or an example that backs it up.',
  rounds: [
    inspect({ id: 'one-reason', phase: 'guided', helped: true, topic: 'garden', count: 1,
      say: 'Here is an opinion and one reason. Drag the card that PROVES the reason into the box.',
      hints: ['One card just says science matters. That is not proof.', 'Kids measuring plants is an example of learning science.'],
      win: 'An example backs up the reason.' }),
    inspect({ id: 'two-reasons', phase: 'guided', helped: true, topic: 'garden',
      say: 'Two reasons now. Give each reason its own proof.',
      hints: ['Match the fact to the reason it is about.', 'Peas in the lunchroom is proof of healthy food.'],
      win: 'Both reasons have proof.' }),
    inspect({ id: 'library', phase: 'guided', helped: true, topic: 'library',
      say: 'A new opinion about the library. Find the proof for both reasons.',
      hints: ['Look for numbers and facts you could check.', 'When parents work is a fact. So is the number of desks.'],
      win: 'Facts you can check make reasons strong.' }),
    inspect({ id: 'last-case', phase: 'solo', topic: last,
      say: 'The inspector is not talking. Put real proof under each reason.' }),
  ],
});
