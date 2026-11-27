// Sock Pairs. Skill: pair objects to decide whether a number is odd or even.
// Even means every sock finds a partner. Odd means one sock is left alone. The size of the
// number has nothing to do with it, which the last round makes the child prove.
const sockIds = (n) => Array.from({ length: n }, (_, i) => 's' + (i + 1));

// Rounds 1 and 2: pair real socks, then name what happened.
function laundry(o) {
  const boxes = Math.floor(o.n / 2) + 1, answer = o.n % 2 ? 'odd' : 'even';
  const alone = (stage) => stage.get('pile').count + Array.from({ length: boxes }, (_, b) => stage.get('pair' + (b + 1)).count).filter((c) => c === 1).length;
  const pairUp = () => sockIds(o.n - (o.n % 2)).map((id, i) => ({ drag: id, to: 'pair' + (Math.floor(i / 2) + 1) }));
  return {
    id: o.id, phase: 'guided', scene: 'desk', height: 70, action: 'Done!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      stage.zone({ id: 'pile', x: 4, y: 5, w: 92, h: 17, look: 'basket', label: 'Laundry pile', showLabel: false, accepts: 'sock' });
      sockIds(o.n).forEach((id) => stage.sprite({ id, emoji: '🧦', size: 8, kind: 'sock', drag: true, zone: 'pile', label: 'sock' }));
      const w = 21, x0 = 50 - (boxes * (w + 2) - 2) / 2;
      for (let b = 0; b < boxes; b++) stage.zone({ id: 'pair' + (b + 1), x: x0 + b * (w + 2), y: 28, w, h: 14, look: 'slot', label: 'Pair box', showLabel: false, capacity: 2, accepts: 'sock' });
      stage.choice({ id: 'call', x: 50, y: 56, w: 94, options: [{ id: 'even', text: 'Even: all paired' }, { id: 'odd', text: 'Odd: one left over' }] });
    },
    check: (stage) => alone(stage) === o.n % 2 && stage.get('call').value === answer,
    solution: () => pairUp().concat([{ choose: 'call', option: answer }]),
    mistakes: answer === 'odd' ? [{
      tag: 'ignores_the_leftover', when: (stage) => alone(stage) === 1 && stage.get('call').value === 'even',
      steps: () => pairUp().concat([{ choose: 'call', option: 'even' }]),
      say: 'Look, one sock has no partner. A number with one left over is odd.',
    }] : [],
  };
}

// Rounds 3 and 4: which baskets would pair up with none left over?
function baskets(o) {
  const evens = o.numbers.filter((n) => n % 2 === 0), odds = o.numbers.filter((n) => n % 2 === 1);
  const biggest = o.numbers.slice().sort((a, b) => b - a).slice(0, 2);
  const chosen = (stage) => stage.get('pick').value.map(Number).sort((a, b) => a - b);
  const same = (stage, list) => chosen(stage).join() === list.slice().sort((a, b) => a - b).join();
  const tap = (list) => list.map((n) => ({ choose: 'pick', option: String(n) }));
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 70, action: 'Done!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.numbers.forEach((n, i) => {
        const x = 14 + i * 24;
        stage.block({ x: x - 10, y: 5, w: 20, h: o.pictures ? 36 : 20, color: 'white', round: 3, border: 'border' });
        stage.label({ text: String(n), x, y: 13, size: 8 });
        if (o.pictures) stage.label({ text: Array.from({ length: Math.ceil(n / 2) }, (_, r) => (r * 2 + 1 < n ? '🧦🧦' : '🧦')).join('\n'), x, y: 30, size: 2.2 });
      });
      stage.label({ text: 'Tap every even number', x: 50, y: 48, size: 4.2 });
      stage.choice({ id: 'pick', x: 50, y: 59, w: 94, multi: true, options: o.numbers.map(String) });
    },
    check: (stage) => same(stage, evens),
    solution: () => tap(evens),
    mistakes: [
      { tag: 'bigger_means_even', when: (stage) => same(stage, biggest), steps: () => tap(biggest),
        say: 'Big numbers are not always even. Look for a sock with no partner.' },
      { tag: 'picks_the_odd_ones', when: (stage) => same(stage, odds), steps: () => tap(odds),
        say: 'Those have one sock left over, so they are odd. Even numbers pair up fully.' },
    ],
  };
}

// Fresh numbers for the last round. In each set the two biggest are not the two even ones.
const lastNumbers = Sidekick.pick([[7, 10, 13, 16], [6, 9, 12, 15], [8, 11, 14, 17]]);

Sidekick.game({
  title: 'Sock Pairs',
  emoji: '🧦',
  premise: 'Laundry day! Pair up the socks and find out which numbers leave one sock alone.',
  outro: 'All sorted! Even numbers pair up with none left over. Odd numbers leave one out.',
  rounds: [
    laundry({ id: 'six-socks', n: 6,
      say: 'Drag the 6 socks into pair boxes, two in each. Then tap what happened.',
      hints: ['Each box holds exactly 2 socks.', 'If every sock has a partner, the number is even.'],
      win: '6 socks make 3 pairs with none left over. 6 is even.' }),
    laundry({ id: 'seven-socks', n: 7,
      say: 'Now 7 socks. Pair them up and see if any sock is left alone.',
      hints: ['Fill three boxes with 2 socks each.', 'One sock has no partner. That makes the number odd.'],
      win: '7 socks make 3 pairs and 1 left over. 7 is odd.' }),
    baskets({ id: 'picture-baskets', phase: 'guided', numbers: [5, 8, 9, 12], pictures: true,
      say: 'Four baskets, already paired up. Tap every number where no sock is left alone.',
      hints: ['Look at the bottom of each stack for a lonely sock.', '8 and 12 have no sock left over.'],
      win: '8 and 12 are even. 5 and 9 each leave one sock out.' }),
    baskets({ id: 'number-baskets', phase: 'solo', numbers: lastNumbers,
      say: 'No pictures now. Tap every number of socks that would pair up with none left over.' }),
  ],
});
