// Solid Shop. Skill K.G.A.3-2.
// Naming common solids: the child tags a can as a cylinder and a ball as a sphere. Flat names like circle and square are offered as the tempting slip.
Sidekick.game(Sidekick.play({
  title: "Solid Shop",
  emoji: "🏪",
  premise: "Everything in this shop is a solid shape. Put the right name tag on each one.",
  outro: "Cube, cone, cylinder, sphere: solids have their own names.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "A ball is a sphere. A can is a cylinder. A box with square faces is a cube.",
  tag: "uses_flat_name_for_solid",
  rounds: [
    { say: "Drag the right name under each solid.", rows: [["🥫", "cylinder"], ["⚽", "sphere"]], extra: "circle", trap: [1, "circle"], why: "A circle is flat. A ball is a sphere.", win: "A can is a cylinder. A ball is a sphere." },
    { say: "Three more solids to name.", rows: [["🧊", "cube"], ["🍦", "cone"], ["🥫", "cylinder"]], extra: "square", trap: [0, "square"], why: "A square is flat. This solid with square faces is a cube.", win: "Cube, cone and cylinder." },
    { say: "Name these solids by yourself.", rows: [["🎲", "cube"], ["🏀", "sphere"], ["🍦", "cone"], ["🛢️", "cylinder"]], extra: "circle square", trap: [1, "circle"] },
  ],
}));
