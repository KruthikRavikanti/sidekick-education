// Fraction Box Volume. Skill 6.G.A.2-2.
// Applying V = l × w × h with fractional edge lengths. Multiplying the fractions incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Box Volume",
  emoji: "📦",
  premise: "Volume is still length times width times height, even when an edge is a fraction.",
  outro: "V = l × w × h works with fractions. Multiply two edges, then multiply by the third.",
  scene: "desk",
  kind: "type",
  hint: "Multiply two of the numbers first. Half of a number is that number ÷ 2.",
  tag: "multiplies_fractions_incorrectly",
  rounds: [
    { say: "Key in the volume.", q: "A box is 2{1/2} by 4 by {1/2} units.", fig: { type: "cubes", d: [5, 4, 1], solid: true, l: ["2½", "4", "½"], v: [] }, ans: "5", trap: "4.25", why: "2 and a half times 4 is 10. Then half of 10.", win: "10 × one half = 5 cubic units." },
    { say: "Key in the volume.", q: "A box is {1/2} by {1/2} by 8 units.", ans: "2", trap: "8", why: "Half of a half is a quarter. A quarter of 8 is 2.", win: "One quarter × 8 = 2 cubic units." },
    { say: "Find the volume by yourself.", alt: [{ q: "A box is 1{1/2} by 2 by 3 units.", ans: "9", trap: "7.5" }, { q: "A box is 3 by {1/2} by 6 units.", ans: "9", trap: "18" }, { q: "A box is 2{1/2} by 2 by 2 units.", ans: "10", trap: "8.5" }] },
  ],
}));
