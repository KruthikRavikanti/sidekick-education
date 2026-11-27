// Think Bubbles. Skill: state an opinion, which says what someone thinks or likes.
// Froggy asks "What do YOU think?" Some cards answer that. Others only tell about the thing.
// Tapping a card gives it a think bubble.
function show(o) {
  const cards = o.cards, isOn = (stage, i) => stage.get('card' + i).data.on;
  const taps = (want) => cards.map((card, i) => (want(card) ? { tap: 'card' + i } : null)).filter(Boolean);
  const all = (stage, want) => cards.every((card, i) => isOn(stage, i) === want(card));
  return {
    id: o.id, phase: o.phase, scene: 'meadow', height: 26 + Math.ceil(cards.length / 2) * 18 + (o.helped ? 12 : 2), action: 'Ta-da!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ emoji: '🐸', x: 9, y: 9, size: 10 });
      stage.label({ text: '“What do YOU think?”', x: 52, y: 9, size: 4.4, card: true });
      const note = o.helped ? stage.label({ text: 'Tap the cards that say what someone thinks.', x: 50, y: 30 + Math.ceil(cards.length / 2) * 18, size: 3.4, w: 92, card: true }) : null;
      cards.forEach((card, i) => stage.sprite({
        id: 'card' + i, text: card.t, size: 3.3, x: 27 + (i % 2) * 46, y: 27 + Math.floor(i / 2) * 18, label: card.t.replace('\n', ' '), data: { on: false },
        tap(tile) {
          tile.data.on = !tile.data.on; tile.badge(tile.data.on ? '💭' : '').pop();
          if (note) note.set(!tile.data.on ? 'Tap the cards that say what someone thinks.' : card.o ? '💭 Yes. That says what someone thinks or likes.' : '📘 That one only tells about it. Nobody says what they think.');
        },
      }));
    },
    check: (stage) => all(stage, (card) => !!card.o),
    solution: () => taps((card) => !!card.o),
    mistakes: [
      { tag: 'marks_every_card', when: (stage) => all(stage, () => true), steps: () => taps(() => true), say: 'Not every card is an opinion. Some only tell about the thing, like its color or shape.' },
      { tag: 'marks_the_telling_cards', when: (stage) => all(stage, (card) => !card.o), steps: () => taps((card) => !card.o), say: 'Those cards tell about the thing. An opinion says what someone likes or thinks is best.' },
    ],
  };
}

// Fresh cards for the last round on every play.
const last = Sidekick.pick([
  [{ t: 'Apples are\nthe best snack.', o: 1 }, { t: 'Apples grow\non trees.' }, { t: 'I think snow\nis fun.', o: 1 }, { t: 'Snow\nis cold.' }],
  [{ t: 'A bike has\ntwo wheels.' }, { t: 'Bikes are\nso much fun.', o: 1 }, { t: 'Birds\nhave wings.' }, { t: 'I like owls\nthe most.', o: 1 }],
]);

Sidekick.game({
  title: 'Think Bubbles',
  emoji: '💭',
  premise: 'Froggy wants to know what you think. Tap the cards that say what someone thinks or likes.',
  outro: 'Ta-da! An opinion tells what you think: I like it, it is the best, it is fun.',
  rounds: [
    show({ id: 'cats', phase: 'guided', helped: true, cards: [{ t: 'I like cats\nthe best.', o: 1 }, { t: 'Cats have\nwhiskers.' }],
      say: 'One card says what someone thinks. Tap it to give it a think bubble.',
      hints: ['Look for the words I like.', '"I like cats the best" tells what someone thinks.'],
      win: 'I like cats the best. That is an opinion!' }),
    show({ id: 'pizza', phase: 'guided', helped: true, cards: [{ t: 'Pizza is\nyummy!', o: 1 }, { t: 'Pizza\nis round.' }, { t: 'I think rain\nis fun.', o: 1 }],
      say: 'Three cards. Two say what someone thinks. Tap those two.',
      hints: ['Yummy is what someone thinks about pizza.', 'Round only tells its shape.'],
      win: 'Yummy and fun are what someone thinks.' }),
    show({ id: 'four-cards', phase: 'guided', helped: true, cards: [{ t: 'The bus\nis yellow.' }, { t: 'Red is the\nbest color.', o: 1 }, { t: 'Frogs\ncan jump.' }, { t: 'I love\nthe park.', o: 1 }],
      say: 'Four cards. Find every one that says what someone thinks or likes.',
      hints: ['Best and love are opinion words.', 'Yellow and jump only tell about it.'],
      win: 'The best color and loving the park are opinions.' }),
    show({ id: 'last-show', phase: 'solo', cards: last,
      say: 'Froggy is quiet now. Tap every card that says what someone thinks.' }),
  ],
});
