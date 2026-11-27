// Book Makers. Skill: the author writes the words and the illustrator makes the pictures.
// A new book arrives in pieces. Every piece of writing goes back to the author's desk and
// every picture to the illustrator's desk. Mixing up the two jobs sends them to the wrong desk.
function book(o) {
  const desk = (piece) => (piece.words ? 'author' : 'artist'), other = (piece) => (piece.words ? 'artist' : 'author');
  const send = (where) => o.pieces.map((piece, i) => ({ drag: 'piece' + i, to: where(piece) }));
  const allAt = (stage, where) => o.pieces.every((piece, i) => stage.get('piece' + i).zone === where(piece));
  return {
    id: o.id, phase: o.phase, scene: 'desk', height: 80, action: 'Print it!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      stage.label({ text: o.author, x: 25.5, y: 7, size: 3.5, card: true });
      stage.label({ text: o.artist, x: 74.5, y: 7, size: 3.5, card: true });
      stage.zone({ id: 'author', x: 3, y: 14, w: 45, h: 32, look: 'box', color: 'sky', label: 'Author desk', showLabel: false, accepts: 'piece' });
      stage.zone({ id: 'artist', x: 52, y: 14, w: 45, h: 32, look: 'box', color: 'sun', label: 'Illustrator desk', showLabel: false, accepts: 'piece' });
      stage.zone({ id: 'pile', x: 4, y: 53, w: 92, h: 23, look: 'tray', label: 'Book pieces', showLabel: false, accepts: 'piece' });
      o.pieces.forEach((piece, i) => stage.sprite(Object.assign({ id: 'piece' + i, kind: 'piece', drag: true, zone: 'pile', label: piece.words ? 'words: ' + piece.words : 'a picture' },
        piece.words ? { text: '“' + piece.words + '”', size: 3.2 } : { emoji: piece.picture, size: 9 })));
    },
    check: (stage) => allAt(stage, desk),
    solution: () => send(desk),
    mistakes: [{ tag: 'swaps_the_jobs', when: (stage) => allAt(stage, other), steps: () => send(other),
      say: 'Those are swapped. The author writes the words. The illustrator makes the pictures.' }],
  };
}

// A fresh book for the last round on every play.
const last = Sidekick.pick([
  [{ picture: '🐻' }, { words: 'Bear woke up.' }, { picture: '🍯' }, { words: 'He was hungry!' }, { picture: '🌲' }],
  [{ words: 'Splash!' }, { picture: '🐳' }, { words: 'The whale\ndove deep.' }, { picture: '🌊' }, { picture: '⛵' }],
]);

Sidekick.game({
  title: 'Book Makers',
  emoji: '📚',
  premise: 'A new book came in pieces. Send each piece back to the person who made it.',
  outro: 'The book is printed! Authors write the words. Illustrators make the pictures.',
  rounds: [
    book({ id: 'cat-book', phase: 'guided', author: '✍️ Author\nwrites the words', artist: '🎨 Illustrator\nmakes the pictures',
      pieces: [{ words: 'The cat sat.' }, { picture: '🐱' }],
      say: 'Two people made this book. Drag the words to the author and the picture to the illustrator.',
      hints: ['Which piece is writing?', 'The author wrote "The cat sat." The illustrator drew the cat.'],
      win: 'Words to the author, picture to the illustrator.' }),
    book({ id: 'rocket-book', phase: 'guided', author: '✍️ Author\nwrites the words', artist: '🎨 Illustrator\nmakes the pictures',
      pieces: [{ picture: '🚀' }, { words: 'Zoom!' }, { words: 'We land\non the moon.' }, { picture: '🌙' }],
      say: 'A space book with four pieces. Who made each one?',
      hints: ['Pictures go to the illustrator.', 'Anything you read goes to the author.'],
      win: 'Two pieces of writing and two pictures, each to the right desk.' }),
    book({ id: 'named-desks', phase: 'guided', author: 'Ana is the author', artist: 'Ivan is the illustrator',
      pieces: [{ words: 'Dig, dig, dig.' }, { picture: '🐶' }, { picture: '🦴' }, { words: 'Dog found\na bone!' }],
      say: 'Ana is the author and Ivan is the illustrator. Give each of them their own work back.',
      hints: ['The author is the one who writes.', 'Ivan the illustrator drew the dog and the bone.'],
      win: 'Ana wrote the words. Ivan made the pictures.' }),
    book({ id: 'last-book', phase: 'solo', author: 'Author', artist: 'Illustrator', pieces: last,
      say: 'The desks only have name tags now. Send every piece of this book to the right desk.' }),
  ],
});
