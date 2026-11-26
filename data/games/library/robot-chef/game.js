// Robot Chef. Skill: use time words (first, next, then, last) to show the order of events.
// The robot does the steps in the order the time words say, not the order they are drawn.
// Put "Last" on the first step and it eats before it cooks. "And then" tells it nothing.
const RANK = { First: 0, Next: 1, Then: 2, Last: 3 };

function recipe(o) {
  const n = o.steps.length, w = 92 / n, trayY = 46;
  const word = (stage, i) => stage.get('slot' + i).texts()[0] || '';
  const give = (words) => { let extra = 0; return words.map((text, i) => ({ drag: text === 'And then' ? 'and' + (++extra) : 't-' + text, to: 'slot' + i })); };
  const right = n === 3 ? ['First', 'Then', 'Last'] : ['First', 'Next', 'Then', 'Last'];
  const flipped = right.slice().reverse(), lazy = ['First'].concat(o.steps.slice(1).map(() => 'And then'));
  const same = (stage, words) => words.every((text, i) => word(stage, i) === text);
  const slips = [{ tag: 'time_words_out_of_order', when: (stage) => same(stage, flipped), steps: () => give(flipped), say: 'The robot would start with the last step! First goes on what happens first.' }];
  if (o.ands) slips.push({ tag: 'and_then_for_every_step', when: (stage) => same(stage, lazy), steps: () => give(lazy), say: '"And then" three times in a row does not say which step comes when. Use next, then and last.' });
  return {
    id: o.id, phase: o.phase, scene: 'kitchen', height: trayY + 28 + (o.helped ? 11 : 0), action: 'Cook!', say: o.say, hints: o.hints || [], win: o.win || '', mistakes: slips,
    setup(stage) {
      o.steps.forEach((step, i) => {
        stage.zone({ id: 'slot' + i, x: 4 + i * w + 1, y: 5, w: w - 2, h: 12, look: 'slot', color: 'white', label: 'time word for step ' + (i + 1), showLabel: false, capacity: 1, swap: true, accepts: 'time' });
        stage.sprite({ emoji: step[0], x: 4 + i * w + w / 2, y: 27, size: 8 });
        stage.label({ text: step[1], x: 4 + i * w + w / 2, y: 37, size: 2.9 });
      });
      stage.zone({ id: 'words', x: 4, y: trayY, w: 92, h: 25, look: 'tray', label: 'Time words', showLabel: false, accepts: 'time' });
      Sidekick.shuffle(right.slice()).forEach((text) => stage.sprite({ id: 't-' + text, text, size: 3.6, color: 'orange', kind: 'time', drag: true, zone: 'words', label: text }));
      for (let k = 1; k <= (o.ands || 0); k++) stage.sprite({ id: 'and' + k, text: 'And then', size: 3.4, kind: 'time', drag: true, zone: 'words', label: 'and then' });
      // The world reacts: the robot lines the steps up the way the time words tell it to.
      const plan = o.helped ? stage.label({ text: '🤖 I need a time word on every step.', x: 50, y: trayY + 31, size: 3.5, w: 92, card: true }) : null;
      if (plan) stage.on('change', () => {
        const words = o.steps.map((step, i) => word(stage, i));
        plan.set(words.some((text) => !text) ? '🤖 I need a time word on every step.' : words.includes('And then') ? '🤖 And then... and then... Which one comes when? ❓'
          : '🤖 I will do: ' + o.steps.map((step, i) => [RANK[words[i]], step[0]]).sort((a, b) => a[0] - b[0]).map((pair) => pair[1]).join(' ➜ '));
      });
    },
    check: (stage) => word(stage, 0) === 'First' && word(stage, n - 1) === 'Last' && o.steps.slice(1, -1).every((step, i) => ['Next', 'Then'].includes(word(stage, i + 1))) && new Set(o.steps.map((step, i) => word(stage, i))).size === n,
    solution: () => give(right),
  };
}

// A fresh recipe for the last round on every play.
const last = Sidekick.pick([
  [['🍞', 'Get bread'], ['🥜', 'Spread'], ['🍓', 'Add jam'], ['😋', 'Eat']],
  [['🚿', 'Wet the dog'], ['🧼', 'Add soap'], ['💦', 'Rinse'], ['🐕', 'Dry off']],
  [['🥚', 'Crack eggs'], ['🥣', 'Stir'], ['🍳', 'Cook'], ['🍽️', 'Serve']],
]);

Sidekick.game({
  title: 'Robot Chef',
  emoji: '🤖',
  premise: 'Robo follows time words exactly. Label each step so the robot does them in order.',
  outro: 'Dinner is served! First, next, then and last tell a reader the order things happen.',
  rounds: [
    recipe({ id: 'cereal', phase: 'guided', helped: true, steps: [['🥣', 'Get a bowl'], ['🥛', 'Pour milk'], ['🥄', 'Eat']],
      say: 'Drag a time word above each step. Watch what order the robot plans to do them.',
      hints: ['First goes on the step that starts it all.', 'First a bowl, then milk, last eat.'],
      win: 'First, then, last. The robot gets it in order.' }),
    recipe({ id: 'garden', phase: 'guided', helped: true, steps: [['🕳️', 'Dig a hole'], ['🌱', 'Drop a seed'], ['💧', 'Water it'], ['🌻', 'Watch it grow']],
      say: 'Four steps to grow a flower. Give every step its time word.',
      hints: ['Next and then go in the middle.', 'First, next, then, last.'],
      win: 'First, next, then, last.' }),
    recipe({ id: 'teeth', phase: 'guided', helped: true, ands: 3, steps: [['🪥', 'Get the brush'], ['🧴', 'Add paste'], ['😬', 'Brush'], ['🚰', 'Rinse']],
      say: 'There are some "And then" tiles in the tray now. See what the robot makes of them.',
      hints: ['"And then" does not tell the robot which step is which.', 'Use first, next, then and last.'],
      win: 'Time words keep the steps in order.' }),
    recipe({ id: 'last-recipe', phase: 'solo', ands: 3, steps: last,
      say: 'The robot keeps its plan secret now. Put the time word that fits on every step.' }),
  ],
});
