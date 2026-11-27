// Twin Ray Zoo. Skill: form regular and irregular plural nouns.
// The twin ray turns one into two, so every sign needs its plural. Each sign keeps the
// part of the word that stays and takes a new ending. Just adding "s" does not fix it.
const WORDS = {
  leaf: { emoji: '🍃', stem: 'lea', right: 'ves', addS: 'fs' },
  mouse: { emoji: '🐭', stem: 'm', right: 'ice', addS: 'ouses' },
  story: { emoji: '📖', stem: 'stor', right: 'ies', addS: 'ys' },
  foot: { emoji: '🦶', stem: 'f', right: 'eet', addS: 'oots' },
  child: { emoji: '🧒', stem: 'child', right: 'ren', addS: 's' },
  tooth: { emoji: '🦷', stem: 't', right: 'eeth', addS: 'ooths' },
  wolf: { emoji: '🐺', stem: 'wol', right: 'ves', addS: 'fs' },
  woman: { emoji: '👩', stem: 'wom', right: 'en', addS: 'ans' },
  baby: { emoji: '👶', stem: 'bab', right: 'ies', addS: 'ys' },
  person: { emoji: '🧑', stem: 'pe', right: 'ople', addS: 'rsons' },
};
const ROW_Y = [5, 20, 35];
const ending = (stage, i) => stage.get('sign' + i).sprites.find((tile) => tile.kind === 'ending') || null;
const tileFor = (stage, i, which) => stage.all('ending').find((tile) => tile.data.word === i && tile.data.which === which);

function zooRound(o) {
  const words = o.words.map((name) => Object.assign({ name }, WORDS[name]));
  return {
    id: o.id, phase: o.phase, say: o.say, hints: o.hints || [], win: o.win || '', scene: 'night', action: 'Zap!',
    height: ROW_Y[words.length - 1] + 45,
    setup(stage, sk) {
      const poolY = ROW_Y[words.length - 1] + 19;
      stage.zone({ id: 'pool', x: 3, y: poolY, w: 94, h: 23, look: 'cloud', label: 'Word endings', showLabel: false, accepts: 'ending' });
      const tiles = [];
      words.forEach((word, i) => {
        const y = ROW_Y[i];
        stage.sprite({ emoji: word.emoji, x: 5.5, y: y + 6, size: 7.5 });
        stage.sprite({ id: 'twin' + i, emoji: word.emoji, x: 13.5, y: y + 6, size: 7.5, hidden: true });
        stage.label({ text: 'one ' + word.name, x: 32, y: y + 6, size: 4.2, color: 'white' });
        stage.zone({ id: 'sign' + i, x: 46, y, w: 51, h: 12, look: 'box', color: 'sun', label: 'Sign for two', showLabel: false,
          layout: 'row', align: 'start', gap: 0, pad: 2.5, capacity: 2, swap: true, accepts: 'ending' });
        stage.sprite({ text: 'two ' + word.stem, plain: true, size: 5.4, zone: 'sign' + i });
        tiles.push({ text: word.right, word: i, which: 'right' }, { text: word.addS, word: i, which: 'addS' });
      });
      (o.extra || []).forEach((text) => tiles.push({ text, word: -1, which: 'extra' }));
      sk.shuffle(tiles).forEach((tile, n) => stage.sprite({ id: 'end' + n, text: tile.text, size: 5.4, kind: 'ending', data: tile, drag: true, zone: 'pool', label: 'ending ' + tile.text }));
    },
    check: (stage) => words.every((word, i) => { const tile = ending(stage, i); return !!tile && tile.text === word.right; }),
    solution: (stage) => words.map((word, i) => ({ drag: tileFor(stage, i, 'right').id, to: 'sign' + i })),
    mistakes: [{
      tag: 'just_adds_s',
      when: (stage) => words.some((word, i) => { const tile = ending(stage, i); return !!tile && tile.text === word.addS; }),
      steps: (stage) => words.map((word, i) => ({ drag: tileFor(stage, i, 'addS').id, to: 'sign' + i })),
      say: 'Adding s works for lots of words, but not these. Say the word for two out loud. Does it sound right?',
    }],
    onWin(stage) { words.forEach((word, i) => stage.get('twin' + i).show().pop()); },
  };
}

// Three fresh words for the last round on every play.
const lastWords = Sidekick.shuffle(['tooth', 'wolf', 'woman', 'baby', 'person']).slice(0, 3);

Sidekick.game({
  title: 'Twin Ray Zoo',
  emoji: '⚡',
  premise: 'The twin ray turns one into two! Fix each sign so it names two, then zap.',
  outro: 'Every sign is right! Some words change their ending, and some change in the middle.',
  rounds: [
    zooRound({ id: 'leaf', phase: 'guided', words: ['leaf'], extra: ['fes'],
      say: 'One leaf is about to become two. Drag an ending onto the sign to finish the word, then zap!',
      hints: ['Say it out loud: one leaf, two...', 'The f changes. Try the ending that starts with v.'],
      win: 'One leaf, two leaves. The f turned into ves.' }),
    zooRound({ id: 'mouse-story', phase: 'guided', words: ['mouse', 'story'], extra: ['es'],
      say: 'Two signs this time. Each one needs its own ending.',
      hints: ['One mouse, two... say it out loud.', 'For story, the y changes to ies.'],
      win: 'Two mice and two stories. Neither one just adds s.' }),
    zooRound({ id: 'foot-child', phase: 'guided', words: ['foot', 'child'], extra: ['es'],
      say: 'These two are tricky. The word for two sounds different from the word for one.',
      hints: ['One foot, two... think of what you put socks on.', 'One child, two... think of a whole class of kids.'],
      win: 'Two feet and two children. Those plurals are their own words.' }),
    zooRound({ id: 'three-signs', phase: 'solo', words: lastWords, extra: ['es'],
      say: 'Last zap! Three new signs. Give each one the ending that makes it mean two.' }),
  ],
});
