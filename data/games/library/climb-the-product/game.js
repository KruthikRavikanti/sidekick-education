// Climb the Product. Skill 4.NBT.B.5-1.
// Multiplying up to four digits by one digit using place value. Forgetting the regrouped amounts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Climb the Product",
  emoji: "🧗",
  premise: "Multiply one place at a time, from the ones up. Carry the extra with you as you climb.",
  outro: "Multiply each place and add what you carried.",
  scene: "snow",
  kind: "type",
  icon: "🧗",
  hint: "Multiply the ones, write the ones digit and carry the tens. Then add it in the next place.",
  tag: "forgets_to_regroup",
  rounds: [
    { say: "Key in the product.", q: "213 × 3", ans: 639, trap: 216, why: "That added 3 instead of multiplying. Each place is tripled.", win: "213 × 3 = 639." },
    { say: "This one needs carrying.", q: "2,347 × 6", ans: 14082, trap: 12842, why: "6 × 7 is 42: write 2 and carry 4 to the tens.", win: "2,347 × 6 = 14,082." },
    { say: "Key in the product by yourself.", alt: [{ q: "1,526 × 4", ans: 6104, trap: 4084 }, { q: "3,418 × 5", ans: 17090, trap: 15050 }] },
  ],
}));
