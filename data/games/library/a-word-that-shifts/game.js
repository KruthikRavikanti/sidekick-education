// A Word That Shifts. Skill RI.11-12.4-1.
// Analyzing how an author uses and refines the meaning of a key term over the course of a text, as Madison does with faction in Federalist No. 10. Using one fixed meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "A Word That Shifts",
  emoji: "🧭",
  premise: "Careful writers define a key term, then sharpen it as the argument moves. The word at the end is not quite the word at the start.",
  outro: "Track how an author uses and refines a key term across a text.",
  scene: "paper",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "How is the word used early? What has been added or narrowed by the end?",
  tag: "one_fixed_meaning",
  rounds: [
    { say: "In Federalist No. 10, Madison refines the word faction. Track it.", rows: [["at first", "any group united by a shared interest"], ["refined", "a group whose interest harms others’ rights"], ["by the end", "a danger a large republic can control"]], trap: [0, "a danger a large republic can control"], why: "That is where the argument lands. He begins with a broad definition.", win: "Broad, then narrowed, then answered." },
    { say: "An essay keeps using the word efficiency. Track the shift.", read: "Early: “Efficiency means doing more with less.” Later: “But an efficiency that discards people is only speed.”", rows: [["early meaning", "doing more with less"], ["later meaning", "must also count the human cost"]], extra: "going faster|", trap: [1, "going faster"], why: "The author rejects mere speed. The term now includes people.", win: "The term grows a condition." },
    { say: "An essay keeps using the word freedom. Track it by yourself.", read: "Early: “Freedom is the absence of restraint.” Later: “Yet no one is free who cannot read the ballot.”", rows: [["early meaning", "being left alone"], ["later meaning", "having the means to act"]], extra: "having no rules at all|", trap: [1, "having no rules at all"] },
  ],
}));
