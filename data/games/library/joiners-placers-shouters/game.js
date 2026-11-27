// Joiners, Placers, Shouters. Skill L.5.1-1.
// Explaining the function of conjunctions, prepositions and interjections. Not being able to name their functions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Joiners, Placers, Shouters",
  emoji: "🌉",
  premise: "Conjunctions join. Prepositions show where or when. Interjections burst out with feeling.",
  outro: "Conjunctions connect, prepositions relate a noun to the rest, and interjections express emotion.",
  scene: "city",
  kind: "sort",
  fs: 5.4,
  hint: "Does it join, show position or time, or shout a feeling?",
  tag: "cannot_name_functions",
  rounds: [
    { say: "In Wow! We ran under the bridge and over the hill, sort the words.", bins: "Conjunction|Preposition|Interjection", items: ["and", "under over", "Wow!"], trap: ["and", 1], why: "And joins two parts. A word that joins is a conjunction.", win: "A joiner, two placers and a shouter." },
    { say: "Sort these words.", bins: "Conjunction|Preposition|Interjection", items: ["but or because", "across during beside", "Ouch! Hooray!"], trap: ["during", 0], why: "During tells when something happens in relation to a noun. It is a preposition.", win: "Three jobs, three groups." },
    { say: "Sort these by yourself.", bins: "Conjunction|Preposition|Interjection", items: ["so although", "between through above", "Oops! Yikes!"], trap: ["although", 1] },
  ],
}));
