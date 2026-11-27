// Penguin Page. Skill RI.1.10-1.
// Reading informational texts appropriately complex for grade 1: a short passage is read, then statements are checked against it. Avoiding nonfiction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Penguin Page",
  emoji: "🐧",
  premise: "Read a page from a fact book all by yourself. Then check what you learned from it.",
  outro: "When you read a fact book, think about what each sentence teaches.",
  scene: "snow",
  kind: "sort",
  hint: "Go back to the page. Does it say that?",
  tag: "does_not_check_the_text",
  rounds: [
    { say: "Read the page. Which things does it say?", read: "Penguins are birds, but they cannot fly. They use their wings to swim. They eat fish.", bins: "The page says it|It does not", items: ["Penguins cannot fly.|Penguins eat fish.", "Penguins live in trees.|Penguins eat grass."], trap: ["Penguins eat grass.", 0], why: "Read the last sentence. It says they eat fish.", win: "You checked the page." },
    { say: "Read this page. Which things does it say?", read: "A spider has eight legs. It spins a web to catch bugs. Spiders are not insects.", bins: "The page says it|It does not", items: ["A spider has eight legs.|A web catches bugs.", "Spiders are insects.|Spiders have six legs."], trap: ["Spiders are insects.", 0], why: "The page says spiders are NOT insects.", win: "You read it with care." },
    { say: "Read and sort by yourself.", read: "Snow is made of tiny ice crystals. Each snowflake has six sides.", bins: "The page says it|It does not", items: ["Snow is made of ice.|Snowflakes have six sides.", "Snowflakes have four sides.|Snow is made of salt."], trap: ["Snowflakes have four sides.", 0] },
  ],
}));
