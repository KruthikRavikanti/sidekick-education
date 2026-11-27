// Flat or Filled?. Skill 5.MD.C.3-1.
// Volume is measured with unit cubes, in cubic units, and is different from area. Confusing volume with area is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flat or Filled?",
  emoji: "📦",
  premise: "Area covers a flat surface with squares. Volume fills a space with cubes. Decide which one each job needs.",
  outro: "Area is measured in square units. Volume is measured in cubic units.",
  scene: "city",
  kind: "sort",
  hint: "Does it cover a flat surface, or fill up a space?",
  tag: "confuses_volume_with_area",
  rounds: [
    { say: "Which kind of unit does each job need?", bins: "Square units|Cubic units", items: ["the floor a rug covers|paint for a wall", "the water a tank holds|sand to fill a box"], trap: ["sand to fill a box", 0], why: "Sand fills up the space inside the box. Filling is measured with cubes.", win: "Covering uses squares. Filling uses cubes." },
    { say: "Sort these jobs.", bins: "Square units|Cubic units", items: ["the size of a poster|tiles for a kitchen floor", "the space inside a fridge|air in a balloon"], trap: ["the space inside a fridge", 0], why: "The inside of a fridge is a space to fill, not a surface to cover.", win: "You told covering from filling." },
    { say: "Sort these by yourself.", bins: "Square units|Cubic units", items: ["grass for a soccer field|wrapping paper for a gift", "cereal in a box|water in a pool|blocks in a toy chest"], trap: ["water in a pool", 0] },
  ],
}));
