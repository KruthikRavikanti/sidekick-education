// Spelling Final Round. Skill L.8.2-3.
// Spelling correctly. Spelling errors in common hard words are the known slip.
Sidekick.game(Sidekick.play({
  title: "Spelling Final Round",
  emoji: "🏅",
  premise: "These are the words that still catch careful writers. Know their hidden letters.",
  outro: "Master commonly misspelled words: conscience, definitely, privilege, necessary.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Find the tricky spot: a silent letter, or a double letter.",
  tag: "spelling_errors",
  rounds: [
    { say: "Which are spelled correctly?", bins: "Spelled right|Needs fixing", items: ["conscience|definitely|privilege", "consience|definitly|privelege"], trap: ["definitly", 0], why: "Definitely has finite inside it: de-finite-ly.", win: "Conscience, definitely, privilege." },
    { say: "Sort these.", bins: "Spelled right|Needs fixing", items: ["necessary|occurred|maintenance", "neccessary|occured|maintainance"], trap: ["occured", 0], why: "Occurred doubles both the c and the r.", win: "Necessary, occurred, maintenance." },
    { say: "Sort these by yourself.", bins: "Spelled right|Needs fixing", items: ["exaggerate|government|guarantee", "exagerate|goverment|garantee"], trap: ["goverment", 0] },
  ],
}));
