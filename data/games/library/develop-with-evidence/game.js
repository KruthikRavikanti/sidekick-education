// Develop With Evidence. Skill W.5.2-2.
// Developing the topic with facts, definitions, concrete details, quotations or other information and examples. Thin development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Develop With Evidence",
  emoji: "🦈",
  premise: "Strong paragraphs are built from different kinds of support: facts, quotations and examples.",
  outro: "Develop a topic with facts, definitions, concrete details, quotations and examples.",
  scene: "ocean",
  kind: "sort",
  hint: "Is it a checkable fact, someone’s exact words, or one particular case?",
  tag: "thin_development",
  rounds: [
    { say: "Sort each sentence by the kind of support it gives.", bins: "Fact|Quotation|Example", items: ["Sharks have existed for 400 million years.|", "\"Sharks are vital to healthy seas,\" says Dr. Ito.|", "The whale shark, for instance, eats only plankton.|"], trap: ["The whale shark, for instance, eats only plankton.", 0], why: "For instance signals one particular case. That is an example.", win: "Fact, quotation, example." },
    { say: "Sort these sentences.", bins: "Fact|Quotation|Example", items: ["The Nile is over 4,000 miles long.|", "\"The river was our life,\" wrote one farmer.|", "One such crop was wheat.|"], trap: ["\"The river was our life,\" wrote one farmer.", 0], why: "Those are someone’s exact words inside quotation marks.", win: "Three kinds of support." },
    { say: "Sort these by yourself.", bins: "Fact|Quotation|Example", items: ["A hummingbird’s heart beats 1,200 times a minute.|", "\"They are jewels with wings,\" the guide said.|", "The ruby-throated kind, for example, crosses the Gulf.|"], trap: ["The ruby-throated kind, for example, crosses the Gulf.", 0] },
  ],
}));
