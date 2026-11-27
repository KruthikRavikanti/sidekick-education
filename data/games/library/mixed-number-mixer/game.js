// Mixed Number Mixer. Skill 4.NF.B.3-3.
// Adding and subtracting mixed numbers with like denominators: fraction parts that reach a whole are regrouped. Forgetting to regroup is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mixed Number Mixer",
  emoji: "🥣",
  premise: "Add the wholes and add the parts. When the parts make a whole, trade them in.",
  outro: "When the fraction parts make a whole, regroup it into the wholes.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  hint: "Add the parts first. Do they make a whole or more?",
  tag: "regroups_incorrectly",
  rounds: [
    { say: "Dial in the answer as wholes and fifths.", q: "2 {3/5} + 1 {4/5}", dials: [["Wholes", 0, 9], ["Fifths", 0, 4]], view: { type: "text", text: "{0} and {1} fifths" }, ans: [4, 2], trap: [3, 2], why: "The parts add to 7 fifths. That is 1 whole and 2 fifths, so the wholes go up by 1.", win: "4 wholes and 2 fifths." },
    { say: "Dial in the answer as wholes and fourths.", q: "3 {1/4} − 1 {3/4}", dials: [["Wholes", 0, 9], ["Fourths", 0, 3]], view: { type: "text", text: "{0} and {1} fourths" }, ans: [1, 2], trap: [2, 2], why: "You cannot take 3 fourths from 1 fourth. Trade one whole for 4 fourths first.", win: "1 whole and 2 fourths." },
    { say: "Dial in the answer by yourself.", alt: [{ q: "1 {5/8} + 2 {6/8}", dials: [["Wholes", 0, 9], ["Eighths", 0, 7]], view: { type: "text", text: "{0} and {1} eighths" }, ans: [4, 3], trap: [3, 3] }, { q: "4 {2/6} − 1 {5/6}", dials: [["Wholes", 0, 9], ["Sixths", 0, 5]], view: { type: "text", text: "{0} and {1} sixths" }, ans: [2, 3], trap: [3, 3] }] },
  ],
}));
