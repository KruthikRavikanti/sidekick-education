// Real With Real. Skill N-CN.A.2-1.
// Adding and subtracting complex numbers. Combining real and imaginary parts into one number is the known slip.
Sidekick.game(Sidekick.play({
  title: "Real With Real",
  emoji: "➕",
  premise: "Adding complex numbers works like combining like terms. Real parts go together. Imaginary parts go together.",
  outro: "(a + bi) + (c + di) = (a + c) + (b + d)i.",
  scene: "space",
  kind: "dial",
  cast: "",
  view: { type: "text", text: "{0} + ({1})i" },
  dials: [["Real part", -9, 9, 1, 0], ["Imaginary part", -9, 9, 1, 0]],
  hint: "Add the plain numbers. Then add the numbers in front of i.",
  tag: "merges_real_and_imaginary",
  rounds: [
    { say: "Add (3 + 2i) + (1 − 5i). Set each part of the answer.", ans: [4, -3], trap: [1, 0], why: "That mashes everything into one number. Keep them apart: 3 + 1, and 2 − 5.", win: "4 − 3i." },
    { say: "Subtract (6 + i) − (2 + 4i). Set each part.", ans: [4, -3], trap: [4, 5], why: "Subtract the whole second number: 1 − 4 = −3.", win: "6 − 2 = 4 and 1 − 4 = −3." },
    { say: "Set each part of the answer by yourself.", alt: [{ say: "By yourself: add (2 + 7i) + (5 − 3i).", ans: [7, 4], trap: [9, 2] }, { say: "By yourself: subtract (8 + 2i) − (3 + 6i).", ans: [5, -4], trap: [5, 8] }, { say: "By yourself: add (−4 + i) + (6 + 2i).", ans: [2, 3], trap: [5, 0] }] },
  ],
}));
