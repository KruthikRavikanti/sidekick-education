// Tent Trip. Skill: decide what a remainder means in the story.
// 14 campers with 4 to a tent is 3 tents with 2 campers left over. Those 2 still need to
// sleep somewhere, so the answer is 4 tents. For canoes it flips: only full canoes may launch.
const MAX = 8, homeX = (i) => 8 + i * 12, waitX = (j) => 5 + (j % 13) * 7.4, waitY = (j) => 41 + Math.floor(j / 13) * 6.2;

function camp(o) {
  const q = Math.floor(o.n / o.k), r = o.n % o.k, boats = o.kind === 'canoe', need = boats ? q : q + 1;
  const count = (stage) => stage.get('count').value, thing = boats ? 'canoes' : 'tents';
  const wrong = (tag, value, say) => ({ tag, when: (stage) => count(stage) === value, steps: () => [{ set: 'count', value }], say });
  const mistakes = boats
    ? [wrong('launches_a_part_full_boat', q + 1, 'The last canoe has only ' + r + ' paddlers. It cannot launch, so it does not count.')]
    : [wrong('ignores_the_remainder', q, q + ' tents hold ' + q * o.k + ' campers. ' + r + ' are left in the rain. They need a tent too.')]
        .concat(r !== q && r !== q + 1 ? [wrong('answers_the_remainder', r, r + ' is how many are left over, not how many tents are needed.')] : []);
  return {
    id: o.id, phase: o.phase, scene: boats ? 'ocean' : 'forest', height: 72, action: boats ? 'Launch!' : 'Camp!', say: o.say, hints: o.hints || [], win: o.win || '', mistakes,
    setup(stage) {
      const homes = Array.from({ length: MAX }, (_, i) => stage.sprite({ emoji: boats ? '🛶' : '⛺', x: homeX(i), y: 9, size: 8, hidden: true }));
      const people = Array.from({ length: o.n }, (_, j) => stage.sprite({ emoji: '🧒', x: waitX(j), y: waitY(j), size: 4, z: 12 }));
      const note = stage.label({ text: o.n + ' campers, ' + o.k + ' in each ' + (boats ? 'canoe' : 'tent'), x: 50, y: 34, size: 3.8, card: true });
      stage.stepper({ id: 'count', x: 50, y: 62, min: 0, max: MAX, value: 0, format: (v) => v + ' ' + thing });
      const settle = (homesUsed) => people.forEach((p, j) => {
        const i = Math.floor(j / o.k), s = j % o.k;
        if (i < homesUsed) p.moveTo(homeX(i) - 2.6 + (s % 2) * 5.2, 17.5 + Math.floor(s / 2) * 4.4); else p.moveTo(waitX(j), waitY(j));
      });
      // The world reacts: campers move in as soon as there is room.
      stage.on('change', () => {
        const n = count(stage), room = n * o.k;
        homes.forEach((home, i) => (i < n ? home.show() : home.hide()));
        if (!o.helped) return;
        settle(n);
        note.set(room < o.n ? (o.n - room) + (boats ? ' paddlers still on shore' : ' campers have no tent')
          : boats ? (room - o.n >= o.k ? 'An empty canoe!' : room > o.n ? 'One canoe has empty seats' : 'Every canoe is full')
            : room - o.n >= o.k ? 'An empty tent! That is too many.' : 'Everyone has a place to sleep');
      });
      stage.data = { settle };
    },
    check: (stage) => count(stage) === need,
    solution: () => [{ set: 'count', value: need }],
    onWin(stage) { stage.data.settle(need); },
  };
}

// A fresh group for the last round. The remainder is never zero.
const last = Sidekick.pick([{ n: 26, k: 4 }, { n: 20, k: 6 }, { n: 19, k: 4 }, { n: 17, k: 5 }]);

Sidekick.game({
  title: 'Tent Trip',
  emoji: '⛺',
  premise: 'Pack for the camping trip. Work out how many tents and canoes the group really needs.',
  outro: 'Good trip! A remainder is real: sometimes it needs one more, and sometimes it has to stay out.',
  rounds: [
    camp({ id: 'fourteen', phase: 'guided', helped: true, n: 14, k: 4,
      say: '14 campers, and each tent sleeps 4. Add tents until nobody is left out in the rain.',
      hints: ['3 tents hold 12 campers. Are any left over?', 'The 2 left over need a tent of their own.'],
      win: '14 ÷ 4 is 3 with 2 left over, so the trip needs 4 tents.' }),
    camp({ id: 'twenty-three', phase: 'guided', helped: true, n: 23, k: 5,
      say: 'A bigger group: 23 campers, 5 to a tent. How many tents do they need?',
      hints: ['4 tents hold 20.', '3 campers are left, so one more tent.'],
      win: '23 ÷ 5 is 4 with 3 left over. They need 5 tents.' }),
    camp({ id: 'canoes', phase: 'guided', helped: true, kind: 'canoe', n: 17, k: 3,
      say: 'Canoe time! 17 paddlers, and a canoe launches only with all 3 seats full. How many canoes launch?',
      hints: ['5 canoes use 15 paddlers.', 'The 2 left over cannot fill a canoe, so they stay on shore.'],
      win: '17 ÷ 3 is 5 with 2 left over. Only 5 full canoes launch.' }),
    camp({ id: 'last-group', phase: 'solo', n: last.n, k: last.k,
      say: 'Last group: ' + last.n + ' campers, ' + last.k + ' to a tent. Nobody moves until you decide. How many tents?' }),
  ],
});
