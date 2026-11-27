// Quotation Marks. Skill L.3.2-3.
// Using commas and quotation marks in dialogue. Putting punctuation outside the quotation marks is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quotation Marks",
  emoji: "🗨️",
  premise: "The exact words someone says go inside quotation marks. The end mark goes inside too.",
  outro: "Put a comma before the quote, and keep the end punctuation inside the quotation marks.",
  scene: "candy",
  kind: "pick",
  hint: "Is the end mark tucked inside the closing quotation marks?",
  tag: "punctuation_outside_quotes",
  rounds: [
    { say: "Tap the sentence that is punctuated correctly.", yes: "Mom said, \"I am proud of you.\"|", no: "Mom said, \"I am proud of you\".|Mom said \"I am proud of you.\"|Mom said, I am proud of you.", trap: "Mom said, \"I am proud of you\".", why: "The period belongs inside the closing quotation marks.", win: "Comma first, period inside." },
    { say: "Tap the sentence that is punctuated correctly.", yes: "\"Where are you going?\" asked Ben.|", no: "\"Where are you going\"? asked Ben.|Where are you going? asked Ben.|\"Where are you going\" asked Ben?", trap: "\"Where are you going\"? asked Ben.", why: "The question mark is part of what he said. It stays inside.", win: "The question mark stays inside." },
    { say: "Tap the two sentences that are punctuated correctly.", yes: "Dad shouted, \"Dinner is ready!\"|\"I will be right there,\" said Lia.", no: "Dad shouted, \"Dinner is ready\"!|\"I will be right there\", said Lia.|Dad shouted \"Dinner is ready!\"", trap: "Dad shouted, \"Dinner is ready\"!" },
  ],
}));
