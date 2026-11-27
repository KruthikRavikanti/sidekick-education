// Marble Bag. Skill: a probability is a number from 0 to 1: the wanted outcomes out of ALL outcomes.
// The chance of red is the red marbles out of every marble in the bag. Comparing red to the
// other color instead can give a number bigger than 1, which shoots past "certain".
function bag(o) {
  const total = o.red + o.blue, num = (stage) => stage.get('num').value, den = (stage) => stage.get('den').value;
  const set = (a, b) => [{ set: 'num', value: a }, { set: 'den', value: b }];
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: o.helped ? 84 : 62, action: 'Draw!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🔴'.repeat(o.red) + '🔵'.repeat(o.blue), x: 50, y: 9, size: 5.6, card: true });
      stage.label({ text: 'Chance of pulling out a red:', x: 50, y: 19, size: 3.6 });
      stage.label({ text: 'this many', x: 27, y: 25.5, size: 3 });
      stage.stepper({ id: 'num', x: 27, y: 35, min: 0, max: 10, value: 0, format: (v) => String(v) });
      stage.label({ text: 'out of', x: 73, y: 25.5, size: 3 });
      stage.stepper({ id: 'den', x: 73, y: 35, min: 1, max: 10, value: 1, format: (v) => String(v) });
      const now = stage.label({ text: '', x: 50, y: 50, size: 5, card: true });
      const show = () => now.set('{' + num(stage) + '/' + den(stage) + '}');
      show(); stage.on('change', show);
      if (!o.helped) return;
      // The world reacts: a pointer slides along the line from impossible to certain, and off the end past 1.
      stage.block({ x: 10, y: 65, w: 70, h: 1.2, color: 'night', round: 0 });
      stage.label({ text: '0\nnever', x: 10, y: 72, size: 2.8 }); stage.label({ text: '1\nalways', x: 80, y: 72, size: 2.8 });
      const pointer = stage.label({ text: '🔻', x: 10, y: 61, size: 4 });
      const note = stage.label({ text: '', x: 46, y: 77, size: 3.2, w: 46 });
      stage.on('change', () => { const p = num(stage) / den(stage); pointer.moveTo(10 + 70 * Math.min(p, 1.22), 61); note.set(p > 1 ? 'Past 1! Nothing is more than certain.' : ''); });
    },
    check: (stage) => num(stage) * total === o.red * den(stage),
    solution: () => set(o.red, total),
    mistakes: o.blue <= 10 ? [{ tag: 'compares_to_the_other_color', when: (stage) => num(stage) === o.red && den(stage) === o.blue, steps: () => set(o.red, o.blue),
      say: 'That compares red to blue. A chance is red out of ALL the marbles: ' + o.red + ' out of ' + total + '.' }] : [],
  };
}

// A fresh bag for the last round on every play.
const last = Sidekick.pick([{ red: 4, blue: 3 }, { red: 5, blue: 2 }, { red: 6, blue: 4 }, { red: 3, blue: 1 }]);

Sidekick.game({
  title: 'Marble Bag',
  emoji: '🔴',
  premise: 'Reach into the bag without looking. Say the chance of pulling out a red marble.',
  outro: 'Good odds! A probability is wanted outcomes out of all outcomes, always between 0 and 1.',
  rounds: [
    bag({ id: 'one-of-four', phase: 'guided', helped: true, red: 1, blue: 3,
      say: 'One red and three blue. Set the chance of red as a fraction: red marbles out of ALL marbles.',
      hints: ['How many marbles are in the bag in all?', '1 red out of 4 marbles.'],
      win: 'The chance of red is {1/4}.' }),
    bag({ id: 'three-of-five', phase: 'guided', helped: true, red: 3, blue: 2,
      say: 'Three red and two blue. Watch the pointer: a chance can never go past 1.',
      hints: ['Not 3 out of 2. Count every marble.', '3 red out of 5 marbles.'],
      win: 'The chance of red is {3/5}.' }),
    bag({ id: 'five-of-eight', phase: 'guided', helped: true, red: 5, blue: 3,
      say: 'Five red and three blue. What is the chance of red?',
      hints: ['There are 8 marbles in all.', '5 out of 8.'],
      win: 'The chance of red is {5/8}.' }),
    bag({ id: 'last-bag', phase: 'solo', red: last.red, blue: last.blue,
      say: 'No pointer this time. Set the chance of pulling a red marble from this bag.' }),
  ],
});
