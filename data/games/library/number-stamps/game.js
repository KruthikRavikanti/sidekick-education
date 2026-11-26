// Number Stamps. Skill K.CC.A.3-2.
// Writing teen numerals: the child builds the number from two digit stamps. Putting the digit you hear first (the 7 in seventeen) in front makes 71.
Sidekick.game(Sidekick.play({
  title: "Number Stamps",
  emoji: "🖋️",
  premise: "The owl says a teen number out loud. Stamp its two digits in the right order.",
  outro: "Teen numbers are written with the 1 first, even when you hear the other part first.",
  scene: "desk",
  kind: "row",
  cast: "🦉",
  hint: "Teen numbers start with a 1. The ones digit comes second.",
  tag: "reverses_teen_digits",
  rounds: [
    { say: "Stamp the number the owl says.", q: "fourteen", seq: "1 4", extra: "7", trap: "4 1", why: "That says forty-one. Fourteen is a 1, then a 4.", win: "Fourteen is 1 then 4." },
    { say: "Stamp the number the owl says.", q: "sixteen", seq: "1 6", extra: "9", trap: "6 1", why: "That says sixty-one. Sixteen is a 1, then a 6.", win: "Sixteen is 1 then 6." },
    { say: "Stamp this number by yourself.", alt: [{ q: "seventeen", seq: "1 7", extra: "4", trap: "7 1" }, { q: "nineteen", seq: "1 9", extra: "6", trap: "9 1" }, { q: "thirteen", seq: "1 3", extra: "8", trap: "3 1" }] },
  ],
}));
