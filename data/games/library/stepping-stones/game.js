// Stepping Stones. Skill K.CC.A.1-1.
// Counting order is the rule: the child lays number stones in order, and a skipped or swapped teen number leaves the path out of order.
Sidekick.game(Sidekick.play({
  title: "Stepping Stones",
  emoji: "🪨",
  premise: "The stones across the pond lost their order. Put the numbers back so the frog can hop across.",
  outro: "Every stone is in order. The frog made it across!",
  scene: "ocean",
  kind: "row",
  cast: "🐸 🪷 🌿 🪷",
  hint: "Say the numbers out loud as you place them.",
  tag: "skips_a_teen_number",
  rounds: [
    { say: "Lay the stones in counting order, starting at 1.", seq: "1 2 3 4 5", win: "One, two, three, four, five!" },
    { say: "These are the tricky teens. Put them in counting order.", seq: "13 14 15 16", extra: "18", trap: "13 14 16 15", why: "Count slowly: thirteen, fourteen, fifteen, sixteen.", win: "Thirteen, fourteen, fifteen, sixteen." },
    { say: "Finish the path all by yourself.", alt: [{ seq: "14 15 16 17", extra: "19", trap: "14 16 15 17" }, { seq: "16 17 18 19", extra: "14", trap: "16 18 17 19" }, { seq: "11 12 13 14", extra: "16", trap: "11 13 12 14" }] },
  ],
}));
