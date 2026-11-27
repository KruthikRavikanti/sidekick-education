// Sentence Spotter. Skill RF.1.1-1.
// Recognizing the features of a sentence: first word capitalized, ending punctuation. Thinking a line of text is a sentence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sentence Spotter",
  emoji: "🔍",
  premise: "A sentence starts with a capital letter and stops at an end mark. A line on the page is not always one sentence.",
  outro: "Count sentences by their end marks, not by the lines.",
  scene: "paper",
  kind: "type",
  icon: "🔍",
  hint: "Count the end marks: periods, question marks and exclamation points.",
  tag: "counts_lines_as_sentences",
  rounds: [
    { say: "How many sentences? Key in the number.", read: "The dog ran. It was fast.", ans: 2, trap: 1, why: "There is one line, but two periods. Each period ends a sentence.", win: "Two end marks, two sentences." },
    { say: "Count the sentences, not the lines.", read: "I see a cat. It is / on the bed. It naps.", ans: 3, trap: 2, why: "There are two lines, but three periods.", win: "Three end marks, three sentences." },
    { say: "How many sentences? Count by yourself.", alt: [{ read: "We went to the / park. Did you see us? / We had fun!", ans: 3, trap: 2 }, { read: "My mom has a red / car. I ride in it.", ans: 2, trap: 1 }, { read: "Look at the big / dog! It can run. Can it / jump? Yes, it can.", ans: 4, trap: 3 }] },
  ],
}));
