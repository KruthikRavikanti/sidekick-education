// Pull Out the Perfect Square. Skill N-RN.A.2-2.
// Simplifying radical expressions. Thinking √(a + b) = √a + √b is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pull Out the Perfect Square",
  emoji: "🧰",
  premise: "A square root splits over multiplication, never over addition. Find a perfect square factor and pull it out.",
  outro: "√(a × b) = √a × √b, so √50 = √25 × √2 = 5√2. It does not split over addition.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Find the biggest perfect square that divides the number.",
  tag: "root_splits_over_addition",
  rounds: [
    { say: "True or not true?", kind: "sort", fs: 5.2, bins: "True|Not true", items: ["√(9 × 16) = 3 × 4|√50 = √25 × √2", "√(9 + 16) = 3 + 4|√(25 + 25) = 5 + 5"], trap: ["√(9 + 16) = 3 + 4", 0], why: "√25 is 5, not 7. Roots do not split over addition.", win: "Roots split over multiplication only." },
    { say: "Simplify each square root.", rows: [["√50", "5√2"], ["√12", "2√3"], ["√18", "3√2"]], extra: "25√2 6√2", trap: [0, "25√2"], why: "The 25 comes out as its square root, 5.", win: "√25 = 5, √4 = 2, √9 = 3." },
    { say: "Simplify these by yourself.", alt: [{ rows: [["√20", "2√5"], ["√45", "3√5"], ["√32", "4√2"]], extra: "4√5 16√2", trap: [0, "4√5"] }, { rows: [["√27", "3√3"], ["√8", "2√2"], ["√75", "5√3"]], extra: "9√3 25√3", trap: [0, "9√3"] }] },
  ],
}));
