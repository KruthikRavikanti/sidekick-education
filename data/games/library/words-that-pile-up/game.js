// Words That Pile Up. Skill RL.9-10.4-1.
// Analyzing the cumulative impact of specific word choices on meaning and tone. Naming devices without their effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words That Pile Up",
  emoji: "🎚️",
  premise: "Tone is built one word at a time. A single cold word is a detail. Five of them in a row are a mood.",
  outro: "Tone comes from the cumulative effect of word choices. Track the pattern, then name what it creates.",
  scene: "night",
  kind: "pick",
  fs: 5,
  hint: "Which words share a feeling? What mood do they add up to?",
  tag: "names_devices_only",
  rounds: [
    { say: "Tap the four words that build a bleak tone.", mark: "The *brittle light *scraped across the *hollow street and *died at the corner.", trap: "-died", why: "Died finishes the pattern. Each of these words makes the street feel lifeless.", win: "Brittle, scraped, hollow, died: one bleak mood." },
    { say: "What does each pattern of words add up to?", kind: "fill", fs: 4.8, cast: "", rows: [["brittle, scraped, hollow, died", "a bleak, lifeless tone"], ["spilled, tumbled, giggled, bright", "a playful, lively tone"], ["hushed, folded, still, pale", "a quiet, solemn tone"]], extra: "the author uses adjectives|", trap: [0, "the author uses adjectives"], why: "That only names a kind of word. Say what the words make you feel.", win: "Pattern, then effect." },
    { say: "Tap the four words that build a tense tone by yourself.", mark: "She *crept past the door, *breath *held, every floorboard a *threat under her feet.", trap: "-threat" },
  ],
}));
