// Theme From the Struggle. Skill RL.5.2-1.
// Determining a theme from how characters respond to challenges. Stating a topic as a theme is the known slip.
Sidekick.game(Sidekick.play({
  title: "Theme From the Struggle",
  emoji: "🧗",
  premise: "How a character responds to a challenge reveals the theme. Watch what they learn or how they change.",
  outro: "A theme is the message shown by how characters respond to challenges.",
  scene: "snow",
  kind: "pick",
  hint: "What does the character learn from the challenge? Say it as a full message.",
  tag: "states_topic_as_theme",
  rounds: [
    { say: "Read the story. Tap the theme shown by how Kenji responds.", read: "Kenji’s first three robots fell apart. Each time, he wrote down what broke and tried a new design. The fourth one crossed the finish line.", yes: "Learning from mistakes leads to success.|", no: "robots|Kenji builds things.|Mistakes are bad.|competition", trap: "robots", why: "Robots is the topic. What message does his response show?", win: "His response shows the message." },
    { say: "Read this story. Tap the theme.", read: "When the new girl sat alone, Rosa’s friends told her not to bother. Rosa walked over anyway. By spring, the two were inseparable.", yes: "Kindness takes courage but is worth it.|", no: "friendship|Rosa has friends.|New students are lonely.|school", trap: "friendship", why: "Friendship is one word. A theme says something about it.", win: "A full message, not a single word." },
    { say: "Tap the theme by yourself.", read: "Old Tam could have sold his land for a fortune. Instead he planted trees he would never see grown. \"Someone will sit in their shade,\" he said.", yes: "Doing good for others matters more than personal gain.|", no: "trees|Tam is old.|Land is valuable.|money|Shade is cool.", trap: "trees" },
  ],
}));
