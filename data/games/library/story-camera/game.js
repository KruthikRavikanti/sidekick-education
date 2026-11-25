// Story Camera. Skill: tell first-person narration from third-person narration.
// First person puts the camera inside a character: I, me, my. Third person puts it outside,
// watching: he, she, his, her. Moving the camera means changing every one of those words.
const SWAP = { I: 'I', my: 'my', She: 'She', she: 'she', her: 'her', He: 'He', he: 'he', his: 'his' };

function scene(o) {
  // A token is plain text, or a [first-person, third-person] pair the child can tap to switch.
  const flips = o.tokens.map((t, i) => (Array.isArray(t) ? i : -1)).filter((i) => i >= 0);
  const startAt = o.goal === 'first' ? 1 : 0, goalAt = 1 - startAt;
  const shown = (stage, i) => stage.get('w' + i).data.at;
  const taps = (list) => list.map((i) => ({ tap: 'w' + i }));
  return {
    id: o.id, phase: o.phase, scene: 'sky', height: 60, action: 'Action!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: o.goal === 'first' ? '🎥 Move the camera INSIDE ' + o.who + ': use I and my' : '🎥 Move the camera OUTSIDE: tell it about ' + o.who, x: 50, y: 8, size: 3.6, w: 92, card: true });
      const n = o.tokens.length, gap = Math.min(15, 91 / n);
      const view = o.helped ? stage.label({ text: '', x: 50, y: 48, size: 3.6, card: true }) : null;
      const look = () => {
        if (!view) return;
        const inside = flips.filter((i) => shown(stage, i) === 0).length;
        view.set(inside === flips.length ? 'Camera inside the character: first person.' : inside === 0 ? 'Camera outside, watching: third person.' : 'Mixed up! Part inside, part outside.');
      };
      o.tokens.forEach((t, i) => {
        const x = 50 + (i - (n - 1) / 2) * gap;
        if (!Array.isArray(t)) { stage.sprite({ text: t, size: 3.8, plain: true, x, y: 29 }); return; }
        stage.sprite({ id: 'w' + i, text: t[startAt], size: 3.8, color: 'orange', x, y: 29, label: 'word ' + t[startAt], data: { at: startAt },
          tap(tile) { tile.data.at = 1 - tile.data.at; tile.set({ text: SWAP[t[tile.data.at]] }).pop(); look(); } });
      });
      look();
    },
    check: (stage) => flips.every((i) => shown(stage, i) === goalAt),
    solution: () => taps(flips),
    mistakes: flips.length > 1 ? [{ tag: 'changes_only_the_first_pronoun', when: (stage) => shown(stage, flips[0]) === goalAt && flips.slice(1).every((i) => shown(stage, i) === startAt), steps: () => taps(flips.slice(0, 1)),
      say: 'The first word moved, but the rest of the sentence did not. Every I, my, he, she, his or her has to match.' }] : [],
  };
}

// A fresh sentence for the last round on every play.
const last = Sidekick.pick([
  { who: 'Leo', goal: 'first', tokens: [['I', 'He'], 'took', ['my', 'his'], 'kite', 'and', ['I', 'he'], 'left.'] },
  { who: 'Nia', goal: 'third', tokens: [['I', 'She'], 'packed', ['my', 'her'], 'bag', 'and', ['I', 'she'], 'waved.'] },
  { who: 'Ava', goal: 'first', tokens: [['I', 'She'], 'found', ['my', 'her'], 'key', 'and', ['I', 'she'], 'smiled.'] },
]);

Sidekick.game({
  title: 'Story Camera',
  emoji: '🎥',
  premise: 'Move the story camera inside a character or outside. Tap the words that have to change.',
  outro: 'Cut! First person says I and my. Third person says he, she, his, her. And the I in a story is the character, not always the author.',
  rounds: [
    scene({ id: 'hat', phase: 'guided', helped: true, who: 'Mia', goal: 'third', tokens: [['I', 'She'], 'lost', ['my', 'her'], 'hat.'],
      say: 'Mia tells this story herself. Move the camera outside so someone else tells it about her. Tap each orange word.',
      hints: ['Tap I to turn it into She.', 'My has to change too: her hat.'],
      win: 'She lost her hat. That is third person.' }),
    scene({ id: 'map', phase: 'guided', helped: true, who: 'Sam', goal: 'first', tokens: [['I', 'He'], 'hid', ['my', 'his'], 'map.'],
      say: 'Now go the other way. Put the camera inside Sam so he tells it himself.',
      hints: ['He becomes I.', 'His map becomes my map.'],
      win: 'I hid my map. That is first person.' }),
    scene({ id: 'dog', phase: 'guided', helped: true, who: 'Zoe', goal: 'third', tokens: [['I', 'She'], 'fed', ['my', 'her'], 'dog', 'and', ['I', 'she'], 'ran.'],
      say: 'A longer sentence with three words to change. Move the camera outside Zoe.',
      hints: ['Do not stop after the first word.', 'She fed her dog and she ran.'],
      win: 'She fed her dog and she ran.' }),
    scene({ id: 'last-shot', phase: 'solo', who: last.who, goal: last.goal, tokens: last.tokens,
      say: 'Last shot, with no camera check. Read the sign and switch every word that has to change.' }),
  ],
});
