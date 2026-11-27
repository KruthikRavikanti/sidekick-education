// Sentence Types Sorter. Skill L.7.1-2.
// Choosing among simple, compound, complex and compound-complex sentences to signal relationships among ideas. Using only one type is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sentence Types Sorter",
  emoji: "🚂",
  premise: "Simple, compound and complex sentences link ideas in different ways. Choosing the right one shows how the ideas relate.",
  outro: "Simple: one clause. Compound: two joined by and, but, so. Complex: one leans on the other with because, when, although.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Count the clauses. What word joins them?",
  tag: "uses_one_type",
  rounds: [
    { say: "What type is each sentence?", bins: "Simple|Compound|Complex", items: ["It rained all day.|", "It rained, so we stayed in.|", "Because it rained, we stayed in.|"], trap: ["Because it rained, we stayed in.", 1], why: "Because makes one clause depend on the other. That is complex.", win: "One clause, two equal, one leaning." },
    { say: "Sort these.", bins: "Simple|Compound|Complex", items: ["The dog barked.|", "The dog barked, and the cat ran.|", "When the dog barked, the cat ran.|"], trap: ["The dog barked, and the cat ran.", 2], why: "And joins two equal clauses. That is compound.", win: "The joining word tells the type." },
    { say: "Sort these by yourself.", bins: "Simple|Compound|Complex", items: ["Maya plays the drums.|", "Maya plays drums, but Eli sings.|", "Although Maya plays drums, she cannot read music.|"], trap: ["Although Maya plays drums, she cannot read music.", 1] },
  ],
}));
