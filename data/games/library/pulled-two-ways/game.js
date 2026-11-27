// Pulled Two Ways. Skill RL.9-10.3-1.
// Analyzing how complex characters with conflicting motivations develop, interact and advance the plot or theme. Describing traits only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pulled Two Ways",
  emoji: "🪢",
  premise: "Complex characters want two things that cannot both happen. That inner tug is what moves the plot.",
  outro: "Analyze a complex character by naming the conflicting motivations and showing how they drive the plot or theme.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does the character want? What else do they want that fights with it?",
  tag: "traits_only",
  rounds: [
    { say: "Name the two pulls on Mara, then what the tug causes.", fs: 4.4, read: "Mara promised to drive her sister to an audition. Her boss offers a shift that could mean a promotion. She takes the shift.", rows: [["one pull", "loyalty to her sister"], ["the other pull", "ambition at work"], ["effect on the plot", "her sister misses the audition"]], extra: "she is hardworking|", trap: [2, "she is hardworking"], why: "Hardworking is a trait. The plot moves because she chose the shift.", win: "Two wants, one choice, a consequence." },
    { say: "Trait, or a motivation in conflict?", kind: "sort", fs: 4.6, bins: "Trait only|Conflicting motivation", items: ["He is tall and quiet.|She is clever.", "He wants to tell the truth but fears losing his friend.|She longs to leave town yet cannot abandon the farm."], trap: ["She is clever.", 1], why: "Clever describes her. It does not show two wants pulling against each other.", win: "Look for but, yet, even though." },
    { say: "Match these by yourself.", read: "Captain Oduya needs the storm rations to reach port. A stranded crew signals for help. He shares the rations, and his own ship limps in two days late.", rows: [["one motivation", "duty to his own crew"], ["the opposing motivation", "compassion for strangers"], ["how it moves the plot", "sharing delays his ship"]], extra: "the captain is brave|", trap: [2, "the captain is brave"] },
  ],
}));
