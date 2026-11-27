// Yarn Shop. Skill 2.MD.B.5-1.
// Addition and subtraction word problems with lengths in the same unit. Choosing the opposite operation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Yarn Shop",
  emoji: "🧶",
  premise: "The yarn shop cuts and joins lengths all day. Read each order and key in the new length.",
  outro: "Lengths in the same unit can be added and subtracted like any numbers.",
  scene: "candy",
  kind: "type",
  icon: "🧶",
  hint: "Is the length getting longer or shorter in the story?",
  tag: "picks_opposite_operation",
  rounds: [
    { say: "Key in the new length in feet.", q: "A rope is 45 feet long. 18 feet are cut off. How many feet long is it now?", ans: 27, trap: 63, why: "Some rope was cut off, so the rope is shorter than 45 feet.", win: "45 − 18 = 27 feet." },
    { say: "Key in the length in meters.", q: "A fence has 26 meters built and 38 meters still to build. How many meters long will it be?", ans: 64, trap: 12, why: "Both parts are fence. Put them together.", win: "26 + 38 = 64 meters." },
    { say: "Solve this order by yourself.", alt: [{ q: "A snake is 52 inches long. It grows 19 inches. How many inches long is it now?", ans: 71, trap: 33 }, { q: "A 70 foot hose has 25 feet rolled out. How many feet are still rolled up?", ans: 45, trap: 95 }] },
  ],
}));
