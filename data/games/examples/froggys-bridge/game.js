// Froggy's Bridge. Skill: a fraction a/b is a copies of the unit fraction 1/b.
// The river gap is one whole. Every plank is a unit fraction of the gap, so the only
// way to stop exactly at the berry is to lay "top number" planks of "bottom number" size.
const X0 = 12, W = 76, DECK = 32;

const plankLength = (plank) => 1 / plank.value;
const built = (stage) => stage.get('bridge').sum(plankLength);
const laid = (stage, den) => stage.get('bridge').sprites.filter((plank) => plank.value === den).length;
const lay = (den, n) => Array.from({ length: n }, (_, i) => ({ drag: 'p' + den + '_' + (i + 1), to: 'bridge' }));
const COLORS = { 2: 'berry', 3: 'grape', 4: 'orange', 6: 'sun', 8: 'coral' };

function bridgeRound(o) {
  const target = o.a / o.b, name = '{' + o.a + '/' + o.b + '}';
  return {
    id: o.id, phase: o.phase, say: o.say, hints: o.hints || [], win: o.win || '', action: 'Hop!', scene: 'ocean', height: 90,
    setup(stage) {
      stage.block({ x: -2, y: DECK, w: X0 + 2, h: 21, color: 'leaf', round: 3 });
      stage.block({ x: X0 + W, y: DECK, w: 14, h: 21, color: 'leaf', round: 3 });
      stage.sprite({ emoji: '🌴', x: 95, y: DECK - 7, size: 11 });
      const frog = stage.sprite({ id: 'frog', emoji: '🐸', x: 6, y: DECK - 5.5, size: 10, z: 50 });
      const flagX = X0 + W * target;
      const post = stage.block({ id: 'post', x: flagX - 0.6, y: DECK - 9, w: 1.2, h: 24, color: 'forest', round: 1 });
      const berry = stage.sprite({ id: 'berry', emoji: '🍓', x: flagX, y: DECK - 12, size: 8, float: true });
      if (o.hidden) {
        post.hide(); berry.hide();
        stage.label({ text: 'Berry at ' + name, x: 50, y: 10, size: 5.4, card: true });
      } else {
        stage.label({ text: name, x: flagX, y: DECK - 22, size: 5.4, card: true });
      }
      if (o.ticks) for (let i = 1; i < o.b; i++) stage.block({ x: X0 + (W * i) / o.b - 0.3, y: DECK + 10, w: 0.6, h: 3, color: 'white', round: 1 });
      stage.zone({ id: 'bridge', x: X0, y: DECK, w: W, h: 9, look: 'slot', color: 'white', label: 'The bridge', showLabel: false,
        layout: 'row', align: 'start', gap: 0, pad: 0,
        accepts: (plank, zone) => plank.kind === 'plank' && zone.sum(plankLength) + plankLength(plank) <= 1.0001 });
      let x = 3;
      o.piles.forEach((pile, index) => {
        const w = o.piles.length === 1 ? 94 : 46;
        stage.zone({ id: 'pile' + pile.den, x, y: 58, w, h: 30.5, look: 'tray', label: '{1/' + pile.den + '} planks', labelAt: 'top', accepts: (plank) => plank.value === pile.den });
        for (let i = 1; i <= pile.count; i++) {
          stage.sprite({ id: 'p' + pile.den + '_' + i, shape: 'rect', w: W / pile.den, h: 8.5, color: COLORS[pile.den], caption: '{1/' + pile.den + '}',
            label: 'one ' + pile.den + 'th plank', kind: 'plank', value: pile.den, drag: true, zone: 'pile' + pile.den });
        }
        x += w + 2;
      });
      // The world reacts: Froggy walks to the end of whatever has been built.
      stage.on('change', () => {
        const length = built(stage);
        frog.moveTo(length > 0 ? X0 + W * length - 3.5 : 6, DECK - 5.5);
      });
    },
    check: (stage) => Math.abs(built(stage) - target) < 0.0001,
    solution: () => lay(o.b, o.a),
    mistakes: o.mistakes,
    onWin(stage, sk) {
      const frog = stage.get('frog'), berry = stage.get('berry');
      stage.get('post').show(); berry.show().pop();
      sk.after(500, () => { berry.hide(); frog.badge('yum!').pop(); });
    },
  };
}

const bottomAsCount = (den) => ({
  tag: 'bottom_number_as_count', when: (stage) => laid(stage, den) === den, steps: () => lay(den, den),
  say: 'That is ' + den + ' planks, all the way across. The bottom number is the plank size. The top number is how many.',
});
const wrongSize = (den, other, n) => ({
  tag: 'wrong_size_planks', when: (stage) => laid(stage, other) > 0, steps: () => lay(other, n),
  say: 'Check the plank size. The bottom number is ' + den + ', so use {1/' + den + '} planks.',
});

// A fresh target for the last round on every play. Each option has one way to land exactly.
const finale = Sidekick.pick([
  { a: 5, b: 6, other: 8, n: 5 },
  { a: 3, b: 8, other: 6, n: 3 },
  { a: 5, b: 8, other: 6, n: 5 },
]);

Sidekick.game({
  title: "Froggy's Bridge",
  emoji: '🐸',
  premise: 'Froggy can only hop on planks. Build a bridge that stops right at the berry.',
  outro: 'Froggy is full! A fraction like {3/4} means 3 planks that are each {1/4} long.',
  rounds: [
    bridgeRound({
      id: 'three-fourths', phase: 'guided', a: 3, b: 4, ticks: true, piles: [{ den: 4, count: 4 }],
      say: 'The berry is at {3/4}. Each plank is {1/4} long. Drag planks to build Froggy a bridge.',
      hints: ['Count as you lay them: one fourth, two fourths...', '{3/4} is 3 planks that are each {1/4} long.'],
      win: '3 planks of {1/4} reach {3/4}. Yum!',
      mistakes: [bottomAsCount(4)],
    }),
    bridgeRound({
      id: 'two-thirds', phase: 'guided', a: 2, b: 3, piles: [{ den: 3, count: 3 }, { den: 2, count: 2 }],
      say: 'Now the berry is at {2/3}. There are two kinds of planks. Pick the size that fits, then count.',
      hints: ['Look at the bottom number. It names the plank size.', 'Use 2 planks from the {1/3} pile.'],
      win: '2 planks of {1/3} make {2/3}.',
      mistakes: [wrongSize(3, 2, 2), bottomAsCount(3)],
    }),
    bridgeRound({
      id: 'five-eighths', phase: 'guided', a: 5, b: 8, piles: [{ den: 8, count: 8 }, { den: 3, count: 2 }],
      say: 'A far one! The berry is at {5/8}. No marks on the water this time.',
      hints: ['Eighths are the small planks. How many do you need?', 'The top number, 5, tells how many {1/8} planks.'],
      win: '5 planks of {1/8} make {5/8}.',
      mistakes: [wrongSize(8, 3, 2), bottomAsCount(8)],
    }),
    bridgeRound({
      id: 'hidden-berry', phase: 'solo', a: finale.a, b: finale.b, hidden: true,
      piles: [{ den: finale.b, count: finale.b }, { den: finale.other, count: finale.other === 6 ? 6 : 5 }],
      say: 'The last berry is hiding under the water at {' + finale.a + '/' + finale.b + '}. Build to it, then press Hop!',
      mistakes: [wrongSize(finale.b, finale.other, finale.n), bottomAsCount(finale.b)],
    }),
  ],
});
