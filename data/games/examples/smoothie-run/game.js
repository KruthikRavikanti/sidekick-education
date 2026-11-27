// Smoothie Run. Skill: solve unit price problems by finding the price of ONE.
// Every deal hides a price for one fruit. The cheaper sign is not always the better deal,
// and a bigger order grows by multiplying the price of one, not by adding the extra fruit.
const money = (n) => '$' + (n % 1 ? n.toFixed(2) : n);
const tagOf = (deal) => deal.count + ' ' + deal.emoji + ' for ' + money(deal.price);
const unit = (deal) => deal.price / deal.count;

function stand(stage, key, deal, x) {
  stage.zone({ id: 'stand' + key, x, y: 4, w: 43, h: 14, look: 'box', color: key === 'A' ? 'sun' : 'mint', label: 'Stand ' + key, labelAt: 'in', showLabel: false, capacity: 1 });
  return stage.sprite({ id: 'bag' + key, text: tagOf(deal), size: 4.3, kind: 'bag', data: deal, drag: true, zone: 'stand' + key, label: 'Stand ' + key + ': ' + tagOf(deal) });
}
const cart = (stage, x, y, w) => stage.zone({ id: 'cart', x, y, w, h: 15, look: 'basket', label: '🛒 Your cart', labelAt: 'top', capacity: 1, swap: true, accepts: 'bag' });
const inCart = (stage) => stage.get('cart').sprites[0] || null;
const carted = (stage, key) => { const bag = inCart(stage); return !!bag && bag.id === 'bag' + key; };

// Round 1: a machine does the splitting, so the idea is visible before it is asked for.
function splitterRound(o) {
  return {
    id: o.id, phase: 'guided', scene: 'city', height: 72, action: 'Buy it!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      stand(stage, 'A', o.A, 4); stand(stage, 'B', o.B, 53);
      const readout = stage.label({ text: 'Drop a deal here', x: 50, y: 44, size: 4, w: 60 });
      stage.zone({ id: 'splitter', x: 22, y: 24, w: 56, h: 15, look: 'cloud', label: '⚙️ Splitter', labelAt: 'top', capacity: 1, swap: true, accepts: 'bag',
        onDrop(bag) {
          const deal = bag.data;
          bag.badge(money(unit(deal))).pop();
          readout.set(money(deal.price) + ' shared by ' + deal.count + ' is ' + money(unit(deal)) + ' for one ' + deal.emoji);
        } });
      cart(stage, 27, 54, 46);
    },
    check: (stage) => carted(stage, o.best),
    solution: () => [{ drag: 'bagA', to: 'splitter' }, { drag: 'bagB', to: 'splitter' }, { drag: 'bag' + o.best, to: 'cart' }],
    mistakes: [{ tag: 'cheaper_total', when: (stage) => carted(stage, o.trap), steps: () => [{ drag: 'bag' + o.trap, to: 'cart' }],
      say: 'That sign shows fewer dollars, but each fruit costs more. Compare the price of one.' }],
  };
}

// Round 2: the child is the splitter. The stand multiplies their guess back so they can see it.
function priceTagRound(o) {
  const right = (stage, key) => stage.get('one' + key).value === unit(o[key]);
  return {
    id: o.id, phase: 'guided', scene: 'city', height: 80, action: 'Buy it!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      ['A', 'B'].forEach((key, index) => {
        const deal = o[key], x = index === 0 ? 25.5 : 74.5;
        stand(stage, key, deal, index === 0 ? 4 : 53);
        stage.label({ text: 'One ' + deal.emoji + ' costs', x, y: 23, size: 4 });
        const one = stage.stepper({ id: 'one' + key, x, y: 33, min: 0, max: 12, value: 0, format: (v) => money(v) });
        const proof = stage.label({ text: deal.count + ' × $0 = $0', x, y: 45, size: 4.2, card: true });
        stage.on('change', () => proof.set(deal.count + ' × ' + money(one.value) + ' = ' + money(deal.count * one.value) + (one.value === unit(deal) ? ' ✓' : '')));
      });
      cart(stage, 27, 60, 46);
    },
    check: (stage) => right(stage, 'A') && right(stage, 'B') && carted(stage, o.best),
    solution: () => [{ set: 'oneA', value: unit(o.A) }, { set: 'oneB', value: unit(o.B) }, { drag: 'bag' + o.best, to: 'cart' }],
    mistakes: [{ tag: 'bigger_pack', when: (stage) => carted(stage, o.trap),
      steps: () => [{ set: 'oneA', value: unit(o.A) }, { set: 'oneB', value: unit(o.B) }, { drag: 'bag' + o.trap, to: 'cart' }],
      say: 'More fruit in the bag is not always the better deal. Look at your two prices for one.' }],
  };
}

