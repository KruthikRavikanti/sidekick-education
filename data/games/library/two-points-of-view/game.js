// Two Points of View. Skill RL.2.6-1.
// Acknowledging differences in the points of view of characters. Reading all dialogue the same way, as if characters thought alike, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Points of View",
  emoji: "🐺",
  premise: "Two characters can see the same thing in different ways. Each one has a point of view.",
  outro: "Different characters think and feel differently about the same event.",
  scene: "forest",
  kind: "sort",
  hint: "Who would say that? Think about what each one wants.",
  tag: "treats_characters_alike",
  rounds: [
    { say: "A cat is chasing a mouse. Who would say each thing?", bins: "The cat|The mouse", items: ["\"I am so hungry!\"|\"Come back here!\"", "\"Help! I must hide!\"|\"That was too close!\""], trap: ["\"That was too close!\"", 0], why: "The mouse is the one who almost got caught.", win: "Same chase, two points of view." },
    { say: "It starts to snow. Who would say each thing?", bins: "A child|A bus driver", items: ["\"Hooray, a snow day!\"|\"Let us build a fort!\"", "\"The roads will be icy.\"|\"I must drive slowly.\""], trap: ["\"The roads will be icy.\"", 0], why: "A driver worries about the roads. A child thinks about play.", win: "Snow means different things to each." },
    { say: "A storm is coming. Sort these by yourself.", bins: "A farmer|A duck", items: ["\"My crops need this rain.\"|\"I must bring in the hay.\"", "\"More puddles to splash in!\"|\"I love wet weather!\""], trap: ["\"More puddles to splash in!\"", 0] },
  ],
}));
