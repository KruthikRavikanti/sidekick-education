// Same Meaning, Different Feeling. Skill L.6.5-3.
// Distinguishing among the connotations of words with similar denotations. Thinking synonyms are interchangeable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Meaning, Different Feeling",
  emoji: "🎭",
  premise: "Thrifty and stingy both mean careful with money. One is a compliment. The other is an insult.",
  outro: "Connotation is the feeling a word carries beyond its dictionary meaning.",
  scene: "candy",
  kind: "sort",
  fs: 5.6,
  hint: "Would you be pleased or annoyed if someone called you this?",
  tag: "synonyms_interchangeable",
  rounds: [
    { say: "Does each word feel positive or negative?", bins: "Positive|Negative", items: ["thrifty|confident|curious", "stingy|cocky|nosy"], trap: ["stingy", 0], why: "Stingy means careful with money in a selfish way.", win: "Each pair shares a meaning but not a feeling." },
    { say: "Sort these.", bins: "Positive|Negative", items: ["slender|determined|youthful", "scrawny|stubborn|childish"], trap: ["stubborn", 0], why: "Stubborn suggests refusing to listen. Determined is the kind version.", win: "Word choice shows attitude." },
    { say: "Sort these by yourself.", bins: "Positive|Negative", items: ["aroma|bold|relaxed", "stench|reckless|lazy"], trap: ["reckless", 0] },
  ],
}));
