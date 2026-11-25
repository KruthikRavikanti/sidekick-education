// Sentence Train. Skill: capitalize the first word of a sentence and the word I.
// Every word is a train car. Tapping a car switches its first letter between small and
// capital. The train only leaves when the engine word and every "I" are capitals.
const bare = (word) => word.replace(/[.?!]/g, '');
const cap = (word) => word[0].toUpperCase() + word.slice(1);

function train(o) {
  const words = o.sentence.split(' '), needs = words.map((word, i) => i === 0 || bare(word) === 'i');
  const isUp = (stage, i) => stage.get('w' + i).data.up;
  const state = (stage) => words.map((word, i) => isUp(stage, i));
  const taps = (wanted) => wanted.map((yes, i) => (yes ? { tap: 'w' + i } : null)).filter(Boolean);
  const firstOnly = words.map((word, i) => i === 0), every = words.map(() => true);
  const hasI = needs.some((yes, i) => yes && i > 0);
  const slip = (tag, wanted, say) => ({ tag, when: (stage) => state(stage).join() === wanted.join(), steps: () => taps(wanted), say });
  return {
    id: o.id, phase: o.phase, scene: 'meadow', height: 62, action: 'All aboard!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.block({ x: 0, y: 38, w: 100, h: 1.6, color: 'night', round: 0 });
      stage.sprite({ id: 'engine', emoji: '🚂', x: 8, y: 30, size: 10 });
      const signal = o.helped ? stage.label({ text: '', x: 50, y: 52, size: 3.8, card: true }) : null;
      const light = () => {
        if (!signal) return;
        const now = state(stage);
        signal.set(!now[0] ? '🔴 The first word needs a capital letter.' : needs.some((yes, i) => yes && !now[i]) ? '🔴 The word I is always a capital letter.'
          : now.some((up, i) => up && !needs[i]) ? '🟡 Only the first word and I need capitals here.' : '🟢 Ready to roll!');
      };
      words.forEach((word, i) => stage.sprite({
        id: 'w' + i, text: word, size: 3.8, x: 23 + i * 16, y: 30, label: 'word ' + bare(word), data: { up: false },
        tap(car) { car.data.up = !car.data.up; car.set({ text: car.data.up ? cap(word) : word }); car.pop(); light(); },
      }));
      light();
    },
    check: (stage) => state(stage).join() === needs.join(),
    solution: () => taps(needs),
    mistakes: [slip('capitalizes_every_word', every, 'Not every word needs a capital. Just the first word' + (hasI ? ' and the word I.' : '.'))]
      .concat(hasI ? [slip('misses_the_i', firstOnly, 'The first word is right. Now find the word I. It is always a capital letter.')] : []),
    onWin(stage) { stage.get('engine').pop(); },
  };
}

// A fresh sentence for the last round on every play. Each has an I that is not the first word.
const last = Sidekick.pick(['today i saw a frog.', 'mom and i play ball.', 'now i can hop.', 'can i pet him?']);

Sidekick.game({
  title: 'Sentence Train',
  emoji: '🚂',
  premise: 'The word train cannot leave until its capital letters are right. Tap a car to fix it.',
  outro: 'Choo choo! A sentence starts with a capital, and the word I is always a capital.',
  rounds: [
    train({ id: 'we-like-cake', phase: 'guided', helped: true, sentence: 'we like cake.',
      say: 'Tap a train car to change its first letter. The first word of a sentence needs a capital.',
      hints: ['The first car is the one next to the engine.', 'Tap we to make it We.'],
      win: 'We like cake. The first word has its capital!' }),
    train({ id: 'can-i-go', phase: 'guided', helped: true, sentence: 'can i go?',
      say: 'This train has the word i in it. Fix the first word, and fix i too.',
      hints: ['Tap can to make it Can.', 'The word I is always a capital, anywhere in a sentence.'],
      win: 'Can I go? Two capitals: the first word and I.' }),
    train({ id: 'my-cat-and-i', phase: 'guided', helped: true, sentence: 'my cat and i nap.',
      say: 'A longer train. Which cars need capitals? Watch the signal light.',
      hints: ['Start with the first word.', 'Then look for the word i near the end.'],
      win: 'My cat and I nap.' }),
    train({ id: 'last-train', phase: 'solo', sentence: last,
      say: 'The signal light is off. Fix every capital letter on this train by yourself.' }),
  ],
});
