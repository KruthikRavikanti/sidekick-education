// Jar Labels. Skill K.CC.B.4-2.
// Cardinality: the last number said is how many. The child counts a set and sets the jar label to that number, with no need to count again.
Sidekick.game(Sidekick.play({
  title: "Jar Labels",
  emoji: "🫙",
  premise: "Every jar on the shelf needs a label that tells how many are inside. Count, then set the label.",
  outro: "The last number you say when you count tells how many there are.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  hint: "Count each one once. The last number you say is how many.",
  tag: "off_by_one_count",
  dials: [["How many", 0, 10]],
  view: { type: "text", text: "{0} in the jar" },
  rounds: [
    { say: "Count the buttons. Set the label to the last number you say.", pic: "🔘🔘🔘🔘🔘🔘", ans: [6], trap: [7], why: "That is one too many. Touch each button once as you count.", win: "Six buttons. The label says 6." },
    { say: "Count the stars. Set the label.", pic: "⭐⭐⭐⭐⭐⭐⭐⭐", ans: [8], trap: [9], why: "That is one too many. The last number you say is how many.", win: "Eight stars." },
    { say: "Count and label this jar by yourself.", alt: [{ pic: "🍬🍬🍬🍬🍬🍬🍬", ans: [7], trap: [8] }, { pic: "🫘🫘🫘🫘🫘🫘🫘🫘🫘", ans: [9], trap: [10] }, { pic: "🧩🧩🧩🧩🧩", ans: [5], trap: [6] }] },
  ],
}));
