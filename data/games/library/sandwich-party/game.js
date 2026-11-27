// Sandwich Party. Skill 4.NF.B.4-3.
// Word problems multiplying a fraction by a whole number: 5 × 3/4 = 15/4 = 3 3/4. Adding the whole number to the fraction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sandwich Party",
  emoji: "🥪",
  premise: "Everyone at the party gets the same fraction. Work out how much food that is altogether.",
  outro: "Equal fraction shares for many people is multiplication.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  hint: "Count the pieces: how many fourths is 5 copies of 3 fourths? Then make wholes.",
  tag: "adds_instead_of_multiplying",
  rounds: [
    { say: "Dial in how many sandwiches are eaten.", q: "Each of 5 kids eats {3/4} of a sandwich.", dials: [["Wholes", 0, 9], ["Fourths", 0, 3]], view: { type: "text", text: "{0} and {1} fourths" }, ans: [3, 3], trap: [5, 3], why: "5 and 3 fourths is adding. Five copies of 3 fourths is 15 fourths.", win: "15 fourths is 3 wholes and 3 fourths." },
    { say: "Dial in how much milk you need.", q: "A recipe uses {2/3} cup of milk. You make 4 batches.", dials: [["Wholes", 0, 9], ["Thirds", 0, 2]], view: { type: "text", text: "{0} and {1} thirds" }, ans: [2, 2], trap: [4, 2], why: "4 and 2 thirds is adding. Four copies of 2 thirds is 8 thirds.", win: "8 thirds is 2 wholes and 2 thirds." },
    { say: "Dial in the answer by yourself.", alt: [{ q: "Each lap is {3/5} mile. Ana runs 4 laps. How far does she run?", dials: [["Wholes", 0, 9], ["Fifths", 0, 4]], view: { type: "text", text: "{0} and {1} fifths" }, ans: [2, 2], trap: [4, 3] }, { q: "6 friends each drink {1/2} liter of juice. How much is that in all?", dials: [["Wholes", 0, 9], ["Halves", 0, 1]], view: { type: "text", text: "{0} and {1} halves" }, ans: [3, 0], trap: [6, 1] }] },
  ],
}));
