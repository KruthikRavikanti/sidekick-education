// Idea Railway. Skill: use linking words like "in contrast" and "especially" to connect ideas.
// A linking word is a signal on the track. "In contrast" turns the train toward an opposite
// idea. "Especially" keeps it going straight to one strong example. The next car has to follow the signal.
const LINES = {
  cats: { lead: 'Cats are\nquiet pets.', sign: 'In contrast,', right: 'dogs bark at\nevery sound.', trap: 'cats nap most\nof the day.' },
  desert: { lead: 'Desert animals\nsave water,', sign: 'especially', right: 'the camel, which\ngoes days without.', trap: 'but frogs need\nponds to live.' },
  summer: { lead: 'Summer days\nare long.', sign: 'In contrast,', right: 'winter days\nend early.', trap: 'the sun sets\nlate in June.' },
  birds: { lead: 'Birds build\nclever nests,', sign: 'especially', right: 'the weaver bird,\nwhich ties knots.', trap: 'but snakes build\nno nests at all.' },
  city: { lead: 'City streets\nare busy.', sign: 'In contrast,', right: 'country roads\nare quiet.', trap: 'cars fill every\nlane downtown.' },
  fruit: { lead: 'Many fruits\nare sweet,', sign: 'especially', right: 'ripe mangoes\nin summer.', trap: 'but lemons\nare sour.' },
  ocean: { lead: 'The deep sea\nis dark.', sign: 'In contrast,', right: 'the surface is\nbright with sun.', trap: 'no light reaches\nthe bottom.' },
  storms: { lead: 'Storms can\ndo damage,', sign: 'especially', right: 'hurricanes, which\nflood whole towns.', trap: 'but a breeze\nfeels pleasant.' },
};

function railway(o) {
  const rows = o.keys.map((key) => LINES[key]), n = rows.length, trayY = 6 + n * 20 + (o.helped ? 10 : 0);
  const car = (stage, k) => stage.get('track' + k).ids[0] || '';
  const couple = (kind) => rows.map((row, k) => ({ drag: kind + k, to: 'track' + k }));
  return {
    id: o.id, phase: o.phase, scene: 'field', height: trayY + (n === 1 ? 19 : 32), action: 'All aboard!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      rows.forEach((row, k) => {
        const y = 13 + k * 20;
        stage.block({ x: 0, y: y + 8, w: 100, h: 1.2, color: 'night', round: 0 });
        stage.label({ text: '🚂 ' + row.lead, x: 18, y, size: 3, card: true });
        stage.label({ text: '🚦 ' + row.sign, x: 46, y, size: 3.2, color: 'orange', card: true });
        stage.zone({ id: 'track' + k, x: 60, y: y - 7.5, w: 37, h: 15, look: 'slot', color: 'white', label: 'next car ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'car' });
      });
      const voice = o.helped ? stage.label({ text: '🚦 Read the signal. Which car can follow it?', x: 50, y: 8 + n * 20, size: 3.3, w: 92, card: true }) : null;
      stage.zone({ id: 'yard', x: 4, y: trayY, w: 92, h: n === 1 ? 16 : 29, look: 'tray', label: 'Train cars', showLabel: false, accepts: 'car' });
      const cars = [];
      rows.forEach((row, k) => { cars.push(['trap' + k, row.trap]); cars.push(['right' + k, row.right]); });
      (n === 1 ? cars : [cars[1], cars[2], cars[0], cars[3]]).forEach(([id, text]) => stage.sprite({ id, text, size: 2.8, kind: 'car', drag: true, zone: 'yard', label: text.replace('\n', ' ') }));
      // The world reacts: the signal explains which way it sends the train.
      if (voice) stage.on('change', () => {
        const k = rows.findIndex((row, i) => car(stage, i) && car(stage, i) !== 'right' + i);
        voice.set(k < 0 ? '🚦 Read the signal. Which car can follow it?' : rows[k].sign === 'especially' ? '🚦 "Especially" goes straight on to one strong example. That car turns away.' : '🚦 "In contrast" turns to the opposite idea. That car keeps going the same way.');
      });
    },
    check: (stage) => rows.every((row, k) => car(stage, k) === 'right' + k),
    solution: () => couple('right'),
    mistakes: [{ tag: 'ignores_the_signal_word', when: (stage) => rows.every((row, k) => car(stage, k) === 'trap' + k), steps: () => couple('trap'),
      say: 'Read each signal again. "In contrast" needs an opposite idea. "Especially" needs one strong example of the same idea.' }],
  };
}

// Fresh tracks for the last round on every play: one of each signal.
const last = Sidekick.pick([['city', 'fruit'], ['ocean', 'storms']]);

Sidekick.game({
  title: 'Idea Railway',
  emoji: '🚂',
  premise: 'Linking words are signals on the track. Couple the car that follows each signal.',
  outro: 'Full steam ahead! "In contrast" turns to the opposite. "Especially" points at the strongest example.',
  rounds: [
    railway({ id: 'contrast', phase: 'guided', helped: true, keys: ['cats'],
      say: 'The signal says "In contrast". Drag the car that goes the OPPOSITE way from the first idea.',
      hints: ['The first idea is that cats are quiet.', 'The opposite of quiet: dogs bark at every sound.'],
      win: 'Cats are quiet. In contrast, dogs bark.' }),
    railway({ id: 'especially', phase: 'guided', helped: true, keys: ['desert'],
      say: 'A different signal: "especially". It points at one strong example of the same idea.',
      hints: ['Which animal is a great example of saving water?', 'The camel, which goes days without.'],
      win: 'Desert animals save water, especially the camel.' }),
    railway({ id: 'two-tracks', phase: 'guided', helped: true, keys: ['summer', 'birds'],
      say: 'Two tracks with two different signals. Couple the right car to each.',
      hints: ['In contrast: find the opposite of long summer days.', 'Especially: find the best example of a clever nest.'],
      win: 'One opposite idea and one strong example.' }),
    railway({ id: 'last-run', phase: 'solo', keys: last,
      say: 'The signals will not explain themselves now. Couple the car that follows each one.' }),
  ],
});
