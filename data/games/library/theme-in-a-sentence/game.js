// Theme in a Sentence. Skill RL.6.2-1.
// Determining a theme and how it is conveyed through particular details. Stating a one-word topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "Theme in a Sentence",
  emoji: "💎",
  premise: "A topic is one word, like courage. A theme is what the story says about it, in a whole sentence.",
  outro: "A theme is a full-sentence message about life, shown through the details of the story.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Is it a whole sentence that says something about life?",
  tag: "one_word_topic",
  rounds: [
    { say: "Theme or just a topic?", bins: "Theme|Just a topic", items: ["Honesty can cost you, but it earns trust.|Real friends show up when things are hard.", "friendship|honesty"], trap: ["friendship", 0], why: "One word is a topic. A theme says something about it.", win: "Themes are full sentences." },
    { say: "Read the story. Tap its theme.", kind: "pick", fs: 4.6, read: "Jun practiced free throws every dawn while his friends slept in. He missed the first ten shots of the big game. He kept shooting. The eleventh went in, and so did the winning one.", yes: "Steady effort pays off, even after early misses.|", no: "basketball|Jun wakes up early.|Winning is everything.", trap: "basketball", why: "Basketball is the topic. What does the story say about effort?", win: "He keeps trying, and it pays off." },
    { say: "Sort these by yourself.", bins: "Theme|Just a topic", items: ["Greed can cost you what you already have.|Small kindnesses can change a hard day.", "greed|kindness"], trap: ["kindness", 0] },
  ],
}));
