// Myself, Ourselves. Skill L.6.1-2.
// Using intensive pronouns such as myself and ourselves. Using them as subjects is the known slip.
Sidekick.game(Sidekick.play({
  title: "Myself, Ourselves",
  emoji: "🪞",
  premise: "Words like myself and ourselves add emphasis or point back to the doer. They cannot be the doer on their own.",
  outro: "Use myself, yourself, ourselves to emphasize or reflect. Never as the subject of a sentence.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is there already an I or we doing the action? Then the self word can follow.",
  tag: "intensive_as_subject",
  rounds: [
    { say: "Drop in the words that fit.", rows: [["I made the cake ___.", "myself"], ["___ went to the game.", "Tom and I"]], extra: "Myself and Tom|", trap: [1, "Myself and Tom"], why: "Myself cannot be the doer. Use I for the subject.", win: "I did it myself. Tom and I went." },
    { say: "Drop in the words that fit.", rows: [["We painted the room ___.", "ourselves"], ["The mayor ___ answered the phone.", "herself"], ["Please call Dana or ___.", "me"]], extra: "myself", trap: [2, "myself"], why: "There is no I earlier in the sentence to point back to. Use me.", win: "Emphasis needs a doer to point back to." },
    { say: "Fill these by yourself.", rows: [["You can fix it ___.", "yourself"], ["___ are leaving at noon.", "Sam and I"], ["The kids cooked dinner ___.", "themselves"]], extra: "Sam and myself|", trap: [1, "Sam and myself"] },
  ],
}));
