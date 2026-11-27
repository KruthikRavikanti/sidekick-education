// Clause or Phrase?. Skill L.7.1-1.
// Explaining the function of phrases and clauses in specific sentences. Not being able to identify clauses is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clause or Phrase?",
  emoji: "🧩",
  premise: "A clause has a subject and a verb. An independent clause can stand alone. A dependent clause leans on another.",
  outro: "Independent clause: a complete thought. Dependent clause: starts with a word like when or because. Phrase: no subject and verb pair.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Does it have a subject and a verb? Can it stand alone as a sentence?",
  tag: "cannot_identify_clauses",
  rounds: [
    { say: "Sort the parts of this sentence: When the bell rang, we left through the side door.", bins: "Dependent clause|Independent clause|Phrase", items: ["when the bell rang|", "we left|", "through the side door|"], trap: ["when the bell rang", 1], why: "It has a subject and verb, but when makes it lean on the rest.", win: "One of each." },
    { say: "Sort these.", bins: "Dependent clause|Independent clause|Phrase", items: ["because it was raining|although she tried", "the game was cancelled|", "after the storm|under the bridge"], trap: ["after the storm", 0], why: "There is no verb. It is a phrase.", win: "Clauses have a subject and a verb." },
    { say: "Sort these by yourself.", bins: "Dependent clause|Independent clause|Phrase", items: ["if you call me|", "I will answer|", "in the morning|with a smile"], trap: ["if you call me", 1] },
  ],
}));
