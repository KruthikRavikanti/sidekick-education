// Page or Screen. Skill RL.6.7-1.
// Comparing the experience of reading a text with viewing or listening to a version of it. Preferring one without analysis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Page or Screen",
  emoji: "🎞️",
  premise: "Reading a scene and watching it are different experiences. Each one gives you something the other cannot.",
  outro: "Compare a text with its film or audio version by what you imagine and what you are shown.",
  scene: "city",
  kind: "sort",
  fs: 4.8,
  hint: "Who is doing the work here: your imagination, or the filmmakers?",
  tag: "prefers_without_analysis",
  rounds: [
    { say: "Where does each one happen?", bins: "Reading|Watching|Both", items: ["you imagine the voices|", "music tells you the mood|actors show feelings on their faces", "the same events unfold|"], trap: ["music tells you the mood", 0], why: "A page has no soundtrack. Film adds music.", win: "Each form has its own tools." },
    { say: "Sort these.", bins: "Reading|Watching|Both", items: ["you picture the setting|", "the camera picks what you see|actors speak the lines", "you learn what characters want|"], trap: ["the camera picks what you see", 0], why: "A book has no camera. Your mind decides what to picture.", win: "Text invites imagining. Film shows." },
    { say: "Sort these by yourself.", bins: "Reading|Watching|Both", items: ["you set the pace|", "lighting sets the mood|a voice gives the lines a tone", "the plot reaches its end|"], trap: ["lighting sets the mood", 0] },
  ],
}));
