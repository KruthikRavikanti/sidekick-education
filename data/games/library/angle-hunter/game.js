// Angle Hunter. Skill 2.G.A.1-2.
// Recognizing shapes with a given number of angles: the child counts corners on varied shapes. Miscounting on irregular shapes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Hunter",
  emoji: "🔻",
  premise: "Every corner of a shape is an angle. Count carefully and tap the shapes with just the right number.",
  outro: "A shape has as many angles as it has corners.",
  scene: "paper",
  kind: "pick",
  hint: "Touch each corner once as you count.",
  tag: "miscounts_angles",
  rounds: [
    { say: "Tap every shape with exactly 4 angles.", yes: "~quad:trap ~quad:rhomb ~quad:rect ~quad:odd", no: "~tri:e ~ngon:5 ~ngon:6", trap: "~ngon:5", why: "Count its corners: 1, 2, 3, 4, 5. That is five angles.", win: "Four corners, four angles." },
    { say: "Tap every shape with exactly 3 angles.", yes: "~tri:r ~tri:o ~tri:s", no: "~quad:kite ~ngon:5 ~quad:para", trap: "~quad:kite", why: "Count its corners. The kite has four.", win: "Three corners, three angles." },
    { say: "Tap every shape with exactly 4 angles.", yes: "~quad:kite ~quad:para ~quad:sq", no: "~tri:i ~ngon:5 ~ngon:6 ~tri:r", trap: "~ngon:5" },
  ],
}));
