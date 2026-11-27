// Essay Check. Skill RI.8.10-1.
// Reading and comprehending literary nonfiction at the high end of the grades 6 to 8 band independently. Needing support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Essay Check",
  emoji: "🧐",
  premise: "A demanding essay makes its point across several sentences. Follow the reasoning to the idea it is built to deliver.",
  outro: "State the central idea of a complex essay in your own words.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "What is the one point every sentence is working toward?",
  tag: "needs_support",
  rounds: [
    { say: "Read the essay. Tap its central idea.", read: "We praise inventors for their flashes of genius, yet most breakthroughs come from long refinement. The light bulb worked only after thousands of trial filaments. The airplane followed years of glider tests. What we call a flash is usually the last step of a very long walk.", yes: "Breakthroughs come from persistent refinement more than sudden genius.|", no: "Light bulbs have filaments.|Gliders came before airplanes.|Inventors are praised.", trap: "Light bulbs have filaments.", why: "That is one example. What point do both examples serve?", win: "Both examples support slow refinement." },
    { say: "Tap the two examples the author uses as evidence.", mark: "Inventors are often praised.|*The light bulb needed thousands of trial filaments.|*The airplane followed years of glider tests.|A flash is a kind of light.", trap: "Inventors are often praised.", why: "That sets up the idea. It is not an example of refinement.", win: "Two cases of long testing." },
    { say: "Read this essay. Tap its central idea by yourself.", read: "Maps feel like plain fact, but every map is a choice. A mapmaker decides what to include and what sits at the center. A subway map bends distance to make routes clear.", yes: "Every map reflects its maker’s choices.|", no: "Subways have maps.|Maps show distance.|Maps have lines.|Some maps are old.|Maps can fold.", trap: "Subways have maps." },
  ],
}));
