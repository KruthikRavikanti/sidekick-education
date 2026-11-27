// Rhyme Pond. Skill: hear which words rhyme.
// A frog can only land on a lily pad whose word sounds the same at the END. Each frog also
// sees a pad that starts with its sound, which is the usual mix-up.
const PIC = { cat: '🐱', hat: '🎩', can: '🥫', dog: '🐶', log: '🪵', duck: '🦆', bug: '🐛', mug: '☕', bus: '🚌', bee: '🐝', tree: '🌳', bat: '🦇',
  fox: '🦊', box: '📦', fish: '🐟', star: '⭐', car: '🚗', sun: '☀️', goat: '🐐', boat: '⛵', gift: '🎁', moon: '🌙', spoon: '🥄', mouse: '🐭',
  snake: '🐍', cake: '🎂', sock: '🧦' };
const show = (word) => PIC[word] + ' ' + word;

// Each frog is [its word, the pad that rhymes, the pad that only starts the same].
function pond(o) {
  const rows = Math.ceil(o.pads.length / 3), bankY = rows * 22 + 12;
  const sit = (key) => o.frogs.map((frog) => ({ drag: 'frog-' + frog[0], to: 'pad-' + frog[key] }));
  const allOn = (stage, key) => o.frogs.every((frog) => stage.get('frog-' + frog[0]).zone === 'pad-' + frog[key]);
  const first = o.frogs[0];
  return {
    id: o.id, phase: o.phase, scene: 'ocean', height: bankY + 17, action: 'Hop!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.pads.forEach((word, i) => stage.zone({ id: 'pad-' + word, x: 4 + (i % 3) * 32, y: 9 + Math.floor(i / 3) * 22, w: 28, h: 13, look: 'slot', color: 'leaf', label: show(word), labelAt: 'top', capacity: 1, swap: true, accepts: 'frog' }));
      stage.zone({ id: 'bank', x: 4, y: bankY, w: 92, h: 14, look: 'tray', label: 'The bank', showLabel: false, accepts: 'frog' });
      o.frogs.forEach((frog) => stage.sprite({ id: 'frog-' + frog[0], text: show(frog[0]), size: 3.6, kind: 'frog', badge: '🐸', drag: true, zone: 'bank', label: 'frog with ' + frog[0] }));
    },
    check: (stage) => allOn(stage, 1),
    solution: () => sit(1),
    mistakes: [{
      tag: 'matches_first_sound', when: (stage) => allOn(stage, 2), steps: () => sit(2),
      say: first[2] + ' starts like ' + first[0] + ', but it does not rhyme. Rhymes sound the same at the end: ' + first[0] + ', ' + first[1] + '.',
    }],
  };
}

// Fresh frogs and pads for the last round on every play.
const last = Sidekick.pick([
  [['bug', 'mug', 'bus'], ['fox', 'box', 'fish'], ['goat', 'boat', 'gift']],
  [['moon', 'spoon', 'mouse'], ['snake', 'cake', 'sock'], ['cat', 'hat', 'can']],
]);
const lastPads = Sidekick.shuffle(last.map((frog) => frog[1]).concat(last.map((frog) => frog[2])));

Sidekick.game({
  title: 'Rhyme Pond',
  emoji: '🐸',
  premise: 'Each frog can only land on a lily pad that rhymes with its word.',
  outro: 'Splash! Rhyming words sound the same at the end, like cat and hat.',
  rounds: [
    pond({ id: 'cat', phase: 'guided', frogs: [['cat', 'hat', 'can']], pads: ['can', 'hat', 'sun'],
      say: 'This frog has the word cat. Say each pad out loud. Drag the frog to the pad that rhymes with cat.',
      hints: ['Listen to the end of the word: c-at.', 'Cat, hat. They both end in at.'],
      win: 'Cat and hat rhyme!' }),
    pond({ id: 'dog', phase: 'guided', frogs: [['dog', 'log', 'duck']], pads: ['log', 'cake', 'duck'],
      say: 'A new frog with the word dog. Which pad sounds the same at the end?',
      hints: ['Dog ends in og.', 'Dog, log.'],
      win: 'Dog and log rhyme!' }),
    pond({ id: 'two-frogs', phase: 'guided', frogs: [['bee', 'tree', 'bat'], ['star', 'car', 'sun']], pads: ['sun', 'tree', 'car', 'bat'],
      say: 'Two frogs now. Send each one to the pad that rhymes with its word.',
      hints: ['Bee ends in ee. Star ends in ar.', 'Bee, tree. Star, car.'],
      win: 'Bee and tree. Star and car.' }),
    pond({ id: 'three-frogs', phase: 'solo', frogs: last, pads: lastPads,
      say: 'Three frogs and six pads. Land every frog on its rhyme.' }),
  ],
});
