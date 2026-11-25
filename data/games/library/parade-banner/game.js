// Parade Banner. Skill: put describing words in the usual order (a small red bag).
// The banner has lanes: what you think of it, then its size, then its color, then the thing.
// A color in front of a size makes a banner nobody would say out loud.
const LANES = { opinion: 'what you think', size: 'size', color: 'color' }, RANK = ['opinion', 'size', 'color'];

function banner(o) {
  const right = o.words.slice().sort((a, b) => RANK.indexOf(a.type) - RANK.indexOf(b.type)), n = right.length;
  const x0 = n === 3 ? 9 : 20, slotAt = (stage, word) => Number((stage.get('adj-' + word.w).zone || 'x9').slice(4));
  const put = (order) => order.map((word, i) => ({ drag: 'adj-' + word.w, to: 'slot' + i }));
  const size = right.find((word) => word.type === 'size'), hue = right.find((word) => word.type === 'color');
  const colorFirst = right.filter((word) => word.type === 'opinion').concat([hue, size]);
  return {
    id: o.id, phase: o.phase, scene: 'sky', height: 76, action: 'Announce!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ id: 'float', emoji: o.emoji, x: 50, y: 9, size: 11, float: true });
      stage.label({ text: 'a', x: x0 - 3.5, y: 31, size: 4.6 });
      right.forEach((word, i) => stage.zone({ id: 'slot' + i, x: x0 + i * 23.5, y: 25, w: 22, h: 12, look: 'slot', color: 'white', label: LANES[word.type], labelAt: 'top', showLabel: !!o.lanes, capacity: 1, swap: true, accepts: 'adj' }));
      stage.label({ text: o.noun, x: x0 + n * 23.5 + o.noun.length * 1.25 + 1, y: 31, size: 4.6 });
      stage.zone({ id: 'words', x: 10, y: 46, w: 80, h: 14, look: 'tray', label: 'Describing words', showLabel: false, accepts: 'adj' });
      o.words.forEach((word) => stage.sprite({ id: 'adj-' + word.w, text: word.w, size: 3.8, kind: 'adj', data: word, drag: true, zone: 'words', label: word.w }));
      // The world reacts: the announcer reads the banner exactly as it is built.
      const voice = o.voice ? stage.label({ text: '📣 a ... ' + o.noun, x: 50, y: 68, size: 4, card: true }) : null;
      if (voice) stage.on('change', () => voice.set('📣 a ' + right.map((word, i) => stage.get('slot' + i).texts()[0] || '...').join(' ') + ' ' + o.noun));
    },
    check: (stage) => right.every((word, i) => slotAt(stage, word) === i),
    solution: () => put(right),
    mistakes: [{ tag: 'color_before_size', when: (stage) => slotAt(stage, hue) < slotAt(stage, size) && slotAt(stage, size) < 9, steps: () => put(colorFirst),
      say: 'Say it out loud: a ' + hue.w + ' ' + size.w + ' ' + o.noun + ' sounds odd. Size comes before color: ' + size.w + ' ' + hue.w + '.' }],
    onWin(stage) { stage.get('float').pop(); },
  };
}

// A fresh float for the last round on every play.
const last = Sidekick.pick([
  { noun: 'bird', emoji: '🐦', words: [{ w: 'blue', type: 'color' }, { w: 'lovely', type: 'opinion' }, { w: 'little', type: 'size' }] },
  { noun: 'hat', emoji: '🎩', words: [{ w: 'purple', type: 'color' }, { w: 'tall', type: 'size' }, { w: 'funny', type: 'opinion' }] },
  { noun: 'kitten', emoji: '🐱', words: [{ w: 'small', type: 'size' }, { w: 'orange', type: 'color' }, { w: 'brave', type: 'opinion' }] },
]);

Sidekick.game({
  title: 'Parade Banner',
  emoji: '🎈',
  premise: 'Every parade float needs a banner. Put its describing words in the order people say them.',
  outro: 'What a parade! We say what we think first, then size, then color: a lovely little blue bird.',
  rounds: [
    banner({ id: 'balloon', phase: 'guided', lanes: true, voice: true, noun: 'balloon', emoji: '🎈', words: [{ w: 'yellow', type: 'color' }, { w: 'big', type: 'size' }],
      say: 'Drag each word into its lane on the banner. The announcer reads it back to you.',
      hints: ['Big tells the size. Yellow tells the color.', 'Size goes before color: a big yellow balloon.'],
      win: 'A big yellow balloon!' }),
    banner({ id: 'pig', phase: 'guided', lanes: true, voice: true, noun: 'pig', emoji: '🐷', words: [{ w: 'pink', type: 'color' }, { w: 'silly', type: 'opinion' }, { w: 'tiny', type: 'size' }],
      say: 'Three words now. Silly is what you think of the pig. Fill the lanes in order.',
      hints: ['What you think comes first.', 'A silly tiny pink pig.'],
      win: 'A silly tiny pink pig!' }),
    banner({ id: 'dragon', phase: 'guided', voice: true, noun: 'dragon', emoji: '🐉', words: [{ w: 'huge', type: 'size' }, { w: 'green', type: 'color' }, { w: 'scary', type: 'opinion' }],
      say: 'The lane names are gone, but the announcer still reads. Build the dragon banner.',
      hints: ['Same order: what you think, size, color.', 'A scary huge green dragon.'],
      win: 'A scary huge green dragon!' }),
    banner({ id: 'last-float', phase: 'solo', noun: last.noun, emoji: last.emoji, words: last.words,
      say: 'Last float. No lane names and no announcer. Put the three words in the order people say them.' }),
  ],
});
