// Table Top game. Skill: tell the main idea from the details that support it.
// The main idea is the table top and the details are the legs that hold it up. A single
// detail is too small to be the top, and a fact about something else cannot be a leg.
const TEXTS = {
  bees: { main: 'Bees help\nplants grow', details: ['They carry pollen\nflower to flower', 'Fruit trees need\nbees to make fruit', 'Farmers keep hives\nnear their crops'], off: 'Bears like\nto eat honey' },
  desert: { main: 'Deserts are hard\nplaces to live', details: ['It almost\nnever rains', 'Days are hot and\nnights are cold', 'Few plants\ncan grow there'], off: 'Camels have\nlong eyelashes' },
  recycle: { main: 'Recycling helps\nthe Earth', details: ['It keeps trash\nout of landfills', 'It saves trees\nand water', 'Old cans become\nnew things'], off: 'Garbage trucks\nare loud' },
  sleep: { main: 'Sleep keeps\nyou healthy', details: ['Your body repairs\nitself at night', 'Rest helps you\nremember things', 'Tired kids get\nsick more often'], off: 'Owls sleep\nin the day' },
  rain: { main: 'Rainforests are\nfull of life', details: ['Half of all animal\nkinds live there', 'Trees grow in\nfour tall layers', 'New plants are\nfound every year'], off: 'Rain boots\nkeep feet dry' },
};
const LEGS = ['leg0', 'leg1', 'leg2'];

function table(o) {
  const t = TEXTS[o.text], at = (stage, id) => stage.get(id).zone;
  const set = (topCard, legCards) => [{ drag: topCard, to: 'top' }].concat(legCards.map((id, i) => ({ drag: id, to: LEGS[i] })));
  const legsHold = (stage, ids) => ids.every((id) => LEGS.includes(at(stage, id)));
  return {
    id: o.id, phase: o.phase, scene: 'paper', height: 92, action: 'Stand it up!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const tip = stage.label({ text: o.helped ? '🪑 Big idea on the table. Supporting facts as legs.' : '🪑', x: 50, y: 5, size: 3.3, w: 92, card: true });
      stage.zone({ id: 'top', x: 18, y: 14, w: 64, h: 14, look: 'box', color: 'sun', label: 'Main idea', labelAt: 'top', showLabel: !!o.helped, capacity: 1, swap: true, accepts: 'card' });
      LEGS.forEach((id, i) => stage.zone({ id, x: 3.5 + i * 31.5, y: 31, w: 30, h: 16, look: 'slot', color: 'white', label: 'Detail', showLabel: false, capacity: 1, swap: true, accepts: 'card' }));
      stage.zone({ id: 'cards', x: 4, y: 54, w: 92, h: 34, look: 'tray', label: 'Fact cards', showLabel: false, accepts: 'card' });
      const cards = [['d0', t.details[0]], ['off', t.off], ['main', t.main], ['d1', t.details[1]], ['d2', t.details[2]]];
      cards.forEach(([id, text]) => stage.sprite({ id, text, size: 2.8, kind: 'card', drag: true, zone: 'cards', label: text.replace('\n', ' ') }));
      // The world reacts: the carpenter says why a card cannot go where it was put.
      if (o.helped) stage.on('change', () => tip.set(['d0', 'd1', 'd2', 'off'].some((id) => at(stage, id) === 'top') ? '🪑 That is one small fact. The top has to be big enough to cover the others.'
        : LEGS.includes(at(stage, 'off')) ? '🪑 That fact is about something else. It cannot hold up this idea.' : '🪑 Big idea on the table. Supporting facts as legs.'));
    },
    check: (stage) => at(stage, 'main') === 'top' && legsHold(stage, ['d0', 'd1', 'd2']),
    solution: () => set('main', ['d0', 'd1', 'd2']),
    mistakes: [{ tag: 'picks_a_detail_as_main_idea', when: (stage) => at(stage, 'd0') === 'top' && legsHold(stage, ['main', 'd1', 'd2']), steps: () => set('d0', ['main', 'd1', 'd2']),
      say: 'That top is just one fact. Which card is the big idea that all the other facts are about?' }],
  };
}

// A fresh text for the last round on every play.
const last = Sidekick.pick(['sleep', 'rain']);

Sidekick.game({
  title: 'Table Top',
  emoji: '🪑',
  premise: 'Build a table from fact cards. The main idea is the top and the details are its legs.',
  outro: 'It stands! A main idea is the big point. Key details are the facts that hold it up.',
  rounds: [
    table({ id: 'bees', phase: 'guided', helped: true, text: 'bees',
      say: 'Five fact cards about bees. Drag the big idea to the table top and three supporting facts to the legs. One card does not belong.',
      hints: ['Which card do the others all explain?', 'Bees help plants grow is the big idea. The bear card is about something else.'],
      win: 'Bees help plants grow, and three facts hold that idea up.' }),
    table({ id: 'desert', phase: 'guided', helped: true, text: 'desert',
      say: 'New cards about deserts. Find the main idea and its three legs.',
      hints: ['Rain, heat and few plants are all reasons for one bigger idea.', 'Deserts are hard places to live.'],
      win: 'Deserts are hard places to live. The three details show why.' }),
    table({ id: 'recycling', phase: 'guided', helped: true, text: 'recycle',
      say: 'One more with the carpenter helping. Build the recycling table.',
      hints: ['The main idea is the most general card.', 'Recycling helps the Earth.'],
      win: 'Recycling helps the Earth, with three facts to support it.' }),
    table({ id: 'last-table', phase: 'solo', text: last,
      say: 'The carpenter has left. Build this table yourself: one main idea, three details, one card left out.' }),
  ],
});
