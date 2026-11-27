// Domino Lab. Skill: tell which event is the cause and which is the effect.
// The dominoes only fall if every card makes the next one happen. Put an effect in front
// of its cause and the chain reads backwards.
const flat = (text) => text.replace('\n', ' ');

function chain(o) {
  const n = o.cards.length, w = 92 / n - 2;
  const set = (order) => order.map((card, slot) => ({ drag: 'card' + card, to: 'slot' + slot }));
  const forward = o.cards.map((card, i) => i), backward = forward.slice().reverse();
  const isOrder = (stage, order) => order.every((card, slot) => stage.get('slot' + slot).ids[0] === 'card' + card);
  return {
    id: o.id, phase: o.phase, scene: 'paper', height: 84, action: 'Tip it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const voice = stage.label({ text: o.helped ? 'Put the cause first. Each card should make the next one happen.' : 'What made what happen?', x: 50, y: 11, size: 3.4, w: 92, card: true });
      o.cards.forEach((card, i) => stage.zone({ id: 'slot' + i, x: 4 + i * (w + 3), y: 28, w, h: 20, look: 'slot', color: i ? 'sun' : 'coral', label: i ? 'so...' : 'First', labelAt: 'top', capacity: 1, swap: true, accepts: 'card' }));
      stage.zone({ id: 'pile', x: 4, y: 58, w: 92, h: 22, look: 'tray', label: 'Event cards', showLabel: false, accepts: 'card' });
      o.start.forEach((i) => stage.sprite({ id: 'card' + i, text: o.cards[i], size: 2.9, kind: 'card', drag: true, zone: 'pile', label: flat(o.cards[i]) }));
      // The world reacts: the chain is read back in the order it is built.
      if (o.helped) stage.on('change', () => {
        const row = o.cards.map((card, slot) => stage.get('slot' + slot).sprites[0]);
        voice.set(row.every(Boolean) ? '📣 ' + row.map((tile, slot) => (slot ? 'So: ' : 'First: ') + flat(tile.text).replace(/^\S+ /, '')).join('. ') + '.' : 'Put the cause first. Each card should make the next one happen.');
      });
    },
    check: (stage) => isOrder(stage, forward),
    solution: () => set(forward),
    mistakes: [{ tag: 'reverses_cause_and_effect', when: (stage) => isOrder(stage, backward), steps: () => set(backward),
      say: 'That chain runs backwards. Ask of each card: did this make the next one happen?' }],
    onWin(stage) { o.cards.forEach((card, i) => stage.get('card' + i).spin()); },
  };
}

// A fresh chain for the last round on every play.
const last = Sidekick.pick([
  ['💨 Wind blew\nhard', '🌳 A branch\nsnapped', '💡 The power\nwent out'],
  ['☂️ Ben forgot\nhis umbrella', '🌧️ He got\nsoaked', '👕 He changed\nhis clothes'],
  ['🍦 Ice cream sat\nin the sun', '💧 It melted\nand dripped', '🧽 Dad wiped\nthe floor'],
]);

Sidekick.game({
  title: 'Domino Lab',
  emoji: '🧪',
  premise: 'Line up the event cards so each one makes the next one happen. Then tip the first.',
  outro: 'They all fell! A cause comes first and makes its effect happen.',
  rounds: [
    chain({ id: 'snowman', phase: 'guided', helped: true, cards: ['☀️ The sun\ncame out', '⛄ The snowman\nmelted'], start: [1, 0],
      say: 'Two events. One made the other happen. Drag the cause into First and the effect after it.',
      hints: ['Read the chain out loud with the word so.', 'The sun came out, so the snowman melted.'],
      win: 'The sun came out, so the snowman melted.' }),
    chain({ id: 'river', phase: 'guided', helped: true, cards: ['🌧️ Rain fell\nall night', '🌊 The river\nrose', '🌉 The bridge\nflooded'], start: [2, 0, 1],
      say: 'Three events this time. Build the chain so each card causes the next.',
      hints: ['What had to happen before the river could rise?', 'Rain, then the river, then the bridge.'],
      win: 'Rain fell, so the river rose, so the bridge flooded.' }),
    chain({ id: 'sprout', phase: 'guided', helped: true, cards: ['💧 A seed\ngets water', '🌱 Roots\ngrow', '🌿 A sprout\npops up'], start: [1, 2, 0],
      say: 'A science chain. What happens first, and what does it cause?',
      hints: ['A dry seed does nothing. What wakes it up?', 'Water, then roots, then the sprout.'],
      win: 'Water makes roots grow, and then a sprout pops up.' }),
    chain({ id: 'last-chain', phase: 'solo', cards: last, start: Sidekick.shuffle([0, 1, 2]),
      say: 'Nobody reads this chain back to you. Put the three events in cause and effect order.' }),
  ],
});
