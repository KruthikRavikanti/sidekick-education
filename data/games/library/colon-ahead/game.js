// Colon Ahead. Skill L.9-10.2-2.
// Using a colon to introduce a list or quotation. Misusing colons is the known slip.
Sidekick.game(Sidekick.play({
  title: "Colon Ahead",
  emoji: "🚦",
  premise: "A colon says: here it comes. It follows a complete sentence and introduces a list, an explanation or a quotation.",
  outro: "Use a colon after a complete sentence to introduce a list or quotation. Never after a verb or preposition.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Cover everything after the colon. Is what remains a complete sentence?",
  tag: "misuses_colon",
  rounds: [
    { say: "Colon used well, or misused?", bins: "Used well|Misused", items: ["Bring three things: a pen, paper and water.|She had one goal: to win.", "Bring: a pen, paper and water.|My favorites are: red and blue."], trap: ["My favorites are: red and blue.", 0], why: "My favorites are is not a complete sentence. No colon after are.", win: "Full sentence, then the colon." },
    { say: "Sort these.", bins: "Used well|Misused", items: ["The sign gave one warning: “Bridge out.”|He packed the basics: socks, soap and a towel.", "The team includes: Ana, Raj and Lee.|We traveled to: Ohio and Maine."], trap: ["We traveled to: Ohio and Maine.", 0], why: "A colon cannot follow the preposition to.", win: "Not after a verb or preposition." },
    { say: "Sort these by yourself.", bins: "Used well|Misused", items: ["The recipe needs three things: flour, salt and time.|Her motto was simple: “Begin.”", "The recipe needs: flour, salt and time.|I am good at: math and chess."], trap: ["The recipe needs: flour, salt and time.", 0] },
  ],
}));
