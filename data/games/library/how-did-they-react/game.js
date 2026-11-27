// How Did They React?. Skill RL.2.3-1.
// Describing how characters respond to major events and challenges. Describing what happened instead of the character’s response is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Did They React?",
  emoji: "⛈️",
  premise: "When something big happens in a story, watch what the character does next. That shows who they are.",
  outro: "A character’s response to a challenge shows what they are like.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "Not what happened. What did the CHARACTER do about it?",
  tag: "tells_event_not_response",
  rounds: [
    { say: "Read the story. How did Maya respond?", read: "A storm knocked out the lights. Maya found a flashlight and read to her little brother until he stopped crying.", rows: [["The event", "the lights went out"], ["How Maya responded", "she calmed her brother"]], extra: "it rained hard|", trap: [1, "it rained hard"], why: "That is what happened. What did Maya DO?", win: "She stayed calm and helped." },
    { say: "Read this story. How did Ben respond?", read: "Ben’s tower of blocks fell over. He took a deep breath and started to build it again.", rows: [["The event", "the tower fell"], ["How Ben responded", "he tried again"]], extra: "the blocks were red|", trap: [1, "the tower fell"], why: "That is the event. What did Ben do after it?", win: "He did not give up." },
    { say: "Read and answer by yourself.", read: "Lena forgot her lines in the play. She smiled, made up new words, and kept going.", rows: [["The event", "she forgot her lines"], ["How Lena responded", "she kept going"]], extra: "it was a play|she had lines", trap: [1, "she forgot her lines"] },
  ],
}));
