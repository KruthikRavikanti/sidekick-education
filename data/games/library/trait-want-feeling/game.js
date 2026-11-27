// Trait, Want, Feeling. Skill RL.3.3-1.
// Describing characters in a story: their traits, motivations and feelings. Describing looks instead of traits is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trait, Want, Feeling",
  emoji: "🎻",
  premise: "To understand a character, ask three things: what are they like, what do they want, and how do they feel?",
  outro: "Describe characters by their traits, motivations and feelings, with evidence.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "A trait is what someone is like inside. A motivation is what they want.",
  tag: "describes_looks",
  rounds: [
    { say: "Read about Ana. Fill in each part.", read: "Ana practiced her violin every night, even when her fingers hurt. She dreamed of playing on the big stage. When she missed a note, tears came to her eyes.", rows: [["Trait", "determined"], ["What she wants", "to play on stage"], ["Feeling", "frustrated"]], extra: "has long hair|", trap: [0, "has long hair"], why: "That is how she looks. A trait is what she is like inside.", win: "Determined, with a dream, and frustrated." },
    { say: "Read about Omar. Fill in each part.", read: "Omar gave his lunch to a new student who had none. He hoped the boy would feel welcome. Seeing him smile, Omar grinned too.", rows: [["Trait", "generous"], ["What he wants", "to welcome the boy"], ["Feeling", "glad"]], extra: "is tall|", trap: [0, "is tall"], why: "Tall is how he looks. What does sharing show?", win: "Generous, welcoming and glad." },
    { say: "Read about Kit. Fill in each part by yourself.", read: "Kit read every book about space. She wanted to be an astronaut one day.", rows: [["Trait", "curious"], ["What she wants", "to be an astronaut"]], extra: "wears glasses|has a red bag", trap: [0, "wears glasses"] },
  ],
}));
