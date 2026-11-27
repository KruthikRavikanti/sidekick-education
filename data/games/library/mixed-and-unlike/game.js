// Mixed and Unlike. Skill 5.NF.A.1-3.
// Adding and subtracting mixed numbers with unlike denominators: 2 1/2 + 1 2/3 = 4 1/6. Regrouping incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mixed and Unlike",
  emoji: "🫙",
  premise: "These mixed numbers have different size pieces. Rename the fraction parts first, then add or subtract.",
  outro: "Rename the fractions to match, then regroup a whole as that many pieces when you need to.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  hint: "Rename both fraction parts with the same denominator first.",
  tag: "regroups_incorrectly",
  rounds: [
    { say: "Dial in the answer as wholes and sixths.", q: "2 {1/2} + 1 {2/3}", dials: [["Wholes", 0, 9], ["Sixths", 0, 5]], view: { type: "text", text: "{0} and {1} sixths" }, ans: [4, 1], trap: [3, 1], why: "3 sixths and 4 sixths make 7 sixths. That is 1 whole and 1 sixth more.", win: "4 wholes and 1 sixth." },
    { say: "Dial in the answer as wholes and fourths.", q: "3 {1/4} − 1 {1/2}", dials: [["Wholes", 0, 9], ["Fourths", 0, 3]], view: { type: "text", text: "{0} and {1} fourths" }, ans: [1, 3], trap: [2, 1], why: "You cannot take 2 fourths from 1 fourth. Trade one whole for 4 fourths.", win: "1 whole and 3 fourths." },
    { say: "Dial in the answer by yourself.", alt: [{ q: "1 {3/4} + 2 {1/2}", dials: [["Wholes", 0, 9], ["Fourths", 0, 3]], view: { type: "text", text: "{0} and {1} fourths" }, ans: [4, 1], trap: [3, 1] }, { q: "4 {1/3} − 2 {1/2}", dials: [["Wholes", 0, 9], ["Sixths", 0, 5]], view: { type: "text", text: "{0} and {1} sixths" }, ans: [1, 5], trap: [2, 1] }] },
  ],
}));
