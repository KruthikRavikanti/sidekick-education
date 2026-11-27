// Summary in a Sentence. Skill RF.4.4-1.
// Reading grade-level text with purpose and understanding, shown by choosing an accurate summary. Reading without understanding is the known slip.
Sidekick.game(Sidekick.play({
  title: "Summary in a Sentence",
  emoji: "🐢",
  premise: "If you understood a passage, you can sum it up. A summary is short and covers the whole thing.",
  outro: "A summary gives the main points in a few words, without small details.",
  scene: "ocean",
  kind: "pick",
  hint: "Which choice covers the whole passage, not just one part?",
  tag: "reads_without_understanding",
  rounds: [
    { say: "Read the passage. Tap the best summary.", read: "Sea turtles hatch on beaches at night and race to the water. Lights from houses can confuse them, sending them the opposite way. Some towns now dim their lights during nesting season to help.", yes: "Bright lights mislead baby turtles, so towns dim them to help.|", no: "Sea turtles hatch at night.|Houses have lights.|Turtles like beaches.", trap: "Sea turtles hatch at night.", why: "That is only the first detail. What problem and fix does the passage describe?", win: "A problem and its solution, in one sentence." },
    { say: "Read this passage. Tap the best summary.", read: "When Mateo joined the chess club, he lost every game. Instead of quitting, he studied one opening each week. By spring, he was teaching new members.", yes: "Mateo kept practicing and went from beginner to teacher.|", no: "Mateo lost at chess.|Chess has openings.|Spring came.", trap: "Mateo lost at chess.", why: "That is how it begins. A summary includes how it ends.", win: "The whole arc, in one sentence." },
    { say: "Tap the best summary by yourself.", read: "Desert plants have clever ways to save water. Cactus stems swell to store it. Waxy skin keeps it from drying out. Spines shade the plant and keep thirsty animals away.", yes: "Desert plants have features that help them hold on to water.|", no: "Cactus stems swell.|Deserts are dry.|Spines are sharp.|Animals get thirsty.|Wax is shiny.", trap: "Cactus stems swell." },
  ],
}));
