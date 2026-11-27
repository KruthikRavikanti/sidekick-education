// Chart Hopper. Skill: find 10 more than a two-digit number without counting by ones.
// The numbers sit in rows of ten, so 10 more is always one row straight down. Adding 1
// lands on the very next tile instead, and Roo has not moved a row at all.
const tileX = (n, first) => 5.5 + ((n - first) % 10) * 9.9;
const tileY = (n, first) => 28 + Math.floor((n - first) / 10) * 11;

function hop(o) {
  const target = o.start + 10, first = o.first;
  const picked = (stage) => stage.get('n' + o.start).data.at;
  return {
    id: o.id, phase: o.phase, scene: 'sand', height: 62, action: 'Hop!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🦘 10 more than ' + o.start, x: 50, y: 9, size: 6, card: true });
      const tiles = {};
      for (let n = first; n < first + 30; n++) {
        tiles[n] = stage.sprite({
          id: 'n' + n, text: o.hidden && n !== o.start ? '·' : String(n), size: 3.6, x: tileX(n, first), y: tileY(n, first),
          color: n === o.start ? 'orange' : 'forest', label: 'number ' + n, data: { at: null },
          tap(tile) {
            const before = tiles[o.start].data.at;
            if (before !== null) tiles[before].badge(before === o.start ? '🦘' : '');
            tiles[o.start].data.at = n;
            tile.badge('📍').pop();
          },
        });
      }
      tiles[o.start].badge('🦘');
    },
    check: (stage) => picked(stage) === target,
    solution: () => [{ tap: 'n' + target }],
    mistakes: [{
      tag: 'adds_one', when: (stage) => picked(stage) === o.start + 1, steps: () => [{ tap: 'n' + (o.start + 1) }],
      say: 'That is 1 more. Roo needs 10 more: hop one whole row down.',
    }],
  };
}

// A fresh starting number for the last round. None end in 0 or 9, so 1 more stays in the same row.
const start = Sidekick.pick([52, 63, 28, 75, 34, 46]);

Sidekick.game({
  title: 'Chart Hopper',
  emoji: '🦘',
  premise: 'Roo hops ten at a time. Tap the tile where each big hop lands.',
  outro: 'Big hops! 10 more is one row down: the tens go up by one and the ones stay the same.',
  rounds: [
    hop({ id: 'from-34', phase: 'guided', start: 34, first: 31,
      say: 'Roo is on 34 and hops 10 at once. Tap the number that is 10 more than 34.',
      hints: ['Count on 10 from 34 and see where you land.', 'Look straight down from 34. One row down is 10 more.'],
      win: '34 and 10 more is 44. One row down!' }),
    hop({ id: 'from-47', phase: 'guided', start: 47, first: 41,
      say: 'Now Roo is on 47. Where does a hop of 10 land?',
      hints: ['Stay in the same column and go down one row.', 'The ones stay 7. The tens go from 4 to 5.'],
      win: '47 and 10 more is 57.' }),
    hop({ id: 'from-26', phase: 'guided', start: 26, first: 21,
      say: 'One more practice hop. What is 10 more than 26?',
      hints: ['No counting needed. Which tile is right under 26?', 'Change the tens: 2 tens becomes 3 tens.'],
      win: '26 and 10 more is 36.' }),
    hop({ id: 'hidden-chart', phase: 'solo', start, first: Math.floor((start - 1) / 10) * 10 + 1, hidden: true,
      say: 'The numbers are hiding! Roo is on ' + start + '. Tap the tile where 10 more lives.' }),
  ],
});
