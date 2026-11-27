// Same Way Round?. Skill G-CO.B.6-1.
// Using rigid motions to predict their effect on a figure. Thinking orientation always stays the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Way Round?",
  emoji: "🔄",
  premise: "Slides and turns keep a figure facing the same way round. A single flip reverses the order of its corners.",
  outro: "Translations and rotations keep orientation. One reflection reverses it. Two reflections restore it.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "Read the corners A, B, C. Still clockwise, or now counterclockwise?",
  tag: "orientation_always_same",
  rounds: [
    { say: "After each motion, does the corner order stay the same or reverse?", bins: "Stays the same|Reverses", items: ["translation|rotation|two reflections", "one reflection|a reflection, then a slide"], trap: ["one reflection", 0], why: "A mirror image reads the other way round.", win: "An odd number of flips reverses it." },
    { say: "A triangle is reflected. True or not true?", fs: 4.8, bins: "True|Not true", items: ["Its side lengths stay the same.|Its angles keep their measures.|Its corners now read in the opposite direction.", "Its area changes.|It gets larger."], trap: ["Its corners now read in the opposite direction.", 1], why: "Clockwise A, B, C becomes counterclockwise after a flip.", win: "Same size and shape, opposite orientation." },
    { say: "Sort these by yourself.", bins: "Stays the same|Reverses", items: ["slide right 4|turn 180°|flip, then flip again", "flip over the x-axis|flip, then turn 90°"], trap: ["flip, then flip again", 1] },
  ],
}));
