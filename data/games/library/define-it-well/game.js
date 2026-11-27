// Define It Well. Skill L.1.5-2.
// Defining words by category and by one or more key attributes. Defining by one small detail is the known slip.
Sidekick.game(Sidekick.play({
  title: "Define It Well",
  emoji: "🦆",
  premise: "A good definition says what kind of thing it is, and what makes it special.",
  outro: "Define a word by its group and a key feature: a duck is a bird that swims.",
  scene: "ocean",
  kind: "fill",
  cast: "",
  hint: "Say the group first. Then say what is special.",
  tag: "defines_by_one_detail",
  rounds: [
    { say: "Finish each definition.", rows: [["A duck is a", "bird that swims"], ["A shark is a", "fish with sharp teeth"]], extra: "thing that is yellow|", trap: [0, "thing that is yellow"], why: "Lots of things are yellow. Say what kind of animal a duck is.", win: "A group, and what is special." },
    { say: "Finish these definitions.", rows: [["A tiger is a", "big cat with stripes"], ["A bus is a", "big car for many riders"]], extra: "thing with wheels|", trap: [1, "thing with wheels"], why: "Bikes have wheels too. Say what makes a bus special.", win: "Clear definitions." },
    { say: "Finish these by yourself.", rows: [["An owl is a", "bird that hunts at night"], ["A hammer is a", "tool for hitting nails"], ["A carrot is a", "vegetable that is orange"]], extra: "thing that is orange|", trap: [2, "thing that is orange"] },
  ],
}));
