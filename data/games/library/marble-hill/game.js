// Marble Hill. Skill: use the halfway point to decide which ten a number is closer to.
// Every marble sits on a hill between two towns, and the flag on the peak is the halfway
// number. Before the flag it rolls back. At the flag or past it, it rolls forward.
const HILL = '<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0,40 Q50,-34 100,40 Z" fill="#b7ce63" stroke="#054a29" stroke-width="1.5"/></svg>';
const HX = 27, HW = 46;
const tens = (n) => { const lo = Math.floor(n / 10) * 10; return { lo, hi: lo + 10, up: n - lo >= 5 }; };

function hill(stage, n, k, y0, big, helped) {
  const t = tens(n), HH = big ? 26 : 15, peakY = y0 + (big ? 6 : 8.5), f = helped ? (n - t.lo) / 10 : 0.5;
  stage.add(HILL, { x: HX, y: peakY, w: HW, h: HH });
  if (helped) stage.label({ text: '🚩 ' + (t.lo + 5), x: 50, y: peakY - 2, size: 3.4 });
  [['lo', t.lo, 3], ['hi', t.hi, 76]].forEach(([side, ten, x]) => {
    stage.zone({ id: side + k, x, y: peakY + HH - 13, w: 21, h: 13, look: 'plate', label: 'Town ' + ten, showLabel: false, capacity: 1, accepts: 'm' + k });
    stage.label({ text: '🏠 ' + ten, x: x + 10.5, y: peakY + HH - 16.5, size: big ? 4 : 3.2 });
  });
  if (helped) for (let i = 0; i <= 10; i++) stage.label({ text: String(t.lo + i), x: HX + (HW * i) / 10, y: peakY + HH + 3, size: 2.3 });
  stage.sprite({ id: 'm' + k, text: String(n), size: 3.6, color: 'orange', kind: 'm' + k, drag: true, x: HX + HW * f, y: peakY + HH * (1 - 3.7 * f * (1 - f)) - 4, label: 'marble ' + n });
}

function roll(o) {
  const big = o.marbles.length === 1;
  const town = (stage, k) => stage.get('m' + k).zone;
  const send = (sides) => o.marbles.map((n, k) => ({ drag: 'm' + k, to: sides[k] + k }));
  const right = o.marbles.map((n) => (tens(n).up ? 'hi' : 'lo'));
  const allDown = o.marbles.map(() => 'lo'), halfDown = o.marbles.map((n, k) => (n % 10 === 5 ? 'lo' : right[k]));
  const matches = (stage, sides) => o.marbles.every((n, k) => town(stage, k) === sides[k] + k);
  return {
    id: o.id, phase: o.phase, scene: 'sky', height: big ? 48 : 82, action: 'Roll!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) { o.marbles.forEach((n, k) => hill(stage, n, k, big ? 4 : 1 + k * 26, big, !!o.helped)); },
    check: (stage) => matches(stage, right),
    solution: () => send(right),
    mistakes: o.mistakes || [
      { tag: 'always_rounds_down', when: (stage) => matches(stage, allDown), steps: () => send(allDown), say: '' },
      { tag: 'rounds_halfway_down', when: (stage) => matches(stage, halfDown), steps: () => send(halfDown), say: '' },
    ],
  };
}
const slip = (tag, side, say) => [{ tag, when: (stage) => stage.get('m0').zone === side + '0', steps: () => [{ drag: 'm0', to: side + '0' }], say }];

// Fresh marbles for the last round: one rolls back, one rolls on, one sits exactly halfway.
const last = Sidekick.pick([[67, 35, 82], [43, 75, 58], [91, 25, 36]]);

Sidekick.game({
  title: 'Marble Hill',
  emoji: '🔵',
  premise: 'Each marble rolls to the nearest town. The flag on the hill marks halfway.',
  outro: 'Every marble is home! Before halfway it rolls back. At halfway or past it, it rolls forward.',
  rounds: [
    roll({ id: 'forty-seven', phase: 'guided', helped: true, marbles: [47],
      say: 'Marble 47 sits between 40 and 50. Which town is it closer to? Drag it there.',
      hints: ['The flag is at 45, halfway between the towns.', '47 is past the flag, so it rolls forward.'],
      win: '47 is past halfway. It rounds to 50.',
      mistakes: slip('always_rounds_down', 'lo', '47 is past the flag at 45. From there the marble rolls forward to 50.') }),
    roll({ id: 'thirty-two', phase: 'guided', helped: true, marbles: [32],
      say: 'Now marble 32. Is it before the flag or past it? Send it to the closer town.',
      hints: ['Halfway between 30 and 40 is 35.', '32 has not reached the flag, so it rolls back.'],
      win: '32 is before halfway. It rounds to 30.',
      mistakes: slip('rounds_up_too_soon', 'hi', '32 has not reached the flag at 35. The marble rolls back to 30.') }),
    roll({ id: 'on-the-flag', phase: 'guided', helped: true, marbles: [45],
      say: 'Marble 45 is balanced right on the flag! The halfway rule: it rolls forward.',
      hints: ['45 is just as far from 40 as from 50.', 'A marble on the flag always rolls to the bigger ten.'],
      win: 'Exactly halfway rounds up. 45 rounds to 50.',
      mistakes: slip('rounds_halfway_down', 'lo', 'Right on the flag is a tie. Rounding breaks the tie by rolling forward, to 50.') }),
    roll({ id: 'three-hills', phase: 'solo', marbles: last,
      say: 'Three hills with no number marks. Each marble waits on its peak. Drag each one to its closer town.' }),
  ],
});
