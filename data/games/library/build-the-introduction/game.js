// Build the Introduction. Skill W.9-10.2-1.
// Introducing a topic and organizing complex ideas, concepts and information to make connections. Writing a disorganized opening is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build the Introduction",
  emoji: "🏗️",
  premise: "An introduction to an explanation leads the reader in: something to catch interest, the background, the main idea, then the plan.",
  outro: "Introduce a topic with a hook, context, a thesis and a preview of how the ideas are organized.",
  scene: "desk",
  kind: "row",
  fs: 4.4,
  hint: "Start wide to catch interest, then narrow to the main idea.",
  tag: "disorganized",
  rounds: [
    { say: "Put this introduction in order: hook, context, thesis, preview.", fs: 4.2, seq: "A bridge can hold a thousand cars yet sway in wind.|People have built bridges for ages.|Every bridge works by balancing two forces.|First tension, then compression.", trap: "Every bridge works by balancing two forces.|A bridge can hold a thousand cars yet sway in wind.|People have built bridges for ages.|First tension, then compression.", why: "The thesis lands better after the reader is curious and has the background.", win: "Hook, context, thesis, preview." },
    { say: "Label each sentence of another introduction.", kind: "fill", fs: 4.4, cast: "", rows: [["hook", "Your phone knows where you are right now."], ["thesis", "GPS finds a position by timing signals from satellites."], ["preview", "First the satellites, then the math."]], trap: [0, "GPS finds a position by timing signals from satellites."], why: "That states the main idea. The hook is the line that makes you curious.", win: "Each sentence has a job." },
    { say: "Put this introduction in order by yourself.", seq: "Bread rises because of something alive.|People have baked with yeast for centuries.|Yeast makes dough rise by releasing gas.|This essay covers the yeast, then the oven.", trap: "Yeast makes dough rise by releasing gas.|Bread rises because of something alive.|People have baked with yeast for centuries.|This essay covers the yeast, then the oven." },
  ],
}));
