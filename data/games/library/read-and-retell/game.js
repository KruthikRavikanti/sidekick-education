// Read and Retell. Skill RF.3.4-1.
// Reading grade-level text with purpose and understanding. Reading fast without being able to retell is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read and Retell",
  emoji: "🦊",
  premise: "Reading well means you can tell someone the key points afterward, in your own words.",
  outro: "After reading, retell the key points, not every detail.",
  scene: "forest",
  kind: "pick",
  hint: "Which points would you need to tell a friend what happened?",
  tag: "cannot_retell",
  rounds: [
    { say: "Read the passage. Tap the key points for a retell.", read: "A young fox wanted the grapes hanging high on a vine. He jumped again and again but could not reach them. At last he walked away, grumbling that they were probably sour anyway.", yes: "A fox wanted some grapes.|He could not reach them.|He said they were sour and left.", no: "The vine was green.|The fox had four legs.", trap: "The vine was green.", why: "The passage does not even say that. Keep to the key points.", win: "Wanted, could not, gave up." },
    { say: "Read this passage. Tap the key points.", read: "Rosa found a wallet on the sidewalk. Inside was twenty dollars and a library card. She took it to the library, and the owner thanked her with a smile.", yes: "Rosa found a wallet.|She returned it to its owner.", no: "It had twenty dollars.|It was on a sidewalk.|There was a library card.", trap: "It had twenty dollars.", why: "That is a small detail. What are the big things that happened?", win: "Found it, returned it." },
    { say: "Tap the key points by yourself.", read: "The class planted a garden in spring. Rabbits ate the first sprouts. The students built a small fence, and by summer they had beans and tomatoes.", yes: "The class planted a garden.|Rabbits ate the sprouts.|A fence saved the garden.", no: "Beans are green.|It was spring.", trap: "It was spring." },
  ],
}));
