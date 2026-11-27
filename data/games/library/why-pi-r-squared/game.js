// Why Pi r Squared. Skill G-GMD.A.1-1.
// Giving an informal argument for the formulas for the circumference and area of a circle. Memorizing with no meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Pi r Squared",
  emoji: "🍕",
  premise: "Cut a circle into thin wedges and flip every other one. They line up into something very close to a rectangle.",
  outro: "The wedges make a rectangle r tall and πr long, so the area is πr × r = πr^2.",
  scene: "kitchen",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Half of the wedges point up and half point down, so the long side is half the circumference.",
  tag: "memorized_no_meaning",
  rounds: [
    { say: "The wedges of a circle are rearranged into a near rectangle. Label it.", rows: [["its height", "the radius, r"], ["its length", "half the circumference, πr"], ["its area", "πr × r = πr^2"]], extra: "the whole circumference, 2πr|", trap: [1, "the whole circumference, 2πr"], why: "Only half of the crusts are along each long side.", win: "πr long, r tall." },
    { say: "Where does each formula come from?", rows: [["C = 2πr", "π is circumference ÷ diameter"], ["A = πr^2", "wedges rearranged into a rectangle"]], extra: "a square with side r|", trap: [1, "a square with side r"], why: "A square of side r has area r^2. The circle is about 3.14 of those.", win: "Each formula has a reason." },
    { say: "A circle has radius 4. Fill in the wedge rectangle by yourself.", rows: [["height", "4"], ["length", "4π"], ["area", "16π"]], extra: "8π 8", trap: [1, "8π"] },
  ],
}));
