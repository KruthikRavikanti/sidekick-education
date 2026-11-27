// What the Images Add. Skill RL.5.7-1.
// Analyzing how visual and multimedia elements contribute to the meaning, tone or beauty of a text. Describing visuals without analysis is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Images Add",
  emoji: "🖼️",
  premise: "In a graphic novel or film, color, size and angle add meaning. They set a tone that words alone might not.",
  outro: "Visual and multimedia elements add to the meaning, tone or beauty of a text.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "What feeling or meaning does that choice create?",
  tag: "describes_without_analysis",
  rounds: [
    { say: "What does each visual choice add?", rows: [["a panel drawn in dark blues and grays", "a gloomy tone"], ["a tiny figure in a huge empty panel", "a feeling of loneliness"]], extra: "it has colors|", trap: [0, "it has colors"], why: "That only describes it. What mood do dark blues and grays create?", win: "Color and size carry feeling." },
    { say: "What does each choice add?", rows: [["fast drums as the hero runs", "excitement and urgency"], ["a slow fade to black", "a sense of ending"], ["a close-up of trembling hands", "the character’s fear"]], trap: [2, "a sense of ending"], why: "Trembling hands show fear.", win: "Sound and camera shape the meaning." },
    { say: "Match these by yourself.", rows: [["bright yellows and a sunrise", "hope"], ["jagged, shaky lettering", "panic"], ["soft music under a quiet scene", "calm"]], extra: "it is a picture|", trap: [0, "it is a picture"] },
  ],
}));
