// Name It Exactly. Skill W.9-10.2-3.
// Using precise language and domain-specific vocabulary to manage the complexity of a topic. Using vague wording is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name It Exactly",
  emoji: "🔬",
  premise: "Stuff, thing and got are placeholders. In an explanation, the exact term does the explaining for you.",
  outro: "Use precise language and the vocabulary of the subject.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Which word would a textbook on this subject use?",
  tag: "vague_wording",
  rounds: [
    { say: "Replace the vague word with the precise one.", rows: [["The ___ in a leaf absorbs light.", "chlorophyll"], ["The metal ___ as it heated.", "expanded"], ["The court ___ the earlier ruling.", "overturned"]], extra: "stuff got", trap: [0, "stuff"], why: "Stuff could be anything. The pigment has a name.", win: "Named, exact, clear." },
    { say: "Choose the precise term.", rows: [["Water vapor ___ into droplets on the cold glass.", "condenses"], ["The author ___ the hero with his rival.", "contrasts"], ["Demand rose, so the price ___.", "increased"]], extra: "changes did", trap: [0, "changes"], why: "Changes into is loose. Gas turning to liquid is condensing.", win: "The subject’s own words." },
    { say: "Choose the precise terms by yourself.", rows: [["Plants release oxygen during ___.", "photosynthesis"], ["The two triangles are ___: same shape and size.", "congruent"], ["The narrator ___ the ending in chapter one.", "foreshadows"]], extra: "that thing|similar", trap: [1, "similar"] },
  ],
}));
