// Story Stones. Skill: find the lesson of a story, not just what happened in it.
// Every old tale ends at a stone where its lesson is carved. A card that only retells the
// story is true, but it is not something a reader can carry into their own life.
const TALES = {
  race: { tale: 'Hare ran fast, then took a nap. Tortoise kept walking and won the race.', lesson: 'Keep going and\ndo not give up', retell: 'A tortoise\nwon a race' },
  ant: { tale: 'Ant saved food all summer. Grasshopper only played. In winter he was hungry.', lesson: 'Get ready\nahead of time', retell: 'A grasshopper\ngot hungry' },
  wolf: { tale: 'A boy yelled "Wolf!" as a joke. When a real wolf came, nobody believed him.', lesson: 'Tell the truth so\npeople trust you', retell: 'A wolf came\nto the field' },
  lion: { tale: 'Lion let Mouse go. Later Mouse chewed a net and set Lion free.', lesson: 'Small friends can\nbe a big help', retell: 'A mouse\nchewed a net' },
  crow: { tale: 'Thirsty Crow could not reach the water. She dropped in pebbles until it rose.', lesson: 'Think it through\nand keep trying', retell: 'A crow dropped\npebbles in a jar' },
  fox: { tale: 'Fox could not reach the grapes. He said they were sour anyway and left.', lesson: 'Do not pretend you\nnever wanted it', retell: 'A fox walked away\nfrom some grapes' },
};

function path(o) {
  const tales = o.keys.map((key) => TALES[key]), n = tales.length, trayY = n * 22 + 4 + (o.helped ? 10 : 0);
  const carved = (stage, k) => stage.get('stone' + k).ids[0] || '';
  const carve = (kind) => tales.map((tale, k) => ({ drag: kind + k, to: 'stone' + k }));
  return {
    id: o.id, phase: o.phase, scene: 'forest', height: trayY + (n === 1 && !o.spare ? 18 : 30), action: 'Carve it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      tales.forEach((tale, k) => {
        stage.label({ text: tale.tale, x: 27, y: 12 + k * 22, size: 2.9, w: 48, card: true });
        stage.zone({ id: 'stone' + k, x: 55, y: 4 + k * 22, w: 42, h: 16, look: 'slot', color: 'white', label: 'lesson stone ' + (k + 1), showLabel: false, capacity: 1, swap: true, accepts: 'card' });
      });
      const owl = o.helped ? stage.label({ text: '🦉 What can a reader learn from this story?', x: 50, y: n * 22 + 6, size: 3.3, w: 92, card: true }) : null;
      stage.zone({ id: 'cards', x: 4, y: trayY, w: 92, h: n === 1 && !o.spare ? 15 : 27, look: 'tray', label: 'Cards', showLabel: false, accepts: 'card' });
      const cards = [];
      tales.forEach((tale, k) => { cards.push(['retell' + k, tale.retell]); cards.push(['lesson' + k, tale.lesson]); });
      if (o.spare) cards.splice(1, 0, ['spare0', TALES[o.spare].lesson]);
      cards.forEach(([id, text]) => stage.sprite({ id, text, size: 2.8, kind: 'card', drag: true, zone: 'cards', label: text.replace('\n', ' ') }));
      // The world reacts: the owl says what kind of card is sitting on the stone.
      if (owl) stage.on('change', () => {
        const kinds = tales.map((tale, k) => carved(stage, k));
        owl.set(kinds.some((id) => id.startsWith('retell')) ? '🦉 That tells what happened. A lesson is something you can use in your own life.'
          : kinds.some((id) => id.startsWith('spare')) ? '🦉 A fine lesson, but this story does not teach it.' : '🦉 What can a reader learn from this story?');
      });
    },
    check: (stage) => tales.every((tale, k) => carved(stage, k) === 'lesson' + k),
    solution: () => carve('lesson'),
    mistakes: [{ tag: 'retells_instead_of_the_lesson', when: (stage) => tales.every((tale, k) => carved(stage, k) === 'retell' + k), steps: () => carve('retell'),
      say: 'That is what happened in the story. The lesson is the big idea the story teaches.' }],
  };
}

// Fresh tales for the last round on every play.
const last = Sidekick.pick([['crow', 'fox'], ['wolf', 'crow'], ['fox', 'lion']]);

Sidekick.game({
  title: 'Story Stones',
  emoji: '🪨',
  premise: 'Each old tale ends at a stone. Carve the lesson the story teaches, not just what happened.',
  outro: 'Carved! A lesson is the big idea of a story that you can use in your own life.',
  rounds: [
    path({ id: 'race', phase: 'guided', helped: true, keys: ['race'],
      say: 'Read the tale. One card tells what happened. One tells the lesson. Drag the lesson onto the stone.',
      hints: ['Which card could help you in your own life?', 'Keep going and do not give up.'],
      win: 'The lesson: keep going and do not give up.' }),
    path({ id: 'ant', phase: 'guided', helped: true, keys: ['ant'], spare: 'wolf',
      say: 'Three cards this time. One is a lesson from a different story.',
      hints: ['What did Ant do that Grasshopper did not?', 'Get ready ahead of time.'],
      win: 'Ant got ready ahead of time. That is the lesson.' }),
    path({ id: 'two-tales', phase: 'guided', helped: true, keys: ['wolf', 'lion'],
      say: 'Two tales and four cards. Carve the right lesson on each stone.',
      hints: ['Why did nobody believe the boy?', 'Who helped the big lion?'],
      win: 'Tell the truth. And small friends can be a big help.' }),
    path({ id: 'last-stones', phase: 'solo', keys: last,
      say: 'The owl is asleep. Carve the lesson of each tale by yourself.' }),
  ],
});
