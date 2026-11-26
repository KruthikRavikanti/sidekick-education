// Treasure Pairs. Skill K.OA.A.3-2.
// Finding several ways to split the same number: the child picks every pair that makes the total, so the parts must really add to the whole.
Sidekick.game(Sidekick.play({
  title: "Treasure Pairs",
  emoji: "💎",
  premise: "The treasure chest only opens for pairs of numbers that make the secret total. Find them all.",
  outro: "One number can be made in many different ways.",
  scene: "sand",
  kind: "pick",
  cast: "🏴‍☠️",
  hint: "Add the two numbers. Do they make the total?",
  tag: "parts_do_not_make_whole",
  rounds: [
    { say: "Tap every pair that makes 5.", yes: "4 + 1|3 + 2|5 + 0", no: "3 + 3|4 + 2", trap: "4 + 2", why: "4 and 2 make 6, not 5.", win: "Three ways to make 5!" },
    { say: "Tap every pair that makes 6.", yes: "5 + 1|4 + 2|3 + 3", no: "4 + 3|5 + 2|2 + 3", trap: "4 + 3", why: "4 and 3 make 7, not 6.", win: "Three ways to make 6!" },
    { say: "Tap every pair that makes 7.", yes: "6 + 1|5 + 2|4 + 3", no: "5 + 3|4 + 2|6 + 2", trap: "5 + 3" },
  ],
}));
