// Guide Word Check. Skill L.3.2-6.
// Consulting reference materials, including dictionaries, to check and correct spellings. Never checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Guide Word Check",
  emoji: "📖",
  premise: "A dictionary page has two guide words at its head. Every word on that page falls between them in ABC order.",
  outro: "Use guide words and ABC order to find a word and check its spelling.",
  scene: "desk",
  kind: "sort",
  fs: 5.6,
  hint: "Does the word come after the first guide word and before the second?",
  tag: "never_checks",
  rounds: [
    { say: "The guide words are mouse and nest. Which words are on this page?", bins: "On this page|Not on it", items: ["much name near", "map new"], trap: ["new", 0], why: "New comes after nest: ne-s is before ne-w.", win: "Much, name and near fit between the guide words." },
    { say: "You want to check the spelling of necessary. Which page has it?", kind: "pick", yes: "nature to need|", no: "mad to mix|net to nut|oak to old", trap: "net to nut", why: "Nec comes before net. It is on the page before.", win: "Necessary falls between nature and need." },
    { say: "The guide words are spin and stop. Sort by yourself.", bins: "On this page|Not on it", items: ["splash star step", "spell story"], trap: ["story", 0] },
  ],
}));
