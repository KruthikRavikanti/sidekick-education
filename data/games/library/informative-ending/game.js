// Informative Ending. Skill W.3.2-4.
// Providing a concluding statement or section for informative writing. Stopping abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Informative Ending",
  emoji: "🏁",
  premise: "An informative piece should not just stop. End with a sentence that sums up what the reader learned.",
  outro: "Finish informative writing with a conclusion about the whole topic.",
  scene: "field",
  kind: "pick",
  hint: "Which sentence sums up the whole topic?",
  tag: "stops_abruptly",
  rounds: [
    { say: "Read the writing. Tap the best conclusion.", read: "Wolves live in packs. They hunt as a team and care for the pups together.", yes: "Working together helps the whole pack survive.|", no: "Wolves have gray fur.|Pups are small.|Then they howl.", trap: "Wolves have gray fur.", why: "That is a new fact. A conclusion sums up.", win: "It sums up the topic." },
    { say: "Read this writing. Tap the best conclusion.", read: "The moon has no air or water. Its surface is covered in dust and craters.", yes: "The moon is a very different world from Earth.|", no: "Craters are round.|Dust is gray.|It also has rocks.", trap: "It also has rocks.", why: "That adds one more fact. End by summing up.", win: "A fitting close." },
    { say: "Tap the best conclusion by yourself.", read: "Bees pollinate flowers. They make honey and wax. Each bee has a job in the hive.", yes: "Bees are small insects that do a great deal of work.|", no: "Honey is sweet.|Wax is yellow.|Bees also buzz.|Flowers are pretty.|Hives are busy.", trap: "Bees also buzz." },
  ],
}));
