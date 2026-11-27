// Show the Scene. Skill W.6.3-2.
// Using narrative techniques such as dialogue, pacing and description to develop events. Summarizing events instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show the Scene",
  emoji: "🎭",
  premise: "Writers bring events to life with three tools: dialogue, description, and pacing that slows down or speeds up.",
  outro: "Dialogue lets characters speak. Description paints the scene. Pacing controls how fast time moves.",
  scene: "forest",
  kind: "sort",
  fs: 4.6,
  hint: "Is someone speaking? Is it a picture in words? Or does time jump or slow?",
  tag: "summarizes_events",
  rounds: [
    { say: "Which tool does each line use?", bins: "Dialogue|Description|Pacing", items: ["“Did you hear that?” Mia whispered.|", "Moss hung from the branches like green curtains.|", "Three hours later, the fire was only ash.|"], trap: ["Three hours later, the fire was only ash.", 1], why: "It skips ahead in time. That is pacing.", win: "Speech, a picture, a jump in time." },
    { say: "Sort these.", bins: "Dialogue|Description|Pacing", items: ["“Run!” Dad shouted.|", "The cave smelled of wet stone and old smoke.|", "For one long second, nobody breathed.|"], trap: ["For one long second, nobody breathed.", 1], why: "It stretches a single second. That slows the pace.", win: "Each tool does a different job." },
    { say: "Sort these by yourself.", bins: "Dialogue|Description|Pacing", items: ["“I am not going in there,” said Leo.|", "Her boots were caked with red mud.|", "By morning, the storm had passed.|"], trap: ["By morning, the storm had passed.", 1] },
  ],
}));
