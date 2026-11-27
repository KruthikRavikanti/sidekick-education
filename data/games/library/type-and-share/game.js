// Type and Share. Skill W.1.6-1.
// Using digital tools to produce and publish writing: the steps of typing and sharing are ordered and keys are matched to their jobs. Avoiding the tools is the known slip.
Sidekick.game(Sidekick.play({
  title: "Type and Share",
  emoji: "🖥️",
  premise: "Writers use computers to type their work and share it. There are steps to follow, in order.",
  outro: "To publish on a computer: type it, check it, save it, then share it.",
  scene: "desk",
  kind: "row",
  hint: "What has to happen before you can share it?",
  tag: "avoids_tools",
  rounds: [
    { say: "What does each key do?", kind: "fill", cast: "", rows: [["makes a capital letter", "shift"], ["puts room between words", "space bar"], ["erases a letter", "delete"], ["starts a new line", "enter"]], trap: [0, "enter"], why: "Enter starts a new line. Shift makes a capital.", win: "Four keys, four jobs." },
    { say: "Put the steps in order to publish your story.", seq: "Type the words.|Read it and fix it.|Save your work.|Print or share it.", trap: "Print or share it.|Type the words.|Read it and fix it.|Save your work.", why: "You cannot share it before you type it.", win: "Type, fix, save, share." },
    { say: "Put these steps in order by yourself.", seq: "Open a new page.|Type your sentence.|Check the spelling.|Save it with a name.", trap: "Save it with a name.|Open a new page.|Type your sentence.|Check the spelling." },
  ],
}));
