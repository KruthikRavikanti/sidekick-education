// Three Baskets. Skill 1.MD.C.4-1.
// Sorting data into up to three categories: every object belongs to exactly one of three groups.
Sidekick.game(Sidekick.play({
  title: "Three Baskets",
  emoji: "🗂️",
  premise: "Everything gets sorted into one of three baskets. Each thing belongs in just one.",
  outro: "Sorting puts each thing into the one group where it belongs.",
  scene: "kitchen",
  kind: "sort",
  cast: "",
  hint: "Say what the thing is. Which one basket fits it?",
  tag: "puts_item_in_other_group",
  rounds: [
    { say: "Sort each thing into its basket.", bins: "Pets|Toys|Foods", items: ["🐶 🐱", "⚽ 🧸", "🍎 🍞"], trap: ["🧸", 0], why: "A teddy bear looks like an animal, but it is a toy.", win: "Two in each basket." },
    { say: "New baskets. Sort these.", bins: "Has wheels|Has wings|Has fins", items: ["🚲 🚌", "🦋 🦅", "🐟 🦈"], trap: ["🦈", 1], why: "A shark swims with fins. It has no wings.", win: "Wheels, wings and fins." },
    { say: "Sort these by yourself.", bins: "Fruit|Clothes|Animals", items: ["🍌 🍇 🍓", "🧦 👕", "🐸 🐴"], trap: ["🧦", 2] },
  ],
}));
