// Typing Tools. Skill W.2.6-1.
// Using digital tools to produce and publish writing: tools are matched to their jobs and editing steps are ordered. Avoiding the tools is the known slip.
Sidekick.game(Sidekick.play({
  title: "Typing Tools",
  emoji: "⌨️",
  premise: "A computer has tools that help writers fix and share their work. Know which tool does which job.",
  outro: "Use the delete key, spell check, save and print to produce your writing.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What do you want to happen? Which tool does that?",
  tag: "avoids_tools",
  rounds: [
    { say: "Which tool does each job?", rows: [["erase a letter you typed", "delete key"], ["keep your work for later", "save"], ["put your work on paper", "print"]], trap: [1, "print"], why: "Print puts it on paper. Save keeps it on the computer.", win: "Delete, save and print." },
    { say: "You typed: I saw a brd. Put the steps in order to fix it.", kind: "row", seq: "Click after the letter b.|Type the letter i.|Read the word again.|Save your work.", trap: "Save your work.|Click after the letter b.|Type the letter i.|Read the word again.", why: "Fix it first. Then save.", win: "Click, type, check, save." },
    { say: "Which tool does each job? Match by yourself.", rows: [["find words spelled the other way", "spell check"], ["make a capital letter", "shift key"], ["start a new paragraph", "enter key"]], extra: "print|", trap: [0, "print"] },
  ],
}));
