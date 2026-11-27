// Draw the Line Between Claims. Skill W.8.1-1.
// Introducing claims and acknowledging and distinguishing them from alternate or opposing claims. Ignoring counterclaims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Draw the Line Between Claims",
  emoji: "📐",
  premise: "A strong introduction states your claim and shows exactly how it differs from the claim on the other side.",
  outro: "Introduce your claim and distinguish it from alternate or opposing claims.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Which side is the writer on? Which sentence states the other side?",
  tag: "ignores_counterclaims",
  rounds: [
    { say: "The writer argues for year-round school. Sort each sentence.", bins: "Writer’s claim|Opposing claim", items: ["Shorter, more frequent breaks help students remember.|", "Others insist a long summer is needed to rest.|Opponents say families rely on summer travel."], trap: ["Others insist a long summer is needed to rest.", 0], why: "Others insist marks the opposing side.", win: "One claim, set apart from two opposing ones." },
    { say: "Which openings distinguish the claim from the other side?", bins: "Distinguishes|One side only", items: ["While some say homework builds discipline, it mostly builds stress.|Although uniforms limit choice, they reduce pressure over clothes.", "Homework is stressful.|Uniforms are good."], trap: ["Homework is stressful.", 0], why: "It gives only the writer’s side. Where is the view it disagrees with?", win: "While and although set the two claims side by side." },
    { say: "The writer argues against a longer school day. Sort by yourself.", bins: "Writer’s claim|Opposing claim", items: ["More hours would exhaust students without raising learning.|", "Supporters believe extra time lifts test scores.|Some argue it helps working families."], trap: ["Some argue it helps working families.", 0] },
  ],
}));
