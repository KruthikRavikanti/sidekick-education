// Tough Spellings. Skill L.9-10.2-3.
// Spelling correctly. Errors in commonly misspelled words are the known slip.
Sidekick.game(Sidekick.play({
  title: "Tough Spellings",
  emoji: "🐝",
  premise: "Some words trip nearly everyone: doubled letters, silent letters, sneaky vowels. Learn the hard spot in each.",
  outro: "Spell correctly: check doubled consonants and unstressed vowels.",
  scene: "desk",
  kind: "pick",
  fs: 5,
  hint: "Say the word slowly and look for doubled letters.",
  tag: "spelling_error",
  rounds: [
    { say: "Tap the four correctly spelled words.", yes: "exaggerate maintenance occurrence acknowledgment", no: "exagerate maintainance occurence acknowlegment", trap: "occurence", why: "Occurrence doubles both the c and the r.", win: "Double g, -ten-, double c and r, -ledg-." },
    { say: "Tap the four correctly spelled words.", yes: "conscience rhythm privilege necessary", no: "concience rythm privelege neccessary", trap: "neccessary", why: "Necessary has one c and two s’s.", win: "One collar, two sleeves: necessary." },
    { say: "Tap the four correctly spelled words by yourself.", yes: "separate definitely embarrass recommend", no: "seperate definately embarass reccomend", trap: "seperate" },
  ],
}));
