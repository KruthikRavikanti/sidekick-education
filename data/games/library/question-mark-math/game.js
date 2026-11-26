// Question Mark Math. Skill 2.OA.A.1-4.
// Writing an equation with a symbol for the unknown: the tiles are arranged so the ? sits where the unknown happens in the story.
Sidekick.game(Sidekick.play({
  title: "Question Mark Math",
  emoji: "❓",
  premise: "Turn each story into a number sentence. The question mark stands where the unknown number is in the story.",
  outro: "A number sentence can follow the story, with a ? for the part you do not know.",
  scene: "desk",
  kind: "row",
  hint: "Tell the story in order: what was there first, what changed, what is there now.",
  tag: "unknown_in_the_wrong_place",
  rounds: [
    { say: "Build the number sentence for the story.", q: "A shop had 45 apples. It sold some. Now 27 are left.", seq: "45 − ? = 27", also: ["27 = 45 − ?"], trap: "? − 45 = 27", why: "The shop started with 45. The ? is how many it sold.", win: "45 − ? = 27." },
    { say: "Build this number sentence.", q: "Some birds sat on a wire. 12 more came. Now there are 30.", seq: "? + 12 = 30", also: ["12 + ? = 30", "30 = ? + 12", "30 = 12 + ?"], trap: "12 + 30 = ?", why: "30 is how many there are now. The ? is how many sat there first.", win: "? + 12 = 30." },
    { say: "Build this one by yourself.", alt: [{ q: "Ana had 60 beads. She used some. Now she has 38.", seq: "60 − ? = 38", also: ["38 = 60 − ?"], trap: "? − 60 = 38" }, { q: "A jar had some coins. Dad added 25. Now it has 70.", seq: "? + 25 = 70", also: ["25 + ? = 70", "70 = ? + 25", "70 = 25 + ?"], trap: "25 + 70 = ?" }] },
  ],
}));
