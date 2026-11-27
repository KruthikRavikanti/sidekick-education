// Trace the Theme. Skill RL.7.2-1.
// Determining a theme and analyzing its development over the course of the text. Stating a theme without tracing it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trace the Theme",
  emoji: "🧵",
  premise: "A theme is not dropped in at the end. It grows across the story, from the first scene to the last.",
  outro: "Trace a theme by showing how it appears at the beginning, in the middle and at the end.",
  scene: "ocean",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "What does this part of the story add to the message?",
  tag: "theme_not_traced",
  rounds: [
    { say: "Theme: asking for help takes courage. How does each part develop it?", read: "Lian insists on rowing the race alone and capsizes. She watches other crews pull together. At last she asks two rivals to row with her, and they finish.", rows: [["beginning", "pride keeps her alone"], ["middle", "she sees teamwork work"], ["end", "she asks and succeeds"]], trap: [0, "she asks and succeeds"], why: "At the start she refuses help. The asking comes last.", win: "The theme grows step by step." },
    { say: "Theme: honesty repairs trust. How does each part develop it?", read: "Theo breaks the telescope and blames the cat. His sister stops lending him anything. He finally admits it, and she hands him the lens cloth.", rows: [["beginning", "a lie is told"], ["middle", "trust is lost"], ["end", "the truth mends it"]], trap: [1, "the truth mends it"], why: "In the middle things get worse. The mending is at the end.", win: "Lie, loss, repair." },
    { say: "Theme: patience brings reward. Match by yourself.", read: "Abena plants a mango seed and digs it up daily to check. Her grandmother makes her wait. Years later she picks the first fruit.", rows: [["beginning", "she cannot wait"], ["end", "waiting pays off"]], extra: "the tree dies|she gives up", trap: [0, "waiting pays off"] },
  ],
}));
