// Whose Eyes, What Problem. Skill W.11-12.3-1.
// Engaging and orienting the reader by setting out a problem, situation or observation and its significance, establishing one or multiple points of view. Writing a flat opening is the known slip.
Sidekick.game(Sidekick.play({
  title: "Whose Eyes, What Problem",
  emoji: "👁️",
  premise: "A narrative opening has two jobs: drop the reader into a problem, and settle whose eyes we are looking through.",
  outro: "Engage the reader by setting out a problem and its significance and establishing a point of view.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Who is telling it: I, you, or he and she? And what has just gone amiss?",
  tag: "flat_opening",
  rounds: [
    { say: "Match each point of view to the opening that uses it.", rows: [["first person", "I knew the bridge was out before I saw it."], ["third person", "Lena knew the bridge was out before she saw it."], ["second person", "You know the bridge is out before you see it."]], trap: [0, "Lena knew the bridge was out before she saw it."], why: "Lena and she tell it from outside. First person says I.", win: "I, she, you." },
    { say: "Does each opening set out a problem, or fall flat?", kind: "sort", fs: 4.2, bins: "Sets out a problem|Falls flat", items: ["The ferry left at dawn. My passport was in the hotel safe.|Three knocks. No one I knew ever knocked three times.", "I am going to write about a trip.|It was a normal day. All was fine."], trap: ["It was a normal day. All was fine.", 0], why: "If all is fine, there is nothing to pull the reader forward.", win: "Trouble on the first line." },
    { say: "Match these by yourself.", rows: [["first person", "We never spoke of the orchard after that."], ["third person", "He counted the coins twice and came up short."], ["second person", "You open the door and the house is not yours."]], extra: "This story is about coins.|", trap: [1, "This story is about coins."] },
  ],
}));
