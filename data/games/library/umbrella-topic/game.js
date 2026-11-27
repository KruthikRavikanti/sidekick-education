// Umbrella Topic. Skill: name the main topic, the idea that covers every detail.
// A topic sign opens an umbrella. A sign that names only one detail keeps that one detail dry
// and leaves the others in the rain. The main topic covers them all.
const SETS = {
  pets: { details: [['🐶', 'dog'], ['🐱', 'cat'], ['🐟', 'fish']], topic: 'pets', narrow: ['dogs', 'dog'] },
  fruit: { details: [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes']], topic: 'fruit', narrow: ['apples', 'apple'] },
  go: { details: [['🚗', 'car'], ['🚌', 'bus'], ['🚲', 'bike']], topic: 'things that go', narrow: ['buses', 'bus'] },
  weather: { details: [['☀️', 'sun'], ['🌧️', 'rain'], ['❄️', 'snow']], topic: 'weather', narrow: ['snow', 'snow'] },
  clothes: { details: [['👕', 'shirt'], ['🧦', 'socks'], ['🧢', 'hat']], topic: 'clothes', narrow: ['hats', 'hat'] },
  bugs: { details: [['🐝', 'bee'], ['🐜', 'ant'], ['🦋', 'moth']], topic: 'bugs', narrow: ['bees', 'bee'] },
  toys: { details: [['🧸', 'bear'], ['🪁', 'kite'], ['🪀', 'yo-yo']], topic: 'toys', narrow: ['kites', 'kite'] },
  farm: { details: [['🐮', 'cow'], ['🐷', 'pig'], ['🐔', 'hen']], topic: 'farm animals', narrow: ['pigs', 'pig'] },
};

function storm(o) {
  const sets = o.keys.map((key) => SETS[key]), n = sets.length, trayY = n * 24 + 6;
  const sign = (stage, k) => stage.get('hook' + k).sprites[0];
  const hang = (pick) => sets.map((set, k) => ({ drag: 'sign-' + pick(set), to: 'hook' + k }));
  const all = (stage, pick) => sets.every((set, k) => sign(stage, k) && sign(stage, k).text === pick(set));
  return {
    id: o.id, phase: o.phase, scene: 'city', height: trayY + 18, action: 'Open up!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const kids = sets.map((set, k) => {
        const y = 14 + k * 24;
        stage.zone({ id: 'hook' + k, x: 3, y: y - 6, w: 31, h: 12, look: 'slot', color: 'sky', label: 'umbrella ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'sign' });
        stage.label({ text: '☂️', x: 40, y, size: 6 });
        return set.details.map((d, i) => stage.sprite({ text: d[0] + ' ' + d[1], size: 3.3, x: 54 + i * 16.5, y, badge: '💧' }));
      });
      stage.zone({ id: 'signs', x: 4, y: trayY, w: 92, h: 14, look: 'tray', label: 'Topic signs', showLabel: false, accepts: 'sign' });
      const tiles = [];
      sets.forEach((set, k) => { tiles.push([set.narrow[0], { set: k, covers: set.narrow[1] }]); tiles.push([set.topic, { set: k, covers: 'all' }]); });
      (o.extra || []).forEach((text) => tiles.push([text, { set: -1 }]));
      tiles.forEach(([text, data]) => stage.sprite({ id: 'sign-' + text, text, size: 3.4, color: 'orange', kind: 'sign', data, drag: true, zone: 'signs', label: text }));
      // The world reacts: each umbrella keeps dry only what its sign names.
      const dry = (k, i) => { const s = sign(stage, k); return !!s && s.data.set === k && (s.data.covers === 'all' || s.data.covers === sets[k].details[i][1]); };
      const paint = (everything) => kids.forEach((row, k) => row.forEach((kid, i) => kid.badge(everything || dry(k, i) ? '' : '💧')));
      if (o.helped) stage.on('change', () => paint(false));
      stage.data = { paint };
    },
    check: (stage) => all(stage, (set) => set.topic),
    solution: () => hang((set) => set.topic),
    mistakes: [{ tag: 'names_one_detail_as_the_topic', when: (stage) => all(stage, (set) => set.narrow[0]), steps: () => hang((set) => set.narrow[0]),
      say: 'That sign names just one of them. The others are still in the rain. Which word covers them all?' }],
    onWin(stage) { stage.data.paint(true); },
  };
}

// Fresh groups for the last round on every play.
const last = Sidekick.pick([['clothes', 'bugs'], ['toys', 'farm']]);

Sidekick.game({
  title: 'Umbrella Topic',
  emoji: '☂️',
  premise: 'It is raining! Hang the topic sign that opens an umbrella over everyone in the row.',
  outro: 'Everybody is dry! The main topic is the big idea that covers all the details.',
  rounds: [
    storm({ id: 'pets', phase: 'guided', helped: true, keys: ['pets'],
      say: 'Drag a sign onto the umbrella hook. Find the word that keeps the dog, the cat and the fish all dry.',
      hints: ['Try both signs and watch the raindrops.', 'A dog, a cat and a fish are all pets.'],
      win: 'Pets covers all three.' }),
    storm({ id: 'fruit', phase: 'guided', helped: true, keys: ['fruit'], extra: ['the park'],
      say: 'A new row and three signs. Which sign covers the apple, the banana and the grapes?',
      hints: ['Apples only covers the apple.', 'They are all fruit.'],
      win: 'Fruit is the main topic.' }),
    storm({ id: 'two-rows', phase: 'guided', helped: true, keys: ['go', 'weather'],
      say: 'Two umbrellas now. Give each row the sign that covers everything in it.',
      hints: ['A car, a bus and a bike are all things that go.', 'Sun, rain and snow are all weather.'],
      win: 'Things that go, and weather.' }),
    storm({ id: 'last-storm', phase: 'solo', keys: last,
      say: 'The raindrops will not tell you this time. Hang the main topic sign on each umbrella.' }),
  ],
});
