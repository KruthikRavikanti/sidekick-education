// Choco Factory. Skill: the area of a rectangle is rows x squares in each row.
// The child's number drives the machine: it pours that many squares into the mold,
// row by row. Adding the two sides pours far too few, and the holes show it.
const BROWN = '#8a5a3c';
const firstCells = (n, rows, cols) => Array.from({ length: Math.max(0, Math.min(n, rows * cols)) }, (_, i) => [i % cols, Math.floor(i / cols)]);
const edgeCells = (rows, cols) => firstCells(rows * cols, rows, cols).filter(([c, r]) => c === 0 || r === 0 || c === cols - 1 || r === rows - 1);

function order(stage, rows, cols) {
  stage.sprite({ id: 'bear', emoji: '🐻', x: 91, y: 8.5, size: 10 });
  stage.label({ text: rows + ' rows, ' + cols + ' in each row, please!', x: 44, y: 8, size: 4.3, card: true });
}

const paintRound = {
  id: 'paint-3-by-4', phase: 'guided', scene: 'kitchen', height: 66, action: 'Wrap it!',
  say: 'Bear wants a bar with 3 rows and 4 squares in each row. Paint chocolate into every square.',
  hints: ['Slide your finger along a row to paint it fast.', 'Fill all 3 rows. Each row has 4 squares.'],
  win: '3 rows of 4 squares makes 12 squares.',
  setup(stage) {
    order(stage, 3, 4);
    const mold = stage.grid({ id: 'mold', x: 50, y: 37, cols: 4, rows: 3, cell: 10, color: BROWN });
    const tally = stage.label({ text: '0 squares', x: 50, y: 60, size: 5 });
    stage.on('change', () => tally.set(mold.count + (mold.count === 1 ? ' square' : ' squares')));
  },
  check: (stage) => stage.get('mold').count === 12,
  solution: () => [{ paint: 'mold', cells: firstCells(12, 3, 4) }],
  mistakes: [{
    tag: 'only_the_edge', when: (stage) => { const mold = stage.get('mold'); return mold.count === 10 && !mold.isOn(1, 1) && !mold.isOn(2, 1); },
    say: 'The edge is done, but a bar is chocolate all the way through. Fill the middle too.',
    steps: () => [{ paint: 'mold', cells: edgeCells(3, 4) }],
  }],
};

function pourRound(o) {
  const total = o.rows * o.cols, cell = Math.min(8, 46 / o.cols), cx = 29, cy = 44;
  const left = cx - (o.cols * cell) / 2, top = cy - (o.rows * cell) / 2;
  const square = (stage, c, r) => stage.block({ x: left + c * cell + 0.3, y: top + r * cell + 0.3, w: cell - 0.6, h: cell - 0.6, color: BROWN, round: 1, z: 2 });
  const typed = (stage) => stage.get('pour').number;
  return {
    id: o.id, phase: o.phase, say: o.say, hints: o.hints || [], win: o.win || '', scene: 'kitchen', height: 76, action: 'Pour!',
    setup(stage) {
      order(stage, o.rows, o.cols);
      stage.keypad({ id: 'pour', x: 80, y: 46, label: 'Squares to pour' });
      if (o.covered) {
        // Only the top row and the left side show. The rest stays under the lid until the pour.
        stage.block({ x: left - 0.8, y: top - 0.8, w: o.cols * cell + 1.6, h: o.rows * cell + 1.6, color: 'sand', border: 'forest', round: 2 });
        for (let c = 0; c < o.cols; c++) square(stage, c, 0);
        for (let r = 1; r < o.rows; r++) square(stage, 0, r);
        stage.label({ id: 'mystery', text: '?', x: cx + cell / 2, y: cy + cell / 2, size: 9, color: 'forest' });
        return;
      }
      const mold = stage.grid({ id: 'mold', x: cx, y: cy, cols: o.cols, rows: o.rows, cell, color: BROWN, paint: false });
      const spill = stage.label({ text: '', x: cx, y: 70, size: 4.2 });
      // The world reacts: the machine pours exactly what was typed.
      stage.on('change', () => {
        const n = typed(stage) || 0;
        mold.set(firstCells(n, o.rows, o.cols), true);
        spill.set(n > total ? (n - total) + ' extra spilled!' : n > 0 && n < total ? (total - n) + ' squares still empty' : '');
      });
    },
    check: (stage) => typed(stage) === total,
    solution: () => [{ type: 'pour', text: String(total) }],
    mistakes: [
      { tag: 'adds_the_sides', when: (stage) => typed(stage) === o.rows + o.cols, steps: () => [{ type: 'pour', text: String(o.rows + o.cols) }],
        say: o.rows + ' + ' + o.cols + ' only counts along two edges. Count the rows: ' + o.rows + ' rows with ' + o.cols + ' in each.' },
      { tag: 'counts_edge_squares', when: (stage) => typed(stage) === o.rows + o.cols - 1, steps: () => [{ type: 'pour', text: String(o.rows + o.cols - 1) }],
        say: 'Those are the squares you can see on the edge. Every row is full of squares.' },
    ],
    onWin(stage) {
      if (o.covered) { stage.get('mystery').hide(); for (let r = 1; r < o.rows; r++) for (let c = 1; c < o.cols; c++) square(stage, c, r); }
      stage.get('bear').set({ emoji: '😋' }).pop();
    },
  };
}

// A fresh order for the last round on every play.
const [rows, cols] = Sidekick.pick([[3, 7], [4, 5], [3, 6], [5, 6], [4, 7], [3, 8]]);

Sidekick.game({
  title: 'Choco Factory',
  emoji: '🍫',
  premise: 'Every chocolate bar is rows of squares. Tell the machine how many squares to pour.',
  outro: 'Sweet work! Rows times squares in each row tells how many squares cover the whole bar.',
  rounds: [
    paintRound,
    pourRound({ id: 'pour-2-by-5', phase: 'guided', rows: 2, cols: 5,
      say: 'Now let the machine work. Type how many squares to pour for 2 rows of 5.',
      hints: ['One row holds 5 squares. There are 2 rows.', '5 and 5 more. That is 2 x 5.'],
      win: '2 rows of 5 is 10 squares. No holes!' }),
    pourRound({ id: 'pour-4-by-6', phase: 'guided', rows: 4, cols: 6,
      say: 'A big bar! 4 rows with 6 squares in each row. How many squares should pour?',
      hints: ['Skip count by rows: 6, 12, 18...', '4 rows of 6 is 4 x 6.'],
      win: '4 x 6 = 24 squares. Bar complete!' }),
    pourRound({ id: 'lid-on', phase: 'solo', rows, cols, covered: true,
      say: 'The lid is on, so you can only see the edge. Type the squares for ' + rows + ' rows of ' + cols + '.' }),
  ],
});
