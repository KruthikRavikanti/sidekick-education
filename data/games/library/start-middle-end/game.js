// Start, Middle, End. Skill RL.K.2-2.
// Telling the beginning, middle and end of a story: events are sorted into the three parts. Mixing up the order of events is the known slip.
Sidekick.game(Sidekick.play({
  title: "Start, Middle, End",
  emoji: "🚂",
  premise: "A story is like a train with three cars: the beginning, the middle and the end.",
  outro: "Every story has a beginning, a middle and an end.",
  scene: "field",
  kind: "sort",
  hint: "What happened first? What happened last?",
  tag: "mixes_up_order",
  rounds: [
    { say: "Read the story. Put each part in its train car.", read: "Ben woke up. He went to school. Then he went to bed.", bins: "Beginning|Middle|End", items: ["🌅 Ben woke up.|", "🏫 He went to school.|", "🛏️ He went to bed.|"], trap: ["🛏️ He went to bed.", 0], why: "Going to bed is the last thing Ben did. It is the end.", win: "Woke up, school, bed." },
    { say: "Read this story. Sort the parts.", read: "A cat saw a bird. The cat ran up the tree. The bird flew away.", bins: "Beginning|Middle|End", items: ["🐱 A cat saw a bird.|", "🌳 The cat ran up.|", "🐦 The bird flew away.|"], trap: ["🌳 The cat ran up.", 0], why: "First the cat saw the bird. Running up the tree came next.", win: "Saw it, ran up, flew away." },
    { say: "Sort the parts by yourself.", read: "Pam got a box. She took off the bow. A puppy was inside.", bins: "Beginning|Middle|End", items: ["📦 Pam got a box.|", "🎀 She took off the bow.|", "🐶 A puppy was inside.|"], trap: ["🐶 A puppy was inside.", 0] },
  ],
}));
