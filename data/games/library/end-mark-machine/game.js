// End Mark Machine. Skill L.K.2-2.
// Recognizing and naming end punctuation. Leaving off end marks or using a period for a question is the known slip.
Sidekick.game(Sidekick.play({
  title: "End Mark Machine",
  emoji: "❓",
  premise: "Every sentence ends with a mark. Telling gets a period, asking gets a question mark, and shouting gets an exclamation point.",
  outro: "A telling sentence ends with a period. An asking sentence ends with a question mark.",
  scene: "candy",
  kind: "fill",
  fs: 8,
  cast: "",
  hint: "Is it asking something, or telling something?",
  tag: "period_for_a_question",
  rounds: [
    { say: "Drop the right mark at the end.", rows: [["Where is my hat", "?"], ["I see a cat", "."]], extra: "!", trap: [0, "."], why: "It asks something. Asking needs a question mark.", win: "Asking and telling." },
    { say: "Drop the right marks.", rows: [["Look out", "!"], ["Can you help me", "?"], ["The sun is hot", "."]], trap: [1, "."], why: "Can you help me is a question.", win: "Shouting, asking and telling." },
    { say: "Drop the marks by yourself.", rows: [["Who is at the door", "?"], ["We like to play", "."], ["What is your name", "?"]], extra: "!", trap: [0, "."] },
  ],
}));
