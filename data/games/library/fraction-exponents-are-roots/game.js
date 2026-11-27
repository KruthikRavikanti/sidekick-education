// Fraction Exponents Are Roots. Skill N-RN.A.1-1.
// Explaining how rational exponents follow from the properties of integer exponents. Reading 5^(1/3) as 5 divided by 3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Exponents Are Roots",
  emoji: "🌱",
  premise: "Cube 8^(1/3) and the exponents multiply to 1, giving 8. So 8^(1/3) must be the number whose cube is 8.",
  outro: "a^(1/n) is the nth root of a, because raising it to the n gives a back.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Which number, multiplied by itself that many times, gives the base?",
  tag: "exponent_as_division",
  rounds: [
    { say: "An exponent of {1/3} asks for the cube root. Match each power to its value.", rows: [["8^(1/3)", "2"], ["27^(1/3)", "3"]], extra: "{8/3} 9", trap: [0, "{8/3}"], why: "That divides 8 by 3. The exponent {1/3} asks: what number cubed is 8?", win: "2 × 2 × 2 = 8 and 3 × 3 × 3 = 27." },
    { say: "An exponent of {1/2} asks for the square root. Match each power.", rows: [["16^(1/2)", "4"], ["100^(1/2)", "10"], ["27^(1/3)", "3"]], extra: "8 50", trap: [0, "8"], why: "8 is half of 16. The square root of 16 is 4, since 4 × 4 = 16.", win: "Roots, not halves." },
    { say: "Match each power to its value by yourself.", alt: [{ rows: [["25^(1/2)", "5"], ["8^(1/3)", "2"], ["81^(1/4)", "3"]], extra: "12.5 27", trap: [0, "12.5"] }, { rows: [["36^(1/2)", "6"], ["1000^(1/3)", "10"], ["32^(1/5)", "2"]], extra: "18 333", trap: [0, "18"] }] },
  ],
}));
