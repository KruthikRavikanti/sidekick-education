// Diagram Detective. Skill RI.1.7-1.
// Using illustrations and details in a text to describe its key ideas. Describing the picture without the idea is the known slip.
Sidekick.game(Sidekick.play({
  title: "Diagram Detective",
  emoji: "🐞",
  premise: "A fact book teaches with words and with diagrams. Use both to get the whole idea.",
  outro: "Use the pictures and the words together to understand the key ideas.",
  scene: "meadow",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Read the words. They tell you what to count or look for.",
  tag: "describes_picture_only",
  rounds: [
    { say: "Read the page. Fill in the facts about an ant.", read: "An ant has three body parts: a head, a middle and a back end. It has six legs.", pic: "🐜", rows: [["body parts", "3"], ["legs", "6"]], extra: "4 8", trap: [1, "8"], why: "Spiders have eight legs. The page says an ant has six.", win: "Three body parts and six legs." },
    { say: "Read the page. Fill in the facts about a plant.", read: "A plant has roots under the ground. The stem holds it up. Leaves catch the sun.", pic: "🌱", rows: [["under the ground", "roots"], ["holds the plant up", "stem"], ["catch the sun", "leaves"]], extra: "seeds", trap: [0, "seeds"], why: "The page says the roots are under the ground.", win: "Roots, stem and leaves." },
    { say: "Fill in the facts by yourself.", read: "A bird has two wings and two legs. Its beak is for eating. Feathers keep it warm.", pic: "🐦", rows: [["for eating", "beak"], ["keep it warm", "feathers"], ["how many wings", "2"]], extra: "4 tail", trap: [2, "4"] },
  ],
}));
