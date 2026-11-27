// Irony and Puns. Skill L.8.5-1.
// Interpreting figures of speech such as verbal irony and puns in context. Missing the irony is the known slip.
Sidekick.game(Sidekick.play({
  title: "Irony and Puns",
  emoji: "☔",
  premise: "Verbal irony says the opposite of what is meant. A pun plays on two meanings of a word. Both ask you to read twice.",
  outro: "Verbal irony: words mean the opposite. Pun: a joke on a double meaning.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Does the speaker mean the opposite? Or does one word have two meanings?",
  tag: "misses_irony",
  rounds: [
    { say: "Verbal irony, or a pun?", bins: "Verbal irony|Pun", items: ["In pouring rain: “Lovely weather!”|After tripping: “Well, that was graceful.”", "I used to be a baker, but I could not make enough dough.|Time flies like an arrow. Fruit flies like a banana."], trap: ["In pouring rain: “Lovely weather!”", 1], why: "No word has two meanings. The speaker means the opposite.", win: "Opposite meaning, or double meaning." },
    { say: "What does the speaker really mean?", kind: "fill", fs: 4.4, cast: "", rows: [["In pouring rain: “Lovely weather!”", "the weather is awful"], ["Seeing a huge mess: “Nice and tidy in here.”", "the room is very messy"]], extra: "the sun is out|", trap: [0, "the sun is out"], why: "It is pouring. The speaker means the opposite of lovely.", win: "Irony flips the meaning." },
    { say: "Sort these by yourself.", bins: "Verbal irony|Pun", items: ["Stuck in traffic: “Oh good, my favorite.”|Given more chores: “Just what I wanted.”", "The math book was sad: too many problems.|A bike cannot stand alone: it is two-tired."], trap: ["Given more chores: “Just what I wanted.”", 1] },
  ],
}));
