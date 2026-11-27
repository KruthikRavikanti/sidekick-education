// Said One Thing, Meant Another. Skill RL.11-12.6-1.
// Analyzing a case in which grasping a point of view requires distinguishing what is directly stated from what is really meant. Reading satire literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Said One Thing, Meant Another",
  emoji: "🙃",
  premise: "Satire and irony say the opposite of what they mean. Read them literally and you miss the whole point.",
  outro: "In satire, sarcasm, irony and understatement, separate what is directly stated from what is really meant.",
  scene: "paper",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is the proposal too extreme to be serious? Then ask what it is mocking.",
  tag: "reads_literally",
  rounds: [
    { say: "Separate what is stated from what is meant.", read: "A modest suggestion: assign forty hours of homework a night. Sleep, after all, only wastes time that could be spent on worksheets.", rows: [["stated", "students should get far more homework"], ["meant", "homework loads are already absurd"]], extra: "sleep is a waste of time|", trap: [1, "sleep is a waste of time"], why: "That takes the joke literally. The exaggeration mocks heavy homework.", win: "The opposite of what it says." },
    { say: "Name each kind of saying-one-thing.", rows: [["sarcasm", "“Oh, wonderful, another meeting.”"], ["understatement", "Of the flood: “We had a little water.”"], ["irony", "The fire station burned down."]], extra: "The meeting is at noon.|", trap: [1, "The meeting is at noon."], why: "That is a plain statement. Understatement makes something big sound small.", win: "Mock, shrink, reverse." },
    { say: "Separate stated from meant by yourself.", read: "By all means, let us pave the last park. Children can admire trees perfectly well on their phones.", rows: [["stated", "the park should be paved"], ["meant", "paving the park would be a loss"]], extra: "phones show trees well|", trap: [1, "phones show trees well"] },
  ],
}));
