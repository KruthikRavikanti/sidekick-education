// Rational or Irrational?. Skill 8.NS.A.1-1.
// Knowing that irrational numbers have non-repeating, non-terminating decimals. Thinking π equals 3.14 exactly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rational or Irrational?",
  emoji: "♾️",
  premise: "A rational number can be written as a fraction. Its decimal ends or repeats. An irrational number goes on forever with no repeating pattern.",
  outro: "Irrational numbers have decimals that never end and never repeat. π is not exactly 3.14.",
  scene: "space",
  kind: "sort",
  fs: 7,
  hint: "Can it be written as a fraction of whole numbers? Does its decimal end or repeat?",
  tag: "pi_is_exactly_3_14",
  rounds: [
    { say: "Sort each number.", bins: "Rational|Irrational", items: ["0.75|{1/3}|√9", "√2|π"], trap: ["π", 0], why: "π is not exactly 3.14. Its digits go on forever with no pattern.", win: "√9 is just 3. √2 and π never settle." },
    { say: "Sort these.", bins: "Rational|Irrational", items: ["0.333...|−5|√16", "√3|0.1010010001..."], trap: ["0.333...", 1], why: "A repeating decimal is a fraction. This one is one third.", win: "Repeating means rational." },
    { say: "Sort these by yourself.", bins: "Rational|Irrational", items: ["3.14|√25|{22/7}", "π|√7"], trap: ["π", 0] },
  ],
}));
