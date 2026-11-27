// Formal or Casual?. Skill L.2.3-1.
// Comparing formal and informal uses of English. Using texting language in school writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Formal or Casual?",
  emoji: "🎩",
  premise: "You talk one way to a friend and another way to a teacher or in a letter. Both are fine in the right place.",
  outro: "Use formal language for school writing and adults. Casual language is for friends.",
  scene: "city",
  kind: "sort",
  hint: "Would you say it to the principal, or to your best friend?",
  tag: "texting_language_in_school",
  rounds: [
    { say: "Is it formal or casual?", bins: "Formal|Casual", items: ["Good morning, Mrs. Lee.|Thank you for your help.", "Hey, what is up?|Thx a lot!"], trap: ["Thx a lot!", 0], why: "Thx is a texting shortcut. Formal writing spells out the words.", win: "Formal and casual." },
    { say: "Sort these.", bins: "Formal|Casual", items: ["May I please have a pencil?|I would like to join the club.", "Gimme that.|Wanna play?"], trap: ["Gimme that.", 0], why: "Gimme is a quick way to talk with friends.", win: "You can tell them apart." },
    { say: "Sort these by yourself.", bins: "Formal|Casual", items: ["Dear Principal Diaz,|I am writing to ask a question.", "Yo!|See ya later.|No way, lol."], trap: ["See ya later.", 0] },
  ],
}));
