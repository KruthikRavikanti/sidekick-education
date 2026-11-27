// Stay on the Whale. Skill RI.K.10-1.
// Engaging in group reading of informational text with purpose: comments are sorted by whether they are about the topic. Losing focus when there is no story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stay on the Whale",
  emoji: "🐋",
  premise: "When we read a fact book together, good listeners think and talk about the topic of the book.",
  outro: "Keep your thinking on the topic of the book.",
  scene: "ocean",
  kind: "sort",
  hint: "Is it about whales?",
  tag: "loses_focus",
  rounds: [
    { say: "We are reading about whales. Which things are about the book?", read: "Whales are very big. They swim in the sea.", bins: "About the book|Off topic", items: ["Whales are big.|Whales swim.", "I have a red bike.|My dog is funny."], trap: ["My dog is funny.", 0], why: "This book is about whales, not dogs.", win: "You stayed on the topic." },
    { say: "We are reading about trains. Sort what the kids say.", read: "Trains run on tracks. They can pull many cars.", bins: "About the book|Off topic", items: ["Trains need tracks.|How many cars can it pull?", "I am hungry.|Look at my shoe."], trap: ["I am hungry.", 0], why: "Being hungry is not about trains.", win: "Good questions are about the topic too." },
    { say: "We are reading about the moon. Sort these by yourself.", read: "The moon shines at night. It looks like it changes shape.", bins: "About the book|Off topic", items: ["The moon shines at night.|Why does it change shape?", "I got new socks.|My cat is named Tom."], trap: ["My cat is named Tom.", 0] },
  ],
}));
