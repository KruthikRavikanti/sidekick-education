// Turn the Arm. Skill 4.MD.C.5-2.
// Measuring an angle as a fraction of a full turn: a quarter turn is 1/4 of the circle, or 90 degrees. Not relating angles to turns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Turn the Arm",
  emoji: "🎡",
  premise: "An angle is a turn. A full turn goes all the way around the circle, and every other angle is a fraction of that.",
  outro: "A full turn is 360 degrees. A quarter turn is 90, a half turn is 180.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "A full turn is 360 degrees. Cut that into the same fraction.",
  tag: "cannot_relate_angles_to_turns",
  rounds: [
    { say: "Match each turn to its degrees.", rows: [["~pie:1/4", "90°"], ["~pie:1/2", "180°"], ["~pie:4/4", "360°"]], extra: "25° 100°", trap: [0, "25°"], why: "A quarter of 100 is 25, but a full turn is 360 degrees. A quarter of 360 is 90.", win: "90, 180 and 360 degrees." },
    { say: "Turn the arm half of a full turn.", kind: "dial", dials: [["Degrees", 0, 360, 30]], view: { type: "angle", full: true, h: 54 }, ans: [180], trap: [90], why: "That is a quarter turn. A half turn makes a straight line.", win: "A half turn is 180 degrees." },
    { say: "Match these by yourself.", rows: [["~pie:3/4", "270°"], ["~pie:1/4", "90°"], ["~pie:1/2", "180°"]], extra: "75° 25° 50°", trap: [0, "75°"] },
  ],
}));
