// Same Theme, Far Apart. Skill RL.4.9-1.
// Comparing and contrasting the treatment of similar themes and patterns of events in traditional literature from different cultures. Listing plots without comparing themes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Theme, Far Apart",
  emoji: "🌏",
  premise: "Stories from different lands often share the same theme or the same pattern, like a quest or a clever trick.",
  outro: "Compare tales from different cultures by their themes and patterns of events, not just their plots.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "What message do both tales share?",
  tag: "lists_plots_only",
  rounds: [
    { say: "Two tales from different lands. What do they share?", read: "A Greek tale: a hare loses a race to a steady tortoise. / An African tale: a proud antelope loses a race to a patient chameleon.", rows: [["Shared theme", "steady effort beats pride"], ["Shared pattern", "a slow animal wins a race"]], extra: "both have a hare|", trap: [0, "both have a hare"], why: "Only one tale has a hare. Look for the message they share.", win: "Same theme, same pattern, different animals." },
    { say: "What do these two tales share?", read: "A Chinese tale: a poor girl is kind to a fish and is rewarded. / A French tale: a poor girl is kind to a stranger and is rewarded.", rows: [["Shared theme", "kindness is rewarded"], ["What differs", "who she helps"]], extra: "both are set in China|", trap: [0, "both are set in China"], why: "The settings differ. The message is what they share.", win: "One theme, two cultures." },
    { say: "Work this out by yourself.", read: "A Native American tale: Coyote tricks others and ends up tricked himself. / A West African tale: Anansi the spider tricks others and gets caught.", rows: [["Shared theme", "tricksters get caught in the end"], ["What differs", "the trickster animal"]], extra: "both have a coyote|nothing at all", trap: [0, "both have a coyote"] },
  ],
}));
