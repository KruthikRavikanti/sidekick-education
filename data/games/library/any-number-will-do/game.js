// Any Number Will Do. Skill 6.EE.B.6-2.
// Understanding that a variable can represent any number in a specified set. Thinking different letters must have different values is the known slip.
Sidekick.game(Sidekick.play({
  title: "Any Number Will Do",
  emoji: "🎲",
  premise: "In an expression like n + 5, the letter n can be any number from the set you are working in.",
  outro: "A variable can stand for any number in a set. Different letters may even share a value.",
  scene: "candy",
  kind: "sort",
  hint: "Is there anything stopping the letter from being that number?",
  tag: "letters_must_differ",
  rounds: [
    { say: "True or not true, for the expression n + 5?", bins: "True|Not true", items: ["n can be 2|n can be 100", "n must be 5|n can only be one number"], trap: ["n must be 5", 0], why: "Nothing says n equals 5. It can be any number.", win: "n can be any number." },
    { say: "True or not true?", bins: "True|Not true", items: ["In x + y, both can be 3|In 2a, a can be a fraction", "x and y must be different|A letter is always 1"], trap: ["x and y must be different", 0], why: "Two different letters are allowed to have the same value.", win: "Variables are flexible." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["In 4k, k can be 0|In m − 1, m can be 10", "k must be 4|Different letters never match"], trap: ["Different letters never match", 0] },
  ],
}));
