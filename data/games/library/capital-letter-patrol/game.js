// Capital Letter Patrol. Skill L.1.2-1.
// Capitalizing dates and names of people. Leaving names in lowercase is the known slip.
Sidekick.game(Sidekick.play({
  title: "Capital Letter Patrol",
  emoji: "🚓",
  premise: "Names of people, days and months get a capital letter. So does the first word of a sentence.",
  outro: "Capitalize names, days, months and the first word of every sentence.",
  scene: "city",
  kind: "pick",
  fs: 5.6,
  hint: "Is it a name, a day or a month? Is it the first word?",
  tag: "lowercases_names",
  rounds: [
    { say: "Tap every word that needs a capital letter.", mark: "*my friend *sam came on *monday.", trap: "-sam", why: "Sam is the name of a person. Names get a capital letter.", win: "My, Sam and Monday." },
    { say: "Tap every word that needs a capital letter.", mark: "*we saw *ana in *june.", trap: "-june.", why: "June is the name of a month. It gets a capital letter.", win: "We, Ana and June." },
    { say: "Tap the words by yourself.", alt: [{ mark: "*on *friday *ben will play.", trap: "-ben" }, { mark: "*my dog *max was born in *may.", trap: "-max" }, { mark: "*did *kim come on *sunday?", trap: "-kim" }] },
  ],
}));
