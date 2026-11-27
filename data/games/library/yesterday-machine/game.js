// Yesterday Machine. Skill: form the past tense of irregular verbs (sat, hid, told).
// The machine sends words back to yesterday. Most verbs just take an -ed tile. Some change
// shape instead, and bolting -ed onto them builds a word that does not exist.
const up = (word) => word[0].toUpperCase() + word.slice(1);

function machine(o) {
  const odd = o.verbs.filter((v) => v.past), firstOdd = odd[0];
  const fix = () => { let n = 0; return o.verbs.map((v, k) => ({ drag: v.past ? 'w-' + v.past : 'ed' + (++n), to: 'slot' + k })); };
  const allEd = (stage) => o.verbs.every((v, k) => stage.get('slot' + k).kinds()[0] === 'ed');
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 26 + o.verbs.length * 14, action: 'Send!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.sprite({ emoji: '🕰️', x: 8, y: 7 + o.verbs.length * 7, size: 9 });
      const bases = o.verbs.map((v, k) => {
        const y = 10 + k * 14;
        stage.label({ text: 'Today I ' + v.base + '.', x: 25, y, size: 3.3 });
        stage.label({ text: '➜ Yesterday I', x: 51, y, size: 3.3 });
        stage.zone({ id: 'slot' + k, x: 77, y: y - 5.8, w: 20, h: 11.6, look: 'slot', label: 'past of ' + v.base, showLabel: false, capacity: 1, swap: true, accepts: ['ed', 'word'] });
        return stage.label({ text: v.base, x: 70, y, size: 3.8, color: 'orange' });
      });
      stage.zone({ id: 'tiles', x: 4, y: 8 + o.verbs.length * 14, w: 92, h: 14, look: 'tray', label: 'Word tiles', showLabel: false, accepts: ['ed', 'word'] });
      o.verbs.forEach((v, k) => stage.sprite({ id: 'ed' + (k + 1), text: '-ed', size: 3.6, kind: 'ed', drag: true, zone: 'tiles', label: 'e d ending' }));
      odd.concat(o.extra || []).forEach((v) => stage.sprite({ id: 'w-' + v.past, text: v.past, size: 3.6, color: 'grape', kind: 'word', drag: true, zone: 'tiles', label: v.past }));
      // The world reacts: a whole new word replaces the old one, an -ed tile bolts onto it.
      stage.on('change', () => bases.forEach((base, k) => (stage.get('slot' + k).kinds()[0] === 'word' ? base.hide() : base.show())));
    },
    check: (stage) => o.verbs.every((v, k) => (v.past ? stage.get('slot' + k).texts()[0] === v.past : stage.get('slot' + k).kinds()[0] === 'ed')),
    solution: fix,
    mistakes: [{
      tag: 'adds_ed_to_everything', when: allEd, steps: () => o.verbs.map((v, k) => ({ drag: 'ed' + (k + 1), to: 'slot' + k })),
      say: '"' + up(firstOdd.base) + 'ed" is not a word. ' + up(firstOdd.base) + ' changes shape when it goes to yesterday: ' + firstOdd.past + '.',
    }],
  };
}

// Fresh verbs for the last round on every play: two take -ed and two change shape.
const last = Sidekick.pick([
  [{ base: 'look' }, { base: 'come', past: 'came' }, { base: 'find', past: 'found' }, { base: 'kick' }],
  [{ base: 'give', past: 'gave' }, { base: 'help' }, { base: 'pull' }, { base: 'see', past: 'saw' }],
  [{ base: 'wait' }, { base: 'take', past: 'took' }, { base: 'open' }, { base: 'make', past: 'made' }],
]);

Sidekick.game({
  title: 'Yesterday Machine',
  emoji: '🕰️',
  premise: 'The machine sends action words back to yesterday. Some take -ed. Some change shape.',
  outro: 'Sent! Many verbs add -ed for the past, but some change into a whole new word.',
  rounds: [
    machine({ id: 'jump-sit', phase: 'guided', verbs: [{ base: 'jump' }, { base: 'sit', past: 'sat' }],
      say: 'Send each word to yesterday. Drag an -ed tile or a new word into each box. Read it out loud to check.',
      hints: ['Yesterday I jumped. That one takes -ed.', 'We do not say sitted. Yesterday I sat.'],
      win: 'Jumped and sat. Sit changed shape!' }),
    machine({ id: 'tell-play-hide', phase: 'guided', verbs: [{ base: 'tell', past: 'told' }, { base: 'play' }, { base: 'hide', past: 'hid' }],
      say: 'Three words this time. Which ones just take -ed, and which ones change?',
      hints: ['Say each one in a sentence: Yesterday I ...', 'Told, played, hid.'],
      win: 'Told, played, hid.' }),
    machine({ id: 'run-walk-eat', phase: 'guided', verbs: [{ base: 'run', past: 'ran' }, { base: 'walk' }, { base: 'eat', past: 'ate' }],
      say: 'More words for the machine. Listen for the ones that sound strange with -ed.',
      hints: ['Runned and eated do not sound right.', 'Ran, walked, ate.'],
      win: 'Ran, walked, ate.' }),
    machine({ id: 'last-batch', phase: 'solo', verbs: last,
      say: 'Last batch: four words. Send each one to yesterday the right way.' }),
  ],
});
