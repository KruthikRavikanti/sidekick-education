// Model It With a Solid. Skill G-MG.A.1-1.
// Using geometric shapes, their measures and their properties to describe objects. Choosing shapes that ignore key features is the known slip.
Sidekick.game(Sidekick.play({
  title: "Model It With a Solid",
  emoji: "🌳",
  premise: "Engineers treat real things as simple solids so they can estimate size. Pick the solid that keeps the key features.",
  outro: "Model an object with the solid that matches its main features: round and long is a cylinder, round all over is a sphere.",
  scene: "field",
  kind: "sort",
  fs: 5.4,
  hint: "Is it round all over, round with flat ends, or round with a point?",
  tag: "ignores_key_features",
  rounds: [
    { say: "Which solid models each object best?", bins: "Cylinder|Sphere|Cone", items: ["🌳 tree trunk|🥫 soup can", "⚽ soccer ball|🍊 orange", "🎉 party hat|🍦 ice cream cone"], trap: ["🌳 tree trunk", 2], why: "A trunk is about as wide near its upper end as at its base. That is a cylinder.", win: "Flat ends, round all over, or pointed." },
    { say: "A tree trunk is modeled as a cylinder with base area 3 square feet and height 20 feet. Key in its volume in cubic feet.", kind: "type", icon: "🌳", ans: 60, trap: 23, why: "Volume multiplies base area by height.", win: "3 × 20 = 60 cubic feet of wood." },
    { say: "Sort these by yourself.", bins: "Cylinder|Sphere|Rectangular prism", items: ["🥤 drinking glass|🕯️ candle", "🌍 planet|🫧 soap bubble", "📦 shipping box|🧱 brick"], trap: ["🥤 drinking glass", 2] },
  ],
}));
