// Show Me the Evidence. Skill RI.6.1-1.
// Citing textual evidence to support analysis of what an informational text says. Paraphrasing without citing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show Me the Evidence",
  emoji: "😴",
  premise: "In an article, the author makes claims. Good readers point to the exact sentences that back them up.",
  outro: "Cite the sentences that state the evidence, not a loose retelling.",
  scene: "night",
  kind: "pick",
  fs: 4.6,
  hint: "Which sentences give facts that prove the claim?",
  tag: "paraphrases_without_citing",
  rounds: [
    { say: "Claim: sleep helps memory. Tap the two sentences that are evidence.", mark: "Many students stay up late.|*In one study, students who slept eight hours recalled more words.|Beds come in many sizes.|*During sleep the brain replays what it learned that day.", trap: "Many students stay up late.", why: "That is true, but it does not show sleep helping memory.", win: "A study and a brain fact." },
    { say: "Claim: bees are important to farms. Tap the two sentences that are evidence.", mark: "Bees live in hives.|*Bees pollinate about a third of the crops we eat.|*Almond growers rent hives because the trees need bees to make nuts.|Honey is sweet.", trap: "Honey is sweet.", why: "Sweet honey does not show why farms need bees.", win: "Pollination and the almond example." },
    { say: "Claim: plastic harms sea life. Tap the two sentences that are evidence by yourself.", mark: "*Sea turtles mistake floating bags for jellyfish and swallow them.|The ocean covers most of the planet.|*Scientists have found plastic in the stomachs of many seabirds.|Plastic was invented long ago.|Some bottles are blue.", trap: "The ocean covers most of the planet." },
  ],
}));
