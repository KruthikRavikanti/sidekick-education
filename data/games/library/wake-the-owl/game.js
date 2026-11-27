// Wake the Owl. Skill: read the hour on an analog clock.
// The short hand names the hour. At every o'clock the long hand points straight up at 12,
// so reading the long hand always says 12 and Owl wakes at the wrong time.
const NUMBERS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1, a = (n * 30 - 90) * Math.PI / 180;
  return '<text x="' + (50 + 37 * Math.cos(a)).toFixed(1) + '" y="' + (50 + 37 * Math.sin(a) + 3.6).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#054a29" font-family="Fredoka, sans-serif">' + n + '</text>';
}).join('');
const face = (hour) => '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff9f0" stroke="#054a29" stroke-width="4"/>' + NUMBERS +
  '<line x1="50" y1="50" x2="50" y2="14" stroke="#6ec3f4" stroke-width="3.5" stroke-linecap="round"/>' +
  '<line class="short" x1="50" y1="50" x2="50" y2="27" stroke="#f79256" stroke-width="6" stroke-linecap="round" transform="rotate(' + hour * 30 + ' 50 50)"/>' +
  '<circle cx="50" cy="50" r="4" fill="#054a29"/></svg>';
const oclock = (v) => v + ':00';

function scene(stage, hour) {
  stage.sprite({ id: 'owl', emoji: '🦉', x: 80, y: 13, size: 14 });
  stage.sprite({ id: 'zzz', emoji: '💤', x: 91, y: 6, size: 6, float: true });
  stage.label({ text: 'short hand = hour', x: 78, y: 30, size: 3.6, color: 'white' });
  return stage.add(face(hour), { x: 6, y: 5, w: 48, h: 48 });
}
const wake = (stage) => { stage.get('zzz').hide(); stage.get('owl').pop(); };

// Round 1: the child turns the short hand.
const setTheHand = {
  id: 'turn-the-hand', phase: 'guided', scene: 'night', height: 74, action: 'Ring!',
  say: 'Owl wakes at 7 o\'clock. Turn the short orange hand until it points to 7.',
  hints: ['Tap + to move the short hand around the clock.', 'The long blue hand stays on 12. Only the short hand names the hour.'],
  win: 'Short hand on 7, long hand on 12. It is 7 o\'clock!',
  setup(stage) {
    const clock = scene(stage, 12);
    stage.stepper({ id: 'hour', x: 50, y: 64, min: 1, max: 12, value: 12, format: (v) => 'Short hand: ' + v });
    stage.on('change', () => clock.querySelector('.short').setAttribute('transform', 'rotate(' + stage.get('hour').value * 30 + ' 50 50)'));
  },
  check: (stage) => stage.get('hour').value === 7,
  solution: () => [{ set: 'hour', value: 7 }],
  mistakes: [],
  onWin: wake,
};

// After that the clock is set and the child reads it onto the alarm.
function readTheClock(o) {
  const alarm = (stage) => stage.get('alarm').value;
  return {
    id: o.id, phase: o.phase, scene: 'night', height: 74, action: 'Ring!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      scene(stage, o.hour);
      stage.stepper({ id: 'alarm', x: 50, y: 64, min: 1, max: 12, value: 1, format: (v) => '⏰ ' + oclock(v) });
    },
    check: (stage) => alarm(stage) === o.hour,
    solution: () => [{ set: 'alarm', value: o.hour }],
    mistakes: [{
      tag: 'reads_the_long_hand', when: (stage) => alarm(stage) === 12, steps: () => [{ set: 'alarm', value: 12 }],
      say: 'The long blue hand is on 12, but it does not name the hour. Look where the short orange hand points.',
    }],
    onWin: wake,
  };
}

// A fresh time for the last round. Never 12, where both hands point the same way.
const hour = Sidekick.pick([2, 5, 8, 4, 9, 11]);

Sidekick.game({
  title: 'Wake the Owl',
  emoji: '🦉',
  premise: 'Owl sleeps all day and needs an alarm. Read the clock and set the right hour.',
  outro: 'Owl is up! The short hand tells the hour. At o\'clock the long hand rests on 12.',
  rounds: [
    setTheHand,
    readTheClock({ id: 'three', phase: 'guided', hour: 3,
      say: 'Now read the clock. Set the alarm to the time it shows.',
      hints: ['Find the short orange hand.', 'The short hand points to 3. That is 3 o\'clock.'],
      win: 'The short hand points to 3. It is 3:00.' }),
    readTheClock({ id: 'ten', phase: 'guided', hour: 10,
      say: 'A new time on the clock. Which hour does the short hand point to?',
      hints: ['Do not read the long hand. It is on 12 at every o\'clock.', 'The short hand is on 10.'],
      win: 'It is 10:00.' }),
    readTheClock({ id: 'last-alarm', phase: 'solo', hour,
      say: 'Last alarm of the night. Read the clock and set the alarm to match.' }),
  ],
});
