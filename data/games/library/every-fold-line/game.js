// Every Fold Line. Skill 4.G.A.3-2.
// Finding all lines of symmetry of a figure, including horizontal and diagonal ones. Drawing only vertical lines is the known slip.
Sidekick.game(Sidekick.play({
  title: "Every Fold Line",
  emoji: "🦋",
  premise: "A line of symmetry can be straight up, flat, or slanted. Find every fold that makes the two halves match.",
  outro: "Lines of symmetry can go in any direction. A square has four.",
  scene: "meadow",
  kind: "pick",
  figW: 17,
  hint: "Picture folding along the dashed line. Do the two halves land exactly on each other?",
  tag: "only_vertical_lines",
  rounds: [
    { say: "Tap every fold line that makes the square match up.", yes: "~sym:sq:v ~sym:sq:h ~sym:sq:d ~sym:sq:e", no: "~sym:sq:o ~sym:sq:u", trap: "-~sym:sq:d", why: "A slanted fold from corner to corner works on a square too.", win: "A square has four lines of symmetry." },
    { say: "Tap every fold line that works for the rectangle.", yes: "~sym:rect:v ~sym:rect:h", no: "~sym:rect:d ~sym:rect:e ~sym:rect:o", trap: "~sym:rect:d", why: "Fold a rectangle corner to corner and the halves do not land on each other.", win: "A rectangle has two lines of symmetry." },
    { say: "How many lines of symmetry does each shape have?", kind: "fill", cast: "", rows: [["~quad:sq", "4"], ["~quad:rect", "2"], ["~tri:e", "3"]], extra: "1 0", trap: [0, "1"], trap2: [0, "2"] },
  ],
}));
