// Square Garden. Skill: estimate a square root by finding the whole numbers it lies between.
// The square root of 50 is the side of a square garden that uses 50 tiles. A side of 7 uses 49
// and a side of 8 uses 64, so the root is between 7 and 8. Half of 50 is nowhere near.
function garden(o) {
  const low = Math.floor(Math.sqrt(o.area)), side = (stage) => stage.get('side').value, half = Math.floor(o.area / 2);
  const wrong = (tag, value, say) => ({ tag, when: (stage) => side(stage) === value, steps: () => [{ set: 'side', value }], say });
  return {
    id: o.id, phase: o.phase, scene: 'field', height: 74, action: 'Plant!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🌻 ' + o.area + ' tiles. √' + o.area + ' is between ? and ?', x: 50, y: 8, size: 4, card: true });
      const bed = stage.block({ x: 8, y: 16, w: 4, h: 4, color: '#8a5a3c', round: 1, border: 'night' });
      const note = stage.label({ text: '', x: 76, y: 28, size: 3.6, w: 40, card: true });
      stage.stepper({ id: 'side', x: 76, y: 50, min: 1, max: 50, value: 1, format: (v) => 'side ' + v });
      stage.label({ text: 'Biggest whole side that fits', x: 76, y: 62, size: 3 });
      // The world reacts: the garden is laid out and its tile count compared with the pile.
      const lay = () => {
        const s = side(stage), drawn = Math.min(44, s * 4);
        bed.set({ w: drawn, h: drawn });
        note.set(!o.helped ? 'side ' + s : s + ' × ' + s + ' = ' + s * s + (s * s > o.area ? '\nToo many tiles!' : (s + 1) * (s + 1) <= o.area ? '\nTiles left over. Go bigger.' : '\nFits. One more would not.'));
      };
      lay(); stage.on('change', lay);
    },
    check: (stage) => side(stage) === low,
    solution: () => [{ set: 'side', value: low }],
    mistakes: [wrong('halves_the_number', half, 'Half of ' + o.area + ' is ' + half + ', but ' + half + ' × ' + half + ' is ' + half * half + '. A square root asks what number times ITSELF gives ' + o.area + '.'),
      wrong('rounds_up_past_the_area', low + 1, (low + 1) + ' × ' + (low + 1) + ' is ' + (low + 1) * (low + 1) + ', more tiles than there are. The side is a little less than ' + (low + 1) + '.')],
  };
}

// A fresh pile of tiles for the last round on every play.
const last = Sidekick.pick([30, 70, 45, 90, 20]);

Sidekick.game({
  title: 'Square Garden',
  emoji: '🌻',
  premise: 'Lay a square garden from a pile of tiles. Find the biggest whole side that the pile can cover.',
  outro: 'Planted! To estimate a square root, find the two perfect squares it sits between.',
  rounds: [
    garden({ id: 'ten', phase: 'guided', helped: true, area: 10,
      say: 'You have 10 tiles. Grow the square. What is the biggest whole side you can fully cover?',
      hints: ['A side of 3 uses 9 tiles.', 'A side of 4 would need 16.'],
      win: '3 × 3 = 9 and 4 × 4 = 16, so √10 is between 3 and 4.' }),
    garden({ id: 'fifty', phase: 'guided', helped: true, area: 50,
      say: 'Now 50 tiles. Find the biggest whole side that fits.',
      hints: ['Try 7: 7 × 7 = 49.', '8 × 8 = 64 is too many.'],
      win: '√50 is between 7 and 8, and very close to 7.' }),
    garden({ id: 'eighty', phase: 'guided', helped: true, area: 80,
      say: '80 tiles this time.',
      hints: ['8 × 8 = 64.', '9 × 9 = 81 is just over.'],
      win: '√80 is between 8 and 9, almost 9.' }),
    garden({ id: 'last-garden', phase: 'solo', area: last,
      say: 'The tile counter is off. You have ' + last + ' tiles. Set the biggest whole side that fits.' }),
  ],
});
