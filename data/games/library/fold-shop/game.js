// Fold Shop. Skill: find a shape's lines of symmetry.
// A fold line is a line of symmetry only if the two halves land exactly on each other.
// A rectangle's corner-to-corner fold looks tempting, but the corners stick out.
const LINES = {
  v: { glyph: '│', a: 90, x: 50, y: 6.5, ends: [50, -2, 50, 102] },
  h: { glyph: '─', a: 0, x: 81, y: 35, ends: [-2, 50, 102, 50] },
  d1: { glyph: '╱', a: -45, x: 73.5, y: 12, ends: [5, 95, 95, 5] },
  d2: { glyph: '╲', a: 45, x: 26.5, y: 12, ends: [5, 5, 95, 95] },
};
const IDS = ['v', 'h', 'd1', 'd2'];
const SHAPES = {
  kite: { points: [[50, 10], [82, 42], [50, 92], [18, 42]], lines: ['v'] },
  wide: { points: [[10, 28], [90, 28], [90, 72], [10, 72]], lines: ['v', 'h'] },
  square: { points: [[18, 18], [82, 18], [82, 82], [18, 82]], lines: ['v', 'h', 'd1', 'd2'] },
  tall: { points: [[28, 8], [72, 8], [72, 92], [28, 92]], lines: ['v', 'h'] },
  gem: { points: [[26, 22], [74, 22], [96, 50], [74, 78], [26, 78], [4, 50]], lines: ['v', 'h'] },
  house: { points: [[50, 10], [86, 42], [86, 88], [14, 88], [14, 42]], lines: ['v'] },
};
const text = (points) => points.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
function flipped(points, deg) {
  const c = Math.cos((2 * deg * Math.PI) / 180), s = Math.sin((2 * deg * Math.PI) / 180);
  return points.map(([x, y]) => [50 + (x - 50) * c + (y - 50) * s, 50 + (x - 50) * s - (y - 50) * c]);
}

function paper(o) {
  const shape = SHAPES[o.shape], isOn = (stage, id) => stage.get(id).data.on;
  const extra = ['d1', 'd2'].filter((id) => !shape.lines.includes(id));
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 68, action: 'Fold!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const sheet = stage.add('<svg viewBox="0 0 100 100"><polygon points="' + text(shape.points) + '" fill="#ffffff" stroke="#054a29" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<polygon class="ghost" points="' + text(shape.points) + '" fill="#f79256" fill-opacity="0" stroke="#f79256" stroke-width="2" stroke-opacity="0" stroke-linejoin="round"/>' +
        IDS.map((id) => '<line class="fold-' + id + '" x1="' + LINES[id].ends[0] + '" y1="' + LINES[id].ends[1] + '" x2="' + LINES[id].ends[2] + '" y2="' + LINES[id].ends[3] + '" stroke="#9aa39c" stroke-width="1.2" stroke-dasharray="3 4"/>').join('') + '</svg>',
        { x: 27, y: 12, w: 46, h: 46 });
      const note = stage.label({ text: o.helped ? 'Tap a fold line to try it' : 'Mark every fold that works', x: 50, y: 63, size: 3.8, card: true });
      IDS.forEach((id) => stage.sprite({
        id, text: LINES[id].glyph, size: 5, x: LINES[id].x, y: LINES[id].y, label: 'fold line ' + id, data: { on: false },
        tap(handle) {
          handle.data.on = !handle.data.on;
          handle.badge(handle.data.on ? '✓' : '');
          const line = sheet.querySelector('.fold-' + id);
          line.setAttribute('stroke', handle.data.on ? '#8a6fe8' : '#9aa39c'); line.setAttribute('stroke-width', handle.data.on ? '2.4' : '1.2');
          if (!o.helped) return;
          // The world reacts: the paper flips over the fold so the child can see if the halves land together.
          const ghost = sheet.querySelector('.ghost'), works = shape.lines.includes(id);
          ghost.setAttribute('points', text(flipped(shape.points, LINES[id].a)));
          ghost.setAttribute('fill-opacity', handle.data.on ? '0.4' : '0'); ghost.setAttribute('stroke-opacity', handle.data.on ? '1' : '0');
          note.set(!handle.data.on ? 'Tap a fold line to try it' : works ? 'The halves land right on top of each other.' : 'The halves do not match. Parts stick out.');
        },
      }));
    },
    check: (stage) => IDS.every((id) => isOn(stage, id) === shape.lines.includes(id)),
    solution: () => shape.lines.map((id) => ({ tap: id })),
    mistakes: extra.length ? [{
      tag: 'counts_the_diagonals', when: (stage) => extra.some((id) => isOn(stage, id)),
      steps: () => shape.lines.concat(extra).map((id) => ({ tap: id })),
      say: 'Try the corner-to-corner fold again. The corners stick out, so it is not a line of symmetry here.',
    }] : [],
  };
}

// A fresh sheet for the last round on every play.
const last = Sidekick.pick(['tall', 'gem', 'house']);

Sidekick.game({
  title: 'Fold Shop',
  emoji: '📄',
  premise: 'The fold shop only makes folds where both halves match. Find every fold that works.',
  outro: 'Perfect folds! A line of symmetry makes two halves that land exactly on each other.',
  rounds: [
    paper({ id: 'kite', phase: 'guided', shape: 'kite', helped: true,
      say: 'Tap a fold line to flip the kite over it. Keep only the folds where the halves match.',
      hints: ['Tap a line again to turn it off.', 'Only the straight up-and-down fold works for the kite.'],
      win: 'One line of symmetry: straight down the middle.' }),
    paper({ id: 'rectangle', phase: 'guided', shape: 'wide', helped: true,
      say: 'Now a rectangle. Try all four folds. Which ones make matching halves?',
      hints: ['Try the corner-to-corner folds and watch the corners.', 'Across and up-and-down both work. The slanted folds do not.'],
      win: 'A rectangle has 2 lines of symmetry. Its diagonals are not among them.' }),
    paper({ id: 'square', phase: 'guided', shape: 'square', helped: true,
      say: 'A square is special. Test every fold line.',
      hints: ['All four sides of a square are the same length.', 'Every one of these folds works on a square.'],
      win: 'A square has 4 lines of symmetry, diagonals too.' }),
    paper({ id: 'last-sheet', phase: 'solo', shape: last,
      say: 'The paper will not flip for you now. Picture each fold and mark every line of symmetry.' }),
  ],
});
