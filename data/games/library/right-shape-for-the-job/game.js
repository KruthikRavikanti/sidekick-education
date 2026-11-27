// Right Shape for the Job. Skill W.3.4-1.
// Producing writing in which development and organization are appropriate to task and purpose. Writing the same way for every task is the known slip.
Sidekick.game(Sidekick.play({
  title: "Right Shape for the Job",
  emoji: "🥪",
  premise: "Different jobs need different kinds of writing. Directions are steps. A story has events. An opinion has reasons.",
  outro: "Match how you organize your writing to its task and purpose.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "What is the writing FOR?",
  tag: "same_way_for_every_task",
  rounds: [
    { say: "Match each task to the kind of writing it needs.", rows: [["tell how to make a sandwich", "numbered steps"], ["tell about a funny day", "a story with events"], ["say which pet is best", "an opinion with reasons"]], trap: [0, "a story with events"], why: "A reader making a sandwich needs clear steps in order.", win: "Steps, story, opinion." },
    { say: "Match each task to how it should be organized.", rows: [["explain what bats eat", "facts grouped by topic"], ["invite a friend to a party", "a short friendly note"], ["tell how to plant a seed", "steps in order"]], trap: [2, "facts grouped by topic"], why: "Planting is a process. It needs steps in order.", win: "The purpose decides the shape." },
    { say: "Match these by yourself.", rows: [["argue for a longer recess", "an opinion with reasons"], ["describe the life of a frog", "facts grouped by topic"], ["tell about a camping trip", "a story with events"]], extra: "a list of rhymes|", trap: [0, "a story with events"] },
  ],
}));
