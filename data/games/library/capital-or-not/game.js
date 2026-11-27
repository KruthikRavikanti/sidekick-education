// Capital or Not?. Skill L.4.2-1.
// Using correct capitalization. Capitalizing common nouns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Capital or Not?",
  emoji: "🗽",
  premise: "Proper nouns name one particular person, place or thing and get capitals. Common nouns like aunt, city and river do not, unless they are part of a name.",
  outro: "Capitalize proper nouns and the first word of a sentence. Leave common nouns lowercase.",
  scene: "city",
  kind: "pick",
  fs: 5.4,
  hint: "Is it the name of ONE particular place or person?",
  tag: "capitalizes_common_nouns",
  rounds: [
    { say: "Tap every word that needs a capital letter.", mark: "*my aunt lives in *new *york *city.", trap: "aunt", why: "Aunt here is a common noun. It is not being used as her name.", win: "My, New York City." },
    { say: "Tap every word that needs a capital letter.", mark: "*we crossed the river near *lake *tahoe in *july.", trap: "river", why: "River here is not part of a name, so it stays lowercase.", win: "We, Lake Tahoe, July." },
    { say: "Tap the words by yourself.", alt: [{ mark: "*last summer my uncle drove to *mount *rushmore.", trap: "uncle" }, { mark: "*our teacher, *mr. *ruiz, loves the ocean.", trap: "teacher," }] },
  ],
}));
