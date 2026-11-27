// Flat or Solid?. Skill K.G.A.3-1.
// Telling flat shapes from solids: a cube is not a square and a ball is not a circle. The child sorts flat shapes from things you can hold.
Sidekick.game(Sidekick.play({
  title: "Flat or Solid?",
  emoji: "📦",
  premise: "Some shapes are flat like paper. Others are solid and you can hold them. Sort them out.",
  outro: "Flat shapes lie on the page. Solid shapes take up space.",
  scene: "desk",
  kind: "sort",
  cast: "",
  hint: "Could you pick it up and hold it in your hand? Then it is solid.",
  tag: "calls_solid_by_flat_name",
  rounds: [
    { say: "Sort each one: flat or solid?", bins: "Flat|Solid", items: ["🟦 🔺 🟡", "🧊 ⚽ 🥫"], trap: ["🧊", 0], why: "An ice cube has depth. You can hold it. It is solid.", win: "Flat on the page, solid in your hand." },
    { say: "More shapes to sort.", bins: "Flat|Solid", items: ["⬛ 🔶 🟢", "🎲 🏀 📦"], trap: ["🎲", 0], why: "The die is a cube. It is solid, not a flat square.", win: "You can hold the solid ones." },
    { say: "Sort these by yourself.", bins: "Flat|Solid", items: ["🟥 🔷 ⚪ 🟨", "🧱 🎾 🥎"], trap: ["🧱", 0] },
  ],
}));
