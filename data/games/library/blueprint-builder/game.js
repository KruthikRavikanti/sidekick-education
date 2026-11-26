// Blueprint Builder. Skill: use the scale of a drawing to find a real length.
// On the blueprint every square stands for several real feet. A real wall is the drawn length
// times the scale. Dividing instead builds a wall shorter than the drawing itself.
function plan(o) {
  const real = o.d * o.k, typed = (stage) => stage.get('feet').number, cell = Math.min(5, 50 / o.d);
  const wrong = (tag, value, say) => ({ tag, when: (stage) => typed(stage) === value, steps: () => [{ type: 'feet', text: String(value) }], say });
  const slips = [wrong('copies_the_drawing', o.d, 'That is how many squares long the drawing is. Each square stands for ' + o.k + ' real feet.')];
  if (o.d % o.k === 0 && o.d / o.k !== o.d) slips.push(wrong('applies_the_scale_backwards', o.d / o.k, 'That divides by the scale. The real wall is bigger than the drawing: ' + o.d + ' squares of ' + o.k + ' feet each.'));
  return {
    id: o.id, phase: o.phase, scene: 'paper', height: 76, action: 'Build it!', say: o.say, hints: o.hints || [], win: o.win || '', mistakes: slips,
    setup(stage) {
      stage.label({ text: '📐 Scale: 1 square = ' + o.k + ' ft', x: 31, y: 8, size: 4, card: true });
      stage.block({ x: 4, y: 18, w: 54, h: 26, color: 'sky', opacity: 0.35, round: 2, border: 'sky' });
      for (let i = 0; i < o.d; i++) stage.block({ x: 6 + i * cell, y: 28, w: cell - 0.3, h: cell, color: 'white', round: 0.4, border: 'night', z: 2 });
      stage.block({ x: 6, y: 28 + cell, w: o.d * cell, h: 1.4, color: 'orange', round: 0, z: 3 });
      stage.label({ text: 'wall: ' + o.d + ' squares long', x: 31, y: 22.5, size: 3.2 });
      const site = stage.label({ text: '🧱 real wall: ? ft', x: 31, y: 56, size: 3.6, w: 54, card: true });
      stage.keypad({ id: 'feet', x: 80, y: 44 });
      // The world reacts: the builder says how that many feet would look back on the plan.
      if (o.helped) stage.on('change', () => { const n = typed(stage); site.set(!n ? '🧱 real wall: ? ft' : '🧱 ' + n + ' ft would be ' + Math.round((n / o.k) * 10) / 10 + ' squares on the plan'); });
      stage.data = { site };
    },
    check: (stage) => typed(stage) === real,
    solution: () => [{ type: 'feet', text: String(real) }],
    onWin(stage) { stage.data.site.set('🧱 real wall: ' + real + ' ft'); },
  };
}

// A fresh blueprint for the last round on every play.
const last = Sidekick.pick([{ k: 3, d: 9 }, { k: 4, d: 8 }, { k: 5, d: 10 }, { k: 6, d: 12 }]);

Sidekick.game({
  title: 'Blueprint Builder',
  emoji: '🏗️',
  premise: 'The blueprint is small and the building is big. Use the scale to find each real length.',
  outro: 'Built to plan! Real length = drawing length × scale.',
  rounds: [
    plan({ id: 'two-feet', phase: 'guided', helped: true, k: 2, d: 5,
      say: 'On this blueprint 1 square is 2 real feet. The wall is 5 squares long. How many feet is the real wall?',
      hints: ['Each square is 2 feet.', '5 squares × 2 feet.'],
      win: '5 × 2 = 10 feet.' }),
    plan({ id: 'four-feet', phase: 'guided', helped: true, k: 4, d: 6,
      say: 'A new scale: 1 square is 4 feet. This wall is 6 squares on the plan.',
      hints: ['The real wall is much longer than the drawing.', '6 × 4.'],
      win: '6 × 4 = 24 feet.' }),
    plan({ id: 'five-feet', phase: 'guided', helped: true, k: 5, d: 8,
      say: '1 square is 5 feet, and the wall is 8 squares long.',
      hints: ['Count by fives, eight times.', '8 × 5.'],
      win: '8 × 5 = 40 feet.' }),
    plan({ id: 'last-plan', phase: 'solo', k: last.k, d: last.d,
      say: 'The builder is on a break. 1 square is ' + last.k + ' feet and the wall is ' + last.d + ' squares. How long is the real wall?' }),
  ],
});
