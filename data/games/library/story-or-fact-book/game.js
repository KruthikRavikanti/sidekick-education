// Story or Fact Book?. Skill RL.1.5-1.
// Explaining major differences between books that tell stories and books that give information. Thinking any book with pictures is a story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Story or Fact Book?",
  emoji: "🍯",
  premise: "Some books tell a made-up story. Other books teach true information. You can tell by what is inside.",
  outro: "Story books have characters and events. Information books teach facts.",
  scene: "desk",
  kind: "sort",
  hint: "Does it tell about made-up characters, or teach true facts?",
  tag: "pictures_mean_story",
  rounds: [
    { say: "Which kind of book has each thing?", bins: "Tells a story|Gives information", items: ["characters with a problem|a beginning, middle and end", "photos with labels|facts about how bees make honey"], trap: ["photos with labels", 0], why: "Photos with labels teach you real things. That is an information book.", win: "Stories and fact books." },
    { say: "Sort these.", bins: "Tells a story|Gives information", items: ["a talking rabbit|Once upon a time", "a table of contents|a diagram of a plant"], trap: ["a diagram of a plant", 0], why: "A diagram teaches the real parts of a plant.", win: "You can tell them apart." },
    { say: "Sort these by yourself.", bins: "Tells a story|Gives information", items: ["a dragon who is sad|a happy ending", "a map of the world|a glossary of words|true facts about frogs"], trap: ["a map of the world", 0] },
  ],
}));
