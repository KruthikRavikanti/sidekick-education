// Debate Scales. Skill: tell which evidence supports which point.
// A text makes two points and gives evidence for each. Every piece of evidence adds weight
// to the point it really supports. Put it on the other side and it argues against itself.
const DEBATES = {
  zoos: { a: 'Zoos help animals', b: 'Zoos can harm animals', cards: [['Zoos breed\nrare pandas', 'a'], ['Some cages\nare too small', 'b'], ['Vets treat\nsick animals', 'a'], ['Animals may\nget bored', 'b']] },
  screens: { a: 'Screens can teach', b: 'Screens can hurt sleep', cards: [['Blue light keeps\nyou awake', 'b'], ['Apps teach\nnew words', 'a'], ['Late games\nsteal sleep', 'b'], ['Videos show\nfar places', 'a']] },
  homework: { a: 'Homework helps learning', b: 'Homework causes stress', cards: [['Practice makes\nskills stick', 'a'], ['Kids lose\nplay time', 'b'], ['It shows what you\nstill need', 'a'], ['Late work\ncuts sleep', 'b']] },
  uniforms: { a: 'Uniforms help schools', b: 'Uniforms limit students', cards: [['Kids cannot\nshow their style', 'b'], ['Mornings\nget faster', 'a'], ['Families must\nbuy extra clothes', 'b'], ['Fewer fights\nover clothes', 'a']] },
};

function weigh(o) {
  const debate = DEBATES[o.topic], cards = debate.cards.slice(0, o.count || 4);
  const side = (card, flip) => ((card[1] === 'a') !== !!flip ? 'a' : 'b');
  const put = (flip) => cards.map((card, i) => ({ drag: 'ev' + i, to: side(card, flip) }));
  const all = (stage, flip) => cards.every((card, i) => stage.get('ev' + i).zone === side(card, flip));
  return {
    id: o.id, phase: o.phase, scene: 'sky', height: 86, action: 'Weigh it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const voice = stage.label({ text: o.helped ? '⚖️ Each card goes on the point it helps prove.' : '⚖️', x: 50, y: 5, size: 3.3, w: 92, card: true });
      stage.zone({ id: 'a', x: 3, y: 16, w: 45, h: 30, look: 'box', color: 'sun', label: debate.a, labelAt: 'top', accepts: 'ev' });
      stage.zone({ id: 'b', x: 52, y: 16, w: 45, h: 30, look: 'box', color: 'sky', label: debate.b, labelAt: 'top', accepts: 'ev' });
      stage.zone({ id: 'pile', x: 4, y: 53, w: 92, h: 29, look: 'tray', label: 'Evidence', showLabel: false, accepts: 'ev' });
      cards.forEach((card, i) => stage.sprite({ id: 'ev' + i, text: card[0], size: 2.9, kind: 'ev', drag: true, zone: 'pile', label: card[0].replace('\n', ' ') }));
      // The world reacts: the judge reads the point and the evidence together, so a mismatch is heard.
      if (o.helped) stage.on('change', () => {
        const off = cards.find((card, i) => ['a', 'b'].includes(stage.get('ev' + i).zone) && stage.get('ev' + i).zone !== card[1]);
        voice.set(off ? '⚖️ “' + debate[off[1] === 'a' ? 'b' : 'a'] + ' because ' + off[0].replace('\n', ' ').toLowerCase() + '”? That does not follow.' : '⚖️ Each card goes on the point it helps prove.');
      });
    },
    check: (stage) => all(stage, false),
    solution: () => put(false),
    mistakes: [{ tag: 'mismatches_evidence_and_points', when: (stage) => all(stage, true), steps: () => put(true),
      say: 'Read each one as a sentence: the point, then "because", then the evidence. Does it make sense?' }],
  };
}

// A fresh debate for the last round on every play.
const last = Sidekick.pick(['homework', 'uniforms']);

Sidekick.game({
  title: 'Debate Scales',
  emoji: '⚖️',
  premise: 'An author made two points. Put each piece of evidence on the point it supports.',
  outro: 'Balanced! Good readers check which evidence backs up which point.',
  rounds: [
    weigh({ id: 'two-cards', phase: 'guided', helped: true, topic: 'zoos', count: 2,
      say: 'An article about zoos makes two points. Drag each piece of evidence onto the point it supports.',
      hints: ['Try reading it: Zoos help animals because...', 'Breeding rare pandas helps. Small cages harm.'],
      win: 'One piece of evidence for each point.' }),
    weigh({ id: 'four-cards', phase: 'guided', helped: true, topic: 'zoos',
      say: 'Four pieces of evidence now. Which point does each one back up?',
      hints: ['Vets treating animals is help.', 'Bored animals is harm.'],
      win: 'Two pieces of evidence on each side.' }),
    weigh({ id: 'screens', phase: 'guided', helped: true, topic: 'screens',
      say: 'A new article, about screens. Sort its evidence.',
      hints: ['Which cards are about learning?', 'Which cards are about sleep?'],
      win: 'Learning evidence on one side, sleep evidence on the other.' }),
    weigh({ id: 'last-debate', phase: 'solo', topic: last,
      say: 'The judge stays quiet. Put all four pieces of evidence on the point they support.' }),
  ],
});
