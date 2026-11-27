// Parallel Line Angles. Skill 8.G.A.5-2.
// Using facts about the angles created when parallel lines are cut by a transversal. Matching the angle pairs incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parallel Line Angles",
  emoji: "🛤️",
  premise: "When a line crosses two parallel lines, it makes the same set of angles at both crossings. Only two sizes appear, and they add to 180°.",
  outro: "Corresponding and alternate interior angles are equal. Same-side interior angles add to 180°.",
  scene: "city",
  kind: "type",
  unit: "°",
  hint: "Is the angle in the same corner at the other crossing? Is it wide or narrow, like the one you know?",
  tag: "matches_other_pairs",
  rounds: [
    { say: "The lines are parallel. Key in the missing angle.", fig: { type: "transversal", mark: { "1": "110°", "5": "?" }, v: [] }, ans: 110, trap: 70, why: "It sits in the same corner of the other crossing. Matching corners are equal.", win: "Corresponding angles: 110°." },
    { say: "Key in the missing angle.", fig: { type: "transversal", mark: { "4": "110°", "5": "?" }, v: [] }, ans: 110, trap: 70, why: "These are between the lines on opposite sides of the crossing line. They are equal.", win: "Alternate interior angles: 110°." },
    { say: "Key in the missing angle.", fig: { type: "transversal", mark: { "4": "110°", "6": "?" }, v: [] }, ans: 70, trap: 110, why: "These two are on the same side, between the lines. One is wide and one is narrow.", win: "Same-side interior: 180 − 110 = 70°." },
    { say: "Find the missing angle by yourself.", alt: [{ fig: { type: "transversal", mark: { "3": "65°", "6": "?" }, v: [] }, ans: 65, trap: 115 }, { fig: { type: "transversal", mark: { "1": "120°", "8": "?" }, v: [] }, ans: 120, trap: 60 }, { fig: { type: "transversal", mark: { "2": "75°", "5": "?" }, v: [] }, ans: 105, trap: 75 }] },
  ],
}));
