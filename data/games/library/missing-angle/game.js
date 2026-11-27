// Missing Angle. Skill 4.MD.C.7-2.
// Finding unknown angles in a diagram: the missing part is the whole minus the known part. Adding when subtraction is needed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Missing Angle",
  emoji: "🔎",
  premise: "You know the whole angle and one of its parts. Work out the part that is hidden.",
  outro: "Whole angle − known part = missing part.",
  scene: "paper",
  kind: "type",
  hint: "The two parts add up to the whole. Take the known part away from the whole.",
  tag: "adds_instead_of_subtracting",
  rounds: [
    { say: "A square corner is split in two. Key in the missing part.", fig: { type: "angle", v: [90], ref: 35 }, q: "The whole angle is 90°. One part is 35°.", ans: 55, trap: 125, why: "The missing part is inside the 90 degrees, so it must be smaller than 90.", win: "90 − 35 = 55 degrees." },
    { say: "A straight line is split in two. Key in the missing part.", fig: { type: "angle", v: [180], ref: 110 }, q: "The whole angle is 180°. One part is 110°.", ans: 70, trap: 290, why: "The missing part is inside the 180 degrees. Subtract.", win: "180 − 110 = 70 degrees." },
    { say: "Find the missing part by yourself.", alt: [{ fig: { type: "angle", v: [90], ref: 28 }, q: "The whole angle is 90°. One part is 28°.", ans: 62, trap: 118 }, { fig: { type: "angle", v: [180], ref: 65 }, q: "The whole angle is 180°. One part is 65°.", ans: 115, trap: 245 }, { fig: { type: "angle", v: [140], ref: 85 }, q: "The whole angle is 140°. One part is 85°.", ans: 55, trap: 225 }] },
  ],
}));
