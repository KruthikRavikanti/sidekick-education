// What Is This Paragraph About?. Skill RI.2.2-2.
// Identifying the focus of specific paragraphs within a text. Treating all paragraphs as the same topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Is This Paragraph About?",
  emoji: "🧩",
  premise: "Each paragraph in an article has its own job. Each one is mostly about one thing.",
  outro: "Each paragraph has its own focus that fits under the main topic.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Read just that paragraph. What is it mostly about?",
  tag: "same_topic_for_all",
  rounds: [
    { say: "Read both paragraphs about frogs. What is each one about?", read: "1. Frogs live near ponds and streams. They need to keep their skin wet. / 2. Frogs eat flies and worms. They catch them with a sticky tongue.", rows: [["Paragraph 1", "where frogs live"], ["Paragraph 2", "what frogs eat"]], extra: "frogs|", trap: [1, "frogs"], why: "Both are about frogs. What is special about paragraph 2?", win: "Homes, then food." },
    { say: "Read both paragraphs. What is each one about?", read: "1. A kite needs a light frame and a tail. / 2. To fly it, run into the wind and let out the string.", rows: [["Paragraph 1", "parts of a kite"], ["Paragraph 2", "how to fly a kite"]], extra: "windy days|", trap: [0, "how to fly a kite"], why: "Paragraph 1 tells what a kite is made of.", win: "Parts, then how to fly it." },
    { say: "Work these out by yourself.", read: "1. Owls have big eyes and soft feathers. / 2. Owls hunt mice at night.", rows: [["Paragraph 1", "what owls look like"], ["Paragraph 2", "how owls hunt"]], extra: "owls|birds that sing", trap: [0, "owls"] },
  ],
}));
