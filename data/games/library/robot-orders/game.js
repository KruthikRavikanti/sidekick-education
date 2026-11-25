// Robot Orders. Skill: know what common prefixes and suffixes mean.
// The robot does exactly what the word says. Snapping un-, re-, pre-, -ful or -less onto a
// base word changes the order, so a real word with the wrong meaning makes the robot do the wrong thing.
const TILES = { un: 'un-', re: 're-', pre: 'pre-', ful: '-ful', less: '-less' };
const SIDE = { un: 'front', re: 'front', pre: 'front', ful: 'back', less: 'back' };

function order(o) {
  const on = (stage, side) => { const tile = stage.get(side).sprites[0]; return tile ? tile.data.part : ''; };
  const built = (stage) => [on(stage, 'front'), on(stage, 'back')].filter(Boolean).join('+');
  const snap = (part) => [{ drag: 't-' + part, to: SIDE[part] }];
  return {
    id: o.id, phase: o.phase, scene: 'space', height: 82, action: 'Go, Robo!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '📋 ' + o.want, x: 50, y: 9, size: 3.6, w: 92, card: true });
      stage.zone({ id: 'front', x: 12, y: 25, w: 26, h: 13, look: 'slot', color: 'sky', label: 'front of the word', showLabel: false, capacity: 1, swap: true, accepts: 'prefix' });
      stage.label({ text: o.base, x: 50, y: 31.5, size: 6.4, card: true });
      stage.zone({ id: 'back', x: 62, y: 25, w: 26, h: 13, look: 'slot', color: 'sun', label: 'end of the word', showLabel: false, capacity: 1, swap: true, accepts: 'suffix' });
      stage.sprite({ id: 'robo', emoji: '🤖', x: 10, y: 51, size: 11 });
      const screen = o.helped ? stage.label({ text: 'Robo reads: ' + o.base, x: 57, y: 51, size: 3.6, w: 72, card: true }) : null;
      stage.zone({ id: 'parts', x: 4, y: 64, w: 92, h: 14, look: 'tray', label: 'Word parts', showLabel: false, accepts: ['prefix', 'suffix'] });
      o.tiles.forEach((part) => stage.sprite({ id: 't-' + part, text: TILES[part], size: 3.8, color: SIDE[part] === 'front' ? 'sky' : 'orange', kind: SIDE[part] === 'front' ? 'prefix' : 'suffix', data: { part }, drag: true, zone: 'parts', label: TILES[part] }));
      // The world reacts: Robo says what the word it is holding means.
      if (screen) stage.on('change', () => screen.set(!built(stage) ? 'Robo reads: ' + o.base : o.means[built(stage)] || '🤖 ? Robo does not know that word.'));
    },
    check: (stage) => built(stage) === o.answer,
    solution: () => snap(o.answer),
    mistakes: o.trap ? [{ tag: 'real_word_wrong_meaning', when: (stage) => built(stage) === o.trap, steps: () => snap(o.trap), say: o.trapSay || '' }] : [],
    onWin(stage) { stage.get('robo').pop(); },
  };
}

// A fresh order for the last round. Each one has a real word that means something else.
const last = Sidekick.pick([
  { base: 'heat', want: 'Warm up the oven BEFORE the cake goes in.', answer: 'pre', trap: 're' },
  { base: 'fear', want: 'Robo walks into the dark cave WITHOUT any fear.', answer: 'less', trap: 'ful' },
  { base: 'pack', want: 'The trip is over. Do the OPPOSITE of pack the bag.', answer: 'un', trap: 're' },
]);

Sidekick.game({
  title: 'Robot Orders',
  emoji: '🤖',
  premise: 'Robo does exactly what the word says. Snap on a word part to make the right order.',
  outro: 'Order complete! un- means not or opposite, re- again, pre- before, -ful full of, -less without.',
  rounds: [
    order({ id: 'unlock', phase: 'guided', helped: true, base: 'lock', want: 'The door is stuck shut. Robo must do the OPPOSITE of lock.', answer: 'un', trap: 're', tiles: ['re', 'un'],
      means: { un: '🔓 unlock: the opposite of lock', re: '🔒 relock: lock it again' },
      trapSay: 'Relock means lock again. The order asks for the opposite of lock.',
      say: 'Drag a word part onto the front of lock. Robo tells you what the new word means.',
      hints: ['Try both parts and read what Robo says.', 'un- means not, or the opposite.'],
      win: 'Unlock: the opposite of lock.' }),
    order({ id: 'repaint', phase: 'guided', helped: true, base: 'paint', want: 'The fence is faded. Robo must paint it AGAIN.', answer: 're', tiles: ['un', 'ful', 're'],
      means: { re: '🎨 repaint: paint it again' },
      say: 'Three parts to choose from. Which one makes a word that means paint again?',
      hints: ['Some parts make words Robo does not know.', 're- means again.'],
      win: 'Repaint: paint again.' }),
    order({ id: 'hopeful', phase: 'guided', helped: true, base: 'hope', want: 'Robo feels FULL OF hope about the big race.', answer: 'ful', trap: 'less', tiles: ['less', 'un', 'ful'],
      means: { ful: '🌈 hopeful: full of hope', less: '🌧️ hopeless: without hope' },
      trapSay: 'Hopeless means without hope. The order says full of hope.',
      say: 'Some word parts snap onto the END of a word. Build the word that fits the order.',
      hints: ['-less means without.', '-ful means full of.'],
      win: 'Hopeful: full of hope.' }),
    order({ id: 'last-order', phase: 'solo', base: last.base, want: last.want, answer: last.answer, trap: last.trap, tiles: ['less', 'un', 'pre', 'ful', 're'],
      say: 'Robo will not explain this time. Read the order and snap on the one part that fits.' }),
  ],
});
