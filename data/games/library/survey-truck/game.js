// Survey Truck. Skill: a statistical question is one whose answers will vary.
// The survey truck only rolls out for questions that need data from many people or things.
// A question with a single fixed answer needs no survey at all.
const Q = {
  tallClass: ['How tall are the\nkids in my class?', '51 in, 56 in, 49 in, 60 in...'], tallMe: ['How tall\nam I?', ''],
  pets: ['How many pets do\nstudents here have?', '0, 2, 1, 0, 4, 1...'], june: ['How many days\nare in June?', ''],
  sleep: ['How long do sixth\ngraders sleep?', '8 h, 9 h, 7 h, 10 h...'], bedtime: ['What time did I\ngo to bed last night?', ''],
  shoes: ['What shoe sizes do\nthe players wear?', '5, 7, 6, 6, 8...'], coach: ['What is the name\nof our coach?', ''],
  commute: ['How do students\nget to school?', 'bus, car, walk, bus, bike...'], bell: ['When does the\nfirst bell ring?', ''],
  books: ['How many books did\neach kid read?', '3, 12, 0, 7, 5...'], capital: ['What is the capital\nof Georgia?', ''],
};

function route(o) {
  const cards = o.keys.map((key) => Q[key]);
  const send = (where) => cards.map((card, i) => ({ drag: 'q' + i, to: where(card) }));
  const all = (stage, where) => cards.every((card, i) => stage.get('q' + i).zone === where(card));
  const home = (card) => (card[1] ? 'survey' : 'single');
  return {
    id: o.id, phase: o.phase, scene: 'city', height: 86, action: 'Roll out!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const board = stage.label({ text: o.helped ? '📋 Would the answers be different from person to person?' : '📋', x: 50, y: 5, size: 3.3, w: 92, card: true });
      stage.zone({ id: 'survey', x: 3, y: 16, w: 45, h: 30, look: 'box', color: 'sun', label: o.helped ? '🚚 Needs a survey' : '🚚 Statistical', labelAt: 'top', accepts: 'q' });
      stage.zone({ id: 'single', x: 52, y: 16, w: 45, h: 30, look: 'box', color: 'sky', label: o.helped ? '☝️ Just one answer' : '☝️ Not statistical', labelAt: 'top', accepts: 'q' });
      stage.zone({ id: 'desk', x: 4, y: 53, w: 92, h: 29, look: 'tray', label: 'Questions', showLabel: false, accepts: 'q' });
      cards.forEach((card, i) => stage.sprite({ id: 'q' + i, text: card[0], size: 2.8, kind: 'q', drag: true, zone: 'desk', label: card[0].replace('\n', ' ') }));
      // The world reacts: the notepad shows what collecting answers to that question would look like.
      if (o.helped) stage.on('change', () => {
        const lone = cards.find((card, i) => !card[1] && stage.get('q' + i).zone === 'survey');
        const many = cards.find((card, i) => card[1] && stage.get('q' + i).zone === 'single');
        board.set(lone ? '📋 Everyone you ask gives the same answer. No survey needed.' : many ? '📋 Answers would vary: ' + many[1] : '📋 Would the answers be different from person to person?');
      });
    },
    check: (stage) => all(stage, home),
    solution: () => send(home),
    mistakes: [{ tag: 'every_question_is_statistical', when: (stage) => all(stage, () => 'survey'), steps: () => send(() => 'survey'),
      say: 'Some of these have one fixed answer. A statistical question expects many different answers.' }],
  };
}

// Fresh questions for the last round on every play.
const last = Sidekick.pick([['commute', 'bell', 'books', 'capital'], ['coach', 'shoes', 'bedtime', 'sleep']]);

Sidekick.game({
  title: 'Survey Truck',
  emoji: '🚚',
  premise: 'The survey truck collects data. Send it out only for questions whose answers will vary.',
  outro: 'Data collected! A statistical question expects different answers that you can gather and study.',
  rounds: [
    route({ id: 'two-questions', phase: 'guided', helped: true, keys: ['tallClass', 'tallMe'],
      say: 'Two questions about height. Which one needs the truck to go and collect many answers?',
      hints: ['How tall am I has one answer.', 'A whole class has many different heights.'],
      win: 'A class has many heights. You have just one.' }),
    route({ id: 'three-questions', phase: 'guided', helped: true, keys: ['june', 'pets', 'sleep'],
      say: 'Three questions. Sort them: survey, or just one answer?',
      hints: ['June always has the same number of days.', 'Pets and sleep are different for different people.'],
      win: 'Two need a survey. One has a single answer.' }),
    route({ id: 'four-questions', phase: 'guided', helped: true, keys: ['shoes', 'coach', 'tallMe', 'pets'],
      say: 'Four questions now. Watch the notepad as you sort.',
      hints: ['Ask: would I get different answers from different people?', 'A coach has one name. Shoe sizes vary.'],
      win: 'Shoe sizes and pets vary. The others have one answer.' }),
    route({ id: 'last-route', phase: 'solo', keys: last,
      say: 'The notepad is blank. Sort these four: statistical or not?' }),
  ],
});
