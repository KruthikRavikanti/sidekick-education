// Space Between. Skill RF.K.1-3.
// Understanding that words are separated by spaces: the child counts the words in a sentence. Running words together is the known slip.
Sidekick.game(Sidekick.play({
  title: "Space Between",
  emoji: "🚀",
  premise: "Words on a page have little spaces between them. The spaces show where one word ends and the next begins.",
  outro: "Spaces separate words. Count the groups of letters to count the words.",
  scene: "space",
  kind: "type",
  icon: "🚀",
  hint: "Look for the spaces. Each group of letters is one word.",
  tag: "runs_words_together",
  rounds: [
    { say: "Tap the sentence that has spaces in the right places.", kind: "pick", fs: 5.4, yes: "We can go home.|", no: "Wecangohome.|We cango home.|Wec ango home.", trap: "We cango home.", why: "Can and go are two words. They need a space between them.", win: "A space after every word." },
    { say: "How many words? Key in the number.", read: "We can go home.", ans: 4, trap: 3, why: "Count each group of letters: We, can, go, home.", win: "Four words." },
    { say: "How many words? Count by yourself.", alt: [{ read: "I like my red hat.", ans: 5, trap: 4 }, { read: "The sun is hot.", ans: 4, trap: 3 }, { read: "Look at the big frog.", ans: 5, trap: 4 }] },
  ],
}));
