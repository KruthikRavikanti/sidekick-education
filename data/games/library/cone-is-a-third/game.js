// Cone Is a Third. Skill 8.G.C.9-2.
// Using the formula for the volume of a cone. Forgetting the one third is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cone Is a Third",
  emoji: "🍦",
  premise: "A cone holds exactly one third of the cylinder it fits inside. Three cones of water fill the can.",
  outro: "V = one third × πr²h.",
  scene: "candy",
  kind: "type",
  icon: "🍦",
  unit: "π",
  hint: "Find the cylinder volume first. Then take one third.",
  tag: "forgets_one_third",
  rounds: [
    { say: "Key in the volume in terms of π.", q: "A cone has radius 3 and height 10.", ans: 30, trap: 90, why: "90π is the cylinder around it. The cone is one third of that.", win: "90 ÷ 3 = 30π." },
    { say: "Key in the volume in terms of π.", q: "A cone has radius 6 and height 5.", ans: 60, trap: 180, why: "180π is the full cylinder. Divide by 3.", win: "180 ÷ 3 = 60π." },
    { say: "Find the volume by yourself, in terms of π.", alt: [{ q: "A cone has radius 3 and height 4.", ans: 12, trap: 36 }, { q: "A cone has radius 2 and height 9.", ans: 12, trap: 36 }, { q: "A cone has radius 5 and height 6.", ans: 50, trap: 150 }] },
  ],
}));
