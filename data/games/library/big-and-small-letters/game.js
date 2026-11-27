// Big and Small Letters. Skill L.K.1-1.
// Printing upper- and lowercase letters: letters are sorted by case and a name is built with correct capitalization. Mixing upper and lowercase at random is the known slip.
Sidekick.game(Sidekick.play({
  title: "Big and Small Letters",
  emoji: "🅰️",
  premise: "Every letter comes in two sizes: uppercase and lowercase. A name starts with an uppercase letter.",
  outro: "Names start with an uppercase letter. The rest of the letters are lowercase.",
  scene: "candy",
  kind: "sort",
  fs: 8,
  hint: "Uppercase letters are the tall, big ones.",
  tag: "mixes_cases",
  rounds: [
    { say: "Sort the letters.", bins: "Uppercase|Lowercase", items: ["A M S", "a m s"], trap: ["s", 0], why: "Small s looks like big S, only shorter. This one is the small one.", win: "Big letters and small letters." },
    { say: "Build the name Sam. Names start with an uppercase letter.", kind: "row", seq: "S a m", extra: "s A M", trap: "s a m", why: "A name starts with an uppercase letter.", win: "Sam, with a big S." },
    { say: "Build the name by yourself.", kind: "row", alt: [{ say: "Build the name Ben by yourself.", seq: "B e n", extra: "b E N", trap: "b e n" }, { say: "Build the name Kit by yourself.", seq: "K i t", extra: "k I T", trap: "k i t" }] },
  ],
}));
