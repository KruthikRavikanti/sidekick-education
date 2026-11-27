// How They Change. Skill RL.6.3-2.
// Describing how characters respond or change as the plot moves toward a resolution. Saying characters stay the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "How They Change",
  emoji: "🦋",
  premise: "Characters rarely end a story the way they began. Track who they were, and who they become.",
  outro: "Describe a character at the start and at the end, and the events that changed them.",
  scene: "meadow",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "What does the character do at the end that they would not do at the start?",
  tag: "characters_stay_same",
  rounds: [
    { say: "How does Priya change?", read: "In September, Priya would not speak in class, even when she knew the answer. After her poem won the school contest, she raised her hand first and offered to read it aloud.", rows: [["at the beginning", "too shy to speak"], ["at the end", "eager to share"]], extra: "the same as before|", trap: [1, "the same as before"], why: "She goes from silent to raising her hand first. That is a change.", win: "From shy to eager." },
    { say: "How does Cole change?", read: "Cole laughed when the new boy dropped his tray. Then Cole tripped on stage in front of the whole school. The next day he sat down beside the new boy at lunch.", rows: [["at the beginning", "mocks others"], ["at the end", "shows kindness"]], extra: "loves the stage|", trap: [0, "shows kindness"], why: "At first he laughs at the new boy.", win: "Being embarrassed himself changed him." },
    { say: "How does Grandpa Sol change? Match by yourself.", read: "Grandpa Sol called the tablet a silly toy and left it in its box. When his granddaughter moved overseas, he learned to video call, and now he rings her every Sunday.", rows: [["at the beginning", "refuses new things"], ["at the end", "embraces new tools"]], extra: "dislikes his family|sells the tablet", trap: [1, "refuses new things"] },
  ],
}));
