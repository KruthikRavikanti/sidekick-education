// Bubble First. Skill: work out what is inside the grouping symbols before anything else.
// The machine squishes two numbers together each time a sign is tapped. Numbers inside the
// bubble (the parentheses) have to be squished first. Going left to right gives another answer.
const DO = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b };
const written = (tokens, group) => tokens.map((t, i) => (i === group[0] ? '(' + t : i === group[1] ? t + ')' : t)).join(' ');
function finish(tokens, order) {
  const list = tokens.map((t, i) => ({ t, i }));
  order.forEach((opIndex) => { const at = list.findIndex((item) => item.i === opIndex); list.splice(at - 1, 3, { t: DO[list[at].t](list[at - 1].t, list[at + 1].t), i: list[at - 1].i }); });
  return list[0].t;
}

function machine(o) {
  const ops = o.tokens.map((t, i) => (typeof t === 'string' ? i : -1)).filter((i) => i >= 0);
  const inner = ops.filter((i) => i > o.group[0] && i < o.group[1]), outer = ops.filter((i) => !inner.includes(i));
  const rightOrder = inner.concat(outer.filter((i) => o.tokens[i] === '×'), outer.filter((i) => o.tokens[i] !== '×'));
  const answer = finish(o.tokens, rightOrder), leftToRight = finish(o.tokens, ops);
  const taps = (order) => order.map((i) => ({ tap: 'sign' + i }));
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: 64, action: 'Check!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: written(o.tokens, o.group), x: 50, y: 7, size: 4.8, card: true });
      const bubble = stage.block({ x: 0, y: 17, w: 10, h: 16, color: 'white', opacity: 0.55, round: 8, border: 'sky' });
      const note = stage.label({ text: 'Tap a sign to squish its two numbers together.', x: 50, y: 43, size: 3.5, card: true });
      let items = [], refused = false;
      const place = () => {
        items.forEach((item, pos) => item.sprite.moveTo(50 + (pos - (items.length - 1) / 2) * 12.5, 25));
        const grouped = items.filter((item) => item.grouped);
        if (grouped.length > 1) bubble.set({ x: grouped[0].sprite.x - 6.4, w: grouped[grouped.length - 1].sprite.x - grouped[0].sprite.x + 12.8 }).show();
        else { bubble.hide(); items.forEach((item) => { item.grouped = false; }); }
      };
      const squish = (item) => {
        const at = items.indexOf(item), left = items[at - 1], right = items[at + 1];
        if (o.helped) {
          const bubbleOpen = items.some((other) => other.grouped && typeof other.t === 'string');
          const timesLeft = items.some((other) => other.t === '×');
          if (bubbleOpen && !item.grouped) { refused = true; note.set('The bubble is not finished. Squish inside it first.'); item.sprite.shake(); return; }
          if (!bubbleOpen && item.t !== '×' && timesLeft) { note.set('Multiply before you add or subtract.'); item.sprite.shake(); return; }
        }
        if (!(left.grouped && right.grouped)) items.forEach((other) => { other.grouped = false; });
        left.t = DO[item.t](left.t, right.t); left.sprite.set({ text: String(left.t) }).pop();
        item.sprite.hide(); right.sprite.hide(); items.splice(at, 2); place();
        note.set(items.length === 1 ? 'The machine made ' + left.t + '.' : 'Now tap the next sign.');
      };
      const start = () => {
        items = o.tokens.map((t, i) => {
          const item = { t, grouped: i >= o.group[0] && i <= o.group[1] };
          const old = stage.get((typeof t === 'string' ? 'sign' : 'num') + i);
          if (old) item.sprite = old.set({ text: String(t) }).show();
          else item.sprite = typeof t === 'string'
            ? stage.sprite({ id: 'sign' + i, text: t, size: 5, color: 'orange', x: 50, y: 25, label: 'sign ' + t, tap: () => squish(items.find((other) => other.sprite.id === 'sign' + i)) })
            : stage.sprite({ id: 'num' + i, text: String(t), size: 5, plain: true, x: 50, y: 25 });
          return item;
        });
        place(); note.set('Tap a sign to squish its two numbers together.');
      };
      start();
      stage.button({ id: 'again', text: '↺ Start over', x: 50, y: 56, size: 3.6, onTap: start });
      stage.data = { result: () => (items.length === 1 ? items[0].t : null), refused: () => refused };
    },
    check: (stage) => stage.data.result() === answer,
    solution: () => taps(rightOrder),
    // With help on, the machine refuses a sign outside an unfinished bubble. Without help it runs any order.
    mistakes: leftToRight === answer ? [] : [o.helped
      ? { tag: 'works_left_to_right', when: (stage) => stage.data.refused() && stage.data.result() === null, steps: () => taps(ops.slice(0, 1)),
        say: 'The machine will not start at the left. Find the bubble and squish inside it first.' }
      : { tag: 'works_left_to_right', when: (stage) => stage.data.result() === leftToRight, steps: () => taps(ops),
        say: 'That went left to right and made ' + leftToRight + '. The bubble has to be squished first. Tap Start over and try again.' }],
  };
}

// A fresh machine for the last round on every play.
const last = Sidekick.pick([[3, '×', 10, '−', 4, '+', 5], [4, '×', 6, '+', 3, '−', 10], [50, '−', 4, '+', 6, '×', 3]]);

Sidekick.game({
  title: 'Bubble First',
  emoji: '🫧',
  premise: 'The number machine squishes two numbers at a time. Anything inside the bubble goes first.',
  outro: 'Pop! Work out what is inside the parentheses first, then the rest.',
  rounds: [
    machine({ id: 'three-times', phase: 'guided', helped: true, tokens: [3, '×', 4, '+', 2], group: [2, 4],
      say: 'The bubble is the parentheses. Tap the sign inside the bubble first, then the one outside.',
      hints: ['Tap the + inside the bubble.', '4 + 2 is 6. Then 3 × 6.'],
      win: '3 × (4 + 2) = 3 × 6 = 18.' }),
    machine({ id: 'twenty-minus', phase: 'guided', helped: true, tokens: [20, '−', 3, '+', 7], group: [2, 4],
      say: 'The bubble is at the end this time. Which sign comes first?',
      hints: ['Do not just go left to right. Find the bubble.', 'Bubble first: 3 + 7 = 10. Then 20 − 10.'],
      win: '20 − (3 + 7) = 20 − 10 = 10.' }),
    machine({ id: 'three-signs', phase: 'guided', helped: true, tokens: [2, '×', 5, '+', 9, '−', 3], group: [2, 4],
      say: 'Three signs now. Bubble first, then multiply, then subtract.',
      hints: ['5 + 9 = 14 comes first.', 'Then 2 × 14 = 28, and last 28 − 3.'],
      win: '2 × (5 + 9) − 3 = 28 − 3 = 25.' }),
    machine({ id: 'free-machine', phase: 'solo', tokens: last, group: [2, 4],
      say: 'Now the machine lets you tap the signs in any order at all. Choose the order that follows the rules.' }),
  ],
});
