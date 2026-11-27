// Shadow Math. Skill G-SRT.B.5-1.
// Using similarity criteria for triangles to solve problems. Setting up the proportion with non-corresponding sides is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shadow Math",
  emoji: "🌳",
  premise: "At the same moment, every upright object and its shadow make similar triangles. Height over shadow is the same for all of them.",
  outro: "Set up the proportion with corresponding sides: height ÷ shadow = height ÷ shadow.",
  scene: "field",
  kind: "type",
  icon: "🌳",
  hint: "Match height with height and shadow with shadow.",
  tag: "non_corresponding_sides",
  rounds: [
    { say: "Key in the height of the tree.", q: "A 6-foot person casts a 4-foot shadow. A tree casts a 20-foot shadow.", ans: 30, trap: 22, why: "That adds 16 feet. The shadow is 5 times as long, so the tree is 5 times as tall.", win: "6 × 5 = 30 feet." },
    { say: "Key in the height of the building.", q: "A 2-meter pole casts a 3-meter shadow. A building casts a 30-meter shadow.", ans: 20, trap: 45, why: "That put shadow over height. The shadow is 10 times longer, so the height is 10 times 2.", win: "2 × 10 = 20 meters." },
    { say: "Find the height by yourself.", alt: [{ q: "A 5-foot post casts a 2-foot shadow. A flagpole casts a 12-foot shadow.", ans: 30, trap: 15 }, { q: "A 4-meter stick casts a 6-meter shadow. A tower casts a 60-meter shadow.", ans: 40, trap: 90 }, { q: "A 3-foot child casts a 5-foot shadow. A lamp post casts a 25-foot shadow.", ans: 15, trap: 23 }] },
  ],
}));
