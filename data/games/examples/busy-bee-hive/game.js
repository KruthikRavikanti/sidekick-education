// Busy Bee Hive. Skill: add and subtract within 10 by counting on or back from a known number.
// Once the hive door shuts, the bees inside cannot be counted one by one. The child has to
// start from the number on the sign and think about the bees that fly in or out.
const plural = (n) => n + (n === 1 ? ' bee' : ' bees');

function meadow(stage, home, sign) {
  stage.sprite({ emoji: '🌼', x: 6, y: 9, size: 8 });
  stage.sprite({ emoji: '🌸', x: 18, y: 14, size: 7 });
  stage.zone({ id: 'hive', x: 50, y: 13, w: 46, h: 29, look: 'box', color: 'sun', label: 'The hive', showLabel: false, layout: 'grid', cols: 5, rows: 2, accepts: 'bee' });
  stage.zone({ id: 'flowers', x: 4, y: 46, w: 46, h: 29, look: 'tray', color: 'leaf', label: '🌷 Flower patch', labelAt: 'top', layout: 'grid', cols: 4, rows: 2, accepts: 'bee' });
  return stage.label({ id: 'sign', text: sign, x: 73, y: 7, size: 5.4, card: true });
}

// Rounds 1 and 2: a glass hive. The child moves the bees and the sign counts on or back live.
const flyIn = {
  id: 'fly-in', phase: 'guided', scene: 'meadow', height: 78, action: 'All home!',
  say: '6 bees are home. 3 more want to come in. Drag each one into the hive and watch the sign.',
  hints: ['Drag a bee from the flower patch into the yellow hive.', 'Say the sign out loud as each bee goes in: 7, 8, 9.'],
  win: '6 and 3 more makes 9. You counted on from 6.',
  setup(stage) {
    const sign = meadow(stage, 6, plural(6) + ' home');
    for (let i = 1; i <= 6; i++) stage.sprite({ id: 'home' + i, emoji: '🐝', size: 8, kind: 'bee', zone: 'hive' });
    for (let i = 1; i <= 3; i++) stage.sprite({ id: 'guest' + i, emoji: '🐝', size: 8, kind: 'bee', drag: true, zone: 'flowers', label: 'bee ' + i });
    stage.on('change', () => sign.set(plural(stage.get('hive').count) + ' home'));
  },
  check: (stage) => stage.get('hive').count === 9,
  solution: () => [1, 2, 3].map((i) => ({ drag: 'guest' + i, to: 'hive' })),
  mistakes: [],
};

const flyOut = {
  id: 'fly-out', phase: 'guided', scene: 'meadow', height: 78, action: 'Snack time!',
  say: 'Now 9 bees are home, and 4 of them are hungry. Drag 4 bees out to the flower patch.',
  hints: ['Drag one bee at a time from the hive to the flowers.', 'Watch the sign count back: 8, 7, 6, 5. Stop when 4 bees are out.'],
  win: '9 take away 4 leaves 5. You counted back from 9.',
  setup(stage) {
    const sign = meadow(stage, 9, plural(9) + ' home');
    for (let i = 1; i <= 9; i++) stage.sprite({ id: 'bee' + i, emoji: '🐝', size: 8, kind: 'bee', drag: true, zone: 'hive', label: 'bee ' + i });
    stage.on('change', () => sign.set(plural(stage.get('hive').count) + ' home'));
  },
  check: (stage) => stage.get('flowers').count === 4,
  solution: () => [1, 2, 3, 4].map((i) => ({ drag: 'bee' + i, to: 'flowers' })),
  mistakes: [],
};

// Rounds 3 and 4: the door is shut. The number of honey cups the child sets is the answer,
// and the cups appear on the table as they choose.
function doorShut(o) {
  const total = o.home + o.change, moving = Math.abs(o.change), out = o.change < 0;
  const cupsSet = (stage) => stage.get('cups').value;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => cupsSet(stage) === value, steps: () => [{ set: 'cups', value }], say });
  return {
    id: o.id, phase: o.phase, scene: 'meadow', height: 82, action: 'Open the hive!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.zone({ id: 'hive', x: 5, y: 7, w: 46, h: 29, look: 'box', color: 'sun', label: 'The hive', showLabel: false, layout: 'grid', cols: 5, rows: 2, capacity: 0 });
      stage.label({ id: 'sign', text: '🚪 ' + plural(o.home) + ' inside', x: 28, y: 21.5, size: 5, card: true });
      for (let i = 0; i < moving; i++) stage.sprite({ emoji: '🐝', x: 62 + (i % 3) * 12, y: 12 + Math.floor(i / 3) * 10, size: 8, float: true });
      stage.label({ text: plural(moving) + (out ? ' fly out' : ' fly in'), x: 75, y: 33, size: 4.6, card: true });
      stage.stepper({ id: 'cups', x: 50, y: 47, min: 0, max: 20, value: 0, format: (v) => v + (v === 1 ? ' cup' : ' cups') });
      stage.zone({ id: 'table', x: 4, y: 58, w: 92, h: 21, look: 'tray', color: 'orange', label: 'Honey table', showLabel: false, capacity: 0 });
      const cups = [];
      // The world reacts: one honey cup lands on the table for each number the child sets.
      stage.on('change', () => {
        const want = cupsSet(stage);
        while (cups.length < want) cups.push(stage.sprite({ emoji: '🍯', size: 6, zone: 'table' }));
        while (cups.length > want) cups.pop().remove();
      });
    },
    check: (stage) => cupsSet(stage) === total,
    solution: () => [{ set: 'cups', value: total }],
    mistakes: out ? [
      wrong('adds_when_bees_leave', o.home + moving, ''),
      wrong('counts_the_start_number', total + 1, ''),
      wrong('only_the_bees_that_moved', moving, ''),
    ] : [
      wrong('counts_the_start_number', total - 1, 'So close! Do not count ' + o.home + ' again. Start after it: ' + (o.home + 1) + ', ' + (o.home + 2) + '...'),
      wrong('only_the_bees_that_moved', moving, moving + ' bees flew in, but ' + o.home + ' were already inside. Start at ' + o.home + ' and count on.'),
    ],
    onWin(stage) {
      stage.get('sign').hide();
      for (let i = 0; i < total; i++) stage.sprite({ emoji: '🐝', size: 7.5, zone: 'hive' }).pop();
    },
  };
}

// A fresh ending on every play. In each one, the three known mistakes all give a different number from the answer.
const [home, away] = Sidekick.pick([[8, 5], [9, 4], [7, 3], [10, 6]]);

Sidekick.game({
  title: 'Busy Bee Hive',
  emoji: '🐝',
  premise: 'Bees keep flying in and out of the hive. Help the queen know how many are home.',
  outro: 'The hive is buzzing! Start from the number you know, then count on or count back.',
  rounds: [
    flyIn,
    flyOut,
    doorShut({ id: 'door-shut-in', phase: 'guided', home: 5, change: 4,
      say: 'The door is shut! 5 bees are inside and 4 more fly in. Set out one honey cup for every bee inside now.',
      hints: ['You cannot see inside, so start at 5 and count on.', 'Count on four times from 5: 6, 7, 8, 9.'],
      win: '5 and 4 more is 9. A cup for every bee!' }),
    doorShut({ id: 'door-shut-out', phase: 'solo', home, change: -away,
      say: 'The door is shut again. ' + home + ' bees are inside and ' + away + ' fly out to play. Set out one honey cup for every bee still inside.' }),
  ],
});
