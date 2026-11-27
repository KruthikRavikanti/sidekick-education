// Reasons That Support. Skill W.3.1-2.
// Providing reasons that support the opinion. Giving reasons that do not support it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reasons That Support",
  emoji: "🏗️",
  premise: "A reason only helps if it backs up your opinion. A fact about something else does not count.",
  outro: "Give reasons that actually support your opinion.",
  scene: "city",
  kind: "pick",
  hint: "Does it explain why YOUR opinion is right?",
  tag: "reasons_do_not_support",
  rounds: [
    { say: "Opinion: Our school should have a garden. Tap the reasons that support it.", yes: "Students would learn how plants grow.|We could eat the vegetables at lunch.", no: "Gardens have dirt.|My uncle has a garden.", trap: "My uncle has a garden.", why: "That is about your uncle. It does not say why the school should have one.", win: "Two reasons that support the opinion." },
    { say: "Opinion: Kids should read every day. Tap the reasons that support it.", yes: "Reading builds your vocabulary.|Reading helps you learn about the world.", no: "Books are made of paper.|Libraries have chairs.|Some books are long.", trap: "Books are made of paper.", why: "That is a fact about books, not a reason to read.", win: "Reasons that fit." },
    { say: "Opinion: Recess should be longer. Tap the reasons by yourself.", yes: "Kids focus better after moving around.|Play teaches teamwork.", no: "Recess is before lunch.|The playground has swings.|Some kids like tag.", trap: "Recess is before lunch." },
  ],
}));
