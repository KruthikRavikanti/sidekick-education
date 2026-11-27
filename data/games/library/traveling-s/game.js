// The Traveling S. Skill: make the naming word and the action word agree (he hops, we hop).
// Each sentence owns one letter S. One animal: the S goes on the action word (The frog hops).
// More than one animal: the S goes on the animal word (The frogs hop). Never both, never neither.
const CW = 2.35, X0 = 30;

function draw(stage, k, y, it, helped) {
  for (let i = 0; i < it.count; i++) stage.sprite({ emoji: it.emoji, x: 6 + i * 8, y, size: 6.5 });
  const noun = 'The ' + it.noun, nx = X0 + noun.length * CW + 1, vx = nx + 12, vEnd = vx + it.verb.length * CW + 1;
  stage.label({ text: noun, x: X0 + (noun.length * CW) / 2, y, size: 4.4 });
  stage.zone({ id: 'n' + k, x: nx, y: y - 5.5, w: 10, h: 11, look: 'slot', label: 'after ' + it.noun, showLabel: false, capacity: 1, accepts: 's' + k });
  stage.label({ text: it.verb, x: vx + (it.verb.length * CW) / 2, y, size: 4.4 });
  stage.zone({ id: 'v' + k, x: vEnd, y: y - 5.5, w: 10, h: 11, look: 'slot', label: 'after ' + it.verb, showLabel: false, capacity: 1, accepts: 's' + k });
  stage.sprite({ id: 's' + k, text: 's', size: 4.6, color: 'orange', kind: 's' + k, drag: true, x: 93, y, label: 'letter s' });
  if (!helped) return;
  // The world reacts: the sentence is read back the way it is built right now.
  const voice = stage.label({ text: '', x: 50, y: y + 13, size: 3.8, card: true });
  const read = () => { const at = stage.get('s' + k).zone; voice.set('📣 The ' + it.noun + (at === 'n' + k ? 's ' : ' ') + it.verb + (at === 'v' + k ? 's.' : '.')); };
  read(); stage.on('change', read);
}

function pens(o) {
  const want = o.rows.map((it, k) => (it.count === 1 ? 'v' : 'n') + k);
  const put = (side) => o.rows.map((it, k) => ({ drag: 's' + k, to: (typeof side === 'string' ? side + k : side[k]) }));
  const allAt = (stage, side) => o.rows.every((it, k) => stage.get('s' + k).zone === side + k);
  const single = o.rows.length === 1, it = o.rows[0];
  return {
    id: o.id, phase: o.phase, scene: 'meadow', height: single ? 44 : o.rows.length * 22 + 8, action: 'Read it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) { o.rows.forEach((row, k) => draw(stage, k, single ? 14 : 14 + k * 22, row, single && o.helped)); },
    check: (stage) => o.rows.every((row, k) => stage.get('s' + k).zone === want[k]),
    solution: () => put(want),
    mistakes: single
      ? [it.count === 1
        ? { tag: 's_on_the_noun_for_one', when: (stage) => allAt(stage, 'n'), steps: () => put('n'), say: 'There is only one ' + it.noun + '. So the S goes on the action word: The ' + it.noun + ' ' + it.verb + 's.' }
        : { tag: 'plural_subject_with_s_verb', when: (stage) => allAt(stage, 'v'), steps: () => put('v'), say: 'There is more than one ' + it.noun + '. Give the S to the animals: The ' + it.noun + 's ' + it.verb + '.' }]
      : [{ tag: 'plural_subject_with_s_verb', when: (stage) => allAt(stage, 'v'), steps: () => put('v'), say: 'Count the animals in each row. With more than one, the S belongs on the animal word.' },
        { tag: 's_on_the_noun_for_one', when: (stage) => allAt(stage, 'n'), steps: () => put('n'), say: 'Count the animals in each row. With only one, the S belongs on the action word.' }],
  };
}

// Fresh animals for the last round on every play. Always a mix of one and many.
const last = Sidekick.pick([
  [{ emoji: '🐝', noun: 'bee', verb: 'sing', count: 3 }, { emoji: '🦉', noun: 'owl', verb: 'hoot', count: 1 }, { emoji: '🐷', noun: 'pig', verb: 'dig', count: 2 }],
  [{ emoji: '🐮', noun: 'cow', verb: 'eat', count: 1 }, { emoji: '🐔', noun: 'hen', verb: 'run', count: 3 }, { emoji: '🦁', noun: 'lion', verb: 'roar', count: 1 }],
  [{ emoji: '🐦', noun: 'bird', verb: 'sing', count: 2 }, { emoji: '🐶', noun: 'dog', verb: 'play', count: 1 }, { emoji: '🐱', noun: 'cat', verb: 'sleep', count: 3 }],
]);

Sidekick.game({
  title: 'The Traveling S',
  emoji: '🐸',
  premise: 'Each sentence has one letter S. Give it to the animal word or to the action word.',
  outro: 'Well read! One animal: the frog hops. Many animals: the frogs hop.',
  rounds: [
    pens({ id: 'one-frog', phase: 'guided', helped: true, rows: [{ emoji: '🐸', noun: 'frog', verb: 'hop', count: 1 }],
      say: 'One frog. Drag the letter S into a box and listen to the sentence. Where does it sound right?',
      hints: ['Try the S in both boxes.', 'One frog hops. The S goes after hop.'],
      win: 'The frog hops. One animal, so the action word gets the S.' }),
    pens({ id: 'three-ducks', phase: 'guided', helped: true, rows: [{ emoji: '🦆', noun: 'duck', verb: 'swim', count: 3 }],
      say: 'Now there are three ducks. Where does the S go this time?',
      hints: ['More than one duck is ducks.', 'The ducks swim. No S on swim.'],
      win: 'The ducks swim. Many animals, so the animal word gets the S.' }),
    pens({ id: 'two-pens', phase: 'guided', rows: [{ emoji: '🐱', noun: 'cat', verb: 'nap', count: 2 }, { emoji: '🐶', noun: 'dog', verb: 'dig', count: 1 }],
      say: 'Two sentences. Count the animals, then place each S.',
      hints: ['Two cats: the cats nap.', 'One dog: the dog digs.'],
      win: 'The cats nap. The dog digs.' }),
    pens({ id: 'three-pens', phase: 'solo', rows: last,
      say: 'Three sentences, and nobody reads them back. Put every S where it belongs.' }),
  ],
});
