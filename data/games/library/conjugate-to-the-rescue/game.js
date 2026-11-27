// Conjugate to the Rescue. Skill N-CN.A.3-1.
// Finding the conjugate of a complex number and using it to divide. Changing the sign of the real part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Conjugate to the Rescue",
  emoji: "🪞",
  premise: "A conjugate flips the sign of the imaginary part only. Multiply a complex number by its conjugate and the i disappears.",
  outro: "The conjugate of a + bi is a − bi. Their product is a^2 + b^2, a real number, which is how you divide.",
  scene: "space",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Keep the real part. Flip only the sign in front of the i term.",
  tag: "flips_real_part",
  rounds: [
    { say: "Match each number to its conjugate.", rows: [["3 + 4i", "3 − 4i"], ["2 − 5i", "2 + 5i"], ["−1 + i", "−1 − i"]], extra: "−3 + 4i|", trap: [0, "−3 + 4i"], why: "That flipped the real part. Only the imaginary part changes sign.", win: "Same real part, opposite imaginary part." },
    { say: "Multiply 3 + 4i by its conjugate. Key in the result.", kind: "type", icon: "🪞", q: "(3 + 4i)(3 − 4i) = 9 − 16i^2", ans: 25, trap: -7, why: "i^2 is −1, so −16i^2 becomes +16.", win: "9 + 16 = 25. No i left." },
    { say: "Divide 1 by 3 + 4i, step by step.", rows: [["multiply above and below by", "3 − 4i"], ["the denominator becomes", "25"], ["the answer is", "{3 − 4i/25}"]], extra: "3 + 4i|−7", trap: [0, "3 + 4i"], why: "Use the conjugate, 3 − 4i, so the denominator turns real.", win: "The conjugate clears i from the denominator." },
    { say: "Multiply by the conjugate by yourself. Key in the result.", kind: "type", icon: "🪞", alt: [{ q: "(2 + i)(2 − i)", ans: 5, trap: 3 }, { q: "(1 + 3i)(1 − 3i)", ans: 10, trap: -8 }, { q: "(4 + 3i)(4 − 3i)", ans: 25, trap: 7 }] },
  ],
}));
