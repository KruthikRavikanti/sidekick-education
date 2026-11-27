// Compass and Straightedge. Skill G-CO.D.12-1.
// Making formal constructions: copying and bisecting segments and angles. Measuring instead of constructing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compass and Straightedge",
  emoji: "🧭",
  premise: "A construction uses only a compass and an unmarked straightedge. Nothing is measured. Everything is built from arcs and lines.",
  outro: "To bisect a segment: open the compass past halfway, draw arcs from both ends, and join where they cross.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Does the step use a number from a ruler or protractor? Then it is measuring.",
  tag: "measures_instead",
  rounds: [
    { say: "Is each step part of a true construction?", bins: "Construction step|Not allowed", items: ["draw an arc with a compass|draw a line along a straightedge|keep the compass width for the next arc", "read a length off a ruler|read an angle off a protractor"], trap: ["read a length off a ruler", 0], why: "A construction never uses measurements, only arcs and straight lines.", win: "Arcs and lines only." },
    { say: "Put the steps for bisecting a segment in order.", kind: "row", fs: 4.6, seq: "Open the compass to more than half the segment.|Draw an arc from each endpoint.|Join the two points where the arcs cross.", trap: "Draw an arc from each endpoint.|Open the compass to more than half the segment.|Join the two points where the arcs cross.", why: "Set the compass width first. Both arcs must use it.", win: "Set, swing, join." },
    { say: "Complete each fact by yourself.", kind: "fill", fs: 4.8, cast: "", rows: [["to bisect a segment, open the compass to", "more than half its length"], ["the line through the arc crossings is the", "perpendicular bisector"]], extra: "less than half its length|parallel line", trap: [0, "less than half its length"] },
  ],
}));
