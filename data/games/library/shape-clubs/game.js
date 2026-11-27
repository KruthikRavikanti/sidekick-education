// Shape Clubs. Skill: a square is also a rectangle and a rhombus, and all of them are quadrilaterals.
// A club lets in every shape that fits its rule, whatever the shape is usually called.
// The square fits the Rectangle Club rule, so leaving it outside breaks the rule.
const ART = {
  square: '<rect x="14" y="14" width="72" height="72"', rectangle: '<rect x="5" y="26" width="90" height="48"',
  rhombus: '<polygon points="50,5 84,50 50,95 16,50"', trapezoid: '<polygon points="30,24 70,24 95,78 5,78"',
  slanted: '<polygon points="30,24 96,24 70,76 4,76"', triangle: '<polygon points="50,10 92,86 8,86"', pentagon: '<polygon points="50,8 92,40 76,90 24,90 8,40"',
};
const FILL = { square: '#6ec3f4', rectangle: '#ffd45c', rhombus: '#aa6da3', trapezoid: '#7fd8b5', slanted: '#ff7f6b', triangle: '#f79256', pentagon: '#b7ce63' };
const FACTS = { square: [4, true, true], rectangle: [4, true, false], rhombus: [4, false, true], trapezoid: [4, false, false], slanted: [4, false, false], triangle: [3, false, false], pentagon: [5, false, false] };
const CLUBS = {
  quadrilateral: { sign: 'Quadrilateral Club', rule: '4 straight sides', fits: (f) => f[0] === 4 },
  rectangle: { sign: 'Rectangle Club', rule: '4 sides and 4 square corners', fits: (f) => f[0] === 4 && f[1] },
  rhombus: { sign: 'Rhombus Club', rule: '4 sides, all the same length', fits: (f) => f[0] === 4 && f[2] },
};
const picture = (name) => '<svg viewBox="0 0 100 100">' + ART[name] + ' fill="' + FILL[name] + '" stroke="#054a29" stroke-width="5" stroke-linejoin="round"/></svg>';
const called = (name) => (name === 'slanted' ? 'slanted shape' : name);

function club(o) {
  const rules = CLUBS[o.club], allowed = o.shapes.filter((name) => rules.fits(FACTS[name]));
  const inside = (stage, name) => stage.get('sh-' + name).zone === 'club';
  const enter = (names) => names.map((name) => ({ drag: 'sh-' + name, to: 'club' }));
  const why = (name) => (FACTS[name][0] !== 4 ? 'it does not have 4 sides' : o.club === 'rectangle' ? 'its corners are not square' : 'its sides are not all the same length');
  const withoutSquare = allowed.filter((name) => name !== 'square');
  return {
    id: o.id, phase: o.phase, scene: 'city', height: 76, action: 'Open the club!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🏠 ' + rules.sign + '\nRule: ' + rules.rule, x: 50, y: 7, size: 3.5, card: true });
      stage.zone({ id: 'club', x: 12, y: 15, w: 76, h: 26, look: 'box', color: 'sun', label: rules.sign, showLabel: false, accepts: 'shape' });
      const owl = o.helped ? stage.label({ text: '🦉 Drag in every shape that fits the rule.', x: 50, y: 47, size: 3.3, card: true }) : null;
      stage.zone({ id: 'street', x: 4, y: 55, w: 92, h: 17, look: 'tray', label: 'Waiting outside', showLabel: false, accepts: 'shape' });
      o.shapes.forEach((name) => stage.sprite({ id: 'sh-' + name, svg: picture(name), w: 11, kind: 'shape', drag: true, zone: 'street', label: called(name) }));
      // The world reacts: the owl at the door explains why a shape that does not fit has to leave.
      if (owl) stage.on('change', () => {
        const stray = o.shapes.find((name) => inside(stage, name) && !allowed.includes(name));
        owl.set(stray ? '🦉 The ' + called(stray) + ' cannot stay: ' + why(stray) + '.' : '🦉 Drag in every shape that fits the rule.');
      });
    },
    check: (stage) => o.shapes.every((name) => inside(stage, name) === allowed.includes(name)),
    solution: () => enter(allowed),
    mistakes: allowed.includes('square') && withoutSquare.length ? [{
      tag: 'leaves_the_square_out', when: (stage) => o.shapes.every((name) => inside(stage, name) === withoutSquare.includes(name)), steps: () => enter(withoutSquare),
      say: 'Check the square against the rule: ' + rules.rule + '. It fits, so it belongs in this club too.',
    }] : [],
  };
}

// A fresh club for the last round on every play. The square always belongs.
const last = Sidekick.pick([
  { club: 'rectangle', shapes: ['slanted', 'square', 'rectangle', 'rhombus', 'trapezoid'] },
  { club: 'rhombus', shapes: ['square', 'slanted', 'rhombus', 'rectangle', 'triangle'] },
  { club: 'quadrilateral', shapes: ['pentagon', 'square', 'slanted', 'triangle', 'rhombus'] },
]);

Sidekick.game({
  title: 'Shape Clubs',
  emoji: '🏠',
  premise: 'Each club has one rule. Let in every shape that fits it, whatever the shape is called.',
  outro: 'Clubs are open! A square has 4 square corners and 4 equal sides, so it is a rectangle and a rhombus too.',
  rounds: [
    club({ id: 'quadrilaterals', phase: 'guided', helped: true, club: 'quadrilateral', shapes: ['triangle', 'square', 'trapezoid', 'pentagon', 'rhombus'],
      say: 'The Quadrilateral Club lets in any shape with 4 straight sides. Drag in everyone who fits.',
      hints: ['Count the sides of each shape.', 'The square, the trapezoid and the rhombus each have 4 sides.'],
      win: 'Three quadrilaterals: a square, a trapezoid and a rhombus.' }),
    club({ id: 'rectangles', phase: 'guided', helped: true, club: 'rectangle', shapes: ['rhombus', 'rectangle', 'trapezoid', 'square'],
      say: 'The Rectangle Club rule: 4 sides and 4 square corners. Who gets in?',
      hints: ['Look at the corners, not the name.', 'The square has 4 square corners too.'],
      win: 'The rectangle and the square both fit. A square is a special rectangle.' }),
    club({ id: 'rhombuses', phase: 'guided', helped: true, club: 'rhombus', shapes: ['rectangle', 'rhombus', 'triangle', 'square'],
      say: 'The Rhombus Club rule: 4 sides, all the same length. Who gets in?',
      hints: ['Compare the side lengths of each shape.', 'A square has 4 equal sides.'],
      win: 'The rhombus and the square. A square is a special rhombus too.' }),
    club({ id: 'last-club', phase: 'solo', club: last.club, shapes: Sidekick.shuffle(last.shapes),
      say: 'The owl has gone home. Read the rule on the sign and let in every shape that fits.' }),
  ],
});
