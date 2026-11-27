// Line Lab. Skill: a relationship is proportional only if its graph is a straight line through the origin.
// Every graph here is a straight line. The proportional ones start at zero, so doubling x
// doubles y. A straight line that starts above zero is not proportional.
function art(m, b) {
  const px = (x) => 12 + x * 16, py = (y) => 88 - y * 9.5, end = Math.min(5, (8 - b) / m);
  return '<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="8" fill="#ffffff" stroke="#054a29" stroke-width="3"/>' +
    '<g stroke="#c9d2cc" stroke-width="1">' + [1, 2, 3, 4, 5].map((x) => '<line x1="' + px(x) + '" y1="' + py(0) + '" x2="' + px(x) + '" y2="' + py(8) + '"/>').join('') + [2, 4, 6, 8].map((y) => '<line x1="' + px(0) + '" y1="' + py(y) + '" x2="' + px(5) + '" y2="' + py(y) + '"/>').join('') + '</g>' +
    '<path d="M' + px(0) + ',' + py(8) + ' V' + py(0) + ' H' + px(5) + '" fill="none" stroke="#054a29" stroke-width="2.5"/>' +
    '<line x1="' + px(0) + '" y1="' + py(b) + '" x2="' + px(end) + '" y2="' + py(b + m * end) + '" stroke="#f79256" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="' + px(0) + '" cy="' + py(b) + '" r="4" fill="#f79256"/></svg>';
}
const num = (v) => String(Math.round(v * 100) / 100);

function lab(o) {
  const on = (stage, i) => stage.get('graph' + i).data.on, n = o.lines.length;
  const taps = (want) => o.lines.map((line, i) => (want(line) ? { tap: 'graph' + i } : null)).filter(Boolean);
  const all = (stage, want) => o.lines.every((line, i) => on(stage, i) === want(line));
  return {
    id: o.id, phase: o.phase, scene: 'space', height: o.helped ? 62 : 48, action: 'Test!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🔬 Tap every graph that is proportional', x: 50, y: 7, size: 3.8, card: true });
      const note = o.helped ? stage.label({ text: 'Tap a graph to see its table.', x: 50, y: 51, size: 3.4, w: 92, card: true }) : null;
      o.lines.forEach(([m, b], i) => stage.sprite({ id: 'graph' + i, svg: art(m, b), w: 21, x: 50 + (i - (n - 1) / 2) * 23.5, y: 27, label: 'graph ' + (i + 1), data: { on: false },
        tap(tile) {
          tile.data.on = !tile.data.on; tile.badge(tile.data.on ? '✅' : '');
          // The world reacts: the table behind the tapped line is read out, with y divided by x.
          if (note) note.set('x: 1, 2, 4   y: ' + [1, 2, 4].map((x) => num(m * x + b)).join(', ') + '   y ÷ x: ' + [1, 2, 4].map((x) => num((m * x + b) / x)).join(', ') + (b ? '   The ratio keeps changing.' : '   Always ' + num(m) + '.'));
        } }));
    },
    check: (stage) => all(stage, (line) => line[1] === 0),
    solution: () => taps((line) => line[1] === 0),
    mistakes: [{ tag: 'any_straight_line_is_proportional', when: (stage) => all(stage, () => true), steps: () => taps(() => true),
      say: 'They are all straight, but not all proportional. Check where each line starts. Only lines through zero keep y ÷ x the same.' }],
  };
}

// Fresh graphs for the last round on every play.
const last = Sidekick.pick([[[3, 0], [1, 3], [0.5, 0], [0.5, 2]], [[1, 2], [2, 0], [2, 2], [1, 0]]]);

Sidekick.game({
  title: 'Line Lab',
  emoji: '🔬',
  premise: 'Test each graph in the lab. Mark only the ones that show a proportional relationship.',
  outro: 'Tested! Proportional graphs are straight lines through the origin. y ÷ x never changes.',
  rounds: [
    lab({ id: 'two-graphs', phase: 'guided', helped: true, lines: [[2, 0], [1, 2]],
      say: 'Two straight lines. Tap a graph to see its table. Mark the one where y ÷ x stays the same.',
      hints: ['Look at where each line starts.', 'The first line starts at zero. Its ratio is always 2.'],
      win: 'The line through zero is proportional.' }),
    lab({ id: 'three-graphs', phase: 'guided', helped: true, lines: [[0.5, 0], [1, 1], [3, 0]],
      say: 'Three graphs. Steep or gentle does not matter. What does?',
      hints: ['Two of these start at zero.', 'The middle one starts at 1, so its ratio changes.'],
      win: 'Two lines pass through the origin, so two are proportional.' }),
    lab({ id: 'four-graphs', phase: 'guided', helped: true, lines: [[1, 0], [0.5, 3], [2, 0], [2, 1]],
      say: 'Four graphs. Two pairs have the same steepness. Test them all.',
      hints: ['Same steepness does not mean both are proportional.', 'Only the ones starting at zero.'],
      win: 'Through the origin: proportional. Starting above it: not.' }),
    lab({ id: 'last-lab', phase: 'solo', lines: last,
      say: 'The tables are locked away. Mark every proportional graph by looking at the lines alone.' }),
  ],
});
