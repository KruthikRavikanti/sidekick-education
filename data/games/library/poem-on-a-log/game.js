// Poem on a Log. Skill RL.1.10-1.
// Reading prose and poetry of appropriate complexity: a short poem is read, then its topic and rhymes are identified. Needing every word read aloud is the known slip.
Sidekick.game(Sidekick.play({
  title: "Poem on a Log",
  emoji: "🪵",
  premise: "Read a little poem. Listen for the words that rhyme and think about what the poem is about.",
  outro: "Poems have rhyme and rhythm, and they still tell you about something.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "Read the poem again. Which words sound the same at the end?",
  tag: "does_not_read_alone",
  rounds: [
    { say: "Read the poem. Answer each question.", read: "A frog on a log / sat in the fog. / Along came a dog / to sit on the log.", rows: [["Who is in the poem?", "a frog and a dog"], ["Which words rhyme?", "log, fog, dog"]], extra: "a cat and a hat|frog, sat, came", trap: [1, "frog, sat, came"], why: "Rhyming words sound the same at the end, like log and fog.", win: "A frog and a dog, with rhymes for log." },
    { say: "Read this poem. Answer each question.", read: "The sun is up, / the sky is blue. / I see a bird / and it sees you.", rows: [["What time of day is it?", "daytime"], ["Which words rhyme?", "blue, you"]], extra: "night|sun, sky", trap: [1, "sun, sky"], why: "Sun and sky start the same. Rhymes sound the same at the END.", win: "Daytime, and blue rhymes with you." },
    { say: "Read and answer by yourself.", read: "My little cat / sat on my hat. / Now my hat / is very flat.", rows: [["What did the cat do?", "sat on a hat"], ["Which words rhyme?", "cat, hat, flat"]], extra: "ran away|my, now, is", trap: [1, "my, now, is"] },
  ],
}));
