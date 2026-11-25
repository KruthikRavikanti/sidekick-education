// Toy Machine. Skill: compare the values of pennies, nickels, dimes and quarters.
// The machine counts cents, not coins and not size. The dime is the smallest coin and is
// worth more than the bigger nickel, so paying by size leaves the child short.
const COINS = {
  penny: { cents: 1, w: 10.5, color: '#c8794a', tray: 'pennies' },
  nickel: { cents: 5, w: 12.5, color: '#c3c7cf', tray: 'nickels' },
  dime: { cents: 10, w: 9.5, color: '#e3e6ec', tray: 'dimes' },
  quarter: { cents: 25, w: 14.5, color: '#b4b9c3', tray: 'quarters' },
};
const KINDS = ['penny', 'nickel', 'dime', 'quarter'];
const paid = (stage) => stage.get('slot').sum((coin) => coin.value);
// What a child who ranks coins by size believes they paid: nickel as 10, dime as 5.
const bySize = (stage) => stage.get('slot').sum((coin) => (coin.kind === 'nickel' ? 10 : coin.kind === 'dime' ? 5 : coin.value));
const drop = (list) => list.map((id) => ({ drag: id, to: 'slot' }));

function shop(o) {
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: 80, action: 'Buy!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ emoji: o.toy, x: 16, y: 13, size: 13 });
      stage.label({ text: o.price + '¢', x: 16, y: 28, size: 6, card: true });
      stage.zone({ id: 'slot', x: 36, y: 5, w: 60, h: 27, look: 'box', color: 'coral', label: 'Coin slot', showLabel: false, accepts: KINDS });
      const screen = stage.label({ text: o.screen ? 'Paid: 0¢' : 'Paid: ?', x: 66, y: 38, size: 4.6, card: true });
      KINDS.forEach((kind, i) => {
        const coin = COINS[kind];
        stage.zone({ id: coin.tray, x: 3 + i * 24, y: 53, w: 22, h: 25, look: 'tray', label: coin.tray, labelAt: 'top', layout: 'stack', accepts: kind });
        for (let n = 1; n <= o.stock[kind]; n++) {
          stage.sprite({ id: kind + n, shape: 'circle', w: coin.w, color: coin.color, caption: o.values ? coin.cents + '¢' : '', kind, value: coin.cents, drag: true, zone: coin.tray, label: kind });
        }
      });
      // The world reacts: the machine adds up the cents as each coin drops.
      if (o.screen) stage.on('change', () => screen.set('Paid: ' + paid(stage) + '¢'));
    },
    check: (stage) => paid(stage) === o.price,
    solution: () => drop(o.pay),
    mistakes: o.trap ? [{
      tag: 'bigger_coin_is_worth_more', when: (stage) => paid(stage) !== o.price && bySize(stage) === o.price, steps: () => drop(o.trap),
      say: 'A nickel is bigger than a dime, but it is only worth 5¢. The little dime is worth 10¢.',
    }] : [],
  };
}

const STOCK = { penny: 5, nickel: 4, dime: 4, quarter: 1 };
// A fresh toy for the last round. Each one can be paid exactly, and the size trap always falls short.
const last = Sidekick.pick([
  { toy: '🪀', price: 20, pay: ['dime1', 'dime2'], trap: ['nickel1', 'nickel2'] },
  { toy: '🚀', price: 40, pay: ['quarter1', 'dime1', 'nickel1'], trap: ['nickel1', 'nickel2', 'nickel3', 'nickel4'] },
  { toy: '🦖', price: 35, pay: ['quarter1', 'dime1'], trap: ['quarter1', 'nickel1'] },
]);

Sidekick.game({
  title: 'Toy Machine',
  emoji: '🪙',
  premise: 'The toy machine counts cents, not coins. Drop in exactly the right amount.',
  outro: 'Sold! A coin is worth what it is worth, no matter how big it looks.',
  rounds: [
    shop({ id: 'ball', phase: 'guided', toy: '🏀', price: 15, stock: STOCK, values: true, screen: true, pay: ['dime1', 'nickel1'],
      say: 'The ball costs 15¢. Drag coins into the slot until the machine says 15¢.',
      hints: ['Each coin shows what it is worth.', 'Try one 10¢ coin and one 5¢ coin.'],
      win: '10¢ and 5¢ make 15¢.' }),
    shop({ id: 'robot', phase: 'guided', toy: '🤖', price: 30, stock: STOCK, screen: true, pay: ['dime1', 'dime2', 'dime3'], trap: ['nickel1', 'nickel2', 'nickel3'],
      say: 'No numbers on the coins now! The robot costs 30¢. The small dime is 10¢. The bigger nickel is 5¢.',
      hints: ['Watch the screen as each coin drops.', 'Three dimes make 30¢.'],
      win: '10, 20, 30. Three little dimes buy the robot.' }),
    shop({ id: 'kite', phase: 'guided', toy: '🪁', price: 41, stock: STOCK, screen: true, pay: ['quarter1', 'dime1', 'nickel1', 'penny1'],
      say: 'The kite costs 41¢. Start with the coin worth the most, then add smaller ones.',
      hints: ['The quarter is worth 25¢.', '25, then a dime makes 35, a nickel makes 40, and a penny makes 41.'],
      win: '25 + 10 + 5 + 1 = 41¢.' }),
    shop({ id: 'last-toy', phase: 'solo', toy: last.toy, price: last.price, stock: STOCK, pay: last.pay, trap: last.trap,
      say: 'The screen is broken, so count in your head. Pay exactly ' + last.price + '¢ for the last toy.' }),
  ],
});
