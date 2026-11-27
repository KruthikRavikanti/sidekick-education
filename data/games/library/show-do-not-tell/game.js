// Show, Do Not Tell. Skill W.4.3-2.
// Using dialogue and description to develop experiences and events. Summarizing instead of showing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show, Do Not Tell",
  emoji: "🎥",
  premise: "Telling says she was scared. Showing lets the reader see it: her hands shook and she whispered, \"Who is there?\"",
  outro: "Develop events with dialogue and description rather than summing them up.",
  scene: "city",
  kind: "sort",
  hint: "Can you see or hear it happening, or is it just summed up?",
  tag: "summarizes_instead_of_showing",
  rounds: [
    { say: "Is each sentence showing or telling?", bins: "Showing|Telling", items: ["Her hands shook as she reached for the door.|\"Who is there?\" she whispered.", "She was scared.|It was a scary night."], trap: ["She was scared.", 0], why: "That names the feeling. Showing lets us see it.", win: "Showing puts the reader in the scene." },
    { say: "Sort these.", bins: "Showing|Telling", items: ["He slammed his book shut and glared.|\"Leave me alone,\" he snapped.", "He was angry.|They had an argument."], trap: ["They had an argument.", 0], why: "That sums it up. What did they say and do?", win: "Dialogue and action show it." },
    { say: "Sort these by yourself.", bins: "Showing|Telling", items: ["She leaped up, cheering, and hugged her coach.|\"We did it!\" she yelled.", "She was happy.|The team won and felt good."], trap: ["The team won and felt good.", 0] },
  ],
}));
