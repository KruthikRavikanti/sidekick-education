// Deep Dive. Skill: adding q means moving |q| from p on the number line, right for positive and left for negative.
// The submarine starts at p. Adding a positive number moves it right. Adding a negative
// number moves it left. Moving the other way lands on the wrong marker.
const show = (n) => (n < 0 ? '(−' + Math.abs(n) + ')' : String(n)), plain = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));

function dive(o) {
  const answer = o.p + o.q, other = o.p - o.q, at = (stage) => stage.get('sub').value;
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: o.helped ? 62 : 52, action: 'Dive!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: plain(o.p) + ' + ' + show(o.q), x: 50, y: 9, size: 6.4, card: true });
      stage.block({ x: 2, y: 27, w: 96, h: 13, color: 'white', opacity: 0.5, round: 2 });
      stage.track({ id: 'line', x: 6, y: 30, w: 88, min: -10, max: 10, step: 1, labelEvery: 2 });
      stage.marker({ id: 'sub', track: 'line', value: o.p, emoji: '🚤', size: 8, dy: -8, label: 'submarine' });
      // The world reacts: the log says how far the submarine has moved and which way.
      const log = o.helped ? stage.label({ text: '', x: 50, y: 54, size: 3.5, w: 92, card: true }) : null;
      const write = () => { if (!log) return; const moved = at(stage) - o.p; log.set(!moved ? 'Slide the submarine ' + Math.abs(o.q) + ' steps. Which way does adding ' + show(o.q) + ' go?' : 'Moved ' + Math.abs(moved) + (moved > 0 ? ' to the right' : ' to the left') + '. Now at ' + plain(at(stage)) + '.'); };
      write(); stage.on('change', write);
    },
    check: (stage) => at(stage) === answer,
    solution: () => [{ slide: 'sub', value: answer }],
    mistakes: Math.abs(other) <= 10 ? [{ tag: 'moves_the_wrong_way', when: (stage) => at(stage) === other, steps: () => [{ slide: 'sub', value: other }],
      say: 'That is ' + Math.abs(o.q) + ' steps, but the other way. Adding a ' + (o.q < 0 ? 'negative moves left.' : 'positive moves right.') }] : [],
  };
}

// A fresh problem for the last round on every play.
const last = Sidekick.pick([{ p: -2, q: -4 }, { p: 3, q: -6 }, { p: -1, q: 4 }, { p: 5, q: -8 }, { p: -6, q: 3 }]);

Sidekick.game({
  title: 'Deep Dive',
  emoji: '🚤',
  premise: 'Steer the submarine along the number line. Adding a negative number sends it left.',
  outro: 'Surfaced! Start at the first number. Add a positive: move right. Add a negative: move left.',
  rounds: [
    dive({ id: 'positive', phase: 'guided', helped: true, p: -3, q: 5,
      say: 'The submarine is at −3. Add 5: slide it 5 steps in the positive direction.',
      hints: ['Positive means to the right.', 'From −3, five steps right lands on 2.'],
      win: '−3 + 5 = 2.' }),
    dive({ id: 'negative', phase: 'guided', helped: true, p: 4, q: -6,
      say: 'Now at 4. Add −6. Which way does a negative number send the submarine?',
      hints: ['Adding a negative moves left.', 'From 4, six steps left lands on −2.'],
      win: '4 + (−6) = −2.' }),
    dive({ id: 'both-negative', phase: 'guided', helped: true, p: -2, q: -5,
      say: 'Start at −2 and add −5. The submarine is already below zero.',
      hints: ['Still left, because −5 is negative.', 'From −2, five steps left lands on −7.'],
      win: '−2 + (−5) = −7.' }),
    dive({ id: 'last-dive', phase: 'solo', p: last.p, q: last.q,
      say: 'The log is switched off. Slide the submarine to where ' + plain(last.p) + ' + ' + show(last.q) + ' lands.' }),
  ],
});
