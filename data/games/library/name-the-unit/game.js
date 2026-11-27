// Name the Unit. Skill 2.MD.A.4-2.
// Expressing a length difference in a standard unit: the answer needs both the number and the unit. A bare number is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name the Unit",
  emoji: "🏷️",
  premise: "A length is not finished until it has its unit. Give each difference its number and its unit.",
  outro: "A measurement needs a number and a unit.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Say the answer out loud. 8 what?",
  tag: "leaves_off_the_unit",
  rounds: [
    { say: "Drag in each difference, with its unit.", rows: [["20 cm − 12 cm =", "8 cm"], ["15 in − 9 in =", "6 in"]], extra: "8|6 cm", trap: [0, "8"], why: "A length needs its unit. 8 what?", win: "8 cm and 6 in." },
    { say: "Number and unit, both.", rows: [["34 ft − 20 ft =", "14 ft"], ["50 m − 15 m =", "35 m"]], extra: "14|35 ft", trap: [0, "14"], why: "A length needs its unit. 14 what?", win: "14 ft and 35 m." },
    { say: "Finish these by yourself.", rows: [["18 cm − 7 cm =", "11 cm"], ["40 in − 22 in =", "18 in"], ["9 m − 4 m =", "5 m"]], extra: "11|18 cm", trap: [0, "11"] },
  ],
}));
