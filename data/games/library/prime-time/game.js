// Prime Time. Skill 4.OA.B.4-3.
// Telling prime from composite: odd composites such as 9, 21 and 51 catch the idea that all odd numbers are prime, and 1 is neither.
Sidekick.game(Sidekick.play({
  title: "Prime Time",
  emoji: "👑",
  premise: "A prime number has exactly two factors: 1 and itself. Everything else bigger than 1 can be broken into smaller factors.",
  outro: "A prime has exactly two factors. A composite has more. The number 1 is neither.",
  scene: "night",
  kind: "sort",
  cast: "",
  hint: "Can you divide it evenly by 2, 3, 5 or 7? Then it is composite.",
  tag: "odd_means_prime",
  tag2: "one_is_prime",
  rounds: [
    { say: "Sort each number: prime or composite?", bins: "Prime|Composite", items: ["2 5 11 13", "9 15 21 4"], trap: ["9", 0], why: "9 is odd, but 3 × 3 = 9. It has more than two factors.", win: "Odd numbers can be composite." },
    { say: "Sort these.", bins: "Prime|Composite", items: ["3 7 17 23", "27 33 49 51"], trap: ["51", 0], why: "51 is 3 × 17. It is composite.", win: "Test before you trust." },
    { say: "Sort these by yourself. One number is neither.", bins: "Prime|Composite|Neither", items: ["19 29 31", "25 39 57", "1"], trap: ["57", 0], trap2: ["1", 0] },
  ],
}));
