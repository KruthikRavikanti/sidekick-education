// Type and Collaborate. Skill W.5.6-1.
// Using technology to produce and publish writing and to interact and collaborate with others, with sufficient keyboarding skills. Slow typing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Type and Collaborate",
  emoji: "💻",
  premise: "Technology lets writers draft long pieces, get comments from others and publish their work.",
  outro: "Use technology to produce, publish and collaborate on writing.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which tool does that job?",
  tag: "slow_typing",
  rounds: [
    { say: "Match each tool to what it lets you do.", rows: [["comments", "give feedback on a draft"], ["shared document", "write together at once"], ["spell check", "catch spelling slips"]], trap: [0, "write together at once"], why: "A comment is a note on the draft. A shared document is for writing together.", win: "Three tools for working together." },
    { say: "Put the steps of a shared writing project in order.", kind: "row", seq: "Draft your section.|Share it with your group.|Read their comments.|Revise and publish.", trap: "Read their comments.|Draft your section.|Share it with your group.|Revise and publish.", why: "There are no comments to read until you have shared a draft.", win: "Draft, share, respond, publish." },
    { say: "Match each habit to why it helps you type two pages.", rows: [["touch typing", "keeps your eyes on the screen"], ["saving often", "protects your work"], ["short stretch breaks", "keeps your hands fresh"]], extra: "makes the font bigger|", trap: [0, "makes the font bigger"] },
  ],
}));
