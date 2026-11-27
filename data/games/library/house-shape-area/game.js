// House Shape Area. Skill 7.G.B.6-1.
// Finding the area of composite two-dimensional figures. Double counting shared regions (or using a full rectangle for a triangle) is the known slip.
Sidekick.game(Sidekick.play({
  title: "House Shape Area",
  emoji: "🏠",
  premise: "A complicated shape is simple shapes joined together. Split it so no piece overlaps, find each area, and add.",
  outro: "Split a composite figure into pieces that do not overlap, then add their areas.",
  scene: "city",
  kind: "type",
  hint: "Rectangle: base × height. Triangle: half of base × height.",
  tag: "double_counts_region",
  rounds: [
    { say: "Key in the area of the whole shape.", fig: { type: "poly", pts: [[22, 92], [78, 92], [78, 54], [50, 18], [22, 54]], sides: ["6", "4", null, null, null], dash: [[22, 54, 78, 54], [50, 18, 50, 54, "3"]], v: [] }, ans: 33, trap: 42, why: "The roof is a triangle: half of 6 × 3 is 9, not 18.", win: "24 + 9 = 33 square units." },
    { say: "Split the L into two rectangles that do not overlap. Key in its area.", fig: { type: "poly", pts: [[12, 90], [88, 90], [88, 62], [40, 62], [40, 22], [12, 22]], sides: ["8", "3", "5", "4", "3", "7"], v: [] }, ans: 36, trap: 45, why: "8 × 3 plus 3 × 7 counts the corner square twice.", win: "8 × 3 + 3 × 4 = 36 square units." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "poly", pts: [[22, 92], [78, 92], [78, 54], [50, 18], [22, 54]], sides: ["10", "5", null, null, null], dash: [[22, 54, 78, 54], [50, 18, 50, 54, "4"]], v: [] }, ans: 70, trap: 90 }, { fig: { type: "poly", pts: [[22, 92], [78, 92], [78, 54], [50, 18], [22, 54]], sides: ["8", "2", null, null, null], dash: [[22, 54, 78, 54], [50, 18, 50, 54, "5"]], v: [] }, ans: 36, trap: 56 }, { fig: { type: "poly", pts: [[22, 92], [78, 92], [78, 54], [50, 18], [22, 54]], sides: ["5", "5", null, null, null], dash: [[22, 54, 78, 54], [50, 18, 50, 54, "4"]], v: [] }, ans: 35, trap: 45 }] },
  ],
}));
