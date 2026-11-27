// Sections and Paragraphs. Skill W.4.2-1.
// Introducing a topic clearly and grouping related information in paragraphs and sections. Writing one long paragraph is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sections and Paragraphs",
  emoji: "🗂️",
  premise: "Long informative writing is split into paragraphs and sections. Each one holds information on one part of the topic.",
  outro: "Group related information into paragraphs and sections.",
  scene: "desk",
  kind: "sort",
  hint: "Which section is this fact about?",
  tag: "one_long_paragraph",
  rounds: [
    { say: "You are writing about sharks. Put each fact in its section.", bins: "Body|Diet|Habitat", items: ["Skeletons made of cartilage|Rows of sharp teeth", "Hunt fish and seals|", "Live in every ocean|"], trap: ["Rows of sharp teeth", 1], why: "Teeth are part of the body. What sharks eat goes under Diet.", win: "Three sections, each on one part of the topic." },
    { say: "You are writing about your state. Put each fact in its section.", bins: "Land|People|History", items: ["Mountains in the north|", "Two million residents|Many work in farming", "Became a state in 1889|"], trap: ["Many work in farming", 0], why: "Farming is what people do. It belongs under People.", win: "Facts grouped by section." },
    { say: "You are writing about volcanoes. Sort by yourself.", bins: "How they form|Types|Effects", items: ["Magma rises through cracks|", "Shield and cone shapes|", "Ash can block the sun|Lava makes new land"], trap: ["Lava makes new land", 0] },
  ],
}));
