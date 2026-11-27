// Reason Plus Fact. Skill W.5.1-2.
// Providing logically ordered reasons that are supported by facts and details. Giving unsupported reasons is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reason Plus Fact",
  emoji: "🧱",
  premise: "A reason is stronger when a fact backs it up. Match each reason to the fact that supports it.",
  outro: "Support each reason with facts and details, and order the reasons logically.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which fact proves that particular reason?",
  tag: "unsupported_reasons",
  rounds: [
    { say: "Opinion: School should start later. Match each reason to its supporting fact.", rows: [["Teens need more sleep.", "Doctors recommend 9 hours."], ["Later starts are safer.", "Morning car crashes fell 16%."]], extra: "Buses are yellow.|", trap: [0, "Buses are yellow."], why: "That fact does not support any reason about sleep.", win: "Each reason has a fact to back it." },
    { say: "Opinion: Schools need gardens. Match each reason to its fact.", rows: [["Gardens teach science.", "Students test soil and track growth."], ["Gardens improve eating.", "Kids who grow vegetables eat more of them."]], extra: "Gardens have gates.|", trap: [1, "Gardens have gates."], why: "A gate says nothing about eating habits.", win: "Reasons supported by facts." },
    { say: "Opinion: Kids should read daily. Match by yourself.", rows: [["Reading builds vocabulary.", "Readers learn thousands of new words a year."], ["Reading lowers stress.", "Six minutes of reading slows the heart rate."]], extra: "Books have covers.|Libraries are quiet.", trap: [0, "Books have covers."] },
  ],
}));
