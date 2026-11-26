// Scoop Shop. Skill: dividing by a fraction asks how many of that fraction fit.
// A tub holds some cups of ice cream and each scoop is a fraction of a cup. Because a scoop is
// smaller than a cup, there are MORE scoops than cups. Division by a fraction makes a bigger number.
const X0 = 6, W = 88, COLORS = ['coral', 'mint', 'sun'];

function tub(o) {
  const [a, b] = o.scoop, answer = (o.cups * b) / a, small = Math.max(1, Math.floor((o.cups * a) / b));
  const scoops = (stage) => stage.get('scoops').value, parts = o.cups * b, pw = W / parts;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => scoops(stage) === value, steps: () => [{ set: 'scoops', value }], say });
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: 66, action: 'Serve!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🍨 ' + o.cups + ' cups ÷ {' + a + '/' + b + '} cup scoops', x: 50, y: 8, size: 4.6, card: true });
      stage.block({ x: X0 - 0.5, y: 19.5, w: W + 1, h: 15, color: 'white', round: 1.5, border: 'night' });
      const cells = Array.from({ length: parts }, (_, i) => stage.block({ x: X0 + i * pw + 0.2, y: 20.2, w: pw - 0.4, h: 13.6, color: 'coral', round: 0.6, z: 2 }).hide());
      for (let c = 1; c < o.cups; c++) stage.block({ x: X0 + (W * c) / o.cups - 0.4, y: 18, w: 0.8, h: 18, color: 'night', round: 0, z: 4 });
      for (let c = 0; c < o.cups; c++) stage.label({ text: 'cup ' + (c + 1), x: X0 + (W * (c + 0.5)) / o.cups, y: 39, size: 2.8 });
      const note = stage.label({ text: '', x: 50, y: 60, size: 3.4, w: 92, card: true }).hide();
      stage.stepper({ id: 'scoops', x: 50, y: 49, min: 0, max: 16, value: 0, format: (v) => v + (v === 1 ? ' scoop' : ' scoops') });
      const fill = (n) => cells.forEach((cell, i) => { if (i < n * a) cell.set({ color: COLORS[Math.floor(i / a) % 3] }).show(); else cell.hide(); });
      // The world reacts: every scoop taken is shaded in the tub.
      if (o.helped) stage.on('change', () => {
        const n = scoops(stage); fill(n);
        if (!n) note.hide(); else note.set(n * a > parts ? 'The tub ran out before that many scoops.' : n * a < parts ? 'There is still ice cream left in the tub.' : 'The tub is scooped clean!').show();
      });
      stage.data = { fill };
    },
    check: (stage) => scoops(stage) === answer,
    solution: () => [{ set: 'scoops', value: answer }],
    mistakes: [wrong('expects_a_smaller_number', small, 'A scoop is smaller than a cup, so there are more scoops than cups. Count how many scoops fit in each cup.')]
      .concat(o.cups !== small ? [wrong('ignores_the_fraction', o.cups, 'That would be right for 1 cup scoops. These scoops are only {' + a + '/' + b + '} of a cup.')] : []),
    onWin(stage) { stage.data.fill(answer); },
  };
}

// A fresh tub for the last round on every play.
const last = Sidekick.pick([{ cups: 6, scoop: [2, 3] }, { cups: 6, scoop: [1, 2] }, { cups: 4, scoop: [1, 2] }, { cups: 6, scoop: [3, 4] }]);

Sidekick.game({
  title: 'Scoop Shop',
  emoji: '🍨',
  premise: 'A tub holds a few cups of ice cream. Work out how many scoops it will serve.',
  outro: 'All served! Dividing by a fraction asks how many of that piece fit, and the answer gets bigger.',
  rounds: [
    tub({ id: 'half-cup', phase: 'guided', helped: true, cups: 2, scoop: [1, 2],
      say: 'This tub holds 2 cups. Each scoop is half a cup. Add scoops until the tub is empty.',
      hints: ['Two half cup scoops fit in each cup.', '2 cups hold 4 scoops.'],
      win: '2 ÷ {1/2} = 4. More scoops than cups!' }),
    tub({ id: 'third-cup', phase: 'guided', helped: true, cups: 3, scoop: [1, 3],
      say: '3 cups, and each scoop is a third of a cup. How many scoops?',
      hints: ['Three scoops fit in every cup.', '3 cups × 3 scoops each.'],
      win: '3 ÷ {1/3} = 9.' }),
    tub({ id: 'two-thirds', phase: 'guided', helped: true, cups: 4, scoop: [2, 3],
      say: 'Bigger scoops: two thirds of a cup each, from a 4 cup tub.',
      hints: ['Cut each cup into thirds. That is 12 thirds.', 'Each scoop takes 2 thirds. 12 ÷ 2.'],
      win: '4 ÷ {2/3} = 6.' }),
    tub({ id: 'last-tub', phase: 'solo', cups: last.cups, scoop: last.scoop,
      say: 'The tub will not show your scoops. Work out how many scoops this tub serves.' }),
  ],
});
