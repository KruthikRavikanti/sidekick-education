// Spicy and Juicy. Skill L.2.5-1.
// Identifying real-life connections between words and their use (foods that are spicy or juicy). Not being able to give examples is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spicy and Juicy",
  emoji: "🌶️",
  premise: "Describing words fit some things and not others. Link each word to real foods you know.",
  outro: "Connect describing words to real things they fit.",
  scene: "kitchen",
  kind: "sort",
  fs: 5,
  hint: "Picture taking a bite. What is it like?",
  tag: "cannot_give_examples",
  rounds: [
    { say: "Sort the foods.", bins: "Spicy|Juicy", items: ["🌶️ chili pepper|🥫 hot sauce", "🍉 watermelon|🍊 orange"], trap: ["🍊 orange", 0], why: "An orange drips with juice. It does not burn your tongue.", win: "Spicy foods and juicy foods." },
    { say: "Sort these foods.", bins: "Crunchy|Soft", items: ["🥕 raw carrot|🥨 pretzel", "🍌 banana|🍞 fresh bread"], trap: ["🍌 banana", 0], why: "A banana is soft and easy to bite.", win: "Crunchy and soft." },
    { say: "Sort these by yourself.", bins: "Sweet|Sour|Salty", items: ["🍯 honey|🍰 cake", "🍋 lemon|", "🥨 pretzel|🍟 fries"], trap: ["🍋 lemon", 0] },
  ],
}));
