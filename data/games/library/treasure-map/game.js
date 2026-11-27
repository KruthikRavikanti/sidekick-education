// Treasure Map. Skill: plot a point from its coordinates.
// The first number says how far to walk across. The second says how far to climb up.
// Swap them and the shovel lands on the wrong spot of the island.
const COLS = 6, ROWS = 5;
const px = (c) => 16 + (c - 1) * 10, py = (r) => 11 + (ROWS - r) * 9.8;
const spot = (c, r) => 'c' + c + 'r' + r;

function island(stage, target, tap) {
  for (let c = 1; c <= COLS; c++) stage.label({ text: String(c), x: px(c), y: py(1) + 8, size: 3.2 });
  for (let r = 1; r <= ROWS; r++) stage.label({ text: String(r), x: 7.5, y: py(r), size: 3.2 });
  stage.label({ text: 'across →', x: 41, y: py(1) + 12.5, size: 2.8 });
  stage.label({ text: '🦜 X marks\n(' + target[0] + ', ' + target[1] + ')', x: 87, y: 13, size: 3.4, card: true });
  for (let r = 1; r <= ROWS; r++) for (let c = 1; c <= COLS; c++) {
    stage.sprite({ id: spot(c, r), text: '·', size: 3.6, x: px(c), y: py(r), label: 'spot ' + c + ' across, ' + r + ' up', data: { c, r }, tap: tap ? (tile) => tap(tile, c, r) : undefined });
  }
}

// Round 1: walk the pirate with two dials. Across first, then up.
function walk(o) {
  const [c, r] = o.target, across = (stage) => stage.get('across').value, up = (stage) => stage.get('up').value;
  const go = (a, u) => [{ set: 'across', value: a }, { set: 'up', value: u }];
  return {
    id: o.id, phase: 'guided', scene: 'sand', height: 86, action: 'Dig!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      island(stage, o.target);
      const pirate = stage.sprite({ id: 'pirate', emoji: '🏴‍☠️', x: 7.5, y: py(1) + 8, size: 7, z: 14 });
      stage.stepper({ id: 'across', x: 27, y: 76, min: 0, max: COLS, value: 0, format: (v) => 'Across ' + v });
      stage.stepper({ id: 'up', x: 73, y: 76, min: 0, max: ROWS, value: 0, format: (v) => 'Up ' + v });
      stage.on('change', () => pirate.moveTo(across(stage) ? px(across(stage)) : 7.5, up(stage) ? py(up(stage)) : py(1) + 8));
    },
    check: (stage) => across(stage) === c && up(stage) === r,
    solution: () => go(c, r),
    mistakes: [{ tag: 'swaps_across_and_up', when: (stage) => across(stage) === r && up(stage) === c, steps: () => go(r, c),
      say: 'That is ' + r + ' across and ' + c + ' up. The first number is always across.' }],
    onWin(stage) { stage.get(spot(c, r)).badge('💎'); },
  };
}

// After that: tap the spot to dig.
function dig(o) {
  const [c, r] = o.target, dugAt = (stage) => stage.get(spot(1, 1)).data.dug || '';
  return {
    id: o.id, phase: o.phase, scene: 'sand', height: 70, action: 'Dig!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const readout = o.helped ? stage.label({ text: 'Tap a spot\nto dig', x: 87, y: 32, size: 3.2, card: true }) : null;
      island(stage, o.target, (tile, tc, tr) => {
        const before = dugAt(stage);
        if (before) stage.get(before).badge('');
        stage.get(spot(1, 1)).data.dug = spot(tc, tr);
        tile.badge('⛏️').pop();
        if (readout) readout.set('Shovel at\n(' + tc + ', ' + tr + ')');
      });
    },
    check: (stage) => dugAt(stage) === spot(c, r),
    solution: () => [{ tap: spot(c, r) }],
    mistakes: [{ tag: 'swaps_across_and_up', when: (stage) => dugAt(stage) === spot(r, c), steps: () => [{ tap: spot(r, c) }],
      say: 'That spot is ' + r + ' across and ' + c + ' up. Go ' + c + ' across first, then ' + r + ' up.' }],
    onWin(stage) { stage.get(spot(c, r)).badge('💎'); },
  };
}

// A fresh X for the last round. Across and up are never the same number.
const last = Sidekick.pick([[2, 5], [5, 3], [4, 1], [1, 4], [3, 5]]);

Sidekick.game({
  title: 'Treasure Map',
  emoji: '🗺️',
  premise: 'The parrot calls out where X marks the spot. Walk across, climb up, and dig.',
  outro: 'Treasure found! In (across, up) the first number goes across and the second goes up.',
  rounds: [
    walk({ id: 'walk-it', target: [4, 2],
      say: 'X marks (4, 2). Walk the pirate 4 across, then 2 up, and dig.',
      hints: ['The first number is across. Set Across to 4.', 'The second number is up. Set Up to 2.'],
      win: '(4, 2) is 4 across and 2 up.' }),
    dig({ id: 'tap-it', phase: 'guided', helped: true, target: [2, 4],
      say: 'Now tap the spot yourself. X marks (2, 4). The sign shows where your shovel is.',
      hints: ['Slide your finger across to 2 first.', 'Then go up to 4.'],
      win: '2 across, 4 up. Treasure!' }),
    dig({ id: 'again', phase: 'guided', helped: true, target: [5, 1],
      say: 'One more with the sign to help: X marks (5, 1).',
      hints: ['Across first: find 5 along the bottom.', 'Then only 1 up.'],
      win: '5 across, 1 up.' }),
    dig({ id: 'last-dig', phase: 'solo', target: last,
      say: 'The sign is gone. X marks (' + last[0] + ', ' + last[1] + '). Tap the spot to dig.' }),
  ],
});
