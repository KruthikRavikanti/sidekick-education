// Label the Area. Skill 3.MD.C.6-2.
// Labelling area with square units: an area of 12 squares one foot on a side is 12 square feet. A plain length unit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Label the Area",
  emoji: "🔖",
  premise: "An area is counted in squares, so its label has to say square. Pick the right label for each area.",
  outro: "Area is written in square units: square feet, square centimeters, square meters.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Area counts squares. What size is each square?",
  tag: "labels_area_in_plain_units",
  rounds: [
    { say: "Drag the right area, with its label.", rows: [["12 squares, each 1 foot on a side. Area =", "12 square feet"], ["8 squares, each 1 inch on a side. Area =", "8 square inches"]], extra: "12 feet|8 inches", trap: [0, "12 feet"], why: "Area counts squares, so the unit is square feet.", win: "Square feet and square inches." },
    { say: "Label these areas.", rows: [["15 squares, each 1 meter on a side. Area =", "15 square meters"], ["20 squares, each 1 cm on a side. Area =", "20 square cm"]], extra: "15 meters|20 cm", trap: [0, "15 meters"], why: "Area counts squares, so the unit is square meters.", win: "Square meters and square centimeters." },
    { say: "Label these by yourself.", rows: [["9 squares, each 1 foot on a side. Area =", "9 square feet"], ["24 squares, each 1 cm on a side. Area =", "24 square cm"]], extra: "9 feet|24 cm", trap: [0, "9 feet"] },
  ],
}));
