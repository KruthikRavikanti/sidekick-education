// How Is It Built?. Skill RI.4.5-1.
// Describing the overall structure of events, ideas or information in a text. Calling every text just facts is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Is It Built?",
  emoji: "🏗️",
  premise: "Nonfiction is organized in patterns: in time order, by comparing, by cause and effect, or by a problem and its solution.",
  outro: "Name the structure: chronology, comparison, cause/effect or problem/solution.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Does it follow time, compare two things, give a cause, or fix a problem?",
  tag: "calls_everything_facts",
  rounds: [
    { say: "Name the structure of each text.", rows: [["Trash filled the park, so the town added bins.", "problem and solution"], ["In 1903 they flew. By 1969 people reached the moon.", "chronology"]], extra: "just facts|", trap: [0, "just facts"], why: "Look closer: there is a problem, then a fix.", win: "Problem and solution, and time order." },
    { say: "Name the structure of each text.", rows: [["Frogs have smooth skin, but toads are bumpy.", "comparison"], ["Because the ice melted, sea levels rose.", "cause and effect"], ["First mix, then bake, then cool.", "chronology"]], trap: [1, "comparison"], why: "Because signals a cause and its effect.", win: "Compare, cause, time order." },
    { say: "Name these by yourself.", rows: [["The bridge was too weak, so engineers added steel.", "problem and solution"], ["Unlike cats, dogs live in packs.", "comparison"], ["Heavy rain led to floods.", "cause and effect"]], extra: "just facts|", trap: [0, "just facts"] },
  ],
}));
