// Mirror Lines. Skill GA-3-GSR.6.3-1.
// Lines of symmetry in polygons: the diagonal of a rectangle is not a line of symmetry, though it passes through the middle. That is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mirror Lines",
  emoji: "❄️",
  premise: "A line of symmetry is a fold that makes two matching halves. Some shapes have several. Some lines only look like one.",
  outro: "A line of symmetry folds a shape exactly onto itself.",
  scene: "snow",
  kind: "pick",
  cast: "",
  hint: "Picture folding along the line. Do the two halves land on each other?",
  tag: "rectangle_diagonal_is_symmetry",
  rounds: [
    { say: "Tap every dashed line that is a line of symmetry.", yes: "~sym:rect:v ~sym:rect:h ~sym:sq:d ~sym:tri:v", no: "~sym:rect:d ~sym:tri:h ~sym:rect:o", trap: "~sym:rect:d", why: "Fold a rectangle corner to corner. The halves do not land on each other.", win: "Those folds match exactly." },
    { say: "How many lines of symmetry does a square have? Set the number.", kind: "dial", dials: [["Lines", 0, 6]], view: { type: "text", text: "{0} lines of symmetry" }, fig: { type: "poly", pts: [[20, 10], [80, 10], [80, 90], [20, 90]] }, ans: [4], trap: [2], why: "A square also folds corner to corner, both ways.", win: "Up, across and two diagonals: 4 lines." },
    { say: "Set the number of lines of symmetry by yourself.", kind: "dial", dials: [["Lines", 0, 6]], view: { type: "text", text: "{0} lines of symmetry" }, alt: [{ say: "How many lines of symmetry does this rectangle have?", fig: { type: "poly", pts: [[5, 25], [95, 25], [95, 75], [5, 75]] }, ans: [2], trap: [4] }, { say: "How many lines of symmetry does this triangle with three equal sides have?", fig: { type: "poly", pts: [[50, 8], [96, 88], [4, 88]] }, ans: [3], trap: [1] }] },
  ],
}));
