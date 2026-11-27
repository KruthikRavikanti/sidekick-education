// Who Tells It Changes It. Skill RL.5.6-1.
// Describing how a narrator’s point of view influences how events are described. Identifying the point of view but not its effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Tells It Changes It",
  emoji: "🐺",
  premise: "The same event sounds different depending on who tells it. A narrator’s point of view colors every detail.",
  outro: "A narrator’s point of view shapes how events are described.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Who would describe it that way, and why?",
  tag: "names_view_but_not_effect",
  rounds: [
    { say: "The same event, two tellers. Who is narrating each?", rows: [["\"I only wanted to borrow some sugar. Then the pig slammed the door on me.\"", "the wolf"], ["\"A monster pounded on my door, howling to be let in.\"", "the pig"]], extra: "a reporter|", trap: [0, "the pig"], why: "This teller thinks he is innocent. That is the wolf’s side.", win: "Each teller makes himself look right." },
    { say: "How does each narrator’s view shape the telling?", rows: [["A child narrator calls the dentist’s office a chamber of doom.", "it sounds frightening"], ["The dentist narrator calls it a bright, friendly clinic.", "it sounds welcoming"]], extra: "it sounds the same|", trap: [0, "it sounds the same"], why: "Same place, but the two narrators feel very differently about it.", win: "Point of view changes the description." },
    { say: "Who is narrating each? Match by yourself.", rows: [["\"Finally, a snow day! No school at all!\"", "a student"], ["\"Snow again. Eight hours of plowing ahead.\"", "a snowplow driver"]], extra: "a weather map|a snowman", trap: [0, "a snowplow driver"] },
  ],
}));
