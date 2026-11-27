// Four Sentence Summary. Skill RL.4.2-2.
// Summarizing a text. Retelling every event is the known slip.
Sidekick.game(Sidekick.play({
  title: "Four Sentence Summary",
  emoji: "✂️",
  premise: "A summary keeps the main events and leaves out the small stuff. Cut until only the important parts remain.",
  outro: "Summarize with the main events only: problem, key actions and outcome.",
  scene: "paper",
  kind: "pick",
  hint: "Would the story fall apart without this sentence?",
  tag: "retells_every_event",
  rounds: [
    { say: "Read the story. Tap the sentences that belong in a short summary.", read: "Kira found a baby bird under a tree. She put on her green gloves. She built a nest in a shoebox and fed it for a week. It ate six worms on Monday. At last it flew away.", yes: "Kira found a baby bird.|She cared for it for a week.|It flew away.", no: "She wore green gloves.|It ate six worms on Monday.", trap: "She wore green gloves.", why: "The gloves do not change the story. Leave them out.", win: "Found, cared for, flew away." },
    { say: "Read this story. Tap the sentences for a summary.", read: "The village well ran dry. An old man remembered a spring in the hills. The path was rocky and had many turns. The villagers dug a channel and brought the water down.", yes: "The well ran dry.|An old man knew of a spring.|The villagers brought the water down.", no: "The path was rocky.|The path had many turns.", trap: "The path was rocky.", why: "The path is a detail. The summary needs the problem and the solution.", win: "Problem, idea, solution." },
    { say: "Tap the summary sentences by yourself.", read: "Jo’s team was losing by ten. The coach wore his lucky hat. Jo passed instead of shooting, and her teammates scored again and again. The gym smelled of popcorn. They won by two.", yes: "Jo’s team was losing.|Jo passed so teammates could score.|They won.", no: "The coach wore a lucky hat.|The gym smelled of popcorn.", trap: "The gym smelled of popcorn." },
  ],
}));
