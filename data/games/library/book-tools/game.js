// Book Tools. Skill: use a table of contents, glossary, index and captions to find things fast.
// Every question about a book has a tool that answers it in seconds. Reading every page also
// works, and the snail shows how long that takes.
const TOOLS = { contents: ['📑 Contents', 'The contents lists chapters and where they start.'], glossary: ['🔤 Glossary', 'The glossary only tells what words mean.'],
  index: ['🔎 Index', 'The index lists every page a word is on.'], caption: ['🖼️ Caption', 'A caption only tells about its picture.'] };
const KEYS = ['contents', 'glossary', 'index', 'caption'];

function library(o) {
  const send = (where) => o.cards.map((card, i) => ({ drag: 'q' + i, to: where(card) }));
  const all = (stage, where) => o.cards.every((card, i) => stage.get('q' + i).zone === where(card));
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 90, action: 'Found it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      const tip = stage.label({ text: o.helped ? '📖 Drag each question to the tool that answers it fastest.' : '📖', x: 50, y: 5, size: 3.3, w: 92, card: true });
      KEYS.forEach((key, i) => stage.zone({ id: key, x: 3 + (i % 2) * 49, y: 15 + Math.floor(i / 2) * 18, w: 45, h: 13, look: 'box', color: i % 3 ? 'sky' : 'sun', label: TOOLS[key][0], labelAt: 'top', accepts: 'q' }));
      stage.zone({ id: 'slow', x: 3, y: 52, w: 94, h: 12, look: 'cloud', label: '🐌 Read every page', labelAt: 'top', accepts: 'q' });
      stage.zone({ id: 'desk', x: 4, y: 68, w: 92, h: 19, look: 'tray', label: 'Questions', showLabel: false, accepts: 'q' });
      o.cards.forEach((card, i) => stage.sprite({ id: 'q' + i, text: card[0], size: 2.8, kind: 'q', drag: true, zone: 'desk', label: card[0].replace('\n', ' ') }));
      // The world reacts: the book says what the chosen tool can and cannot do.
      if (o.helped) stage.on('change', () => {
        const off = o.cards.find((card, i) => KEYS.includes(stage.get('q' + i).zone) && stage.get('q' + i).zone !== card[1]);
        const snail = o.cards.some((card, i) => stage.get('q' + i).zone === 'slow');
        tip.set(off ? '📖 ' + TOOLS[o.cards.map((card, i) => stage.get('q' + i).zone)[o.cards.indexOf(off)]][1] : snail ? '🐌 That would work, but it takes all day. A tool is faster.' : '📖 Drag each question to the tool that answers it fastest.');
      });
    },
    check: (stage) => all(stage, (card) => card[1]),
    solution: () => send((card) => card[1]),
    mistakes: [{ tag: 'reads_every_page', when: (stage) => all(stage, () => 'slow'), steps: () => send(() => 'slow'),
      say: 'Reading every page would take all day. Each of these has a tool that finds it in seconds.' }],
  };
}

// Fresh questions for the last round on every play.
const last = Sidekick.pick([
  [['What does\n"larva" mean?', 'glossary'], ['Where does the\nbee chapter start?', 'contents'], ['Which pages\nmention honey?', 'index'], ['Who is in\nthis photo?', 'caption']],
  [['Which pages\ntalk about lava?', 'index'], ['What is this\ndrawing showing?', 'caption'], ['What does\n"erupt" mean?', 'glossary'], ['Which chapter\nis about ash?', 'contents']],
]);

Sidekick.game({
  title: 'Book Tools',
  emoji: '📖',
  premise: 'A fact book has tools that find things fast. Send each question to the tool that answers it.',
  outro: 'Found it! Contents for chapters, glossary for meanings, index for pages, captions for pictures.',
  rounds: [
    library({ id: 'two-questions', phase: 'guided', helped: true, cards: [['What does\n"hatch" mean?', 'glossary'], ['What is in\nthis photo?', 'caption']],
      say: 'Two questions about a frog book. Drag each one to the book tool that answers it.',
      hints: ['A glossary is a little dictionary at the back of the book.', 'The words under a photo are its caption.'],
      win: 'Glossary for word meanings. Caption for the photo.' }),
    library({ id: 'three-questions', phase: 'guided', helped: true, cards: [['Where does the\nfrog chapter start?', 'contents'], ['Which pages\ntalk about eggs?', 'index'], ['What does\n"tadpole" mean?', 'glossary']],
      say: 'Three questions. One asks about a chapter, one about pages, one about a word.',
      hints: ['The contents lists chapters, at the front.', 'The index lists pages for a word, at the back.'],
      win: 'Contents, index and glossary.' }),
    library({ id: 'four-questions', phase: 'guided', helped: true, cards: [['Which pages\nmention ponds?', 'index'], ['What is this\nmap showing?', 'caption'], ['Which chapter is\nabout toads?', 'contents'], ['What does\n"croak" mean?', 'glossary']],
      say: 'Four questions, four tools. Match them all.',
      hints: ['Chapter questions go to the contents.', 'Page questions go to the index.'],
      win: 'Every question has its tool.' }),
    library({ id: 'last-book', phase: 'solo', cards: last,
      say: 'A new book, and no tips. Send each question to the tool that answers it fastest.' }),
  ],
});
