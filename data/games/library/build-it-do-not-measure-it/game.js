// Build It, Do Not Measure It. Skill G-CO.D.12-2.
// Constructing perpendicular lines and a line parallel to a given line through a point. Changing the compass width mid-construction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build It, Do Not Measure It",
  emoji: "📐",
  premise: "Perpendicular and parallel lines can be constructed exactly. The key is never changing the compass between matching arcs.",
  outro: "Matching arcs must use the same compass width. Copying an angle builds a parallel line.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "Do the two matching arcs use the same opening?",
  tag: "changes_compass_width",
  rounds: [
    { say: "True or not true about constructions?", bins: "True|Not true", items: ["Matching arcs need the same width.|Copying an angle gives a parallel line.", "Width can change between matching arcs.|A straightedge measures lengths."], trap: ["Width can change between matching arcs.", 0], why: "If the width changes, the arcs no longer cross in the right place.", win: "Same width, exact result." },
    { say: "Put the steps for a perpendicular through point P on a line in order.", kind: "row", fs: 4.4, seq: "Mark two points on the line, equally far from P.|From each mark, draw arcs that cross above the line.|Join P to the point where the arcs cross.", trap: "From each mark, draw arcs that cross above the line.|Mark two points on the line, equally far from P.|Join P to the point where the arcs cross.", why: "The arcs need centers first. Mark the two points before drawing them.", win: "Marks, arcs, line." },
    { say: "Match each goal to its method by yourself.", kind: "fill", fs: 4.8, cast: "", rows: [["a line parallel to another", "copy an angle at a new point"], ["a line perpendicular to another", "cross two equal arcs"]], extra: "use a protractor for 90°|draw it by eye", trap: [1, "use a protractor for 90°"] },
  ],
}));
