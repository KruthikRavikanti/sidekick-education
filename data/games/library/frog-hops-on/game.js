// Frog Hops On. Skill K.CC.A.2-1.
// Counting on from a given number: the frog starts on a pad, and the child slides it forward by counting on instead of starting again at 1.
Sidekick.game(Sidekick.play({
  title: "Frog Hops On",
  emoji: "🐸",
  premise: "The frog is already sitting on a lily pad. Count on from there to find where it lands.",
  outro: "You counted on from where the frog was. No need to go back to 1!",
  scene: "meadow",
  kind: "line",
  cast: "🪷 🌿 🪷 🌿",
  hint: "Start from the frog. Say the next number for each hop.",
  tag: "restarts_at_one",
  line: [0, 20, 1],
  icon: "🐸",
  rounds: [
    { say: "The frog is on 7. Hop it 3 more pads.", from: 7, ans: 10, trap: 3, why: "The frog starts on 7, not on 0. Count on: 8, 9, 10.", win: "Seven... 8, 9, 10!" },
    { say: "The frog is on 12. Hop it 4 more pads.", from: 12, ans: 16, trap: 4, why: "Start where the frog is. Count on: 13, 14, 15, 16.", win: "Twelve... 13, 14, 15, 16!" },
    { say: "Your turn. Hop the frog the right number of pads.", alt: [{ say: "The frog is on 9. Hop it 5 more pads.", from: 9, ans: 14, trap: 5 }, { say: "The frog is on 11. Hop it 6 more pads.", from: 11, ans: 17, trap: 6 }, { say: "The frog is on 8. Hop it 4 more pads.", from: 8, ans: 12, trap: 4 }] },
  ],
}));
