// Units or Square Units?. Skill 3.MD.C.5-1.
// A unit square measures area: jobs that cover a surface are sorted from jobs that measure along an edge. Confusing area with length is the known slip.
Sidekick.game(Sidekick.play({
  title: "Units or Square Units?",
  emoji: "⬛",
  premise: "Length is measured along a line. Area is the space something covers. Sort each job by what it measures.",
  outro: "Length uses units. Area uses square units, because it counts squares.",
  scene: "paper",
  kind: "sort",
  hint: "Does it go along an edge, or does it cover a surface?",
  tag: "confuses_area_and_length",
  rounds: [
    { say: "Is it measured in units or in square units?", bins: "Units (length)|Square units (area)", items: ["the edge of a rug|how tall a door is|the distance around a field", "the floor a rug covers|the space inside a frame"], trap: ["the distance around a field", 1], why: "Going around a field is a walk along its edges. That is a length.", win: "Edges are length. Covering is area." },
    { say: "Sort these jobs.", bins: "Units (length)|Square units (area)", items: ["a fence around a yard|the length of a pool", "grass covering a yard|paint covering a wall|carpet for a room"], trap: ["a fence around a yard", 1], why: "A fence runs along the edge of the yard. That is a length.", win: "Fences are length. Grass is area." },
    { say: "Sort these by yourself.", bins: "Units (length)|Square units (area)", items: ["a ribbon around a gift|the side of a square|a walk around the block", "wrapping paper on a gift|the surface of a desk"], trap: ["a ribbon around a gift", 1] },
  ],
}));
