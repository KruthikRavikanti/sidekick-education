// Chalk Dots. Skill K.OA.A.1-2.
// Showing addition and subtraction with drawings: the child paints dots for what is there at the end of the story. Drawing only the starting number misses the action.
Sidekick.game(Sidekick.play({
  title: "Chalk Dots",
  emoji: "🖍️",
  premise: "Draw each little story with chalk dots. Your picture should show what happened, not just the numbers.",
  outro: "A drawing can show adding and taking away.",
  scene: "paper",
  kind: "paint",
  cast: "",
  hint: "Think about what happened. Draw what is there at the end.",
  tag: "draws_numbers_not_action",
  grid: [5, 2],
  icon: "🟣",
  noun: "Dots",
  rounds: [
    { say: "Draw 2 and 3 more. Paint one dot for each.", need: 5, trap: 3, why: "There were 2 first. Draw those and the 3 more.", win: "2 and 3 more make 5 dots." },
    { say: "Draw 4 take away 1. Paint only the dots that are left.", need: 3, trap: 4, why: "One was taken away. Show only what is left.", win: "4 take away 1 leaves 3." },
    { say: "Draw this story by yourself.", alt: [{ say: "Draw 6 take away 2. Paint only the dots that are left.", need: 4, trap: 6 }, { say: "Draw 3 and 4 more. Paint one dot for each.", need: 7, trap: 4 }, { say: "Draw 7 take away 3. Paint only the dots that are left.", need: 4, trap: 7 }] },
  ],
}));
