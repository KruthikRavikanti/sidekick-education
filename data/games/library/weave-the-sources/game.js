// Weave the Sources. Skill W.9-10.7-1.
// Conducting research to answer a question, synthesizing multiple sources. Using one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Weave the Sources",
  emoji: "🧶",
  premise: "Research means more than quoting one website. Synthesis puts several sources together to say something none says alone.",
  outro: "Synthesize multiple sources: combine what they show into one supported answer.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the sentence draw on more than one source and connect them?",
  tag: "uses_one_source",
  rounds: [
    { say: "Question: do bike lanes make streets safer? Synthesis or single source?", bins: "Synthesis|Single source", items: ["Two studies and a city report all show fewer crashes.|Crash data and rider surveys point the same way.", "One website says bike lanes are great.|A blog post claims lanes help."], trap: ["One website says bike lanes are great.", 0], why: "One source cannot be checked against anything. Synthesis compares several.", win: "Several sources, one conclusion." },
    { say: "Three sources on school gardens. Build the synthesis.", kind: "fill", fs: 4.4, cast: "", rows: [["Source A", "Students ate more vegetables."], ["Source B", "Science scores rose slightly."], ["Synthesis", "Gardens may improve both diet and learning."]], trap: [2, "Students ate more vegetables."], why: "That is one finding. The synthesis joins the findings together.", win: "A plus B makes a bigger point." },
    { say: "Question: does music help studying? Sort these by yourself.", bins: "Synthesis|Single source", items: ["Three experiments agree that lyrics distract readers.|Lab results and a student survey both favor quiet.", "My friend says music helps.|One video recommends jazz."], trap: ["One video recommends jazz.", 0] },
  ],
}));
