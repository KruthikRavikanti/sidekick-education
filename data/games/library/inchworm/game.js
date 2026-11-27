// Inchworm. Skill: start measuring at 0.
// A ruler counts spaces from 0. If the worm's tail is not on 0, the number at its head is
// not its length, and neither is the count of marks it covers.
const X0 = 8, STEP = 8.4, BODY_Y = 24;
const inches = (v) => v + (v === 1 ? ' inch' : ' inches');

function draw(stage, tail, length) {
  const body = stage.block({ id: 'body', x: X0 + tail * STEP, y: BODY_Y, w: length * STEP, h: 9, color: 'leaf', round: 5, border: 'forest', z: 4 });
  const head = stage.sprite({ id: 'head', emoji: '🐛', x: X0 + (tail + length) * STEP - 3, y: BODY_Y - 5, size: 7, z: 12 });
  return { body, head };
}
function ruler(stage) {
  stage.block({ x: 3, y: 36, w: 94, h: 14, color: 'sun', round: 2, border: 'forest' });
  return stage.track({ id: 'ruler', x: X0, y: 39, w: STEP * 10, min: 0, max: 10, step: 1 });
}

// Rounds 1 and 2: the worm can slide. Line its tail up with 0, then read its head.
function slide(o) {
  const tail = (stage) => stage.get('tail').value, said = (stage) => stage.get('len').value;
  return {
    id: o.id, phase: 'guided', scene: 'forest', height: 72, action: 'Measure!', say: o.say, hints: o.hints, win: o.win,
    setup(stage) {
      ruler(stage);
      const worm = draw(stage, o.tail, o.length);
      stage.marker({ id: 'tail', track: 'ruler', value: o.tail, emoji: '👆', size: 8, dy: 9, label: 'Slide the worm' });
      stage.stepper({ id: 'len', x: 50, y: 62, min: 0, max: 10, value: 0, format: inches });
      // The world reacts: the whole worm follows its tail along the ruler.
      stage.on('change', () => {
        const at = Math.min(tail(stage), 10 - o.length);
        worm.body.set({ x: X0 + at * STEP });
        worm.head.moveTo(X0 + (at + o.length) * STEP - 3, BODY_Y - 5);
      });
    },
    check: (stage) => tail(stage) === 0 && said(stage) === o.length,
    solution: () => [{ slide: 'tail', value: 0 }, { set: 'len', value: o.length }],
    mistakes: [{
      tag: 'reads_the_head_number', when: (stage) => tail(stage) === o.tail && said(stage) === o.tail + o.length, steps: () => [{ set: 'len', value: o.tail + o.length }],
      say: 'The head is at ' + (o.tail + o.length) + ', but the tail is not at 0 yet. Slide the worm to 0 first.',
    }],
  };
}

// Rounds 3 and 4: the worm will not move. Count the spaces from tail to head.
function stuck(o) {
  const said = (stage) => stage.get('len').value;
  const wrong = (tag, value, say) => ({ tag, when: (stage) => said(stage) === value, steps: () => [{ set: 'len', value }], say });
  return {
    id: o.id, phase: o.phase, scene: 'forest', height: 72, action: 'Measure!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      ruler(stage); draw(stage, o.tail, o.length);
      stage.sprite({ emoji: '😴', x: X0 + (o.tail + o.length) * STEP + 4, y: BODY_Y - 9, size: 5 });
      stage.stepper({ id: 'len', x: 50, y: 62, min: 0, max: 10, value: 0, format: inches });
    },
    check: (stage) => said(stage) === o.length,
    solution: () => [{ set: 'len', value: o.length }],
    mistakes: [
      wrong('reads_the_head_number', o.tail + o.length, 'That is the number at the head. The tail starts at ' + o.tail + ', not 0. Count the spaces in between.'),
      wrong('counts_the_marks', o.length + 1, 'That counts the little marks. An inch is the space between two marks.'),
    ],
  };
}

// A fresh sleepy worm for the last round. Tail never on 0 or 1, so the two slips give different numbers.
const last = Sidekick.pick([{ tail: 2, length: 6 }, { tail: 3, length: 4 }, { tail: 4, length: 5 }, { tail: 2, length: 7 }]);

Sidekick.game({
  title: 'Inchworm',
  emoji: '🐛',
  premise: 'How long is each worm? Measure from 0, or count the spaces if the worm will not move.',
  outro: 'Well measured! Length is the number of spaces from the tail to the head.',
  rounds: [
    slide({ id: 'slide-to-zero', tail: 2, length: 4,
      say: 'Drag the hand to slide the worm until its tail sits on 0. Then set how long it is.',
      hints: ['Slide the hand left to the 0 mark.', 'With the tail on 0, the head points at the length.'],
      win: 'Tail on 0, head on 4. The worm is 4 inches long.' }),
    slide({ id: 'another-worm', tail: 3, length: 6,
      say: 'Another worm, and its tail is on 3. Line it up with 0 before you read it.',
      hints: ['The head is on 9 now, but the worm does not start at 0.', 'Slide to 0. The head lands on 6.'],
      win: 'From 0 to 6. That worm is 6 inches long.' }),
    stuck({ id: 'sleepy-worm', phase: 'guided', tail: 3, length: 5,
      say: 'This worm is asleep and will not move. Its tail is on 3 and its head is on 8. How long is it?',
      hints: ['Count the spaces from 3 to 8, not the marks.', '3 to 4 is one inch. Keep counting to 8.'],
      win: 'Five spaces from 3 to 8. The worm is 5 inches long.' }),
    stuck({ id: 'last-worm', phase: 'solo', tail: last.tail, length: last.length,
      say: 'One more sleepy worm. Its tail is not on 0. Work out how long it is.' }),
  ],
});
