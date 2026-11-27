// Solid Builders. Skill 1.G.A.2-2.
// Composing three-dimensional shapes: the child names the two solids that make a familiar object, such as a cone and a sphere in an ice cream cone.
Sidekick.game(Sidekick.play({
  title: "Solid Builders",
  emoji: "🧊",
  premise: "Everyday things are built from solid shapes stuck together. Name the two solids in each one.",
  outro: "Solid shapes can be joined to make new things.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Look at one part at a time. Is it round like a ball, or pointed, or like a can?",
  tag: "cannot_see_inner_solids",
  rounds: [
    { say: "Which two solids make each thing?", rows: [["🍦 ice cream cone", "cone + sphere"], ["⛄ snowman", "sphere + sphere"]], extra: "cube + cone|", trap: [0, "sphere + sphere"], why: "The scoop is a sphere, but it sits on a pointed cone.", win: "A cone and a sphere. Two spheres." },
    { say: "Three things to take apart.", rows: [["🚀 rocket", "cone + cylinder"], ["⛄ snowman", "sphere + sphere"], ["🎁 two stacked boxes", "cube + cube"]], trap: [0, "cube + cube"], why: "The rocket has a pointed nose on a long round body.", win: "You named every solid." },
    { say: "Name the solids by yourself.", rows: [["🗼 round tower with a pointed roof", "cylinder + cone"], ["🎁 two stacked boxes", "cube + cube"], ["🍭 ball on a stick", "sphere + cylinder"]], extra: "cone + cone|", trap: [2, "cylinder + cone"] },
  ],
}));
