// Evidence That Fits. Skill W.6.1-2.
// Supporting claims with clear reasons and relevant evidence. Using evidence that does not support the claim is the known slip.
Sidekick.game(Sidekick.play({
  title: "Evidence That Fits",
  emoji: "🧲",
  premise: "Evidence has to prove the claim you made, not some other claim. Keep what fits. Cut what drifts.",
  outro: "Relevant evidence directly supports the claim. Interesting facts that do not are off topic.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Does this fact make the claim more believable?",
  tag: "irrelevant_evidence",
  rounds: [
    { say: "Claim: school should start later. Sort the evidence.", bins: "Supports the claim|Off topic", items: ["Teens who sleep more score higher on tests.|Tired students miss more morning classes.", "The school was built in 1980.|The cafeteria serves pizza on Fridays."], trap: ["The school was built in 1980.", 0], why: "The age of the building says nothing about start times.", win: "Sleep and attendance fit the claim." },
    { say: "Claim: our town needs more trees. Sort the evidence.", bins: "Supports the claim|Off topic", items: ["Shaded streets are cooler in summer.|Trees soak up rain and reduce flooding.", "Maple syrup comes from trees.|The mayor has a dog."], trap: ["Maple syrup comes from trees.", 0], why: "It is about trees, but it does not show why the town needs more.", win: "Cooling and flood control are reasons." },
    { say: "Claim: students should learn to cook. Sort by yourself.", bins: "Supports the claim|Off topic", items: ["Home cooking costs less than eating out.|Cooking teaches measuring and planning.", "Some chefs are on television.|Spoons were invented long ago."], trap: ["Some chefs are on television.", 0] },
  ],
}));
