// What the Diagram Adds. Skill RI.2.7-1.
// Explaining how specific images, such as a diagram, contribute to and clarify a text. Describing the image without connecting it to the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Diagram Adds",
  emoji: "⚙️",
  premise: "A diagram shows what words alone cannot. It lets you see the parts and where they are.",
  outro: "Images and diagrams make the text clearer by showing what it describes.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What can you SEE in it that helps the words make sense?",
  tag: "does_not_connect_image",
  rounds: [
    { say: "How does each image help the reader?", rows: [["a diagram of a beehive", "shows the rooms inside"], ["a map of bird flights", "shows where they travel"]], extra: "makes the page pretty|", trap: [0, "makes the page pretty"], why: "It may look nice, but its job is to show what the text explains.", win: "Images show what the words tell." },
    { say: "Match each image to how it helps.", rows: [["a picture with labels of a bike", "names each part"], ["a chart of rainfall", "compares the months"], ["a photo of a volcano", "shows what it looks like"]], trap: [1, "names each part"], why: "A chart with numbers lets you compare.", win: "Labels, charts and photos." },
    { say: "Match these by yourself.", rows: [["a life cycle drawing", "shows the stages in order"], ["a cutaway of the Earth", "shows the layers inside"]], extra: "fills empty space|adds color", trap: [0, "adds color"] },
  ],
}));
