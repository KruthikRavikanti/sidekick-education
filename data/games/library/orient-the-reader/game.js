// Orient the Reader. Skill W.4.3-1.
// Orienting the reader by establishing a situation and introducing a narrator and characters. Starting without setup is the known slip.
Sidekick.game(Sidekick.play({
  title: "Orient the Reader",
  emoji: "🧭",
  premise: "The opening of a story orients the reader: who is telling it, who is in it, and what situation they are in.",
  outro: "Open a story by establishing the situation, the narrator and the characters.",
  scene: "forest",
  kind: "fill",
  fs: 4.2,
  cast: "",
  hint: "Which sentence tells who is speaking? Who else is there? What is going on?",
  tag: "starts_without_setup",
  rounds: [
    { say: "Read the opening. What does each sentence introduce?", rows: [["My name is Zed, and I am the worst camper alive.", "narrator"], ["My cousin Jo can build a fire in the rain.", "character"], ["So when our tent blew away, everyone looked at her.", "situation"]], trap: [1, "narrator"], why: "Zed is the narrator. Jo is another character.", win: "Narrator, character, situation." },
    { say: "What does each sentence introduce?", rows: [["I had never seen snow until the day we moved north.", "narrator"], ["Our new neighbor, Mrs. Ito, waved from her porch.", "character"], ["By noon, the car was stuck in a drift.", "situation"]], trap: [2, "character"], why: "A stuck car is a problem. That is the situation.", win: "The reader is oriented." },
    { say: "Match these by yourself.", rows: [["Everyone calls me Flash, though I am slow.", "narrator"], ["Coach Reyes blew her whistle.", "character"], ["The race I had dreaded all year was about to begin.", "situation"]], extra: "ending", trap: [0, "situation"] },
  ],
}));
