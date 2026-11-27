// Your Words, Their Credit. Skill W.6.8-2.
// Quoting or paraphrasing the data and conclusions of others while avoiding plagiarism, and providing basic bibliographic information. Copying without credit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Your Words, Their Credit",
  emoji: "🧾",
  premise: "Using a source means putting its ideas in your own words, or quoting exactly, and always saying where it came from.",
  outro: "Paraphrase in your own words or use quotation marks, and credit the author and title.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Are the words new, or lifted? Is the source named?",
  tag: "plagiarizes",
  rounds: [
    { say: "Source: “Honeybees dance to share the direction of food.” Sort the student sentences.", bins: "Fair use|Copying", items: ["Bees use a kind of dance to point hive mates toward food (Rao).|Rao writes that bees “dance to share the direction of food.”", "Honeybees dance to share the direction of food.|Honeybees dance to share the direction of the food."], trap: ["Honeybees dance to share the direction of the food.", 0], why: "Adding one word does not make it yours. It still copies the source.", win: "New words or quotation marks, plus credit." },
    { say: "What belongs in a basic source note?", kind: "pick", fs: 5.2, yes: "the author|the title|the date", no: "your favorite color|how long it took to read", trap: "-the author", why: "Readers need to know who wrote it.", win: "Author, title, date." },
    { say: "Source: “Glaciers carve valleys slowly.” Sort by yourself.", bins: "Fair use|Copying", items: ["Over a long time, moving ice shapes valleys (Lin).|Lin says glaciers “carve valleys slowly.”", "Glaciers carve valleys slowly.|Glaciers carve the valleys slowly."], trap: ["Glaciers carve the valleys slowly.", 0] },
  ],
}));
