// Key to the Factor. Skill 3.OA.A.4-1.
// Finding an unknown factor (8 × ? = 48). Multiplying the two numbers shown is the known slip.
Sidekick.game(Sidekick.play({
  title: "Key to the Factor",
  emoji: "🗝️",
  premise: "A number is missing from each multiplication fact. Find the factor that unlocks it.",
  outro: "The missing factor is how many groups of the first number make the product.",
  scene: "night",
  kind: "type",
  icon: "🗝️",
  hint: "Skip count by the first number until you reach the product.",
  tag: "multiplies_the_two_numbers",
  rounds: [
    { say: "Key in the missing factor.", q: "8 × ▢ = 48", ans: 6, trap: 384, why: "48 is the product. How many 8s make 48?", win: "8 × 6 = 48." },
    { say: "Key in the missing factor.", q: "7 × ▢ = 35", ans: 5, trap: 245, why: "35 is the product. How many 7s make 35?", win: "7 × 5 = 35." },
    { say: "Find the factor by yourself.", alt: [{ q: "9 × ▢ = 63", ans: 7, trap: 567 }, { q: "6 × ▢ = 54", ans: 9, trap: 324 }] },
  ],
}));
