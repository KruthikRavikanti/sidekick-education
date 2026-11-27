// True for Every Number. Skill A-APR.C.4-1.
// Proving polynomial identities. Testing one value and calling it proven is the known slip.
Sidekick.game(Sidekick.play({
  title: "True for Every Number",
  emoji: "♾️",
  premise: "An identity is true for every value. Checking one example cannot prove that. Algebra can.",
  outro: "Prove an identity by transforming one side into the other with valid steps.",
  scene: "paper",
  kind: "row",
  fs: 4.8,
  hint: "Expand, then combine like terms until both sides match.",
  tag: "one_example_as_proof",
  rounds: [
    { say: "Put the proof that (a + b)^2 − (a − b)^2 = 4ab in order.", seq: "(a + b)^2 − (a − b)^2|= (a^2 + 2ab + b^2) − (a^2 − 2ab + b^2)|= 2ab + 2ab|= 4ab", trap: "(a + b)^2 − (a − b)^2|= 2ab + 2ab|= (a^2 + 2ab + b^2) − (a^2 − 2ab + b^2)|= 4ab", why: "Expand both squares before you subtract.", win: "Expand, subtract, combine." },
    { say: "Which of these prove an identity?", kind: "sort", fs: 4.8, bins: "Proof|Not a proof", items: ["Expand one side until it matches the other.|Show each step works for every value.", "It works when a = 1 and b = 2.|It works for three examples."], trap: ["It works for three examples.", 0], why: "Examples can only suggest it. A fourth example might break it.", win: "Algebra covers every value at once." },
    { say: "Put the proof that (x + 1)^2 − (x − 1)^2 = 4x in order by yourself.", seq: "(x + 1)^2 − (x − 1)^2|= (x^2 + 2x + 1) − (x^2 − 2x + 1)|= 2x + 2x|= 4x", trap: "(x + 1)^2 − (x − 1)^2|= 2x + 2x|= (x^2 + 2x + 1) − (x^2 − 2x + 1)|= 4x" },
  ],
}));
