// Semicolon Fix. Skill L.9-10.2-1.
// Using a semicolon to link closely related independent clauses. Writing comma splices is the known slip.
Sidekick.game(Sidekick.play({
  title: "Semicolon Fix",
  emoji: "🔧",
  premise: "Two complete sentences cannot be held together by a comma alone. A semicolon is strong enough.",
  outro: "Use a semicolon to join two closely related independent clauses.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Could each half stand alone as a sentence? Then a comma is too weak.",
  tag: "comma_splice",
  rounds: [
    { say: "Correct, or a comma splice?", bins: "Correct|Comma splice", items: ["It was late; we went home.|The bus was full; I walked.", "It was late, we went home.|The bus was full, I walked."], trap: ["It was late, we went home.", 0], why: "Both halves are full sentences. A comma cannot join them alone.", win: "Semicolon between two sentences." },
    { say: "Choose the mark that fits.", kind: "fill", fs: 5, cast: "", rows: [["It was late ___ we went home.", ";"], ["It was late ___ so we went home.", ","], ["We packed three things ___ a map, water and rope.", ":"]], trap: [0, ","], why: "With no joining word such as so, two sentences need a semicolon.", win: "Semicolon, comma with so, colon for a list." },
    { say: "Sort these by yourself.", bins: "Correct|Comma splice", items: ["The rain stopped; the game resumed.|She studied all night; she passed.", "The rain stopped, the game resumed.|She studied all night, she passed."], trap: ["She studied all night, she passed.", 0] },
  ],
}));
