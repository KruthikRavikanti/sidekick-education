// Verbal Spotter. Skill L.8.1-1.
// Explaining the function of verbals (gerunds, participles, infinitives). Not being able to identify verbals is the known slip.
Sidekick.game(Sidekick.play({
  title: "Verbal Spotter",
  emoji: "🏊",
  premise: "A verbal is a verb form doing another job. A gerund acts as a noun, a participle as an adjective, and an infinitive starts with to.",
  outro: "Gerund: -ing noun. Participle: verb form describing a noun. Infinitive: to plus a verb.",
  scene: "ocean",
  kind: "sort",
  fs: 4.6,
  hint: "Is the capital word naming an activity, describing a noun, or to plus a verb?",
  tag: "cannot_identify_verbals",
  rounds: [
    { say: "What is the word in capitals?", bins: "Gerund|Participle|Infinitive", items: ["SWIMMING is fun.|", "The BARKING dog woke us.|", "I love TO READ.|"], trap: ["The BARKING dog woke us.", 0], why: "Barking describes the dog. That makes it a participle.", win: "A noun, a describer, a to-verb." },
    { say: "Sort these.", bins: "Gerund|Participle|Infinitive", items: ["She enjoys PAINTING.|", "The BROKEN vase lay there.|", "He hopes TO WIN.|"], trap: ["She enjoys PAINTING.", 1], why: "Painting is the thing she enjoys. It works as a noun: a gerund.", win: "Job decides the name." },
    { say: "Sort these by yourself.", bins: "Gerund|Participle|Infinitive", items: ["RUNNING keeps me calm.|", "The FROZEN lake cracked.|", "They plan TO TRAVEL.|"], trap: ["The FROZEN lake cracked.", 0] },
  ],
}));
