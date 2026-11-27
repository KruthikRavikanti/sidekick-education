// So What?. Skill W.9-10.2-4.
// Providing a concluding statement that articulates the implications or significance of the topic. Restating only is the known slip.
Sidekick.game(Sidekick.play({
  title: "So What?",
  emoji: "💡",
  premise: "The end of an explanation should answer one last question: why does this matter?",
  outro: "A conclusion articulates the significance of the topic, beyond restating it.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the sentence tell the reader why the topic matters?",
  tag: "restates_only",
  rounds: [
    { say: "A report explained how bridges balance forces. Which endings show why it matters?", bins: "Shows why it matters|Only restates", items: ["Knowing these forces lets engineers build longer, safer spans.|Each new bridge design starts from this balance.", "So that is how bridges work.|As explained, bridges balance two forces."], trap: ["As explained, bridges balance two forces.", 0], why: "That repeats the thesis. Add what the idea makes possible.", win: "Point to the significance." },
    { say: "A report explained how GPS works. Sort the endings.", bins: "Shows why it matters|Only restates", items: ["The same timing math now guides ships, planes and rescue teams.|Without it, modern shipping would slow to a crawl.", "In conclusion, GPS uses satellites.|That was my report on GPS."], trap: ["In conclusion, GPS uses satellites.", 0], why: "The reader already knows that. Say what follows from it.", win: "End on the so what." },
    { say: "A report explained how yeast makes bread rise. Sort these by yourself.", bins: "Shows why it matters|Only restates", items: ["The same process is used to make medicines today.|Understanding it lets bakers control texture and flavor.", "To sum up, yeast makes gas.|As I said, bread rises because of yeast."], trap: ["To sum up, yeast makes gas.", 0] },
  ],
}));
