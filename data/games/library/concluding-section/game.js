// Concluding Section. Skill W.5.2-5.
// Providing a concluding statement or section related to the information or explanation presented. Having none is the known slip.
Sidekick.game(Sidekick.play({
  title: "Concluding Section",
  emoji: "🏁",
  premise: "An informative essay ends with a section that follows from the explanation and leaves the reader with the key point.",
  outro: "End with a conclusion related to the information presented.",
  scene: "field",
  kind: "pick",
  hint: "Which one pulls the explanation together?",
  tag: "no_conclusion",
  rounds: [
    { say: "The essay explains how astronauts eat, sleep and exercise in space. Tap the best conclusion.", yes: "Life in orbit turns every everyday task into a challenge to be solved.|", no: "Astronauts also wear suits.|The moon has no air.|That is all.", trap: "Astronauts also wear suits.", why: "That adds another fact. A conclusion pulls the facts together.", win: "It ties the explanation together." },
    { say: "The essay explains the causes of the Dust Bowl. Tap the best conclusion.", yes: "Together, drought and careless farming turned rich prairie into dust.|", no: "Dust is dry.|Farms grow food.|In conclusion, that is it.", trap: "In conclusion, that is it.", why: "The words in conclusion are not a conclusion by themselves.", win: "A real concluding statement." },
    { say: "The essay explains how bees share information. Tap the best conclusion by yourself.", yes: "Through dance and scent, a hive acts almost like a single mind.|", no: "Bees have six legs.|Wasps are different.|So that is my report.|Honey is sweet.|Bees can sting.", trap: "So that is my report." },
  ],
}));
