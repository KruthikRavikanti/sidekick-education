// Trace the Argument. Skill RI.6.8-1.
// Tracing an argument and its specific claims. Not being able to find the claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trace the Argument",
  emoji: "🧵",
  premise: "An argument is built from claims: the statements the author wants you to accept. Find them first.",
  outro: "A claim is a statement the author argues is true. Background facts and questions are not claims.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Which sentences take a side that someone could disagree with?",
  tag: "cannot_find_claims",
  rounds: [
    { say: "Tap the two claims the author is arguing for.", mark: "*School should start later in the morning.|Our school starts at 7:30.|*Teens learn better when they get more sleep.|The bus ride takes twenty minutes.", trap: "Our school starts at 7:30.", why: "That is a fact about the schedule. Nobody would argue with it.", win: "Two claims someone could disagree with." },
    { say: "Tap the two claims.", mark: "The city has four parks.|*The city needs more trees along its streets.|*Trees make neighborhoods cooler in summer.|Summer begins in June.", trap: "The city has four parks.", why: "That is background. The claims say what should happen and why.", win: "One says what to do. One says why." },
    { say: "Tap the two claims by yourself.", mark: "Lunch lasts twenty minutes.|*Students should have a longer lunch.|The cafeteria has ten tables.|*Rushed meals leave students hungry in class.|Lunch is at noon.", trap: "Lunch lasts twenty minutes." },
  ],
}));
