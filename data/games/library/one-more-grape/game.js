// One More Grape. Skill K.CC.B.4-4.
// Each next number is one more: the child fills a bowl one grape at a time and sees the total go up by exactly one.
Sidekick.game(Sidekick.play({
  title: "One More Grape",
  emoji: "🍇",
  premise: "The fruit bowl needs just the right number of grapes. Each one you add makes one more.",
  outro: "Each grape you added made the number one bigger.",
  scene: "kitchen",
  kind: "build",
  cast: "",
  hint: "Add one grape and watch the number. One more grape is the next number.",
  tag: "one_off_count",
  pile: [["🍇", 1, 10]],
  rounds: [
    { say: "Put 5 grapes in the bowl. Watch the number as you add each one.", goal: 5, trap: 4, why: "That is one too few. One more grape makes the next number.", win: "Five grapes." },
    { say: "Now make it one more than 6.", goal: 7, trap: 6, why: "That is 6. One more than 6 is the next number.", win: "One more than 6 is 7." },
    { say: "Fill the bowl with one more than 8.", goal: 9, trap: 8, trap2: 10 },
  ],
}));
