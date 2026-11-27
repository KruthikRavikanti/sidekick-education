// Why Tell It in That Order?. Skill RL.9-10.5-1.
// Analyzing how an author’s choices about structure, order and time create mystery, tension or surprise. Describing the structure without its effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Tell It in That Order?",
  emoji: "⏳",
  premise: "Authors choose where to start, when to look back, and how fast to move. Each choice does something to the reader.",
  outro: "Name the structural choice, then its effect: mystery, tension or surprise.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does the reader know, or not know, because of this choice?",
  tag: "structure_without_effect",
  rounds: [
    { say: "Match each choice to its effect on the reader.", rows: [["opening with the ending", "makes us ask how it came to this"], ["a flashback just before the duel", "reveals what is at stake"], ["short, clipped sentences in the chase", "speeds the pace"]], extra: "it is a flashback|", trap: [1, "it is a flashback"], why: "That only names the technique. What does looking back do for the reader right then?", win: "Choice, then effect." },
    { say: "Match each choice to its effect.", rows: [["ending a chapter mid-scene", "builds suspense"], ["withholding the narrator’s name", "creates mystery"], ["slowing down to describe one second", "stretches the tension"]], extra: "the chapter is short|", trap: [0, "the chapter is short"], why: "Length is a fact about the chapter. The cut-off scene leaves us needing to know more.", win: "Each choice works on the reader." },
    { say: "Match these by yourself.", read: "The story opens with a locked suitcase on a train. Only in the last paragraph, in a flashback, do we learn who packed it.", rows: [["starting with the suitcase", "raises a question right away"], ["saving the flashback for the end", "delivers a surprise"]], extra: "the story is set on a train|it is told in the past tense", trap: [0, "the story is set on a train"] },
  ],
}));
