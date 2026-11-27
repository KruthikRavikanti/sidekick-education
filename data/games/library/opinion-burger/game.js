// Opinion Burger. Skill: end opinion writing with a concluding statement.
// An opinion piece is stacked like a burger: the opinion is the first bun, the reasons are the
// filling, and an ending that wraps it up is the last bun. With no last bun it all falls out.
const ROLE_NAME = { opinion: '🍞 Opinion', reason: '🥬 Reason', ending: '🍞 Ending' };

function burger(o) {
  const roles = ['opinion'].concat(o.cards.filter((card) => card[1] === 'reason').map(() => 'reason'), ['ending']), n = roles.length;
  const trayY = 8 + n * 12.5;
  const roleIn = (stage, i) => { const card = stage.get('layer' + i).sprites[0]; return card ? card.data.role : ''; };
  const id = (role, skip) => { let seen = 0; return 'c' + o.cards.findIndex((card) => card[1] === role && seen++ === (skip || 0)); };
  const stack = (ids) => ids.map((cardId, i) => ({ drag: cardId, to: 'layer' + i }));
  const reasons = roles.filter((role) => role === 'reason').map((role, k) => id('reason', k));
  const right = [id('opinion')].concat(reasons, [id('ending')]);
  const hasExtra = o.cards.some((card) => card[1] === 'extra');
  const noEnding = hasExtra ? [id('opinion')].concat(reasons, [id('extra')]) : [id('opinion'), id('ending')].concat(reasons);
  return {
    id: o.id, phase: o.phase, scene: 'kitchen', height: trayY + 30, action: 'Serve it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ emoji: '🍔', x: 88, y: 12, size: 11 });
      roles.forEach((role, i) => {
        stage.zone({ id: 'layer' + i, x: 30, y: 4 + i * 12.5, w: 46, h: 11.5, look: 'slot', color: role === 'reason' ? 'leaf' : 'sun', label: 'layer ' + (i + 1), showLabel: false, capacity: 1, swap: true, accepts: 'card' });
        if (o.helped) stage.label({ text: ROLE_NAME[role], x: 15, y: 9.75 + i * 12.5, size: 3.3, card: true });
      });
      stage.zone({ id: 'cards', x: 4, y: trayY, w: 92, h: 27, look: 'tray', label: 'Sentences', showLabel: false, accepts: 'card' });
      o.cards.forEach((card, i) => stage.sprite({ id: 'c' + i, text: card[0], size: 2.9, kind: 'card', data: { role: card[1] }, drag: true, zone: 'cards', label: card[0].replace('\n', ' ') }));
    },
    check: (stage) => roles.every((role, i) => roleIn(stage, i) === role),
    solution: () => stack(right),
    mistakes: [{ tag: 'ends_without_a_conclusion', when: (stage) => roleIn(stage, 0) === 'opinion' && !!roleIn(stage, n - 1) && roleIn(stage, n - 1) !== 'ending', steps: () => stack(noEnding),
      say: 'The burger has no last bun! Finish with the sentence that wraps up the opinion, like "That is why..."' }],
  };
}

// A fresh burger for the last round on every play.
const last = Sidekick.pick([
  [['We can\nswim.', 'reason'], ['So summer is\nmy favorite.', 'ending'], ['Snow\nis cold.', 'extra'], ['Summer is the\nbest season.', 'opinion'], ['The days\nare long.', 'reason']],
  [['Stories\nare fun.', 'reason'], ['My bag\nis blue.', 'extra'], ['Everyone should\nread books.', 'opinion'], ['That is why\nreading is great.', 'ending'], ['Books teach\nnew things.', 'reason']],
]);

Sidekick.game({
  title: 'Opinion Burger',
  emoji: '🍔',
  premise: 'Stack an opinion burger: the opinion first, reasons in the middle, and an ending to hold it together.',
  outro: 'Order up! Good opinion writing starts with the opinion, gives reasons, and ends by wrapping it up.',
  rounds: [
    burger({ id: 'pizza', phase: 'guided', helped: true, cards: [['It is warm\nand cheesy.', 'reason'], ['So I always\npick pizza!', 'ending'], ['Pizza is the\nbest lunch.', 'opinion']],
      say: 'Build the burger. The opinion is the first bun, the reason is the filling, the ending is the last bun.',
      hints: ['The opinion says what the writer thinks.', 'The ending wraps it up: So I always pick pizza!'],
      win: 'Opinion, reason, ending. A whole burger!' }),
    burger({ id: 'dogs', phase: 'guided', helped: true, cards: [['They keep\nyou safe.', 'reason'], ['Dogs are the\nbest pets.', 'opinion'], ['That is why\nI love dogs.', 'ending'], ['They play\nfetch.', 'reason']],
      say: 'A bigger burger with two reasons. Stack all four layers.',
      hints: ['Start with: Dogs are the best pets.', 'End with: That is why I love dogs.'],
      win: 'An opinion, two reasons and an ending.' }),
    burger({ id: 'recess', phase: 'guided', helped: true, cards: [['Play helps\nus think.', 'reason'], ['My school\nis big.', 'extra'], ['That is why we\nneed more recess.', 'ending'], ['Recess should\nbe longer.', 'opinion'], ['Kids need\nto run.', 'reason']],
      say: 'One sentence here does not belong in the burger at all. Leave it out.',
      hints: ['"My school is big" is not a reason for longer recess.', 'Finish with the sentence that starts "That is why".'],
      win: 'The ending wraps up the opinion. The extra sentence stays out.' }),
    burger({ id: 'last-burger', phase: 'solo', cards: last,
      say: 'No layer names this time. Stack the burger: opinion, two reasons, and an ending that wraps it up.' }),
  ],
});
