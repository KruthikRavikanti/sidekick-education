// Count Every Root. Skill N-CN.C.9-1.
// Knowing the Fundamental Theorem of Algebra. Counting only the real roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count Every Root",
  emoji: "🌳",
  premise: "The Fundamental Theorem of Algebra: a polynomial of degree n has exactly n complex roots, when repeats are counted.",
  outro: "Degree n means n complex roots, counting multiplicity. Some may not be real.",
  scene: "forest",
  kind: "type",
  icon: "🌳",
  hint: "Find the highest power of x. That is the number of roots.",
  tag: "counts_real_roots_only",
  rounds: [
    { say: "Key in how many complex roots x^3 − 2x + 1 has, counting repeats.", ans: 3, trap: 1, why: "The degree is 3, so there are 3 roots in the complex numbers.", win: "Degree 3: three roots." },
    { say: "x^4 + 1 never touches the x-axis. Key in how many complex roots it has.", ans: 4, trap: 0, why: "It has no real roots, but all 4 of its roots are complex.", win: "Degree 4: four roots, none of them real." },
    { say: "Count the complex roots by yourself.", alt: [{ q: "x^5 − x", ans: 5, trap: 3 }, { q: "x^2 + 9", ans: 2, trap: 0 }, { q: "(x − 1)^3", ans: 3, trap: 1 }, { q: "x^6 + x^2 + 7", ans: 6, trap: 0 }] },
  ],
}));
