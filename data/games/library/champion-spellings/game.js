// Champion Spellings. Skill L.11-12.2-2.
// Spelling correctly. Errors in advanced, commonly misspelled words are the known slip.
Sidekick.game(Sidekick.play({
  title: "Champion Spellings",
  emoji: "🏅",
  premise: "The hardest spellings hide silent letters and unexpected doubles. Find the trap in each word.",
  outro: "Spell correctly, checking doubled letters and silent vowels in difficult words.",
  scene: "desk",
  kind: "pick",
  fs: 5,
  hint: "Look for the doubled letter or the hidden vowel.",
  tag: "spelling_error",
  rounds: [
    { say: "Tap the four correctly spelled words.", yes: "conscientious liaison questionnaire supersede", no: "concientious liason questionaire supercede", trap: "supercede", why: "Supersede ends in -sede. It is the only English word that does.", win: "sc, two i’s, double n, -sede." },
    { say: "Tap the four correctly spelled words.", yes: "accommodate millennium perseverance bureaucracy", no: "accomodate millenium perserverance beaurocracy", trap: "accomodate", why: "Accommodate has room for two c’s and two m’s.", win: "Double c and m, double l and n." },
    { say: "Tap the four correctly spelled words by yourself.", yes: "pronunciation occasionally harass threshold", no: "pronounciation occassionally harrass threshhold", trap: "pronounciation" },
  ],
}));
