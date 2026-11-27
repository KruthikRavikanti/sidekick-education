// One Spelling, Two Words. Skill L.5.5-3.
// Using the relationship between particular words (synonyms, antonyms, homographs) to better understand each of the words. Confusing homographs is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Spelling, Two Words",
  emoji: "🎸",
  premise: "Homographs are spelled the same but mean different things, like bass the fish and bass the low sound.",
  outro: "Use the sentence to tell which meaning of a homograph is intended.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Which meaning makes sense in this sentence?",
  tag: "confuses_homographs",
  rounds: [
    { say: "Which meaning of bass fits each sentence?", rows: [["He caught a bass in the lake.", "a kind of fish"], ["She plays bass in the band.", "a low-sounding instrument"]], extra: "a kind of drum|", trap: [1, "a kind of fish"], why: "You do not play a fish in a band. This bass is an instrument.", win: "Same spelling, two meanings." },
    { say: "Which meaning fits each sentence?", rows: [["A tear rolled down her cheek.", "a drop from the eye"], ["Do not tear the page.", "to rip"], ["The bow on the gift was red.", "a tied ribbon"]], trap: [1, "a drop from the eye"], why: "You cannot do a drop to a page. This tear means to rip.", win: "Homographs sorted by context." },
    { say: "Match the meanings by yourself.", rows: [["The dove flew away.", "a bird"], ["She dove into the pool.", "jumped in headfirst"], ["Please close the door.", "to shut"], ["Stand close to me.", "near"]], trap: [1, "a bird"] },
  ],
}));
