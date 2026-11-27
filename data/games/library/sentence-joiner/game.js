// Sentence Joiner. Skill L.3.1-6.
// Producing simple, compound and complex sentences. Writing run-ons with no joining word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sentence Joiner",
  emoji: "🧩",
  premise: "Two short sentences can be joined into one. Words like because, when and although do the joining.",
  outro: "A complex sentence joins two ideas with a word like because, when or although.",
  scene: "desk",
  kind: "row",
  hint: "Which idea is the reason? Because goes right before it.",
  tag: "writes_run_ons",
  rounds: [
    { say: "Join the two sentences with because.", read: "We stayed inside. It rained.", seq: "We stayed inside|because|it rained.", trap: "because|We stayed inside|it rained.", why: "Because goes before the reason: it rained.", win: "One sentence, with the reason joined on." },
    { say: "Join the two sentences with when.", read: "The bell rang. We lined up.", seq: "We lined up|when|the bell rang.", trap: "when|We lined up|the bell rang.", why: "When goes before the bell rang.", win: "Two ideas joined by when." },
    { say: "Join these by yourself.", alt: [{ read: "I was tired. I finished the race.", seq: "I finished the race|although|I was tired.", trap: "although|I finished the race|I was tired." }, { read: "The cat hid. It heard thunder.", seq: "The cat hid|because|it heard thunder.", trap: "because|The cat hid|it heard thunder." }] },
  ],
}));
