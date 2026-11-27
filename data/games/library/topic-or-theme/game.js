// Topic or Theme?. Skill RL.4.2-1.
// Determining a theme of a story from details in the text. Stating a topic instead of a theme is the known slip.
Sidekick.game(Sidekick.play({
  title: "Topic or Theme?",
  emoji: "🧵",
  premise: "A topic is one word, like friendship. A theme is a full message about it, like true friends stay loyal in hard times.",
  outro: "A theme is a complete message about life, not a single word.",
  scene: "candy",
  kind: "sort",
  hint: "Is it one word or a whole message?",
  tag: "states_topic_as_theme",
  rounds: [
    { say: "Is it a topic or a theme?", bins: "Topic|Theme", items: ["friendship|courage", "True friends stay loyal in hard times.|Courage means acting even when afraid."], trap: ["friendship", 1], why: "Friendship is a single word. A theme says something ABOUT friendship.", win: "Topics are words. Themes are messages." },
    { say: "Sort these.", bins: "Topic|Theme", items: ["honesty|family", "Telling the truth builds trust.|Family is who shows up for you."], trap: ["family", 1], why: "Family is a topic. What does the story say about family?", win: "You told them apart." },
    { say: "Read the story, then tap its theme.", kind: "pick", read: "Sam bragged that he needed no help with the raft. It sank twice. When he finally let his sister hold the ropes, they crossed the lake together.", yes: "Accepting help can lead to success.|", no: "rafts|Sam has a sister.|lakes are wide|teamwork|It sank twice.", trap: "teamwork" },
  ],
}));
