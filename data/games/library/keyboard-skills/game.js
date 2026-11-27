// Keyboard Skills. Skill W.3.6-1.
// Using technology to produce and publish writing, including keyboarding skills. Avoiding typing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Keyboard Skills",
  emoji: "⌨️",
  premise: "Typing your writing lets you fix and share it easily. Learn what the main keys and tools do.",
  outro: "Use keyboarding and tools like spell check to produce and publish writing.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What do you want the computer to do?",
  tag: "avoids_typing",
  rounds: [
    { say: "Match each key or tool to its job.", rows: [["Shift", "makes a capital letter"], ["Backspace", "erases the letter before"], ["Enter", "starts a new line"]], trap: [1, "starts a new line"], why: "Backspace erases. Enter moves down a line.", win: "Shift, Backspace and Enter." },
    { say: "Put the steps in order to publish a typed paragraph.", kind: "row", seq: "Type your paragraph.|Run the spell check.|Fix the marked words.|Save and print.", trap: "Run the spell check.|Type your paragraph.|Fix the marked words.|Save and print.", why: "There is nothing to check until you have typed it.", win: "Type, check, fix, publish." },
    { say: "Match these by yourself.", rows: [["Tab", "indents a paragraph"], ["Spell check", "finds spelling slips"], ["Save", "keeps your work"]], extra: "turns the screen off|", trap: [0, "turns the screen off"] },
  ],
}));
