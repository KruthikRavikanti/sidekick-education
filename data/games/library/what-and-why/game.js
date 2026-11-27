// What and Why. Skill RI.4.3-1.
// Explaining events, procedures or ideas in a text, including what happened and why. Explaining what without why is the known slip.
Sidekick.game(Sidekick.play({
  title: "What and Why",
  emoji: "🌪️",
  premise: "A good explanation tells what happened and also why. The why is found in the text.",
  outro: "Explain events with both what happened and why, using information from the text.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "Look for the cause: because, so, as a result.",
  tag: "what_without_why",
  rounds: [
    { say: "Read the text. Fill in what happened and why.", read: "In the 1930s, farmers plowed up the prairie grass. With no roots to hold it, the dry soil blew away in huge dust storms.", rows: [["What happened", "soil blew away in storms"], ["Why", "no roots held the soil"]], extra: "farmers liked dust|", trap: [1, "soil blew away in storms"], why: "That is what happened again. Why did it happen?", win: "The event and its cause." },
    { say: "Read this text. Fill in what happened and why.", read: "The ship was called unsinkable, so it carried too few lifeboats. When it struck an iceberg, many passengers had no way off.", rows: [["What happened", "many had no way off"], ["Why", "there were too few lifeboats"]], extra: "the ship was large|", trap: [1, "the ship was large"], why: "Size is not the reason. What was missing?", win: "What, and why." },
    { say: "Fill these in by yourself.", read: "Wolves were returned to the park. They hunted the elk, so young trees along the rivers could grow again.", rows: [["What happened", "young trees grew back"], ["Why", "wolves kept elk from eating them"]], extra: "it rained more|elk like parks", trap: [1, "it rained more"] },
  ],
}));
