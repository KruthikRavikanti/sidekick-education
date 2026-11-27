// Two Source Research. Skill W.3.7-1.
// Conducting short research projects that build knowledge about a topic. Copying from one source only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Source Research",
  emoji: "🍯",
  premise: "Research means learning from more than one source and putting the facts together in your own report.",
  outro: "Use more than one source and combine what you learn.",
  scene: "meadow",
  kind: "sort",
  hint: "Which source gave that fact?",
  tag: "copies_one_source",
  rounds: [
    { say: "Your question: How do bees make honey? Sort the facts by source.", read: "Book: Bees suck nectar from flowers. / Video: Bees fan the nectar with their wings until it thickens.", bins: "From the book|From the video|From neither", items: ["Bees suck nectar from flowers.|", "Bees fan the nectar to thicken it.|", "Bees buy honey at a store.|"], trap: ["Bees fan the nectar to thicken it.", 0], why: "That step came from the video. A good report uses both.", win: "Two sources, one fuller answer." },
    { say: "Your question: Why do birds migrate? Sort the facts by source.", read: "Article: Birds fly south to find food in winter. / Website: Some birds travel thousands of miles.", bins: "From the article|From the website|From neither", items: ["They fly south to find food.|", "Some travel thousands of miles.|", "Birds migrate by train.|"], trap: ["Birds migrate by train.", 0], why: "Neither source says that.", win: "You tracked both sources." },
    { say: "Your question: How do plants drink? Sort by yourself.", read: "Book: Roots take in water from soil. / Video: Water travels up the stem to the leaves.", bins: "From the book|From the video|From neither", items: ["Roots take in water.|", "Water moves up the stem.|", "Plants drink with straws.|"], trap: ["Water moves up the stem.", 0] },
  ],
}));
