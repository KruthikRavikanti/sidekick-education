// Poem and Painting. Skill RL.9-10.7-1.
// Analyzing the representation of a subject in two different artistic mediums, including what is emphasized or absent in each. Listing differences without analysis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Poem and Painting",
  emoji: "🖼️",
  premise: "A poem and a painting can share a subject and still tell you different things. Each medium has to leave something out.",
  outro: "Compare two mediums by what each emphasizes and what each leaves absent.",
  scene: "ocean",
  kind: "sort",
  fs: 4.4,
  hint: "A painting freezes one moment you can see. A poem moves through time and inside minds.",
  tag: "lists_differences",
  rounds: [
    { say: "Both show a fishing boat in a storm. Which medium emphasizes each thing?", read: "The painting: one huge green wave, a tiny boat, no faces. The poem: a sailor’s thoughts of home as the hours pass.", bins: "The painting|The poem", items: ["the size of the wave|one frozen instant", "the sailor’s thoughts|the passing hours"], trap: ["the sailor’s thoughts", 0], why: "No faces are visible in the painting. Thoughts belong to the poem.", win: "Paint shows scale. Words show minds and time." },
    { say: "What is absent from each?", read: "The painting: one huge green wave, a tiny boat, no faces. The poem: a sailor’s thoughts of home as the hours pass.", kind: "fill", fs: 4.6, cast: "", rows: [["absent from the painting", "what the sailors feel"], ["absent from the poem", "the exact look of the wave"]], extra: "the storm itself|", trap: [0, "the storm itself"], why: "The storm is in both. Look for what only one of them can give.", win: "Each leaves something out." },
    { say: "Both show a city at dawn. Sort these by yourself.", read: "The photograph: empty wet streets, one lit window, long shadows. The poem: a baker’s tired pride as she hears the first bus and smells the bread.", bins: "The photograph|The poem", items: ["the pattern of light and shadow|the stillness of one instant", "sounds and smells|what the baker feels"], trap: ["sounds and smells", 0] },
  ],
}));
