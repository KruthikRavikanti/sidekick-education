// Ribbon Shop. Skill: make an equal fraction by multiplying top and bottom by the same number.
// Cutting every part of a ribbon into smaller equal parts changes both numbers of the
// fraction, but the dyed length stays put. Adding the same number to both moves the dye.
const X0 = 6;

function bar(stage, y, w, parts, dyed, maxParts) {
  stage.block({ x: X0, y, w, h: 11, color: 'white', round: 1, border: 'night' });
  const dye = stage.block({ x: X0, y, w: (w * dyed) / parts, h: 11, color: 'coral', round: 1, z: 2 });
  const cuts = Array.from({ length: maxParts - 1 }, () => stage.block({ x: X0, y, w: 0.5, h: 11, color: 'night', round: 0, z: 3 }));
  const cutInto = (n) => cuts.forEach((line, i) => (i + 1 < n ? line.set({ x: X0 + (w * (i + 1)) / n - 0.25 }).show() : line.hide()));
  cutInto(parts);
  return { dye, cutInto, w };
}

// Rounds 1 and 2: cut every part into smaller parts and watch the fraction's two numbers grow together.
function cut(o) {
  const k = (stage) => stage.get('cuts').value;
  return {
    id: o.id, phase: 'guided', scene: 'candy', height: 70, action: 'Snip!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      stage.label({ text: 'Order: ' + o.to + ' equal parts', x: 50, y: 7, size: 4.4, card: true });
      const ribbon = bar(stage, 16, 88, o.b, o.a, o.b * 6);
      const name = stage.label({ text: '{' + o.a + '/' + o.b + '} is dyed', x: 50, y: 36, size: 5, card: true });
      stage.stepper({ id: 'cuts', x: 50, y: 53, min: 1, max: 6, value: 1, format: (v) => 'Each part into ' + v });
      stage.on('change', () => { ribbon.cutInto(o.b * k(stage)); name.set('{' + o.a * k(stage) + '/' + o.b * k(stage) + '} is dyed'); });
    },
    check: (stage) => o.b * k(stage) === o.to,
    solution: () => [{ set: 'cuts', value: o.to / o.b }],
    mistakes: [],
  };
}

// Rounds 3 and 4: dye a second ribbon, already cut smaller, to match the first.
function match(o) {
  const need = (o.a * o.to) / o.b, typed = (stage) => stage.get('n').number;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'n', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: 76, action: 'Dye it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '{' + o.a + '/' + o.b + '}', x: 32, y: 9, size: 5 });
      bar(stage, 16, 52, o.b, o.a, o.b);
      stage.label({ text: '{?/' + o.to + '}', x: 32, y: 39, size: 5 });
      const copy = bar(stage, 46, 52, o.to, 0, o.to);
      stage.keypad({ id: 'n', x: 80, y: 44 });
      const dyeTo = (n) => copy.dye.set({ w: (52 * Math.min(n, o.to)) / o.to });
      if (o.helped) stage.on('change', () => dyeTo(typed(stage) || 0));
      stage.data = { dyeTo };
    },
    check: (stage) => typed(stage) === need,
    solution: () => [{ type: 'n', text: String(need) }],
    mistakes: [
      wrong('adds_the_same_number', o.a + (o.to - o.b), 'The bottom went from ' + o.b + ' to ' + o.to + ' by multiplying, not adding. Each part was cut into ' + o.to / o.b + ', so multiply the top by ' + o.to / o.b + ' too.'),
      wrong('keeps_the_top', o.a, 'The parts are smaller now, so it takes more of them to cover the same length.'),
    ],
    onWin(stage) { stage.data.dyeTo(need); },
  };
}

// A fresh ribbon for the last round on every play.
const last = Sidekick.pick([{ a: 2, b: 3, to: 12 }, { a: 3, b: 4, to: 8 }, { a: 2, b: 5, to: 15 }, { a: 1, b: 4, to: 12 }]);

Sidekick.game({
  title: 'Ribbon Shop',
  emoji: '🎀',
  premise: 'Cut dyed ribbon into smaller equal parts. The dyed length has to stay exactly the same.',
  outro: 'Beautiful ribbons! Multiply the top and the bottom by the same number and the fraction stays equal.',
  rounds: [
    cut({ id: 'halves-to-sixths', a: 1, b: 2, to: 6,
      say: 'Half of this ribbon is dyed. The order wants 6 equal parts. Cut each part into smaller ones and watch the fraction.',
      hints: ['There are 2 parts now. How many cuts in each make 6?', 'Cut each part into 3. Both numbers get 3 times bigger.'],
      win: '{1/2} became {3/6}. The dyed length did not move.' }),
    cut({ id: 'thirds-to-twelfths', a: 2, b: 3, to: 12,
      say: 'Two thirds are dyed. This order wants 12 equal parts.',
      hints: ['3 parts times what makes 12?', 'Cut each part into 4.'],
      win: '{2/3} = {8/12}. Top and bottom were both multiplied by 4.' }),
    match({ id: 'fifths-to-tenths', phase: 'guided', helped: true, a: 3, b: 5, to: 10,
      say: 'The top ribbon is {3/5} dyed. The bottom one is cut into tenths. How many tenths must be dyed to match?',
      hints: ['Each fifth was cut into 2 tenths.', '3 fifths is 3 × 2 tenths.'],
      win: '{3/5} = {6/10}. Both numbers doubled.' }),
    match({ id: 'last-ribbon', phase: 'solo', a: last.a, b: last.b, to: last.to,
      say: 'The dye waits until you decide. How many parts of the bottom ribbon match the top one?' }),
  ],
});
