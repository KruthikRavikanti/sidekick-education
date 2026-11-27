// Use the Term Before. Skill F-IF.A.3-2.
// Using recursive definitions of sequences. Starting from the term after the given one is the known slip.
Sidekick.game(Sidekick.play({
  title: "Use the Term Before",
  emoji: "🔁",
  premise: "A recursive rule builds each term from the ones before it. You must start from the given first term.",
  outro: "Start at the given term and apply the rule step by step.",
  scene: "night",
  kind: "type",
  icon: "🔁",
  hint: "Write out the terms one at a time, beginning with the one you are given.",
  tag: "starts_one_term_late",
  rounds: [
    { say: "Key in a(4).", q: "a(1) = 2 and a(n) = a(n − 1) + 3", ans: 11, trap: 14, why: "a(1) is 2. Then 5, 8, 11. The count started one term too late.", win: "2, 5, 8, 11." },
    { say: "Key in f(5).", q: "f(1) = 1, f(2) = 1 and f(n) = f(n − 1) + f(n − 2)", ans: 5, trap: 8, why: "The terms are 1, 1, 2, 3, 5. The 5th is 5. 8 is the 6th.", win: "1, 1, 2, 3, 5." },
    { say: "Find the term by yourself.", alt: [{ q: "a(1) = 3 and a(n) = 2 × a(n − 1). Find a(4).", ans: 24, trap: 48 }, { q: "a(1) = 10 and a(n) = a(n − 1) − 4. Find a(3).", ans: 2, trap: -2 }, { q: "f(1) = 2, f(2) = 3 and f(n) = f(n − 1) + f(n − 2). Find f(5).", ans: 13, trap: 21 }] },
  ],
}));
