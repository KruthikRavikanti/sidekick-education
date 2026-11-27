// Many Sides of a Topic. Skill W.4.7-1.
// Conducting short research projects that build knowledge through investigation of different aspects of a topic. Using a single source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Many Sides of a Topic",
  emoji: "🗺️",
  premise: "A research project looks at a topic from several sides. One source rarely covers them all.",
  outro: "Investigate different aspects of a topic, using more than one source.",
  scene: "sand",
  kind: "sort",
  hint: "Which aspect of the state is this fact about?",
  tag: "single_source",
  rounds: [
    { say: "You are researching a state. Sort the facts by aspect.", bins: "Land|History|People", items: ["It has three mountain ranges.|", "It joined the nation in 1846.|", "Most residents live near the coast.|"], trap: ["Most residents live near the coast.", 0], why: "That is about where people live, so it belongs under People.", win: "Three aspects of one topic." },
    { say: "Which source is best for each aspect?", kind: "fill", cast: "", rows: [["the shape of the land", "an atlas with maps"], ["when it became a state", "a history book"], ["how many people live there", "a census website"]], trap: [0, "a history book"], why: "Maps show land best. Use the atlas.", win: "Different aspects, different sources." },
    { say: "You are researching whales. Sort by yourself.", bins: "Body|Food|Travel", items: ["Blue whales reach 100 feet.|", "They strain tiny krill from the water.|", "They swim thousands of miles each year.|"], trap: ["They swim thousands of miles each year.", 0] },
  ],
}));
