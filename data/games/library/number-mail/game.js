// Number Mail. Skill K.CC.A.3-1.
// Telling look-alike numerals apart: cards with 6 and 9, or 12 and 21, go to different mailboxes, so the child has to look at each numeral closely.
Sidekick.game(Sidekick.play({
  title: "Number Mail",
  emoji: "📬",
  premise: "The mail carrier has number cards to deliver. Drop each one in the right mailbox.",
  outro: "All the mail is delivered. You know your numbers!",
  scene: "city",
  kind: "sort",
  cast: "📬 🏠 🌳 🏡",
  hint: "Look at which way the number faces and which digit comes first.",
  tag: "look_alike_numerals",
  rounds: [
    { say: "Sort the cards. Some show six and some show nine.", bins: "Six|Nine", items: ["6 6 6", "9 9"], trap: ["9", 0], why: "A 9 has its circle up high. A 6 has its circle down low.", win: "Six has its loop down low. Nine has its loop up high." },
    { say: "Now twelve and twenty-one. Which digit comes first?", bins: "Twelve|Twenty-one", items: ["12 12", "21 21 21"], trap: ["21", 0], why: "Twelve starts with a 1. Twenty-one starts with a 2.", win: "Twelve is 1 then 2. Twenty-one is 2 then 1." },
    { say: "Deliver every card to its mailbox.", bins: "Twelve|Twenty-one|Six", items: ["12 12", "21 21", "6"], trap: ["21", 0] },
  ],
}));
