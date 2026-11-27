// Fragment, Run-On, Complete. Skill L.4.1-5.
// Producing complete sentences, recognizing and correcting fragments and run-ons. Writing run-ons is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fragment, Run-On, Complete",
  emoji: "🧱",
  premise: "A complete sentence has a subject and a verb and one clear idea. A fragment is missing something. A run-on crams in too much.",
  outro: "Fix fragments by adding what is missing. Fix run-ons with a period or a comma and a joining word.",
  scene: "paper",
  kind: "sort",
  hint: "Does it have a subject and a verb? Are two sentences stuck together?",
  tag: "writes_run_ons",
  rounds: [
    { say: "Sort each group of words.", bins: "Complete|Fragment|Run-on", items: ["I ran home.|", "Because I was late.|", "I ran home I ate dinner.|"], trap: ["I ran home I ate dinner.", 0], why: "Two sentences are stuck together with nothing between them.", win: "Complete, fragment and run-on." },
    { say: "Tap the correct ways to fix: I ran home I ate dinner.", kind: "pick", yes: "I ran home, and I ate dinner.|I ran home. I ate dinner.", no: "I ran home I ate, dinner.|I ran home and.|Ran home ate dinner.", trap: "I ran home I ate, dinner.", why: "A comma in that spot does not separate the two ideas.", win: "A period, or a comma with and." },
    { say: "Sort these by yourself.", bins: "Complete|Fragment|Run-on", items: ["The dog barked at the mail truck.|", "Under the old bridge.|Running down the hill.", "It rained we stayed inside.|"], trap: ["It rained we stayed inside.", 0] },
  ],
}));
