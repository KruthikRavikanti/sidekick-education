// Lily Pad Hops. Skill: make a number pattern by adding or subtracting the same amount each time.
// Froggy hops the same distance every time. Tap the pads where the hops land. If one hop
// is a different size from the others, the pattern is broken.
const tileX = (n) => 5.5 + ((n - 1) % 10) * 9.9, tileY = (n) => 26 + Math.floor((n - 1) / 10) * 11;

function pond(o) {
  const lands = [1, 2, 3].map((k) => o.start + o.step * k), sign = o.step > 0 ? 1 : -1;
  const drifted = [lands[0], lands[1], lands[2] - sign];
  const picked = (stage) => { const out = []; for (let n = 1; n <= 30; n++) if (n !== o.start && stage.get('n' + n).data.on) out.push(n); return out.sort((a, b) => sign * (a - b)); };
  const taps = (list) => list.map((n) => ({ tap: 'n' + n }));
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: o.helped ? 70 : 60, action: 'Hop!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🐸 Start at ' + o.start + '. ' + (sign > 0 ? 'Add ' : 'Subtract ') + Math.abs(o.step) + ' every hop.', x: 50, y: 9, size: 4.2, card: true });
      const path = o.helped ? stage.label({ text: 'Tap the next three pads Froggy lands on.', x: 50, y: 62, size: 3.4, w: 94, card: true }) : null;
      for (let n = 1; n <= 30; n++) stage.sprite({ id: 'n' + n, text: String(n), size: 3.6, x: tileX(n), y: tileY(n), color: n === o.start ? 'orange' : 'forest', label: 'pad ' + n, data: { on: false }, badge: n === o.start ? '🐸' : '',
        tap(tile) {
          if (n === o.start) return;
          tile.data.on = !tile.data.on; tile.badge(tile.data.on ? '🪷' : '');
          if (!path) return;
          // The world reacts: the hops are read back with the size of each one.
          const stops = [o.start].concat(picked(stage)), sizes = stops.slice(1).map((v, i) => v - stops[i]);
          path.set(stops.length < 2 ? 'Tap the next three pads Froggy lands on.' : stops.join(' → ') + '   (' + sizes.map((d) => (d > 0 ? '+' : '−') + Math.abs(d)).join(', ') + ')' + (sizes.some((d) => d !== o.step) ? '  Not every hop is the same size.' : ''));
        } });
    },
    check: (stage) => picked(stage).join() === lands.join(),
    solution: () => taps(lands),
    mistakes: [{ tag: 'changes_the_step_partway', when: (stage) => picked(stage).join() === drifted.join(), steps: () => taps(drifted),
      say: 'The last hop is a different size from the first two. Every hop in a pattern has to be the same.' }],
  };
}

// A fresh rule for the last round on every play.
const last = Sidekick.pick([{ start: 5, step: 6 }, { start: 29, step: -4 }, { start: 4, step: 7 }, { start: 27, step: -6 }]);

Sidekick.game({
  title: 'Lily Pad Hops',
  emoji: '🪷',
  premise: 'Froggy always hops the same distance. Tap the lily pads where the hops land.',
  outro: 'Splash! A number pattern adds or subtracts the same amount every single time.',
  rounds: [
    pond({ id: 'add-four', phase: 'guided', helped: true, start: 3, step: 4,
      say: 'Froggy starts on 3 and adds 4 every hop. Tap the next three pads. The sign shows the size of each hop.',
      hints: ['3 and 4 more is 7.', 'Keep adding 4: 7, 11, 15.'],
      win: '3, 7, 11, 15. Plus 4 every time.' }),
    pond({ id: 'add-five', phase: 'guided', helped: true, start: 2, step: 5,
      say: 'A new rule: start at 2 and add 5 every hop.',
      hints: ['2, then 7.', '7, 12, 17.'],
      win: '2, 7, 12, 17. Plus 5 every time.' }),
    pond({ id: 'subtract-five', phase: 'guided', helped: true, start: 28, step: -5,
      say: 'Now Froggy hops backward. Start at 28 and subtract 5 every hop.',
      hints: ['28 take away 5 is 23.', '23, 18, 13.'],
      win: '28, 23, 18, 13. Minus 5 every time.' }),
    pond({ id: 'last-pond', phase: 'solo', start: last.start, step: last.step,
      say: 'The sign is gone. Read the rule and tap the next three pads Froggy lands on.' }),
  ],
});
