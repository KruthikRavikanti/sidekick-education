// Critter Race. Skill: compare decimals by place value, not by how many digits they have.
// Each critter crawled part of a meter. On the track 0.5 is clearly ahead of 0.405, even
// though 0.405 has more digits. In the last race fog hides the track.
const CRITTERS = ['🐌', '🐢', '🐛'];
const digits = (v) => String(v).length;

function race(o) {
  const byDistance = o.values.slice().sort((a, b) => b - a), byLength = o.values.slice().sort((a, b) => digits(b) - digits(a));
  const tag = (v) => 'tag' + o.values.indexOf(v);
  const podium = (stage) => ['p1', 'p2', 'p3'].map((id) => stage.get(id).values()[0]);
  const place = (order) => order.map((v, i) => ({ drag: tag(v), to: 'p' + (i + 1) }));
  const same = (stage, order) => podium(stage).join() === order.join();
  return {
    id: o.id, phase: o.phase, scene: 'forest', height: 78, action: 'Medals!', say: o.say, hints: o.hints || [], win: o.win || '',
    setup(stage) {
      o.values.forEach((v, i) => {
        stage.block({ x: 3, y: 4 + i * 9.5, w: 94, h: 8.5, color: o.fog ? '#cfd6d2' : 'sand', round: 2, border: 'forest' });
        stage.sprite({ id: 'critter' + i, emoji: CRITTERS[i], x: o.fog ? 8 : 8 + v * 84, y: 8.25 + i * 9.5, size: 5.5, z: 6 });
      });
      if (o.fog) stage.label({ text: '🌫️ Fog on the track', x: 55, y: 17.5, size: 4, card: true });
      else [0, 0.5, 1].forEach((m) => stage.label({ text: m + ' m', x: 8 + m * 84, y: 34.5, size: 2.8 }));
      stage.zone({ id: 'tags', x: 4, y: 38, w: 92, h: 14, look: 'tray', label: 'Distance tags', showLabel: false, accepts: 'tag' });
      o.values.forEach((v, i) => stage.sprite({ id: 'tag' + i, text: CRITTERS[i] + ' ' + v, size: 3.5, kind: 'tag', value: v, drag: true, zone: 'tags', label: v + ' meters' }));
      ['🥇 1st', '🥈 2nd', '🥉 3rd'].forEach((name, i) => stage.zone({ id: 'p' + (i + 1), x: 4 + i * 31.5, y: 60, w: 29, h: 15, look: 'slot', color: 'sun', label: name, labelAt: 'top', capacity: 1, swap: true, accepts: 'tag' }));
    },
    check: (stage) => same(stage, byDistance),
    solution: () => place(byDistance),
    mistakes: [{
      tag: 'longer_is_greater', when: (stage) => same(stage, byLength), steps: () => place(byLength),
      say: 'More digits does not mean farther. Compare the tenths first: ' + byDistance[0] + ' has the most tenths.',
    }],
    // On a win the fog lifts and every critter is shown where it really finished.
    onWin(stage) { o.values.forEach((v, i) => stage.get('critter' + i).moveTo(8 + v * 84, 8.25 + i * 9.5)); },
  };
}

// A fresh race for the last round. In every one the longest decimal is not the winner.
const last = Sidekick.pick([[0.305, 0.6, 0.52], [0.375, 0.35, 0.4], [0.75, 0.125, 0.8]]);

Sidekick.game({
  title: 'Critter Race',
  emoji: '🐌',
  premise: 'Three slow critters raced along a one meter track. Hand out the medals by distance.',
  outro: 'Medals for all! Compare decimals place by place: tenths first, then hundredths.',
  rounds: [
    race({ id: 'first-race', phase: 'guided', values: [0.405, 0.5, 0.45],
      say: 'The race is over. Drag each distance tag to a medal: farthest gets gold.',
      hints: ['Look at the track. Who is closest to the 1 m end?', '0.5 is five tenths. 0.45 and 0.405 are only four tenths and a bit.'],
      win: '0.5, then 0.45, then 0.405. The shortest decimal went farthest!' }),
    race({ id: 'second-race', phase: 'guided', values: [0.29, 0.125, 0.3],
      say: 'A new race. Use the track to check, then give out the medals.',
      hints: ['Compare the first digit after the point.', '0.3 has 3 tenths. 0.29 has 2 tenths. 0.125 has 1 tenth.'],
      win: '0.3 beats 0.29, and 0.29 beats 0.125.' }),
    race({ id: 'close-race', phase: 'guided', values: [0.85, 0.9, 0.875],
      say: 'This one is close! Two critters have 8 tenths, so look at their hundredths.',
      hints: ['0.9 has the most tenths, so it wins.', '0.875 has 7 hundredths. 0.85 has only 5.'],
      win: '0.9, then 0.875, then 0.85.' }),
    race({ id: 'foggy-race', phase: 'solo', fog: true, values: last,
      say: 'Fog hides the track! Use only the numbers to give out gold, silver and bronze.' }),
  ],
});
