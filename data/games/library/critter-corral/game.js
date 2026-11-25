// Critter Corral. Skill: name a shape by counting its sides, not by how it looks.
// Each critter orders a pen by name. The number of fence posts is the number of corners and
// sides, so five posts always build a pentagon, however lumpy the pen looks.
const NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon' };
const WOBBLE = [1, 0.82, 0.96, 0.78, 1, 0.86, 0.92, 0.8];
const corners = (n) => Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2, r = 44 * WOBBLE[i]; return (50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1); }).join(' ');
const posts = (stage, k) => stage.get('posts' + k).value;
const swapped = (n) => (n === 5 ? 6 : n === 6 ? 5 : n);

function corral(o) {
  const xs = o.pens.length === 1 ? [50] : [26, 74];
  const build = (values) => values.map((value, k) => ({ set: 'posts' + k, value }));
  const mixed = o.pens.map((pen) => swapped(pen.sides));
  return {
    id: o.id, phase: o.phase, scene: 'field', height: o.helped ? 82 : 74, action: 'Close the gate!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const note = o.helped ? stage.label({ text: '3 posts make 3 sides: a triangle', x: 50, y: 76, size: 3.6, card: true }) : null;
      o.pens.forEach((pen, k) => {
        stage.label({ text: '🪧 ' + NAMES[pen.sides] + ' pen', x: xs[k], y: 6, size: 3.4, card: true });
        const yard = stage.add('<svg viewBox="0 0 100 100"><polygon class="fence" points="' + corners(3) + '" fill="#cfeeb0" stroke="#8a5a3c" stroke-width="3.5" stroke-linejoin="round"/></svg>', { x: xs[k] - 21, y: 12, w: 42, h: 42 });
        stage.sprite({ emoji: pen.emoji, x: xs[k], y: 35, size: 8 });
        stage.stepper({ id: 'posts' + k, x: xs[k], y: 63, min: 3, max: 8, value: 3, format: (v) => v + ' posts' });
        // The world reacts: the fence is rebuilt with one side between each pair of posts.
        stage.on('change', () => {
          const n = posts(stage, k);
          yard.querySelector('.fence').setAttribute('points', corners(n));
          if (note) note.set(n + ' posts make ' + n + ' sides: ' + (NAMES[n] ? 'a ' + NAMES[n] : 'more than a hexagon'));
        });
      });
    },
    check: (stage) => o.pens.every((pen, k) => posts(stage, k) === pen.sides),
    solution: () => build(o.pens.map((pen) => pen.sides)),
    mistakes: mixed.join() === o.pens.map((pen) => pen.sides).join() ? [] : [{
      tag: 'pentagon_hexagon_mixup', when: (stage) => mixed.every((n, k) => posts(stage, k) === n), steps: () => build(mixed),
      say: 'Count the sides. A pentagon has 5 and a hexagon has 6. Penta means five, hexa means six.',
    }],
  };
}

// Fresh orders for the last round on every play.
const last = Sidekick.pick([
  [{ sides: 5, emoji: '🐷' }, { sides: 4, emoji: '🐔' }],
  [{ sides: 6, emoji: '🐑' }, { sides: 5, emoji: '🐐' }],
  [{ sides: 4, emoji: '🐮' }, { sides: 6, emoji: '🦆' }],
]);

Sidekick.game({
  title: 'Critter Corral',
  emoji: '🐑',
  premise: 'Every critter orders a pen by its shape name. Set the fence posts to build it.',
  outro: 'Gates closed! Count the sides: 3 triangle, 4 quadrilateral, 5 pentagon, 6 hexagon.',
  rounds: [
    corral({ id: 'quadrilateral', phase: 'guided', helped: true, pens: [{ sides: 4, emoji: '🐔' }],
      say: 'Hen wants a quadrilateral pen. Add fence posts and watch the pen change. Quad means four.',
      hints: ['Three posts make a triangle. Add one more.', 'Any shape with 4 sides is a quadrilateral.'],
      win: '4 posts, 4 sides. A quadrilateral!' }),
    corral({ id: 'pentagon', phase: 'guided', helped: true, pens: [{ sides: 5, emoji: '🐷' }],
      say: 'Pig wants a pentagon pen. How many posts does that take?',
      hints: ['Penta means five.', 'Set the posts to 5.'],
      win: '5 posts, 5 sides. A pentagon, even though it looks a bit lumpy.' }),
    corral({ id: 'hexagon', phase: 'guided', helped: true, pens: [{ sides: 6, emoji: '🐑' }],
      say: 'Sheep wants a hexagon pen. Count the sides as you add posts.',
      hints: ['Hexa means six.', 'Set the posts to 6.'],
      win: '6 posts, 6 sides. A hexagon!' }),
    corral({ id: 'two-pens', phase: 'solo', pens: last,
      say: 'Two orders at once, and the helper sign is gone. Build each pen to match its name.' }),
  ],
});
