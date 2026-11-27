// Bird Wire. Skill K.OA.A.1-1.
// Acting out joining and taking apart: the child places birds to match a short story, and counting the birds that flew away gives too many.
Sidekick.game(Sidekick.play({
  title: "Bird Wire",
  emoji: "🕊️",
  premise: "Birds land on the wire and birds fly away. Act out each story so the wire shows who is there now.",
  outro: "Joining makes more. Flying away leaves fewer.",
  scene: "sky",
  kind: "build",
  cast: "",
  hint: "Act it out. Birds that flew away are not on the wire now.",
  tag: "counts_the_ones_taken_away",
  pile: [["🐦", 1, 9]],
  plateLook: "slot",
  rounds: [
    { say: "3 birds sit on the wire. 2 more land. Put all of those birds on the wire.", goal: 5, trap: 3, why: "Two more birds came. Put them on the wire too.", win: "3 and 2 more make 5." },
    { say: "6 birds sat on the wire. 2 flew away. Put on only the birds that are left.", goal: 4, trap: 6, why: "Two flew away, so they are not on the wire now.", win: "6 take away 2 leaves 4." },
    { say: "Act out this story by yourself.", alt: [{ say: "7 birds sat on the wire. 3 flew away. Put on only the birds that are left.", goal: 4, trap: 7 }, { say: "4 birds sit on the wire. 4 more land. Put all of those birds on the wire.", goal: 8, trap: 4 }, { say: "8 birds sat on the wire. 3 flew away. Put on only the birds that are left.", goal: 5, trap: 8 }] },
  ],
}));
