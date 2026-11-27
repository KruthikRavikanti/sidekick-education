// Distance Between Complex Numbers. Skill N-CN.B.6-1.
// Calculating the distance between numbers in the complex plane as the modulus of the difference. Adding the numbers first is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distance Between Complex Numbers",
  emoji: "📡",
  premise: "To find how far apart two complex numbers are, subtract them. The modulus of the difference is the distance.",
  outro: "Distance between z and w = the modulus of z − w.",
  scene: "space",
  kind: "type",
  icon: "📡",
  hint: "Subtract real from real and imaginary from imaginary. Then find the modulus.",
  tag: "adds_before_modulus",
  rounds: [
    { say: "Key in the distance between 1 + 2i and 4 + 6i.", q: "difference: 3 + 4i", ans: 5, trap: 7, why: "7 adds the two legs. The distance is √(9 + 16).", win: "√25 = 5." },
    { say: "Key in the distance between 2 + i and 8 + 9i.", q: "difference: 6 + 8i", ans: 10, trap: 14, why: "Square 6 and 8, add, then take the root.", win: "√100 = 10." },
    { say: "Find the distance by yourself.", alt: [{ q: "between 0 and 5 + 12i", ans: 13, trap: 17 }, { q: "between 1 + i and 4 + 5i", ans: 5, trap: 7 }, { q: "between 2 + 3i and 10 + 18i", ans: 17, trap: 23 }] },
  ],
}));
