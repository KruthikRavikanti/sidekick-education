// Bus to Ten. Skill: use a ten frame to find how many more make 10.
// The bus has exactly ten seats, laid out like a ten frame. Only the number of EMPTY seats
// fills it. Counting the riders already on board calls the wrong number of kids.
const FACES = ['🧒', '👧', '👦', '🧒🏽', '👧🏾', '👦🏻'];
const kids = (n) => n + (n === 1 ? ' kid' : ' kids');

function bus(stage, riders) {
  stage.block({ x: 6, y: 8, w: 66, h: 30, color: 'sun', round: 4, border: 'forest' });
  stage.block({ x: 72, y: 20, w: 11, h: 18, color: 'sun', round: 3, border: 'forest' });
  stage.block({ x: 15, y: 34, w: 9, h: 9, color: 'night', round: 5, z: 3 });
  stage.block({ x: 56, y: 34, w: 9, h: 9, color: 'night', round: 5, z: 3 });
  for (let i = 0; i < 10; i++) stage.block({ x: 9.6 + 11.76 * (i % 5) + 1.1, y: 12.6 + 10.4 * Math.floor(i / 5) + 0.9, w: 9.6, h: 8.6, color: 'white', round: 2, opacity: 0.75 });
  stage.zone({ id: 'bus', x: 8, y: 11, w: 62, h: 24, look: 'ghost', label: 'Bus seats', showLabel: false, layout: 'grid', cols: 5, rows: 2, capacity: 10, accepts: 'kid' });
  for (let i = 0; i < riders; i++) stage.sprite({ emoji: FACES[i % FACES.length], size: 8, kind: 'kid', zone: 'bus' });
}

const boarding = {
  id: 'fill-the-seats', phase: 'guided', scene: 'city', height: 78, action: 'Go!',
  say: 'The bus leaves when all 10 seats are full. Drag kids from the stop into the empty seats.',
  hints: ['Drag one kid at a time onto the bus.', 'Watch the sign count the empty seats down to 0.'],
  win: '6 riders and 4 more make 10. The bus is full!',
  setup(stage) {
    bus(stage, 6);
    const sign = stage.label({ text: 'Empty seats: 4', x: 50, y: 49, size: 5, card: true });
    stage.zone({ id: 'stop', x: 4, y: 59, w: 92, h: 16, look: 'tray', label: '🚏 Bus stop', labelAt: 'top', accepts: 'kid' });
    for (let i = 1; i <= 6; i++) stage.sprite({ id: 'w' + i, emoji: FACES[(i + 2) % FACES.length], size: 8, kind: 'kid', drag: true, zone: 'stop', label: 'kid ' + i });
    stage.on('change', () => sign.set('Empty seats: ' + (10 - stage.get('bus').count)));
  },
  check: (stage) => stage.get('bus').count === 10,
  solution: () => [1, 2, 3, 4].map((i) => ({ drag: 'w' + i, to: 'bus' })),
  mistakes: [],
};

// From here the child decides the number first. The kids they call line up at the stop.
function callRound(o) {
  const need = 10 - o.riders, called = (stage) => stage.get('call').value;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => called(stage) === value, steps: () => [{ set: 'call', value }], say });
  return {
    id: o.id, phase: o.phase, scene: 'city', height: 78, action: 'Go!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      bus(stage, o.riders);
      stage.stepper({ id: 'call', x: 50, y: 53, min: 0, max: 10, value: 0, format: (v) => 'Call ' + kids(v) });
      stage.zone({ id: 'stop', x: 4, y: 62, w: 92, h: 14, look: 'tray', label: 'Bus stop', showLabel: false, capacity: 0 });
      const line = [];
      // The world reacts: every kid called walks up to the stop.
      stage.on('change', () => {
        while (line.length < called(stage)) line.push(stage.sprite({ emoji: FACES[(line.length + 3) % FACES.length], size: 7, kind: 'kid', zone: 'stop' }));
        while (line.length > called(stage)) line.pop().remove();
      });
    },
    check: (stage) => called(stage) === need,
    solution: () => [{ set: 'call', value: need }],
    mistakes: [
      wrong('counts_the_filled_seats', o.riders, o.riders + ' seats already have riders. Count the empty seats instead.'),
      wrong('calls_all_ten', 10, 'The bus holds 10 in all, and ' + o.riders + ' are already on. Only the empty seats need kids.'),
    ],
    onWin(stage) { stage.get('stop').sprites.slice().forEach((kid) => kid.place('bus')); },
  };
}

// A fresh bus for the last round. Never 5 riders, where empty and full seats match.
const riders = Sidekick.pick([2, 3, 6, 8, 1]);

Sidekick.game({
  title: 'Bus to Ten',
  emoji: '🚌',
  premise: 'The bus only leaves when all 10 seats are full. Call just enough kids.',
  outro: 'Every seat full! Count the empty seats to know how many more make 10.',
  rounds: [
    boarding,
    callRound({ id: 'seven-on', phase: 'guided', riders: 7,
      say: 'Now 7 kids are riding. How many more should the driver call so the bus is full?',
      hints: ['Count the white seats. Those are the empty ones.', 'The bottom row has 3 empty seats.'],
      win: '7 and 3 more make 10.' }),
    callRound({ id: 'four-on', phase: 'guided', riders: 4,
      say: 'Only 4 riders this time. Call enough kids to fill all 10 seats.',
      hints: ['One empty seat on top, and the whole bottom row.', 'A full row is 5. So that is 5 and 1 more.'],
      win: '4 and 6 more make 10.' }),
    callRound({ id: 'your-bus', phase: 'solo', riders,
      say: 'Last bus! ' + riders + (riders === 1 ? ' kid is' : ' kids are') + ' on. Call the kids needed to make 10.' }),
  ],
});
