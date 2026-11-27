// Purpose and Its Tools. Skill RI.9-10.6-1.
// Determining an author’s point of view or purpose and analyzing how rhetoric advances it. Identifying the purpose without the rhetoric is the known slip.
Sidekick.game(Sidekick.play({
  title: "Purpose and Its Tools",
  emoji: "🎤",
  premise: "Writers who want to move you reach for rhetoric: questions that need no answer, repeated phrases, appeals to what you value.",
  outro: "Name the author’s purpose, then show which rhetorical choices advance it.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Find the technique. Then ask what it makes the listener feel or do.",
  tag: "purpose_without_rhetoric",
  rounds: [
    { say: "A speech urges the town to save its library. Name each tool.", fs: 4.4, rows: [["Where will our children read?", "rhetorical question"], ["We built it. We filled it. We will keep it.", "repetition"], ["A town that values learning keeps its library.", "appeal to shared values"]], trap: [1, "rhetorical question"], why: "There is no question here. The same pattern, We plus a verb, comes three times.", win: "Question, repetition, values." },
    { say: "How does each tool advance the purpose of saving the library?", fs: 4.4, rows: [["rhetorical question", "makes listeners picture the loss"], ["repetition", "builds unity and resolve"], ["appeal to shared values", "ties the cause to who the town is"]], extra: "makes the speech longer|", trap: [0, "makes the speech longer"], why: "Asking where children will read makes the audience imagine life without the library.", win: "Each tool pushes toward the same goal." },
    { say: "A letter urges neighbors to join a cleanup. Match each tool by yourself.", fs: 4.4, rows: [["rhetorical question", "Who will do it, if not us?"], ["repetition", "One street. One morning. One clean start."], ["shared values", "Good neighbors care for what they share."]], extra: "Trash pickup is on Friday.|", trap: [0, "One street. One morning. One clean start."] },
  ],
}));
