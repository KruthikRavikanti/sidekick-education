// Scatter Garden. Skill: describe the association in a scatter plot as positive, negative or none.
// Every dot is one plant: water along the bottom, height up the side. If taller plants tend to
// be the watered ones, that is a positive trend even when the dots are loosely spread.
const N = [3, -5, 6, -2, 4, -6, 1, 5, -4, 2, -3, 6], R = [5, -6, 2, -1, -5, 6, -3, 4, 0, -4, 3, -2];
const Y = {
  strongUp: (i) => 84 - i * 6.3 + N[i] * 0.8, weakUp: (i) => 74 - i * 4.4 + N[i] * 3.6,
  strongDown: (i) => 16 + i * 6.3 + N[i] * 0.8, weakDown: (i) => 26 + i * 4.4 + N[i] * 3.6, none: (i) => 50 + R[i] * 6,
};
const KIND = { strongUp: 'up', weakUp: 'up', strongDown: 'down', weakDown: 'down', none: 'none' };
const SAY = { up: 'More of one comes with more of the other, even if loosely.', down: 'As one goes up the other tends to go down.', none: 'No tilt at all. The dots show no trend.' };
const plot = (key) => '<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="8" fill="#ffffff" stroke="#054a29" stroke-width="3"/><path d="M10,8 V90 H94" fill="none" stroke="#054a29" stroke-width="2.5"/>' +
  N.map((v, i) => '<circle cx="' + (15 + i * 6.6) + '" cy="' + Y[key](i).toFixed(1) + '" r="3.2" fill="#f79256"/>').join('') + '</svg>';

function beds(o) {
  const send = (where) => o.keys.map((key, i) => ({ drag: 'plot' + i, to: where(key) }));
  const all = (stage, where) => o.keys.every((key, i) => stage.get('plot' + i).zone === where(key));
  const loose = (key) => (key.startsWith('weak') ? 'none' : KIND[key]);
  return {
    id: o.id, phase: o.phase, scene: 'field', height: 84, action: 'Sort!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const sign = stage.label({ text: o.helped ? '🌱 Do the dots tilt up, tilt down, or neither?' : '🌱', x: 50, y: 5, size: 3.3, w: 92, card: true });
      [['up', '↗ Positive'], ['down', '↘ Negative'], ['none', '· No trend']].forEach(([id, label], i) => stage.zone({ id, x: 3 + i * 32, y: 16, w: 30, h: 26, look: 'box', color: ['mint', 'coral', 'sky'][i], label, labelAt: 'top', accepts: 'plot' }));
      stage.zone({ id: 'shed', x: 4, y: 50, w: 92, h: 30, look: 'tray', label: 'Scatter plots', showLabel: false, accepts: 'plot' });
      o.keys.forEach((key, i) => stage.sprite({ id: 'plot' + i, svg: plot(key), w: 14, kind: 'plot', drag: true, zone: 'shed', label: 'scatter plot ' + (i + 1) }));
      // The world reacts: the gardener describes the trend of a plot that was put in another bed.
      if (o.helped) stage.on('change', () => {
        const off = o.keys.find((key, i) => ['up', 'down', 'none'].includes(stage.get('plot' + i).zone) && stage.get('plot' + i).zone !== KIND[key]);
        sign.set(off ? '🌱 Look again at that one. ' + SAY[KIND[off]] : '🌱 Do the dots tilt up, tilt down, or neither?');
      });
    },
    check: (stage) => all(stage, (key) => KIND[key]),
    solution: () => send((key) => KIND[key]),
    mistakes: o.keys.some((key) => key.startsWith('weak')) ? [{ tag: 'calls_weak_association_none', when: (stage) => all(stage, loose), steps: () => send(loose),
      say: 'Spread out dots can still tilt. Squint at each cloud: does it lean up or down overall?' }] : [],
  };
}

// Fresh plots for the last round on every play.
const last = Sidekick.pick([['weakUp', 'strongDown', 'none', 'weakDown'], ['none', 'weakDown', 'strongUp', 'weakUp']]);

Sidekick.game({
  title: 'Scatter Garden',
  emoji: '🌱',
  premise: 'Each dot is a plant: water along the bottom, height up the side. Sort the plots by their trend.',
  outro: 'Sorted! Dots that lean up show a positive association, lean down a negative one, and no lean means none.',
  rounds: [
    beds({ id: 'two-plots', phase: 'guided', helped: true, keys: ['strongUp', 'strongDown'],
      say: 'Two scatter plots. In one, the dots climb. In the other, they fall. Drag each to its bed.',
      hints: ['Read the dots from left to right.', 'Climbing is positive. Falling is negative.'],
      win: 'Up is positive. Down is negative.' }),
    beds({ id: 'three-plots', phase: 'guided', helped: true, keys: ['none', 'strongUp', 'weakDown'],
      say: 'Three plots. One has no trend at all, and one has a loose trend. Sort them.',
      hints: ['A loose cloud can still lean one way.', 'The scattered one that leans down is still negative.'],
      win: 'A loose lean down is still a negative association.' }),
    beds({ id: 'four-plots', phase: 'guided', helped: true, keys: ['weakUp', 'none', 'strongDown', 'strongUp'],
      say: 'Four plots. Careful with the loose ones.',
      hints: ['Compare the left half of the dots with the right half.', 'One loose cloud leans up. One truly has no lean.'],
      win: 'Two positive, one negative, one with no trend.' }),
    beds({ id: 'last-beds', phase: 'solo', keys: last,
      say: 'The gardener has gone home. Sort these four plots by their trend.' }),
  ],
});
