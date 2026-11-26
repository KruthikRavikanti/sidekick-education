// Shape Hunt at Home. Skill K.G.A.1-1.
// Naming shapes in everyday objects: a slice of pizza is a triangle and an envelope is a rectangle, so the child looks for sides and corners in real things.
Sidekick.game(Sidekick.play({
  title: "Shape Hunt at Home",
  emoji: "🏠",
  premise: "Shapes are hiding in everyday things around the house. Sort each thing by the shape you see in it.",
  outro: "Shapes are everywhere, not only in math books.",
  scene: "kitchen",
  kind: "sort",
  cast: "🏠 🪟 🚪 🛋️",
  hint: "Trace around it with your finger. Count the sides.",
  tag: "only_textbook_shapes",
  rounds: [
    { say: "Sort each thing by its shape.", bins: "Circle|Rectangle|Triangle", items: ["🍪 🕐", "🚪 📱", "🍕 ⛵"], trap: ["🍕", 0], why: "Look at this slice: three sides and three corners.", win: "Round ones, four-sided ones and three-sided ones." },
    { say: "More shapes around the house.", bins: "Circle|Rectangle|Triangle", items: ["🥏 🔘", "✉️ 📺", "📐 🚩"], trap: ["📐", 1], why: "Count its sides: three. It is a triangle.", win: "You spotted every shape." },
    { say: "Sort these by yourself.", bins: "Circle|Rectangle|Triangle", items: ["🧭 🍩", "🖼️ 🎫", "⛺ 🔻"], trap: ["⛺", 1] },
  ],
}));
