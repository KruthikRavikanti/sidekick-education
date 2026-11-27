// Choice and Chain. Skill RL.3.3-2.
// Explaining how characters’ actions contribute to the sequence of events. Listing actions without linking them to events is the known slip.
Sidekick.game(Sidekick.play({
  title: "Choice and Chain",
  emoji: "⛓️",
  premise: "What a character chooses to do sets off what happens next, like the first link in a chain.",
  outro: "A character’s actions cause the events that follow.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "What happened BECAUSE of that choice?",
  tag: "does_not_link_action_to_event",
  rounds: [
    { say: "Connect each choice to what it caused.", rows: [["Tom left the gate open,", "so the sheep got out"], ["Lily shared her map,", "so the others found the way"]], extra: "so the gate was green|", trap: [0, "so the gate was green"], why: "Leaving a gate open does not change its color. What got out?", win: "Choices have results." },
    { say: "Connect these.", rows: [["Jay told a lie,", "so his friend stopped trusting him"], ["Mei practiced daily,", "so she won the contest"], ["Sam ignored the warning,", "so he got lost"]], trap: [1, "so he got lost"], why: "Practicing does not make you lost. What does it lead to?", win: "Each action drives the story." },
    { say: "Connect these by yourself.", rows: [["Ava stopped to help the bird,", "so she missed the bus"], ["Ben forgot to water the plant,", "so it wilted"]], extra: "so the bus was yellow|so plants are green", trap: [0, "so the bus was yellow"] },
  ],
}));
