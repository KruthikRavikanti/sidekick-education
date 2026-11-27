// Fence Off the Extra. Skill L.6.2-1.
// Using commas, parentheses or dashes to set off nonrestrictive elements. Leaving them out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fence Off the Extra",
  emoji: "🚧",
  premise: "Extra information that could be lifted out of a sentence gets a comma on each side, like a pair of fences.",
  outro: "Set off nonrestrictive information with a pair of commas (or parentheses or dashes).",
  scene: "paper",
  kind: "pick",
  fs: 5.6,
  hint: "Which words could be lifted out? Put a comma before and after them.",
  tag: "omits_paired_commas",
  rounds: [
    { say: "Tap the two commas that fence off the extra information.", mark: "My brother *, who is ten *, loves , chess.", trap: "-,", why: "The extra part needs a comma on BOTH sides.", win: "My brother, who is ten, loves chess." },
    { say: "Tap the two commas that belong.", mark: "Mrs. Lee *, our coach *, blew , the whistle.", trap: "-,", why: "Our coach can be lifted out. Fence it on both sides.", win: "Mrs. Lee, our coach, blew the whistle." },
    { say: "Tap the two commas that belong by yourself.", mark: "The old bridge *, which was built in 1900 *, is , closing soon.", trap: "-," },
  ],
}));
