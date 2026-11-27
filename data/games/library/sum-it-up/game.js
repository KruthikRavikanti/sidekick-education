// Sum It Up. Skill RF.5.4-1.
// Reading grade-level text with purpose and understanding, shown by choosing an accurate summary. Reading without understanding is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sum It Up",
  emoji: "🦅",
  premise: "Understanding a passage means you can boil it down to its main points without losing the meaning.",
  outro: "An accurate summary covers the main points of the whole passage, briefly.",
  scene: "sky",
  kind: "pick",
  hint: "Which choice is true to the whole passage, not just one part?",
  tag: "reads_without_understanding",
  rounds: [
    { say: "Read the passage. Tap the most accurate summary.", read: "Bald eagles nearly vanished in the 1960s because a farm chemical thinned their eggshells. After the chemical was banned and nests were protected, their numbers slowly recovered. Today they are no longer endangered.", yes: "Eagles nearly died out from a chemical but recovered once it was banned.|", no: "Bald eagles lay eggs.|Farm chemicals are used on crops.|Eagles are endangered today.", trap: "Eagles are endangered today.", why: "The last sentence says they are NO longer endangered.", win: "Cause, action and result in one sentence." },
    { say: "Read this passage. Tap the most accurate summary.", read: "Amara thought the science fair was only about winning. When her volcano fizzled in front of the judges, a younger student asked how it was meant to work. Explaining it, Amara realized she loved the science more than the ribbon.", yes: "A project that flops teaches Amara she values science over winning.|", no: "Amara wins the science fair.|A volcano erupts at school.|A student asks a question.", trap: "Amara wins the science fair.", why: "Her volcano did not work. What did she learn instead?", win: "What happened, and what changed in her." },
    { say: "Tap the most accurate summary by yourself.", read: "The Great Wall was built over many centuries, not all at once. Different rulers added sections to guard against invasion. Much of what visitors see today dates from the Ming dynasty.", yes: "The Great Wall was built in stages by many rulers for defense.|", no: "The Great Wall was built in one year.|Visitors like the wall.|The Ming dynasty ruled China.|Walls are made of stone.|Invaders came often.", trap: "The Great Wall was built in one year." },
  ],
}));
