// Dictionary Check. Skill L.2.2-5.
// Consulting reference materials, including beginning dictionaries, to check and correct spellings. Never checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dictionary Check",
  emoji: "📔",
  premise: "When you are not sure how to spell a word, look it up. A dictionary lists words in ABC order.",
  outro: "Check spelling in a dictionary: words are in alphabetical order by first letter, then second.",
  scene: "desk",
  kind: "row",
  fs: 6,
  hint: "Look at the first letter. If they match, look at the next letter.",
  tag: "never_checks",
  rounds: [
    { say: "Put the words in dictionary order.", seq: "apple because cat dog", trap: "because apple cat dog", why: "A comes before b in the alphabet.", win: "A, b, c, d." },
    { say: "These all start with b. Use the second letter.", seq: "bat because big box", trap: "because bat big box", why: "All start with b. Now compare the second letters: a comes before e.", win: "Ba, be, bi, bo." },
    { say: "Put these in dictionary order by yourself.", alt: [{ seq: "said school ship stop", trap: "school said ship stop" }, { seq: "tail their they tree", trap: "their tail they tree" }, { seq: "paper people pig play", trap: "people paper pig play" }] },
  ],
}));
