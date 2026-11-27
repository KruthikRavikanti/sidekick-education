// Tell It Again. Skill RL.K.2-1.
// Retelling a familiar story with key details in order. Retelling only the ending or one favorite part first is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tell It Again",
  emoji: "🌱",
  premise: "Retelling a story means telling the big things that happened, in the same order as the book.",
  outro: "A retell starts at the start and tells the key events in order.",
  scene: "meadow",
  kind: "row",
  hint: "What happened first? Start there.",
  tag: "retells_only_the_ending",
  rounds: [
    { say: "Read the story. Put the cards in order to retell it.", read: "Kim put a seed in the dirt. Rain fell on it. Then a flower grew.", seq: "🌰 Kim planted a seed.|🌧️ Rain fell.|🌼 A flower grew.", trap: "🌼 A flower grew.|🌰 Kim planted a seed.|🌧️ Rain fell.", why: "The flower comes last. Start with the seed.", win: "Seed, rain, flower." },
    { say: "Read and retell this story.", read: "A hen sat on her egg. The egg went crack. Out came a chick.", seq: "🐔 A hen sat on an egg.|🥚 The egg cracked.|🐥 A chick came out.", trap: "🐥 A chick came out.|🐔 A hen sat on an egg.|🥚 The egg cracked.", why: "The chick comes at the end. Start with the hen.", win: "Hen, crack, chick." },
    { say: "Read and retell by yourself.", read: "Sam mixed the batter. Dad put it in the oven. They ate the cake.", seq: "🥣 Sam mixed batter.|🔥 Dad baked it.|🍰 They ate cake.", trap: "🍰 They ate cake.|🥣 Sam mixed batter.|🔥 Dad baked it." },
  ],
}));