// Round 3 and the last round: a bigger order. The total is the price of one, times how many.
function orderRound(o) {
  const best = o[o.best], total = unit(best) * o.need, added = best.price + (o.need - best.count);
  const typed = (stage) => stage.get('total').number;
  const two = !!o.trap;
  return {
    id: o.id, phase: o.phase, scene: 'city', height: 80, action: 'Pay!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      if (two) { stand(stage, 'A', o.A, 4); stand(stage, 'B', o.B, 53); cart(stage, 4, 48, 48); }
      else { stand(stage, o.best, best, 4); stage.sprite({ emoji: '🧑‍🍳', x: 75, y: 11, size: 11 }); }
      stage.label({ text: 'You need ' + o.need + ' ' + best.emoji, x: 28, y: two ? 30 : 25, size: 5, card: true });
      stage.keypad({ id: 'total', x: 79, y: 49, label: 'Total dollars', prefix: '$' });
      if (two) return;
      // Guided only: set the price of one and watch it land on every fruit in the order.
      const one = stage.stepper({ id: 'one', x: 27, y: 39, min: 0, max: 12, value: 0, format: (v) => money(v) + ' each' });
      stage.zone({ id: 'crate', x: 3, y: 50, w: 49, h: 25, look: 'tray', label: 'The order', showLabel: false, capacity: 0 });
      const fruit = Array.from({ length: o.need }, () => stage.sprite({ emoji: best.emoji, size: 6.4, zone: 'crate' }));
      stage.on('change', () => fruit.forEach((item) => item.badge(one.value ? money(one.value) : '')));
    },
    check: (stage) => typed(stage) === total && (two ? carted(stage, o.best) : stage.get('one').value === unit(best)),
    solution: () => (two ? [{ drag: 'bag' + o.best, to: 'cart' }] : [{ set: 'one', value: unit(best) }]).concat([{ type: 'total', text: String(total) }]),
    mistakes: [
      { tag: 'adds_the_extra', when: (stage) => typed(stage) === added,
        steps: () => (two ? [{ drag: 'bag' + o.best, to: 'cart' }] : [{ set: 'one', value: unit(best) }]).concat([{ type: 'total', text: String(added) }]),
        say: (o.need - best.count) + ' more fruit does not mean ' + money(o.need - best.count) + ' more. Each one costs ' + money(unit(best)) + '.' },
    ].concat(two ? [{ tag: 'cheaper_total', when: (stage) => carted(stage, o.trap),
      steps: () => [{ drag: 'bag' + o.trap, to: 'cart' }, { type: 'total', text: String(unit(o[o.trap]) * o.need) }], say: '' }] : []),
  };
}

// A fresh last round on every play. The cheaper sign is never the better deal, and it can sit on either side.
const last = Sidekick.pick([
  { good: { count: 5, price: 15 }, poor: { count: 3, price: 12 }, need: 8, emoji: '🥭' },
  { good: { count: 6, price: 24 }, poor: { count: 2, price: 10 }, need: 9, emoji: '🍍' },
  { good: { count: 7, price: 14 }, poor: { count: 4, price: 12 }, need: 10, emoji: '🍑' },
]);
const goodSide = Sidekick.pick(['A', 'B']), poorSide = goodSide === 'A' ? 'B' : 'A';
const finale = { need: last.need, best: goodSide, trap: poorSide };
finale[goodSide] = { count: last.good.count, price: last.good.price, emoji: last.emoji };
finale[poorSide] = { count: last.poor.count, price: last.poor.price, emoji: last.emoji };

Sidekick.game({
  title: 'Smoothie Run',
  emoji: '🥤',
  premise: 'You run a smoothie stand. Shop smart: find what ONE fruit costs before you buy.',
  outro: 'Smart shopping! Find the price of one, and any deal or any order is easy to work out.',
  rounds: [
    splitterRound({ id: 'splitter', A: { count: 6, price: 12, emoji: '🍋' }, B: { count: 4, price: 10, emoji: '🍋' }, best: 'A', trap: 'B',
      say: 'Two stands sell lemons. Drop each deal on the Splitter to see the price of one. Then put the better deal in your cart.',
      hints: ['Try both deals on the Splitter. Read the price for one lemon.', 'The better deal has the lower price for one.'],
      win: '$2 a lemon beats $2.50 a lemon, even though the sign says more dollars.' }),
    priceTagRound({ id: 'price-tags', A: { count: 3, price: 6, emoji: '🍓' }, B: { count: 10, price: 30, emoji: '🍓' }, best: 'A', trap: 'B',
      say: 'The Splitter is resting. Set the price of ONE for each stand, then cart the better deal.',
      hints: ['Share the dollars equally. $6 shared by 3 is how much each?', 'Tap + until the check mark shows. Then compare the two prices.'],
      win: '$2 each beats $3 each. The small bag wins this time.' }),
    orderRound({ id: 'big-order', phase: 'guided', A: { count: 3, price: 6, emoji: '🥝' }, best: 'A', need: 7,
      say: 'A big order! 3 kiwis cost $6, and you need 7. Set the price of one, then type the total.',
      hints: ['First find one kiwi: $6 shared by 3.', 'Every kiwi costs the same. 7 kiwis is 7 times the price of one.'],
      win: '7 kiwis at $2 each is $14.' }),
    orderRound(Object.assign({ id: 'on-your-own', phase: 'solo',
      say: 'You need ' + last.need + '. Put the better deal in your cart, then type what ' + last.need + ' will cost at that stand.' }, finale)),
  ],
});
