// Word Jobs. Skill L.3.1-1.
// Explaining the function of nouns, pronouns, verbs, adjectives and adverbs. Labelling words by their position instead of their function is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Jobs",
  emoji: "🧑‍🔧",
  premise: "Every word in a sentence has a job. Nouns name, verbs do, adjectives describe nouns, and adverbs describe verbs.",
  outro: "A word’s part of speech depends on the job it does in the sentence.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Ask what the word is DOING in the sentence.",
  tag: "labels_by_position",
  rounds: [
    { say: "In The small dog barked loudly, name the job of each word.", rows: [["dog", "noun"], ["barked", "verb"], ["small", "adjective"], ["loudly", "adverb"]], trap: [3, "adjective"], why: "Loudly tells HOW it barked. A word that describes a verb is an adverb.", win: "Noun, verb, adjective, adverb." },
    { say: "In She quickly ate the red apple, name the job of each word.", rows: [["She", "pronoun"], ["ate", "verb"], ["red", "adjective"], ["quickly", "adverb"]], trap: [3, "adjective"], why: "Quickly tells how she ate. It describes the verb.", win: "Pronoun, verb, adjective, adverb." },
    { say: "In They sang a happy song softly, name each job by yourself.", rows: [["They", "pronoun"], ["song", "noun"], ["happy", "adjective"], ["softly", "adverb"]], extra: "verb", trap: [3, "adjective"] },
  ],
}));
