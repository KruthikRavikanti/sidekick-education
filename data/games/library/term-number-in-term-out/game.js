// Term Number In, Term Out. Skill F-IF.A.3-1.
// Recognizing that sequences are functions whose domain is a subset of the integers. Treating sequences as lists only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Term Number In, Term Out",
  emoji: "🔢",
  premise: "A sequence is a function. The input is the position: 1st, 2nd, 3rd. The output is the term in that position.",
  outro: "A sequence is a function whose domain is a set of whole numbers: f(n) is the nth term.",
  scene: "desk",
  kind: "type",
  icon: "🔢",
  hint: "f(4) asks for the 4th term.",
  tag: "sequence_as_list",
  rounds: [
    { say: "The sequence 3, 5, 7, 9 has f(1) = 3 and f(2) = 5. Key in f(4).", ans: 9, trap: 7, why: "7 is the 3rd term. f(4) is the 4th.", win: "The 4th term is 9." },
    { say: "Which numbers can be inputs for a sequence that starts at f(1)?", kind: "sort", fs: 6, bins: "Can be an input|Cannot", items: ["1|2|10", "1.5|−3|0.25"], trap: ["1.5", 0], why: "There is no term in position one and a half.", win: "Only positive whole positions." },
    { say: "Find the term by yourself.", alt: [{ q: "The sequence is 4, 8, 12, 16. Find f(3).", ans: 12, trap: 3 }, { q: "The sequence is 10, 7, 4, 1. Find f(4).", ans: 1, trap: 4 }, { q: "The sequence is 2, 4, 8, 16. Find f(5).", ans: 32, trap: 20 }] },
  ],
}));
