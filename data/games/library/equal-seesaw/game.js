// Equal Seesaw. Skill 1.OA.D.7-1.
// The meaning of the equal sign: a balance shows a number or a sum on one side and the child loads the other side until it is level.
Sidekick.game(Sidekick.play({
  title: "Equal Seesaw",
  emoji: "🎠",
  premise: "The seesaw only sits level when both sides hold the same amount. Load the right side to match the left.",
  outro: "The equal sign means both sides are the same amount.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  hint: "Both sides must be the same amount. Watch the seesaw.",
  tag: "equal_means_answer_next",
  dials: [["Right side", 0, 12]],
  rounds: [
    { say: "The left side holds 6. Load the right side until the seesaw is level.", view: { type: "balance", eq: [0, 6, 1, 0], left: "6", right: "?" }, ans: [6], trap: [5], why: "The left side is still heavier. Both sides must be the same.", win: "6 is the same as 6." },
    { say: "The left side holds 4 + 3. Make the right side the same amount.", view: { type: "balance", eq: [0, 7, 1, 0], left: "4 + 3", right: "?" }, ans: [7], trap: [4], why: "The left side is 4 and 3 together. That is 7.", win: "4 + 3 is the same as 7." },
    { say: "Level the seesaw by yourself.", alt: [{ view: { type: "balance", eq: [0, 8, 1, 0], left: "2 + 6", right: "?" }, ans: [8], trap: [6] }, { view: { type: "balance", eq: [0, 9, 1, 0], left: "5 + 4", right: "?" }, ans: [9], trap: [5] }, { view: { type: "balance", eq: [0, 10, 1, 0], left: "3 + 7", right: "?" }, ans: [10], trap: [7] }] },
  ],
}));
