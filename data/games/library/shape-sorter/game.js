// Shape Sorter. Skill: name a shape no matter how it is turned.
// A square stays a square when it is tipped onto a corner. Dropping any shape in a bin
// straightens it up, so the child sees it was the same shape all along.
const SHAPES = {
  triangle: '<polygon points="50,8 94,90 6,90" fill="#f79256" stroke="#054a29" stroke-width="5" stroke-linejoin="round"/>',
  thin: '<polygon points="50,6 78,92 22,92" fill="#ffd45c" stroke="#054a29" stroke-width="5" stroke-linejoin="round"/>',
  square: '<polygon points="14,14 86,14 86,86 14,86" fill="#6ec3f4" stroke="#054a29" stroke-width="5" stroke-linejoin="round"/>',
  circle: '<circle cx="50" cy="50" r="40" fill="#aa6da3" stroke="#054a29" stroke-width="5"/>',
  hexagon: '<polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#7fd8b5" stroke="#054a29" stroke-width="5" stroke-linejoin="round"/>',
};
const BIN = { triangle: 'triangles', thin: 'triangles', square: 'squares', circle: 'others', hexagon: 'others' };
const svg = (name) => '<svg viewBox="0 0 100 100">' + SHAPES[name] + '</svg>';

function sorter(o) {
  const items = o.items.map((item, i) => Object.assign({ id: 'shape' + (i + 1), bin: BIN[item.shape] }, item));
  const sortAll = (override) => items.map((item) => ({ drag: item.id, to: (override && override[item.id]) || item.bin }));
  const tippedSquares = items.filter((item) => item.shape === 'square' && item.turn % 90 !== 0);
  return {
    id: o.id, phase: o.phase, scene: 'space', height: 78, action: 'Sorted!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.zone({ id: 'belt', x: 3, y: 5, w: 94, h: 22, look: 'cloud', label: 'Shapes to sort', showLabel: false, layout: 'row', gap: 2.5, accepts: 'shape' });
      items.forEach((item) => stage.sprite({ id: item.id, svg: svg(item.shape), w: item.size || 13, turn: item.turn, kind: 'shape', data: item, drag: true, zone: 'belt', label: 'a shape' }));
      const straighten = (shape) => { if (!o.locked) shape.turn(0); };
      [['triangles', '🔺 Triangles', 'orange'], ['squares', '🟦 Squares', 'sky'], ['others', 'Other shapes', 'mint']].forEach(([id, label, color], i) =>
        stage.zone({ id, x: 3 + i * 32, y: 40, w: 30, h: 34, look: 'tray', color, label, labelAt: 'top', layout: 'flow', accepts: 'shape', onDrop: straighten }));
    },
    check: (stage) => items.every((item) => stage.get(item.id).zone === item.bin),
    solution: () => sortAll(),
    mistakes: tippedSquares.length ? [{
      tag: 'tipped_square_is_not_a_square',
      when: (stage) => tippedSquares.some((item) => stage.get(item.id).zone === 'others'),
      steps: () => sortAll(Object.fromEntries(tippedSquares.map((item) => [item.id, 'others']))),
      say: 'Look again at the tipped one. Four equal sides and four square corners: it is still a square.',
    }] : [],
    onWin(stage) { items.forEach((item) => stage.get(item.id).turn(0)); },
  };
}

// A fresh mix for the last round on every play.
const lastItems = Sidekick.shuffle([
  { shape: 'square', turn: 45, size: 12 }, { shape: 'triangle', turn: 180 }, { shape: 'hexagon', turn: 15 },
  { shape: 'square', turn: 20, size: 10 }, { shape: 'thin', turn: 115 },
]);

Sidekick.game({
  title: 'Shape Sorter',
  emoji: '🛸',
  premise: 'Shapes are tumbling off the space belt. Sort each one into its bin, even when it is turned.',
  outro: 'All sorted! Turning a shape does not change what it is.',
  rounds: [
    sorter({ id: 'easy-belt', phase: 'guided', items: [{ shape: 'triangle', turn: 0 }, { shape: 'square', turn: 0 }, { shape: 'circle', turn: 0 }, { shape: 'triangle', turn: 180 }],
      say: 'Drag each shape into its bin. Watch what happens to the upside-down one.',
      hints: ['Count the sides. Triangles have 3.', 'The upside-down shape still has 3 sides.'],
      win: 'An upside-down triangle is still a triangle.' }),
    sorter({ id: 'tipped-square', phase: 'guided', items: [{ shape: 'square', turn: 45 }, { shape: 'hexagon', turn: 0 }, { shape: 'thin', turn: 60 }, { shape: 'square', turn: 0, size: 10 }],
      say: 'One of these is standing on its corner. Sort them all and see what it really is.',
      hints: ['Count sides and corners on the tipped shape.', 'Four equal sides and four square corners make a square.'],
      win: 'The tipped shape was a square all along.' }),
    sorter({ id: 'big-and-small', phase: 'guided', items: [{ shape: 'triangle', turn: 90, size: 10 }, { shape: 'square', turn: 30, size: 14 }, { shape: 'circle', turn: 0, size: 10 }, { shape: 'thin', turn: 200 }, { shape: 'square', turn: 45, size: 10 }],
      say: 'Big ones, small ones, turned ones. Size and turning do not change the name.',
      hints: ['Ignore the size. Count the sides.', 'Two of these are squares.'],
      win: 'Two squares, two triangles and one circle.' }),
    sorter({ id: 'locked-belt', phase: 'solo', locked: true, items: lastItems,
      say: 'The bins will not straighten the shapes now. Sort all five by yourself.' }),
  ],
});
