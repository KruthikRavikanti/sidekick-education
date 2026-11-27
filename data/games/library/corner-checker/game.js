// Corner Checker. Skill: pick out the right angles in a shape.
// A right angle is a square corner, like the corner of a sheet of paper. It stays a right
// angle when the shape is tilted, and a corner that is only close does not count.
const SHAPES = {
  triangle: [[20, 15], [20, 85], [85, 85]],
  trapezoid: [[15, 20], [60, 20], [88, 80], [15, 80]],
  tilted: [20, 110, 200, 290].map((deg) => [50 + 40 * Math.cos((deg * Math.PI) / 180), 50 + 40 * Math.sin((deg * Math.PI) / 180)]),
  house: [[50, 10], [86, 42], [86, 88], [14, 88], [14, 42]],
  kite: [[20, 25], [75, 15], [90, 80], [20, 80]],
  flag: [[40, 20], [85, 20], [85, 80], [12, 80]],
};
function angleAt(points, i) {
  const n = points.length, p = points[i], a = points[(i + n - 1) % n], b = points[(i + 1) % n];
  const ux = a[0] - p[0], uy = a[1] - p[1], vx = b[0] - p[0], vy = b[1] - p[1];
  return (Math.acos((ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy))) * 180) / Math.PI;
}

function sheet(o) {
  const points = SHAPES[o.shape], angles = points.map((p, i) => angleAt(points, i)), square = angles.map((deg) => Math.abs(deg - 90) < 1);
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length, cy = points.reduce((s, p) => s + p[1], 0) / points.length;
  const marked = (stage, i) => stage.get('corner' + i).data.on;
  const taps = (want) => points.map((p, i) => (want(i) ? { tap: 'corner' + i } : null)).filter(Boolean);
  const all = (stage, want) => points.every((p, i) => marked(stage, i) === want(i));
  return {
    id: o.id, phase: o.phase, scene: 'paper', height: o.helped ? 72 : 62, action: 'Check!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.add('<svg viewBox="0 0 100 100"><polygon points="' + points.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '" fill="#cfeeb0" stroke="#054a29" stroke-width="2.5" stroke-linejoin="round"/></svg>', { x: 27, y: 10, w: 46, h: 46 });
      const note = o.helped ? stage.label({ text: '📐 Tap a corner to test it with a square corner.', x: 50, y: 65, size: 3.4, w: 92, card: true }) : null;
      points.forEach((p, i) => {
        const d = Math.hypot(p[0] - cx, p[1] - cy), hx = p[0] + ((p[0] - cx) / d) * 13, hy = p[1] + ((p[1] - cy) / d) * 13;
        stage.sprite({ id: 'corner' + i, text: '·', size: 4, x: 27 + hx * 0.46, y: 10 + hy * 0.46, label: 'corner ' + (i + 1), data: { on: false },
          tap(handle) {
            handle.data.on = !handle.data.on; handle.badge(handle.data.on ? '📐' : '');
            if (note) note.set(!handle.data.on ? '📐 Tap a corner to test it with a square corner.' : square[i] ? '📐 A square corner fits exactly. This is a right angle.' : angles[i] < 90 ? '📐 This corner is sharper than a square corner.' : '📐 This corner is wider than a square corner.');
          } });
      });
    },
    check: (stage) => all(stage, (i) => square[i]),
    solution: () => taps((i) => square[i]),
    mistakes: square.every(Boolean) ? [] : [{ tag: 'marks_every_corner', when: (stage) => all(stage, () => true), steps: () => taps(() => true),
      say: 'Not every corner is a right angle. A right angle is exactly a square corner, not sharper and not wider.' }],
  };
}

// A fresh shape for the last round on every play.
const last = Sidekick.pick(['house', 'kite', 'flag']);

Sidekick.game({
  title: 'Corner Checker',
  emoji: '📐',
  premise: 'Check every corner of the shape. Mark only the ones that are square corners.',
  outro: 'Checked! A right angle is a square corner. Tilting the shape does not change it.',
  rounds: [
    sheet({ id: 'triangle', phase: 'guided', helped: true, shape: 'triangle',
      say: 'Tap a corner to test it. Mark the one corner of this triangle that is a square corner.',
      hints: ['Two corners are sharp and pointy.', 'The corner at the bottom left is square.'],
      win: 'One right angle, at the square corner.' }),
    sheet({ id: 'trapezoid', phase: 'guided', helped: true, shape: 'trapezoid',
      say: 'Four corners this time. Test each one and mark only the right angles.',
      hints: ['The two corners on the left are square.', 'One corner on the right is too wide and one is too sharp.'],
      win: 'Two right angles on the left side.' }),
    sheet({ id: 'tilted-square', phase: 'guided', helped: true, shape: 'tilted',
      say: 'This square is tilted. Are its corners still right angles? Test them all.',
      hints: ['Turning a shape does not change its corners.', 'All four are still square corners.'],
      win: 'A tilted square still has four right angles.' }),
    sheet({ id: 'last-shape', phase: 'solo', shape: last,
      say: 'The corner tester is put away. Mark every right angle on this shape, and only those.' }),
  ],
});
