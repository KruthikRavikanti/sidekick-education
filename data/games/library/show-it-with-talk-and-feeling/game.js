// Show It With Talk and Feeling. Skill W.3.3-2.
// Using dialogue and descriptions of actions, thoughts and feelings to develop experiences and events. Telling events with no detail is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show It With Talk and Feeling",
  emoji: "💬",
  premise: "Stories come alive when characters talk, move, think and feel.",
  outro: "Use dialogue and descriptions of actions, thoughts and feelings to develop a story.",
  scene: "candy",
  kind: "sort",
  hint: "Are those spoken words, something done, or something inside the character?",
  tag: "tells_without_detail",
  rounds: [
    { say: "Sort each sentence.", bins: "Dialogue|Action|Thought or feeling", items: ["\"Wait for me!\" called Ana.|", "She raced down the hill.|", "Her heart pounded with worry.|"], trap: ["Her heart pounded with worry.", 1], why: "Worry is a feeling inside her.", win: "Talk, action and feeling." },
    { say: "Sort these sentences.", bins: "Dialogue|Action|Thought or feeling", items: ["\"I found it!\" Ben shouted.|", "He held the key up high.|", "He wondered what it would open.|"], trap: ["He wondered what it would open.", 1], why: "Wondering happens in his mind.", win: "Three ways to show a story." },
    { say: "Sort these by yourself.", bins: "Dialogue|Action|Thought or feeling", items: ["\"Is anyone home?\" she asked.|", "She pushed the door open.|", "She hoped it was safe.|Fear crept over her."], trap: ["She hoped it was safe.", 1] },
  ],
}));
