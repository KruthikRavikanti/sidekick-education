// Move Makers. Skill: slides, flips and turns keep every length the same.
// A key has to stay exactly its size to fit its lock. Sliding, flipping and turning only change
// where it is or which way it faces. Stretching and shrinking are the moves that change lengths.
const MOVES = {
  slide: ['➡️ Slide it\n5 to the right', true, 'After a slide the key is still 6 cm long.'], turn: ['🔄 Turn it\na quarter turn', true, 'After a turn the key is still 6 cm long. Only its direction changed.'],
  flip: ['🪞 Flip it\nover a line', true, 'After a flip the key is still 6 cm long. It is a mirror image.'], stretch: ['↔️ Stretch it\nto double', false, 'Stretched, the key is 12 cm long. It no longer fits.'],
  shrink: ['🤏 Shrink it\nto half', false, 'Shrunk, the key is 3 cm long. It no longer fits.'], halfTurn: ['🔃 Turn it\nhalf way round', true, 'After a half turn the key is still 6 cm long.'],
  slideUp: ['⬆️ Slide it\n3 up', true, 'After a slide the key is still 6 cm long.'], triple: ['⤢ Make it 3\ntimes as big', false, 'Three times as big, the key is 18 cm long.'],
};

function shop(o) {
  const cards = o.keys.map((key) => MOVES[key]);
  const send = (where) => cards.map((card, i) => ({ drag: 'move' + i, to: where(card, o.keys[i]) }));
  const all = (stage, where) => cards.every((card, i) => stage.get('move' + i).zone === where(card, o.keys[i]));
  const home = (card) => (card[1] ? 'same' : 'changed'), fear = (card, key) => (card[1] && !key.toLowerCase().includes('turn') && key !== 'flip' ? 'same' : 'changed');
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 86, action: 'Try the lock!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const ruler = stage.label({ text: o.helped ? '🗝️ The key is 6 cm long. Which moves keep it that way?' : '🗝️ 6 cm', x: 50, y: 5, size: 3.3, w: 92, card: true });
      stage.zone({ id: 'same', x: 3, y: 16, w: 45, h: 30, look: 'box', color: 'mint', label: '🔒 Still fits: same size', labelAt: 'top', accepts: 'move' });
      stage.zone({ id: 'changed', x: 52, y: 16, w: 45, h: 30, look: 'box', color: 'coral', label: '🚫 Size changed', labelAt: 'top', accepts: 'move' });
      stage.zone({ id: 'bench', x: 4, y: 53, w: 92, h: 29, look: 'tray', label: 'Moves', showLabel: false, accepts: 'move' });
      cards.forEach((card, i) => stage.sprite({ id: 'move' + i, text: card[0], size: 2.9, kind: 'move', drag: true, zone: 'bench', label: card[0].replace('\n', ' ') }));
      // The world reacts: the ruler measures the key after a move that was filed in the other box.
      if (o.helped) stage.on('change', () => {
        const off = cards.find((card, i) => ['same', 'changed'].includes(stage.get('move' + i).zone) && stage.get('move' + i).zone !== home(card));
        ruler.set(off ? '📏 ' + off[2] : '🗝️ The key is 6 cm long. Which moves keep it that way?');
      });
    },
    check: (stage) => all(stage, home),
    solution: () => send(home),
    mistakes: !o.keys.some((key) => key.toLowerCase().includes('turn') || key === 'flip') ? [] : [{ tag: 'thinks_turns_change_lengths', when: (stage) => all(stage, fear), steps: () => send(fear),
      say: 'Measure the key after a turn or a flip. It faces a new way, but every length is the same.' }],
  };
}

// Fresh moves for the last round on every play.
const last = Sidekick.pick([['halfTurn', 'triple', 'slideUp', 'flip'], ['shrink', 'turn', 'flip', 'slideUp']]);

Sidekick.game({
  title: 'Move Makers',
  emoji: '🗝️',
  premise: 'The key must stay exactly its size to fit the lock. Sort the moves that keep it that way.',
  outro: 'Click! Slides, flips and turns are rigid motions. They never change a length.',
  rounds: [
    shop({ id: 'two-moves', phase: 'guided', helped: true, keys: ['slide', 'stretch'],
      say: 'The key is 6 cm long. One move keeps its size and one changes it. Drag each move to its box.',
      hints: ['Sliding only changes where the key is.', 'Stretching makes it longer.'],
      win: 'A slide keeps the size. A stretch does not.' }),
    shop({ id: 'three-moves', phase: 'guided', helped: true, keys: ['turn', 'shrink', 'flip'],
      say: 'Three moves. What happens to the length of the key when it is turned or flipped?',
      hints: ['Turn a pencil around. Is it any longer?', 'Only shrinking changes the length.'],
      win: 'Turns and flips keep every length. Shrinking does not.' }),
    shop({ id: 'four-moves', phase: 'guided', helped: true, keys: ['stretch', 'halfTurn', 'slide', 'flip'],
      say: 'Four moves. Three of them keep the key the same size.',
      hints: ['Slide, flip and turn only change position or direction.', 'The stretch is the one that changes size.'],
      win: 'Three rigid motions and one stretch.' }),
    shop({ id: 'last-shop', phase: 'solo', keys: last,
      say: 'The ruler is put away. Sort these four moves: same size, or size changed?' }),
  ],
});
