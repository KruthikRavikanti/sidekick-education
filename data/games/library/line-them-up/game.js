// Line Them Up. Skill 1.MD.A.1-1.
// Ordering three objects by length, first by looking and then by reasoning from two clues. Going longest to shortest is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line Them Up",
  emoji: "🧵",
  premise: "Three things, three lengths. Line them up from the shortest to the longest.",
  outro: "To order by length, find the shortest, then the next, then the longest.",
  scene: "desk",
  kind: "row",
  cast: "",
  hint: "Find the shortest one first. Put it at the start.",
  tag: "orders_longest_first",
  rounds: [
    { say: "Line these up from shortest to longest.", seq: "🖍️▬|✏️▬▬▬|🖊️▬▬▬▬▬", trap: "reverse", why: "That goes from longest to shortest. Start with the shortest.", win: "Shortest, longer, longest." },
    { say: "Use the clues. Line them up from shortest to longest.", q: "A pencil is longer than a crayon. A marker is longer than the pencil.", seq: "crayon pencil marker", trap: "pencil crayon marker", why: "The pencil is longer than the crayon, so the crayon comes first.", win: "Crayon, pencil, marker." },
    { say: "Use the clues by yourself. Shortest to longest.", alt: [{ q: "The rope is longer than the belt. The belt is longer than the sock.", seq: "sock belt rope", trap: "rope belt sock" }, { q: "The bus is longer than the car. The bike is shorter than the car.", seq: "bike car bus", trap: "car bike bus" }, { q: "The spoon is shorter than the broom. The broom is shorter than the ladder.", seq: "spoon broom ladder", trap: "ladder broom spoon" }] },
  ],
}));
