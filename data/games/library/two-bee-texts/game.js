// Two Bee Texts. Skill RI.2.9-1.
// Comparing and contrasting the most important points presented by two texts on the same topic. Listing facts from one text only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Bee Texts",
  emoji: "🍯",
  premise: "Two texts on the same topic share some big points. Each also has a point of its own.",
  outro: "Compare the most important points: which are in both, and which are in only one?",
  scene: "meadow",
  kind: "sort",
  hint: "Check each text for the point.",
  tag: "uses_one_text",
  rounds: [
    { say: "Read both texts. Where is each point?", read: "Text 1: Bees pollinate plants. Bees live in hives. / Text 2: Bees pollinate plants. Many bees are dying.", bins: "Both|Only text 1|Only text 2", items: ["Bees pollinate plants.|", "Bees live in hives.|", "Many bees are dying.|"], trap: ["Bees pollinate plants.", 1], why: "Text 2 says that too.", win: "One shared point, two different ones." },
    { say: "Read both texts. Sort the points.", read: "Text 1: Recycling saves trees. It also saves energy. / Text 2: Recycling saves trees. It keeps trash out of the sea.", bins: "Both|Only text 1|Only text 2", items: ["It saves trees.|", "It saves energy.|", "It keeps trash from the sea.|"], trap: ["It saves energy.", 0], why: "Only text 1 talks about energy.", win: "You compared the points." },
    { say: "Sort these by yourself.", read: "Text 1: Dogs need walks. Dogs need fresh water. / Text 2: Dogs need walks. Dogs need a vet.", bins: "Both|Only text 1|Only text 2", items: ["Dogs need walks.|", "Dogs need fresh water.|", "Dogs need a vet.|"], trap: ["Dogs need walks.", 1] },
  ],
}));
