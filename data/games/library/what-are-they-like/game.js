// What Are They Like?. Skill RL.1.3-1.
// Describing characters using key details: traits are inferred from actions. Describing only how characters look is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Are They Like?",
  emoji: "🥪",
  premise: "You can tell what a character is like from what they do and say, not just from how they look.",
  outro: "Describe a character by what they do and say.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "What did the character DO? What does that show?",
  tag: "describes_only_looks",
  rounds: [
    { say: "Read what each character does. What are they like?", rows: [["Lin gives half her sandwich to a boy who dropped his lunch.", "kind"], ["Jay tries again and again to tie his shoe.", "does not give up"]], extra: "tall|has red hair", trap: [0, "tall"], why: "Tall is how someone looks. What does sharing show about Lin?", win: "Lin is kind. Jay does not give up." },
    { say: "What is each character like?", rows: [["Pat jumps into the cold lake first.", "brave"], ["Kim tells her mom she broke the cup.", "honest"]], extra: "short|wears a hat", trap: [1, "wears a hat"], why: "A hat is something you see. Telling the truth shows she is honest.", win: "Pat is brave. Kim is honest." },
    { say: "Work these out by yourself.", rows: [["Ben helps his little sister cross the street.", "caring"], ["Zoe asks lots of questions about bugs.", "curious"], ["Dan will not share any of his toys.", "selfish"]], extra: "has big feet|", trap: [0, "has big feet"] },
  ],
}));
