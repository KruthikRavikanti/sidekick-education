// Sail Maker. Skill: a right triangle is half of a rectangle, so its area is half of base times height.
// Two matching triangle sails fit together into one rectangle of cloth. Counting the whole
// rectangle orders twice the cloth one sail needs.
function sail(o) {
  const whole = o.b * o.h, need = o.shape === 'rectangle' ? whole : whole / 2, typed = (stage) => stage.get('cloth').number;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'cloth', text: String(value) }], say });
  const W = 50, cell = Math.min(W / o.b, 34 / o.h), w = cell * o.b, h = cell * o.h;
  let lines = '';
  for (let i = 0; i <= o.b; i++) lines += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + o.h + '"/>';
  for (let j = 0; j <= o.h; j++) lines += '<line x1="0" y1="' + j + '" x2="' + o.b + '" y2="' + j + '"/>';
  const art = '<svg viewBox="-0.2 -0.2 ' + (o.b + 0.4) + ' ' + (o.h + 0.4) + '" preserveAspectRatio="none">' +
    (o.shape === 'rectangle' ? '<rect x="0" y="0" width="' + o.b + '" height="' + o.h + '" fill="#ffd45c"/>' : '<polygon points="0,' + o.h + ' ' + o.b + ',' + o.h + ' 0,0" fill="#ffd45c"/>' +
      (o.twin ? '<polygon points="' + o.b + ',0 0,0 ' + o.b + ',' + o.h + '" fill="#6ec3f4" fill-opacity="0.55"/>' : '')) +
    '<g stroke="#054a29" stroke-width="0.06" stroke-opacity="0.45">' + lines + '</g>' +
    (o.shape === 'rectangle' ? '' : '<polygon points="0,' + o.h + ' ' + o.b + ',' + o.h + ' 0,0" fill="none" stroke="#054a29" stroke-width="0.14"/>') + '</svg>';
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: 76, action: 'Cut the cloth!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '⛵ ' + o.b + ' wide, ' + o.h + ' tall', x: 31, y: 8, size: 4, card: true });
      stage.add(art, { x: 6 + (W - w) / 2, y: 16 + (34 - h) / 2, w, h });
      if (o.twin) stage.label({ text: 'Two sails make one ' + o.b + ' by ' + o.h + ' rectangle', x: 31, y: 58, size: 3.2, card: true });
      stage.label({ text: 'squares of cloth', x: 31, y: 67, size: 3.4, card: true });
      stage.keypad({ id: 'cloth', x: 80, y: 44 });
    },
    check: (stage) => typed(stage) === need,
    solution: () => [{ type: 'cloth', text: String(need) }],
    mistakes: o.shape === 'rectangle' ? [wrong('adds_the_sides', o.b + o.h, 'Count the squares inside: ' + o.h + ' rows of ' + o.b + '.')]
      : [wrong('forgets_to_halve', whole, o.b + ' × ' + o.h + ' is the whole rectangle. The sail is only half of it.'), wrong('adds_the_sides', o.b + o.h, 'Area counts the squares inside the sail, not the lengths of its sides.')],
  };
}

// A fresh sail for the last round on every play.
const last = Sidekick.pick([{ b: 6, h: 6 }, { b: 10, h: 4 }, { b: 8, h: 3 }, { b: 5, h: 4 }]);

Sidekick.game({
  title: 'Sail Maker',
  emoji: '⛵',
  premise: 'Cut cloth for triangle sails. Order exactly the squares of cloth each sail covers.',
  outro: 'Ready to sail! A right triangle is half a rectangle: area = base × height ÷ 2.',
  rounds: [
    sail({ id: 'whole-cloth', phase: 'guided', shape: 'rectangle', b: 6, h: 4,
      say: 'Start with a flag: a rectangle 6 wide and 4 tall. How many squares of cloth does it cover?',
      hints: ['Count one row, then the rows.', '4 rows of 6.'],
      win: '6 × 4 = 24 squares.' }),
    sail({ id: 'half-cloth', phase: 'guided', shape: 'triangle', twin: true, b: 6, h: 4,
      say: 'Now cut that flag corner to corner into two sails. How many squares does ONE sail cover?',
      hints: ['The two sails are the same size.', 'Half of 24.'],
      win: 'Half of 24 is 12 squares.' }),
    sail({ id: 'big-sail', phase: 'guided', shape: 'triangle', twin: true, b: 8, h: 5,
      say: 'A bigger sail: 8 wide and 5 tall. Its twin is shown in blue. How much cloth for one sail?',
      hints: ['The whole rectangle is 8 × 5 = 40.', 'One sail is half of that.'],
      win: '8 × 5 ÷ 2 = 20 squares.' }),
    sail({ id: 'last-sail', phase: 'solo', shape: 'triangle', b: last.b, h: last.h,
      say: 'No twin sail this time. This sail is ' + last.b + ' wide and ' + last.h + ' tall. How many squares of cloth?' }),
  ],
});
