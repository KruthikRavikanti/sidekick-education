// Digit Elevator. Skill: a digit is worth 10 times as much one place to the left.
// The building has a floor for each place. One floor up makes a digit worth ten times as
// much. One floor down makes it worth a tenth. 700 is not "7 more" than 70, it is a floor higher.
const FLOORS = [[1000, 'Thousands'], [100, 'Hundreds'], [10, 'Tens'], [1, 'Ones']];
const worth = (d, place) => (place === 1000 ? d + ',000' : String(d * place));

function ride(o) {
  const at = (stage, t) => stage.get('digit' + t.d).zone;
  const move = (key) => o.tiles.map((t) => ({ drag: 'digit' + t.d, to: 'f' + (typeof key === 'function' ? key(t) : t[key]) }));
  const allAt = (stage, where) => o.tiles.every((t) => at(stage, t) === 'f' + where(t));
  const back = (t) => (t.from * t.from) / t.to, twice = (t) => (t.to * t.to) / t.from, real = (place) => FLOORS.some((floor) => floor[0] === place);
  const slips = [];
  if (o.tiles.every((t) => real(back(t)))) slips.push({ tag: 'moves_the_wrong_way', when: (stage) => allAt(stage, back), steps: () => move(back), say: o.wrongWay || '' });
  if (o.tiles.every((t) => real(twice(t)))) slips.push({ tag: 'jumps_two_places', when: (stage) => allAt(stage, twice), steps: () => move(twice), say: o.twoFloors || '' });
  return {
    id: o.id, phase: o.phase, scene: 'city', height: 70, action: 'Ding!', say: o.say, hints: o.hints || [], win: o.win || '', mistakes: slips,
    setup(stage) {
      const signs = FLOORS.map(([place, name], i) => {
        stage.zone({ id: 'f' + place, x: 26, y: 5 + i * 15.5, w: 46, h: 13.5, look: 'box', color: i % 2 ? 'sky' : 'white', label: name + ' floor', showLabel: false, capacity: 2, accepts: 'digit' });
        stage.label({ text: name, x: 13, y: 11.75 + i * 15.5, size: 3.1, card: true });
        return o.helped ? stage.label({ text: '', x: 87, y: 11.75 + i * 15.5, size: 3.8 }) : null;
      });
      o.tiles.forEach((t) => stage.sprite({ id: 'digit' + t.d, text: String(t.d), size: 5, color: 'orange', kind: 'digit', drag: true, zone: 'f' + t.from, label: 'digit ' + t.d }));
      // The world reacts: each floor shows what its digit is worth there.
      const show = () => signs.forEach((sign, i) => { if (sign) sign.set(o.tiles.filter((t) => at(stage, t) === 'f' + FLOORS[i][0]).map((t) => '= ' + worth(t.d, FLOORS[i][0])).join(' ')); });
      show(); stage.on('change', show);
    },
    check: (stage) => allAt(stage, (t) => t.to),
    solution: () => move('to'),
  };
}

// Fresh digits for the last round: one goes up a floor and one goes down.
const last = Sidekick.pick([
  [{ d: 4, from: 10, to: 100 }, { d: 9, from: 100, to: 10 }],
  [{ d: 6, from: 100, to: 1000 }, { d: 2, from: 10, to: 1 }],
  [{ d: 5, from: 100, to: 1000 }, { d: 7, from: 100, to: 10 }],
]);
const grow = last.find((t) => t.to > t.from), shrink = last.find((t) => t.to < t.from);

Sidekick.game({
  title: 'Digit Elevator',
  emoji: '🛗',
  premise: 'Each floor is a place in a number. Ride digits up or down to change what they are worth.',
  outro: 'Ding! One place to the left is worth 10 times as much. One place to the right is a tenth.',
  rounds: [
    ride({ id: 'three', phase: 'guided', helped: true, tiles: [{ d: 3, from: 1, to: 10 }],
      twoFloors: 'Two floors up makes it worth 300. That is 100 times as much. Ten times is just one floor.',
      say: 'The 3 is on the Ones floor, worth 3. Drag it to the floor where it is worth 10 times as much.',
      hints: ['10 times 3 is 30.', 'One floor up is the Tens floor.'],
      win: 'On the Tens floor the 3 is worth 30. One floor up, ten times as much.' }),
    ride({ id: 'seven', phase: 'guided', helped: true, tiles: [{ d: 7, from: 10, to: 100 }],
      wrongWay: 'Down a floor makes it worth only 7. Ten times as much is one floor UP.',
      twoFloors: 'Two floors up is 7,000. That is 100 times as much.',
      say: 'The 7 is worth 70. Move it so it is worth 10 times as much.',
      hints: ['10 times 70 is 700.', '700 is not 7 more than 70. It is one whole floor higher.'],
      win: 'On the Hundreds floor the 7 is worth 700. That is 10 times 70.' }),
    ride({ id: 'five', phase: 'guided', helped: true, tiles: [{ d: 5, from: 1000, to: 100 }],
      twoFloors: 'Two floors down is 50. A tenth of 5,000 is just one floor down.',
      say: 'The 5 is worth 5,000. Move it so it is worth one tenth as much.',
      hints: ['A tenth means divide by 10.', 'One floor down: 5,000 becomes 500.'],
      win: 'One floor down, the 5 is worth 500. That is a tenth of 5,000.' }),
    ride({ id: 'two-riders', phase: 'solo', tiles: last,
      say: 'No signs now. Make the ' + grow.d + ' worth 10 times as much, and the ' + shrink.d + ' worth one tenth as much.' }),
  ],
});
