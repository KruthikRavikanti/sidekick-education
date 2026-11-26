// Word Drums. Skill: break a long word into syllables to read it.
// Every drum beat is one syllable, and every syllable has one vowel SOUND. Counting vowel
// letters gives too many beats, because a silent e or a team like "io" makes no extra sound.
const letters = (word) => word.split('').filter((c) => 'aeiou'.includes(c)).length;
const beatsText = (v) => v + (v === 1 ? ' beat' : ' beats');

function drum(o) {
  const words = o.words.map((parts) => ({ parts, word: parts.join(''), vowels: letters(parts.join('')) }));
  const beats = (stage, k) => stage.get('beats' + k).value, single = words.length === 1;
  const play = (pick) => words.map((w, k) => ({ set: 'beats' + k, value: pick(w) }));
  const all = (stage, pick) => words.every((w, k) => beats(stage, k) === pick(w));
  const tricky = words.some((w) => w.vowels !== w.parts.length);
  return {
    id: o.id, phase: o.phase, scene: 'candy', height: single ? 50 : words.length * 19 + 8, action: 'Play it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      words.forEach((w, k) => {
        const y = single ? 16 : 13 + k * 19;
        stage.label({ text: w.word, x: 28, y: y - (o.helped ? 2 : 0), size: 4.8, card: true });
        stage.stepper({ id: 'beats' + k, x: 76, y, min: 1, max: 7, value: 1, format: beatsText });
        if (!o.helped) return;
        // The world reacts: the word is chopped into as many beats as the dial says.
        const chopped = stage.label({ text: '🥁', x: 28, y: y + 7, size: 3.8 });
        const note = stage.label({ text: 'Set the beats. Clap the word as you go.', x: 50, y: y + 22, size: 3.3, w: 92, card: true });
        stage.on('change', () => {
          const v = beats(stage, k);
          chopped.set('🥁 ' + (v === w.parts.length ? w.parts.join(' · ') : Array.from({ length: v }, () => '?').join(' · ')));
          note.set(v === w.parts.length ? 'Each beat has one vowel sound.' : v === w.vowels ? 'That counts vowel letters. Some letters make no sound of their own.' : 'Clap the word slowly and count the claps.');
        });
      });
    },
    check: (stage) => all(stage, (w) => w.parts.length),
    solution: () => play((w) => w.parts.length),
    mistakes: tricky ? [{ tag: 'counts_vowel_letters', when: (stage) => all(stage, (w) => w.vowels), steps: () => play((w) => w.vowels),
      say: 'That is the number of vowel letters. Count vowel sounds: a silent e, or two letters making one sound, add no beat.' }] : [],
  };
}

// Fresh words for the last round on every play. In each, vowel letters and vowel sounds differ.
const last = Sidekick.pick([
  [['cel', 'e', 'brate'], ['ed', 'u', 'ca', 'tion'], ['mul', 'ti', 'pli', 'ca', 'tion']],
  [['cal', 'cu', 'late'], ['tem', 'per', 'a', 'ture'], ['con', 'ver', 'sa', 'tion']],
  [['i', 'mag', 'ine'], ['va', 'ca', 'tion'], ['re', 'frig', 'er', 'ate']],
]);

Sidekick.game({
  title: 'Word Drums',
  emoji: '🥁',
  premise: 'Every long word has a beat. Set the drum to the number of syllables and play it.',
  outro: 'What a rhythm! Break a long word into beats, one vowel sound in each, and it is easy to read.',
  rounds: [
    drum({ id: 'fantastic', phase: 'guided', helped: true, words: [['fan', 'tas', 'tic']],
      say: 'Clap the word fantastic. Set the drum to the number of beats and watch the word split.',
      hints: ['Say it slowly: fan, tas, tic.', 'Three claps, three beats.'],
      win: 'Fan · tas · tic. Three beats.' }),
    drum({ id: 'adventure', phase: 'guided', helped: true, words: [['ad', 'ven', 'ture']],
      say: 'Now adventure. Careful: it has four vowel letters. How many beats do you hear?',
      hints: ['The e at the end is silent.', 'Ad, ven, ture. Three beats.'],
      win: 'Ad · ven · ture. The last e makes no sound of its own.' }),
    drum({ id: 'information', phase: 'guided', helped: true, words: [['in', 'for', 'ma', 'tion']],
      say: 'A longer one: information. Clap it out.',
      hints: ['The ending tion is one beat.', 'In, for, ma, tion. Four beats.'],
      win: 'In · for · ma · tion. Four beats.' }),
    drum({ id: 'three-words', phase: 'solo', words: last,
      say: 'Three long words, and the drum will not split them for you. Set the beats for each one.' }),
  ],
});
