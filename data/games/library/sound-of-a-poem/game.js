// Sound of a Poem. Skill RL.2.4-1.
// Describing how words and phrases (regular beats, alliteration, rhymes, repeated lines) supply rhythm and meaning in a poem. Noticing rhyme but not its effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sound of a Poem",
  emoji: "🥁",
  premise: "Poets choose words for how they sound. Rhyme, a steady beat, and repeated sounds make a poem feel like music.",
  outro: "Rhyme, rhythm, repetition and alliteration give a poem its sound and feeling.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Say the line out loud. What do you hear?",
  tag: "notices_rhyme_only",
  rounds: [
    { say: "Read the poem. Name what the poet used.", read: "Rain, rain, on my head. / Rain, rain, on my bed. / Drip, drop, drip, drop, / will it ever stop?", rows: [["head and bed", "rhyme"], ["Rain, rain said again and again", "repeated words"]], extra: "a long sentence|", trap: [1, "rhyme"], why: "Rhyme is two words that end the same. This is the same word said again.", win: "Rhyme and repeated words." },
    { say: "What does each sound trick do?", rows: [["Silly Sam sips soup", "same first sound"], ["drip, drop, drip, drop", "a steady beat"], ["stop and drop", "rhyme"]], trap: [0, "rhyme"], why: "These words START with the same sound. That is called alliteration.", win: "Three ways a poem makes music." },
    { say: "Name each sound trick by yourself.", read: "Big brown bears / climb the stairs. / Up, up, up they go.", rows: [["Big brown bears", "same first sound"], ["bears and stairs", "rhyme"]], extra: "repeated words|", trap: [0, "rhyme"] },
  ],
}));
