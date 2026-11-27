// Brownie Plates. Skill: cutting a whole into more equal shares makes each share smaller.
// Each animal's plate fits one piece of a certain size. The number of cuts is the control,
// and the piece on the plate shows what it does: a bigger number makes a smaller piece.
const PAN_W = 28, PAN_X = 18, PLATE_X = 54, NAMES = { 1: 'whole', 2: 'halves', 3: 'thirds', 4: 'fourths' };

function table(o) {
  const cuts = (stage, key) => stage.get('cut' + key).value;
  const serve = (values) => o.guests.map((guest, i) => ({ set: 'cut' + (i + 1), value: values[i] }));
  const right = o.guests.map((guest) => guest.fits), swapped = right.slice().reverse();
  return {
    id: o.id, phase: o.phase, scene: 'kitchen', height: o.guests.length === 1 ? 62 : 98, action: 'Serve!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.guests.forEach((guest, i) => {
        const key = i + 1, y = 4 + i * 48;
        stage.sprite({ emoji: guest.emoji, x: 9, y: y + 9, size: 11 });
        stage.block({ x: PAN_X, y: y + 2, w: PAN_W, h: 13, color: '#8a5a3c', round: 1.5, border: 'night' });          // the whole brownie
        const lines = [1, 2, 3].map((n) => stage.block({ x: PAN_X, y: y + 2, w: 0.7, h: 13, color: 'cream', round: 0, z: 2 }));
        stage.block({ x: PLATE_X, y: y + 1, w: PAN_W / guest.fits + 2.4, h: 15, color: 'white', round: 2, border: 'forest' });   // the plate
        stage.label({ text: 'plate', x: PLATE_X + (PAN_W / guest.fits + 2.4) / 2, y: y + 19.5, size: 3.2 });
        const piece = stage.block({ id: 'piece' + key, x: PLATE_X + 1.2, y: y + 2, w: PAN_W, h: 13, color: '#8a5a3c', round: 1.5, z: 3 });
        if (o.hidden) piece.hide();
        stage.stepper({ id: 'cut' + key, x: 42, y: y + 32, min: 1, max: 4, value: 1, format: (v) => 'Cut into ' + NAMES[v] });
        const draw = () => {
          const n = cuts(stage, key);
          lines.forEach((line, k) => (k + 1 < n ? line.set({ x: PAN_X + (PAN_W * (k + 1)) / n - 0.35 }).show() : line.hide()));
          if (!o.hidden) piece.set({ w: PAN_W / n });
        };
        draw(); stage.on('change', draw);
      });
    },
    check: (stage) => o.guests.every((guest, i) => cuts(stage, i + 1) === guest.fits),
    solution: () => serve(right),
    mistakes: o.guests.length === 2 ? [{
      tag: 'bigger_number_bigger_piece', when: (stage) => o.guests.every((guest, i) => cuts(stage, i + 1) === swapped[i]), steps: () => serve(swapped),
      say: 'More cuts make smaller pieces. The big plate needs the brownie cut into fewer pieces.',
    }] : [],
    // On a win every piece is served, so the child sees it fit.
    onWin(stage) { o.guests.forEach((guest, i) => stage.get('piece' + (i + 1)).set({ w: PAN_W / guest.fits }).show()); },
  };
}

// Fresh guests for the last round. The first guest always has the bigger plate.
const lastGuests = Sidekick.pick([
  [{ emoji: '🐘', fits: 2 }, { emoji: '🐜', fits: 4 }],
  [{ emoji: '🦊', fits: 2 }, { emoji: '🐿️', fits: 3 }],
  [{ emoji: '🐼', fits: 3 }, { emoji: '🐥', fits: 4 }],
]);

Sidekick.game({
  title: 'Brownie Plates',
  emoji: '🍫',
  premise: 'Each guest gets one piece that fits their plate. Choose how many equal pieces to cut.',
  outro: 'Everyone is served! The more equal pieces you cut, the smaller each piece is.',
  rounds: [
    table({ id: 'mouse', phase: 'guided', guests: [{ emoji: '🐭', fits: 4 }],
      say: 'Mouse has a small plate. Cut the brownie into equal pieces until one piece fits the plate.',
      hints: ['Tap + and watch the piece on the plate shrink.', 'Fourths are the smallest pieces here.'],
      win: 'One fourth fits. Four pieces means small pieces.' }),
    table({ id: 'bear', phase: 'guided', guests: [{ emoji: '🐻', fits: 2 }],
      say: 'Bear has a big plate. Which cut gives a piece that fills it?',
      hints: ['Fewer pieces means bigger pieces.', 'Cut the brownie into halves.'],
      win: 'One half fills the big plate.' }),
    table({ id: 'both', phase: 'guided', guests: [{ emoji: '🐻', fits: 2 }, { emoji: '🐭', fits: 4 }],
      say: 'Bear and Mouse each have a brownie. Cut each one so a single piece fits the plate.',
      hints: ['The big plate needs a big piece.', 'Halves for Bear. Fourths for Mouse.'],
      win: 'Halves are bigger than fourths, even though 4 is more than 2.' }),
    table({ id: 'no-peeking', phase: 'solo', hidden: true, guests: lastGuests,
      say: 'The pieces stay in the pan until you serve. Choose the cut for each plate.' }),
  ],
});
