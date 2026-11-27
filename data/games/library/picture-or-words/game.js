// Picture or Words. Skill: tell what you learned from the picture apart from what you learned from the words.
// A page has a picture and a few words. Each clue card came from one or the other. The
// detective files it under where it was really found.
const PAGES = {
  max: { picture: '🌧️ 🐶 🎈', words: 'Max is two. He loves to dig.', clues: [['It is\nraining', 'p'], ['His name\nis Max', 'w'], ['He has\na balloon', 'p'], ['He loves\nto dig', 'w']] },
  owl: { picture: '🌙 🦉 🌲', words: 'Owls eat mice. They can turn their heads far.', clues: [['The owl is\nby a tree', 'p'], ['Owls\neat mice', 'w'], ['The moon\nis out', 'p'], ['Owls turn\ntheir heads', 'w']] },
  turtle: { picture: '☀️ 🐢 🌊', words: 'Sea turtles live 50 years. They lay eggs in sand.', clues: [['They live\n50 years', 'w'], ['The sun\nis out', 'p'], ['They lay eggs\nin sand', 'w'], ['The turtle is\nby the water', 'p']] },
  penguin: { picture: '❄️ 🐧 🐧 🐧', words: 'Penguins cannot fly. They eat fish.', clues: [['It is\nsnowing', 'p'], ['Penguins\ncannot fly', 'w'], ['There are\nthree penguins', 'p'], ['They\neat fish', 'w']] },
};

function page(o) {
  const info = PAGES[o.page], clues = info.clues.slice(0, o.count || 4);
  const file = (flip) => clues.map((clue, i) => ({ drag: 'clue' + i, to: (clue[1] === 'p') !== !!flip ? 'saw' : 'read' }));
  const all = (stage, flip) => clues.every((clue, i) => stage.get('clue' + i).zone === ((clue[1] === 'p') !== !!flip ? 'saw' : 'read'));
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 88, action: 'Case closed!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.block({ x: 8, y: 3, w: 84, h: 22, color: 'white', round: 2, border: 'night' });
      stage.label({ text: info.picture, x: 28, y: 14, size: 7 });
      stage.label({ text: info.words, x: 68, y: 14, size: 3.2, w: 42 });
      stage.zone({ id: 'saw', x: 3, y: 33, w: 45, h: 22, look: 'box', color: 'sun', label: '🖼️ I saw it in the picture', labelAt: 'top', accepts: 'clue' });
      stage.zone({ id: 'read', x: 52, y: 33, w: 45, h: 22, look: 'box', color: 'sky', label: '📝 I read it in the words', labelAt: 'top', accepts: 'clue' });
      const tip = o.helped ? stage.label({ text: '🕵️ Where did each clue come from?', x: 50, y: 60, size: 3.3, card: true }) : null;
      stage.zone({ id: 'clues', x: 4, y: 65, w: 92, h: 20, look: 'tray', label: 'Clue cards', showLabel: false, accepts: 'clue' });
      clues.forEach((clue, i) => stage.sprite({ id: 'clue' + i, text: clue[0], size: 2.9, kind: 'clue', drag: true, zone: 'clues', label: clue[0].replace('\n', ' ') }));
      // The world reacts: the detective sends the child back to the page to look again.
      if (tip) stage.on('change', () => {
        const inWords = clues.find((clue, i) => clue[1] === 'p' && stage.get('clue' + i).zone === 'read');
        const inPicture = clues.find((clue, i) => clue[1] === 'w' && stage.get('clue' + i).zone === 'saw');
        tip.set(inWords ? '🕵️ Read the words again. Do they say that?' : inPicture ? '🕵️ Look at the picture again. Can you see that?' : '🕵️ Where did each clue come from?');
      });
    },
    check: (stage) => all(stage, false),
    solution: () => file(false),
    mistakes: [{ tag: 'mixes_the_two_sources', when: (stage) => all(stage, true), steps: () => file(true),
      say: 'Those are mixed up. Check each clue: can you see it, or did you have to read it?' }],
  };
}

// A fresh page for the last round on every play.
const last = Sidekick.pick(['turtle', 'penguin']);

Sidekick.game({
  title: 'Picture or Words',
  emoji: '🕵️',
  premise: 'Every clue came from the picture or from the words. File each one where it was found.',
  outro: 'Case closed! Pictures and words each tell you different things. Good readers use both.',
  rounds: [
    page({ id: 'two-clues', phase: 'guided', helped: true, page: 'max', count: 2,
      say: 'Look at the page. One clue you can see in the picture. One you have to read. Drag each to its box.',
      hints: ['Can you see rain in the picture?', 'The name Max is only in the words.'],
      win: 'Rain is in the picture. The name is in the words.' }),
    page({ id: 'four-clues', phase: 'guided', helped: true, page: 'max',
      say: 'Four clues about the same page. Where did each one come from?',
      hints: ['The balloon and the rain are things you can see.', 'His name and what he loves are written.'],
      win: 'Two from the picture and two from the words.' }),
    page({ id: 'owl-page', phase: 'guided', helped: true, page: 'owl',
      say: 'A new page about owls. File all four clues.',
      hints: ['The picture shows a moon, an owl and a tree.', 'What owls eat is only in the words.'],
      win: 'The tree and moon were in the picture. The facts were in the words.' }),
    page({ id: 'last-case', phase: 'solo', page: last,
      say: 'The detective has gone to lunch. File these four clues by yourself.' }),
  ],
});
