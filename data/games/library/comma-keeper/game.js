// Comma Keeper. Skill L.1.2-3.
// Using commas in dates and to separate single words in a series. Leaving out the commas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Comma Keeper",
  emoji: "🐾",
  premise: "Commas go between the things in a list, and between the day and the year in a date. Keep the commas that belong.",
  outro: "Use commas between items in a list of three or more, and between the day and the year.",
  scene: "paper",
  kind: "pick",
  fs: 5.6,
  hint: "A comma goes after each thing in the list, before the last one.",
  tag: "leaves_out_commas",
  rounds: [
    { say: "Tap the commas that belong. Leave the extra one.", mark: ["I have", ",", "a cat", "*,", "a dog", "*,", "and a fish."], trap: ",", why: "No comma goes right after have. Commas go after each thing in the list.", win: "A cat, a dog, and a fish." },
    { say: "Tap the comma that belongs in the date.", mark: ["I was born on", "May", ",", "5", "*,", "2019", ",", "in the morning."], trap: ",", why: "In a date, the comma goes between the day and the year.", win: "May 5, 2019." },
    { say: "Tap the commas that belong, by yourself.", alt: [{ mark: ["We ate", ",", "plums", "*,", "pears", "*,", "and grapes."], trap: "," }, { mark: ["Pack", "a hat", "*,", "a coat", "*,", "and", ",", "boots."], trap: "-," }] },
  ],
}));
