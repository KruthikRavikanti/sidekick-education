// Sorting Baskets. Skill L.K.5-1.
// Sorting common objects into categories to gain a sense of the concepts the categories represent. Sorting by one random feature is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sorting Baskets",
  emoji: "🧺",
  premise: "Things that go together belong in the same basket. Think about what kind of thing each one is.",
  outro: "A category is a group of things that are the same kind.",
  scene: "kitchen",
  kind: "sort",
  hint: "What kind of thing is it? Can you eat it? Is it alive?",
  tag: "sorts_by_random_feature",
  rounds: [
    { say: "Sort into foods and animals.", bins: "Food|Animal", items: ["🍎 🍞 🧀", "🐶 🐱 🐴"], trap: ["🐴", 0], why: "A horse is alive. It is an animal.", win: "Foods and animals." },
    { say: "Sort into clothes and toys.", bins: "Clothes|Toys", items: ["👕 🧦 🧢", "🧸 🪀 ⚽"], trap: ["🧢", 1], why: "You wear a cap on your head. It is clothing.", win: "Clothes and toys." },
    { say: "Sort into three groups by yourself.", bins: "Food|Animal|Clothes", items: ["🍌 🥕 🍕", "🐸 🐦 🐷", "👖 🧤 👟"], trap: ["🐷", 0] },
  ],
}));
