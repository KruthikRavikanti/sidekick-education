// Measure It!. Skill K.MD.A.1-2.
// Describing several measurable attributes of one object: the child picks the things that can be measured and leaves out color and names, which cannot.
Sidekick.game(Sidekick.play({
  title: "Measure It!",
  emoji: "🧴",
  premise: "One thing can be measured in more than one way. Tap every way you could measure it.",
  outro: "One object can have many things to measure: how tall, how heavy, how much it holds.",
  scene: "kitchen",
  kind: "pick",
  hint: "Could you use a ruler, a scale or a cup to find it out?",
  tag: "picks_unmeasurable_attribute",
  rounds: [
    { say: "Tap everything you could measure about it.", q: "A water bottle", yes: "how tall it is|how heavy it is|how much it holds", no: "its color|its name", trap: "its color", why: "Color is not measured. You measure how tall, how heavy, how much.", win: "Tall, heavy and how much it holds." },
    { say: "Tap everything you could measure about it.", q: "A puppy", yes: "how long it is|how heavy it is|how tall it stands", no: "how cute it is|what it is called|its spots", trap: "its spots", why: "Spots are a look, not a measure.", win: "Long, heavy and tall." },
    { say: "Tap everything you could measure about it.", q: "A backpack", yes: "how heavy it is|how wide it is|how much it holds", no: "its color|who owns it|its picture", trap: "its color" },
  ],
}));
