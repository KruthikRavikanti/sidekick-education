// Word Rocket. Skill: read a long word chunk by chunk instead of guessing from its first part.
// A long word is a rocket with three stages. Two real words can share the same first and last
// stage, so only reading the middle tells which rocket fits the mission.
function launch(o) {
  const said = (stage) => [0, 1, 2].map((i) => stage.get('stage' + i).texts()[0] || '');
  const load = (parts) => parts.map((text, i) => ({ drag: 'p-' + text, to: 'stage' + i }));
  const trap = [o.parts[0], o.decoy, o.parts[2]];
  return {
    id: o.id, phase: o.phase, scene: 'space', height: o.helped ? 74 : 64, action: 'Launch!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: '🎯 Mission: build the word that means “' + o.means + '”', x: 50, y: 8, size: 3.5, w: 92, card: true });
      [0, 1, 2].forEach((i) => stage.zone({ id: 'stage' + i, x: 5 + i * 28, y: 20, w: 26, h: 13, look: 'slot', color: 'white', label: 'rocket stage ' + (i + 1), showLabel: false, capacity: 1, swap: true, accepts: 'part' }));
      stage.label({ text: '🚀', x: 94, y: 26.5, size: 7 });
      stage.zone({ id: 'parts', x: 6, y: 42, w: 88, h: 14, look: 'tray', label: 'Word chunks', showLabel: false, accepts: 'part' });
      Sidekick.shuffle(o.parts.concat([o.decoy])).forEach((text) => stage.sprite({ id: 'p-' + text, text, size: 4, color: 'orange', kind: 'part', drag: true, zone: 'parts', label: text }));
      // The world reacts: mission control reads the chunks in order and says what that word means.
      const radio = o.helped ? stage.label({ text: '📡 Read the chunks from left to right.', x: 50, y: 65, size: 3.4, w: 92, card: true }) : null;
      if (radio) stage.on('change', () => {
        const now = said(stage), word = now.join('');
        radio.set(now.some((text) => !text) ? '📡 Read the chunks from left to right.' : word === o.parts.join('') ? '📡 ' + word + ': ' + o.means + '.' : word === trap.join('') ? '📡 ' + word + ': ' + o.decoyMeans + '.' : '📡 ' + now.join('·') + '? Mission control does not know that word.');
      });
    },
    check: (stage) => said(stage).join('|') === o.parts.join('|'),
    solution: () => load(o.parts),
    mistakes: [{ tag: 'guesses_from_the_first_chunk', when: (stage) => said(stage).join('|') === trap.join('|'), steps: () => load(trap),
      say: 'That word starts and ends the same way, but it means ' + o.decoyMeans + '. Read the middle chunk too.' }],
  };
}

// A fresh mission for the last round on every play.
const last = Sidekick.pick([
  { parts: ['un', 'break', 'able'], decoy: 'comfort', means: 'cannot be broken', decoyMeans: 'not feeling at ease' },
  { parts: ['help', 'ful', 'ness'], decoy: 'less', means: 'being a big help', decoyMeans: 'not being able to do anything' },
  { parts: ['thought', 'ful', 'ly'], decoy: 'less', means: 'in a kind and caring way', decoyMeans: 'without caring about others' },
]);

Sidekick.game({
  title: 'Word Rocket',
  emoji: '🚀',
  premise: 'A long word is a three stage rocket. Load the chunks in order to match the mission.',
  outro: 'Lift off! Break a long word into chunks and read every chunk, not just the first one.',
  rounds: [
    launch({ id: 'disagreement', phase: 'guided', helped: true, parts: ['dis', 'agree', 'ment'], decoy: 'appoint', means: 'when people do not agree', decoyMeans: 'a sad feeling when a hope falls through',
      say: 'Drag three chunks into the rocket, front to back. Mission control reads your word back to you.',
      hints: ['Both words start with dis and end with ment.', 'The middle chunk has to be agree.'],
      win: 'Dis·agree·ment. Reading the middle chunk made the difference.' }),
    launch({ id: 'replacement', phase: 'guided', helped: true, parts: ['re', 'place', 'ment'], decoy: 'fresh', means: 'a new one that takes the place of an old one', decoyMeans: 'a snack or a drink',
      say: 'A new mission. Two words fit this rocket. Only one fits the meaning.',
      hints: ['Look for the small word you know inside.', 'Re·place·ment has the word place in it.'],
      win: 'Re·place·ment.' }),
    launch({ id: 'overflowing', phase: 'guided', helped: true, parts: ['over', 'flow', 'ing'], decoy: 'look', means: 'spilling over the edge', decoyMeans: 'looking down on from above',
      say: 'Another long word. Read each chunk before you launch.',
      hints: ['Water can flow.', 'Over·flow·ing.'],
      win: 'Over·flow·ing.' }),
    launch({ id: 'last-launch', phase: 'solo', parts: last.parts, decoy: last.decoy, means: last.means, decoyMeans: last.decoyMeans,
      say: 'Mission control is silent now. Load the three chunks that build the word for this mission.' }),
  ],
});
