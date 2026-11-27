// Point, Line, Segment, Ray. Skill 4.G.A.1-1.
// Identifying points, lines, line segments and rays. Confusing a ray with a segment is the known slip.
Sidekick.game(Sidekick.play({
  title: "Point, Line, Segment, Ray",
  emoji: "➡️",
  premise: "A line goes on forever both ways. A ray starts at a point and goes on forever one way. A segment stops at both ends.",
  outro: "Count the endpoints: a line has none, a ray has one, a segment has two.",
  scene: "paper",
  kind: "sort",
  hint: "Count the endpoints. Arrows mean it keeps going forever.",
  tag: "confuses_ray_and_segment",
  rounds: [
    { say: "Match each picture to its name.", kind: "fill", cast: "", rows: [["~geo:point", "point"], ["~geo:line", "line"], ["~geo:seg", "segment"], ["~geo:ray", "ray"]], trap: [3, "segment"], why: "This one has an arrow on one end, so it keeps going that way. It is a ray.", win: "Point, line, segment and ray." },
    { say: "Sort each clue.", bins: "Line|Segment|Ray", items: ["forever both ways|no endpoints", "stops at both ends|two endpoints", "starts, never ends|one endpoint"], trap: ["starts, never ends", 1], why: "A segment stops at both ends. This one stops at only one.", win: "None, two and one endpoint." },
    { say: "Sort these by yourself.", bins: "Line|Segment|Ray", figW: 12, items: ["~geo:line|two arrows", "~geo:seg|a ruler edge", "~geo:ray|one arrow|a flashlight beam"], trap: ["one arrow", 1] },
  ],
}));
