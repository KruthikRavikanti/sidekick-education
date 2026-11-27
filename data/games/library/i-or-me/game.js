// I or Me?. Skill L.1.1-4.
// Using personal, possessive and indefinite pronouns. Using me as the subject is the known slip.
Sidekick.game(Sidekick.play({
  title: "I or Me?",
  emoji: "🙋",
  premise: "Little words like I, me, my, she and they stand in for names. Each one has its own job in a sentence.",
  outro: "Use I when you do something. Use me when something happens to you.",
  scene: "candy",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Say the sentence out loud with each word. Which one sounds right?",
  tag: "me_as_subject",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["___ went to the store.", "I"], ["Dad gave the ball to ___.", "me"]], extra: "my", trap: [0, "me"], why: "Me went to the store does not sound right. The doer is I.", win: "I went. Give it to me." },
    { say: "Drop in these words.", rows: [["___ is my mom.", "She"], ["That red hat is ___.", "mine"], ["___ can come to the party.", "Everyone"]], extra: "Her", trap: [0, "Her"], why: "Her is my mom does not sound right. Use She.", win: "She, mine and everyone." },
    { say: "Drop in the words by yourself.", rows: [["___ like to read.", "I"], ["Read a book to ___.", "me"], ["This is ___ book.", "my"], ["___ are my friends.", "They"]], extra: "Them", trap: [3, "Them"] },
  ],
}));
