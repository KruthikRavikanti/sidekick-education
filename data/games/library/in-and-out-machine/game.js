// In and Out Machine. Skill 4.OA.C.5-3.
// Using input-output tables: the rule maps inputs to outputs. Treating a given output as an input is the known slip.
Sidekick.game(Sidekick.play({
  title: "In and Out Machine",
  emoji: "📠",
  premise: "A number goes in, the rule does its work, and a number comes out. Fill in whichever one is missing.",
  outro: "The rule turns each input into its output. Work backward to find a missing input.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Check which side the number is on: did it go in, or come out?",
  tag: "mixes_input_and_output",
  rounds: [
    { say: "Fill in what comes out.", q: "Rule: out = in × 3", rows: [["in 7 → out ___", "21"], ["in 4 → out ___", "12"]], extra: "10 7", trap: [0, "10"], why: "The rule multiplies by 3. 7 × 3 is 21.", win: "21 and 12." },
    { say: "One of these is missing what went IN.", q: "Rule: out = in × 3", rows: [["in ___ → out 30", "10"], ["in 9 → out ___", "27"]], extra: "90 12", trap: [0, "90"], why: "The 30 is what came OUT. What number times 3 gives 30?", win: "10 went in. 27 came out." },
    { say: "Fill these by yourself.", q: "Rule: out = in + 8", rows: [["in 5 → out ___", "13"], ["in ___ → out 20", "12"], ["in 9 → out ___", "17"]], extra: "28 40", trap: [1, "28"] },
  ],
}));
