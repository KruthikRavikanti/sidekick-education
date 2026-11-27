// Label the Volume. Skill 5.MD.C.4-2.
// Reporting volume in cubic cm, cubic in and cubic ft. Labelling a volume with square units is the known slip.
Sidekick.game(Sidekick.play({
  title: "Label the Volume",
  emoji: "🏷️",
  premise: "A measurement needs the right label. Lengths get plain units, areas get square units and volumes get cubic units.",
  outro: "Volume is labelled in cubic units: cubic centimeters, cubic inches, cubic feet.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Cubes fill a space, so the label says cubic.",
  tag: "uses_square_units",
  rounds: [
    { say: "Give each measurement the right label.", rows: [["A box holds 24 one-centimeter cubes", "24 cubic cm"], ["A rug covers 24 one-foot squares", "24 square ft"]], extra: "24 square cm|24 ft", trap: [0, "24 square cm"], why: "The box is filled with cubes, so its volume is in cubic centimeters.", win: "Cubic for filling, square for covering." },
    { say: "Label these.", rows: [["A bin holds 40 one-inch cubes", "40 cubic in"], ["A rope is 40 one-inch sections long", "40 in"]], extra: "40 square in|40 cubic ft", trap: [0, "40 square in"], why: "Cubes fill the bin. That is cubic inches.", win: "Cubic inches and plain inches." },
    { say: "Label these by yourself.", rows: [["A crate holds 60 one-foot cubes", "60 cubic ft"], ["A floor has 60 one-inch square tiles", "60 square in"], ["A fence has 60 one-foot sections", "60 ft"]], extra: "60 square ft|60 cubic in", trap: [0, "60 square ft"] },
  ],
}));
