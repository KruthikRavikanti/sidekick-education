// Root Finder. Skill 8.EE.A.2-2.
// Evaluating square roots of perfect squares and cube roots of perfect cubes. Confusing squaring with doubling is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root Finder",
  emoji: "🧱",
  premise: "A square root asks which number times itself makes this. It is not the same as halving.",
  outro: "√144 = 12 because 12 × 12 = 144. A cube root asks which number is used three times.",
  scene: "desk",
  kind: "type",
  icon: "🧱",
  hint: "Which number times itself gives this?",
  tag: "halves_instead_of_root",
  rounds: [
    { say: "Key in the square root.", q: "√144", ans: "12", trap: "72", why: "72 is half of 144. Which number times itself is 144?", win: "12 × 12 = 144." },
    { say: "Key in the cube root.", q: "∛27", ans: "3", trap: "9", why: "9 is 27 ÷ 3. Which number used three times makes 27?", win: "3 × 3 × 3 = 27." },
    { say: "Find the root by yourself.", alt: [{ q: "√196", ans: "14", trap: "98" }, { q: "√400", ans: "20", trap: "200" }, { q: "∛64", ans: "4", trap: "32" }] },
  ],
}));
