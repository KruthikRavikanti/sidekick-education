// Close the Argument. Skill W.5.1-4.
// Providing a concluding statement or section related to the opinion presented. Having no conclusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Close the Argument",
  emoji: "🔒",
  premise: "The conclusion of an opinion piece brings the reader back to your opinion and leaves them convinced.",
  outro: "End with a conclusion tied to the opinion presented.",
  scene: "paper",
  kind: "pick",
  hint: "Which one returns to the opinion and sums up the reasons?",
  tag: "no_conclusion",
  rounds: [
    { say: "The essay argues school should start later for health and safety. Tap the best conclusion.", yes: "A later bell would give students the rest they need to learn and stay safe.|", no: "Students also need better lunches.|School starts at eight.|That is my essay.", trap: "That is my essay.", why: "That announces an ending but says nothing about the opinion.", win: "It returns to the opinion and its reasons." },
    { say: "The essay argues for washable lunch trays to cut waste and cost. Tap the best conclusion.", yes: "Washable trays would shrink our trash and our budget at once.|", no: "Recess should be longer too.|Trays are flat.|Thank you for reading.", trap: "Recess should be longer too.", why: "That is a different topic altogether.", win: "A conclusion tied to the opinion." },
    { say: "The essay argues the library should stay open daily. Tap the best conclusion by yourself.", yes: "Keeping the library open every day keeps opportunity open for everyone.|", no: "Parks need funding as well.|Libraries have books.|The end.|I worked hard on this.|Books are heavy.", trap: "The end." },
  ],
}));
