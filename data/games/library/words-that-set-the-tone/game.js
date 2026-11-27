// Words That Set the Tone. Skill RL.6.4-2.
// Analyzing the impact of specific word choices on meaning and tone. Naming a tone without evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words That Set the Tone",
  emoji: "🌫️",
  premise: "Tone is the feeling in the writing. You can point to the exact words that create it.",
  outro: "Name the tone and the specific words that create it.",
  scene: "night",
  kind: "pick",
  fs: 5.6,
  hint: "Which words would you change to change the mood?",
  tag: "tone_without_evidence",
  rounds: [
    { say: "The tone is gloomy. Tap the four words that create it.", mark: "The *gray fog *crept over the *silent *empty street.", trap: "street.", why: "Street just names the place. The mood comes from the describing words.", win: "Gray, crept, silent, empty." },
    { say: "The tone is joyful. Tap the four words that create it.", mark: "Bright ribbons *danced above the *laughing crowd as music *bubbled from every *cheerful door.", trap: "crowd", why: "Crowd names the people. Laughing gives the feeling.", win: "Danced, laughing, bubbled, cheerful." },
    { say: "The tone is tense. Tap the four words that create it by yourself.", mark: "Her heart *hammered as the *shadow *slid closer and the floorboard *creaked.", trap: "floorboard" },
  ],
}));
