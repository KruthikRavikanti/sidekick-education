// Capital Places and Days. Skill L.2.2-1.
// Capitalizing holidays, product names and geographic names. Lowercasing proper nouns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Capital Places and Days",
  emoji: "🗽",
  premise: "Special names get capital letters: holidays, places on the map, and the names of products.",
  outro: "Capitalize holidays, product names and geographic names.",
  scene: "city",
  kind: "pick",
  fs: 5.6,
  hint: "Is it the name of one special place, holiday or product?",
  tag: "lowercases_proper_nouns",
  rounds: [
    { say: "Tap every word that needs a capital letter.", mark: "*we went to *florida on *thanksgiving.", trap: "-florida", why: "Florida is the name of a place on the map.", win: "We, Florida and Thanksgiving." },
    { say: "Tap every word that needs a capital letter.", mark: "*my aunt lives in *texas near the *red *river.", trap: "-river.", why: "Red River is the full name of the river. Both words get capitals.", win: "My, Texas and Red River." },
    { say: "Tap the words by yourself.", alt: [{ mark: "*on *halloween we ate *crunchies cereal.", trap: "-crunchies" }, { mark: "*i saw *lake *erie in *ohio.", trap: "-lake" }] },
  ],
}));
