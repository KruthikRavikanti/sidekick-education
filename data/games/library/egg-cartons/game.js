// Egg Cartons. Skill: a teen number is one full ten and some extra ones.
// A carton only ever holds ten. To pack 14 eggs the child needs 1 carton and 4 loose eggs.
// Reading 14 as "1 and 4" puts 5 eggs on the table, and the order is plainly short.
const CARTON = '🥚🥚🥚🥚🥚\n🥚🥚🥚🥚🥚';
const value = (stage, id) => stage.get(id).value;
const onTable = (stage) => value(stage, 'cartons') * 10 + value(stage, 'loose');
const pack = (cartons, loose) => [{ set: 'cartons', value: cartons }, { set: 'loose', value: loose }];

function order(o) {
  const ones = o.n - 10;
  return {
    id: o.id, phase: o.phase, scene: 'field', height: 76, action: 'Pack it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ emoji: '🐔', x: 9, y: 8, size: 10 });
      stage.label({ text: 'Order: ' + o.n + ' eggs', x: 52, y: 8, size: 5.6, card: true });
      stage.zone({ id: 'table', x: 4, y: 16, w: 92, h: 27, look: 'tray', color: 'orange', label: 'Packing table', showLabel: false, capacity: 0 });
      stage.label({ text: 'Cartons of 10', x: 27, y: 49, size: 3.8 });
      stage.label({ text: 'Loose eggs', x: 75, y: 49, size: 3.8 });
      stage.stepper({ id: 'cartons', x: 27, y: 58, min: 0, max: 2, value: 0 });
      stage.stepper({ id: 'loose', x: 75, y: 58, min: 0, max: 9, value: 0 });
      const tally = o.tally ? stage.label({ text: 'On the table: 0 eggs', x: 50, y: 70, size: 4.4, card: true }) : null;
      const boxes = [], eggs = [];
      // The world reacts: cartons and eggs land on the table as the child sets them.
      stage.on('change', () => {
        const cartons = value(stage, 'cartons'), loose = value(stage, 'loose');
        while (boxes.length < cartons) boxes.push(stage.sprite({ text: CARTON, size: 3.3, zone: 'table' }));
        while (boxes.length > cartons) boxes.pop().remove();
        while (eggs.length < loose) eggs.push(stage.sprite({ emoji: '🥚', size: 5.5, zone: 'table' }));
        while (eggs.length > loose) eggs.pop().remove();
        if (tally) tally.set('On the table: ' + onTable(stage) + ' eggs');
      });
    },
    check: (stage) => onTable(stage) === o.n,
    solution: () => pack(1, ones),
    mistakes: [
      { tag: 'digits_as_ones', when: (stage) => value(stage, 'cartons') === 0 && value(stage, 'loose') === 1 + ones, steps: () => pack(0, 1 + ones),
        say: 'That is 1 and ' + ones + ', only ' + (1 + ones) + ' eggs. The 1 in ' + o.n + ' means one full carton of ten.' },
      { tag: 'only_the_ones', when: (stage) => value(stage, 'cartons') === 0 && value(stage, 'loose') === ones, steps: () => pack(0, ones),
        say: 'Those are the ' + ones + ' extra eggs. ' + o.n + ' also has one full carton of ten.' },
    ],
  };
}

// A fresh order for the last round on every play.
const last = Sidekick.pick([14, 17, 12, 15, 18]);

Sidekick.game({
  title: 'Egg Cartons',
  emoji: '🥚',
  premise: 'Hen sells eggs in cartons of ten. Pack each order with full cartons and loose eggs.',
  outro: 'All packed! A teen number is one full ten and some more.',
  rounds: [
    order({ id: 'thirteen', phase: 'guided', n: 13, tally: true,
      say: 'Hen needs 13 eggs. A carton holds 10. Add 1 full carton, then loose eggs until the table shows 13.',
      hints: ['Tap + under Cartons of 10 one time.', 'One carton is 10. Count on with loose eggs: 11, 12, 13.'],
      win: '13 is 1 carton of ten and 3 more.' }),
    order({ id: 'sixteen', phase: 'guided', n: 16, tally: true,
      say: 'Next order: 16 eggs. How many full cartons, and how many loose eggs?',
      hints: ['Start with a full carton of 10.', '10 and how many more make 16?'],
      win: '16 is 10 and 6.' }),
    order({ id: 'eleven', phase: 'guided', n: 11,
      say: 'The counter is switched off. Pack 11 eggs: full cartons first, then the loose ones.',
      hints: ['11 is just past 10.', 'One full carton and 1 more egg.'],
      win: '11 is 10 and 1.' }),
    order({ id: 'last-order', phase: 'solo', n: last,
      say: 'Last order: ' + last + ' eggs. Pack it with full cartons and loose eggs.' }),
  ],
});
