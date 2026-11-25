// Seed Planter. Skill: read 4 x 6 as 4 groups of 6.
// The planter makes rows. The first number is how many rows and the second is how many seeds
// in each row. Adding the two numbers buys far too few seeds, and the plot shows the bare holes.
const X0 = 8, Y0 = 20, STEP = 6.3;
const at = (i, each) => ({ x: X0 + (i % each) * STEP, y: Y0 + Math.floor(i / each) * STEP });

function plot(stage, rows, each, holes) {
  const sprouts = [];
  for (let i = 0; i < rows * each; i++) {
    const p = at(i, each);
    if (holes) stage.block({ x: p.x - 2, y: p.y - 2, w: 4, h: 4, color: '#8a5a3c', round: 3, opacity: 0.55 });
    sprouts.push(stage.sprite({ emoji: '🌱', x: p.x, y: p.y, size: 4.2, hidden: true }));
  }
  return (n) => sprouts.forEach((s, i) => (i < n ? s.show() : s.hide()));
}

// Rounds 1 and 2: set the planter's two dials and watch the rows appear.
function dials(o) {
  const rows = (stage) => stage.get('rows').value, each = (stage) => stage.get('each').value;
  const set = (a, b) => [{ set: 'rows', value: a }, { set: 'each', value: b }];
  return {
    id: o.id, phase: 'guided', scene: 'field', height: 66, action: 'Plant!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      stage.label({ text: 'Order: ' + o.a + ' × ' + o.b, x: 30, y: 8, size: 5.6, card: true });
      stage.label({ text: 'Rows', x: 79, y: 14, size: 3.6, card: true });
      stage.stepper({ id: 'rows', x: 79, y: 23, min: 1, max: 6, value: 1 });
      stage.label({ text: 'Seeds in each row', x: 79, y: 37, size: 3.6, card: true });
      stage.stepper({ id: 'each', x: 79, y: 46, min: 1, max: 8, value: 1 });
      const used = stage.label({ text: 'Seeds planted: 1', x: 79, y: 59, size: 3.8, card: true });
      const dots = Array.from({ length: 48 }, () => stage.sprite({ emoji: '🌱', x: X0, y: Y0, size: 4.2, hidden: true }));
      const grow = () => {
        const n = rows(stage) * each(stage);
        dots.forEach((dot, i) => { if (i < n) { const p = at(i, each(stage)); dot.moveTo(p.x, p.y); dot.show(); } else dot.hide(); });
        used.set('Seeds planted: ' + n);
      };
      grow(); stage.on('change', grow);
    },
    check: (stage) => rows(stage) === o.a && each(stage) === o.b,
    solution: () => set(o.a, o.b),
    mistakes: [{ tag: 'swaps_groups_and_size', when: (stage) => rows(stage) === o.b && each(stage) === o.a, steps: () => set(o.b, o.a),
      say: 'That is ' + o.b + ' rows of ' + o.a + '. In ' + o.a + ' × ' + o.b + ' the first number tells how many rows.' }],
  };
}

// Rounds 3 and 4: buy the seeds. The number typed is poured into the plot, row by row.
function seeds(o) {
  const total = o.a * o.b, typed = (stage) => stage.get('bag').number;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'bag', text: String(value) }], say });
  return {
    id: o.id, phase: o.phase, scene: 'field', height: 76, action: 'Plant!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: 'Order: ' + o.a + ' × ' + o.b, x: 30, y: 8, size: 5.6, card: true });
      const pour = plot(stage, o.a, o.b, !o.covered);
      const cover = o.covered ? stage.label({ text: '🚜 The plot is not dug yet', x: 30, y: 38, size: 3.6, card: true }) : null;
      stage.keypad({ id: 'bag', x: 80, y: 44 });
      if (!o.covered) stage.on('change', () => pour(typed(stage) || 0));
      stage.data = { pour, cover };
    },
    check: (stage) => typed(stage) === total,
    solution: () => [{ type: 'bag', text: String(total) }],
    mistakes: [
      wrong('adds_the_numbers', o.a + o.b, o.a + ' × ' + o.b + ' is not ' + o.a + ' + ' + o.b + '. It means ' + o.a + ' rows with ' + o.b + ' in every row. Look at the bare holes.'),
      wrong('counts_one_row', o.b, 'That fills one row. There are ' + o.a + ' rows of ' + o.b + '.'),
    ],
    onWin(stage) { if (stage.data.cover) stage.data.cover.hide(); stage.data.pour(total); },
  };
}

// A fresh order for the last round on every play.
const [a, b] = Sidekick.pick([[4, 6], [3, 7], [5, 6], [6, 4]]);

Sidekick.game({
  title: 'Seed Planter',
  emoji: '🌱',
  premise: 'The planter makes equal rows. Read each order as rows of seeds and plant it.',
  outro: 'The field is planted! A × B means A groups with B in each one.',
  rounds: [
    dials({ id: 'three-by-four', a: 3, b: 4,
      say: 'The order says 3 × 4. That means 3 rows of 4 seeds. Set both dials to plant it.',
      hints: ['The first number is how many rows.', 'Make 3 rows. Put 4 seeds in each row.'],
      win: '3 rows of 4 seeds. That is 3 × 4, and it makes 12.' }),
    dials({ id: 'two-by-six', a: 2, b: 6,
      say: 'New order: 2 × 6. Set the planter to make it.',
      hints: ['2 × 6 means 2 groups of 6.', 'Rows: 2. Seeds in each row: 6.'],
      win: '2 rows of 6 seeds make 12.' }),
    seeds({ id: 'four-by-five', phase: 'guided', a: 4, b: 5,
      say: 'The plot is dug for 4 × 5. How many seeds should we buy? Type it and watch them fill the holes.',
      hints: ['Count the holes row by row: 5, 10, 15...', '4 rows of 5 is 5 + 5 + 5 + 5.'],
      win: '4 rows of 5 is 20 seeds.' }),
    seeds({ id: 'last-order', phase: 'solo', a, b, covered: true,
      say: 'Last order: ' + a + ' × ' + b + '. The plot is not dug yet, so picture the rows. How many seeds?' }),
  ],
});
