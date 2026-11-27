// Odd Plurals. Skill L.2.1-2.
// Forming and using frequently occurring irregular plural nouns. Writing foots and childs is the known slip.
Sidekick.game(Sidekick.play({
  title: "Odd Plurals",
  emoji: "🦷",
  premise: "Most words add s to mean more than one. A few change in their own special way.",
  outro: "Some plurals are irregular: feet, children, teeth, mice.",
  scene: "candy",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Say it out loud. Which one have you heard people say?",
  tag: "adds_s_to_irregulars",
  rounds: [
    { say: "Drop in the word for more than one.", rows: [["one foot, two ___", "feet"], ["one child, two ___", "children"]], extra: "foots childs", trap: [0, "foots"], why: "Foot does not add s. It changes to feet.", win: "Feet and children." },
    { say: "Drop in these plurals.", rows: [["one tooth, two ___", "teeth"], ["one mouse, two ___", "mice"], ["one man, two ___", "men"]], extra: "tooths mouses", trap: [1, "mouses"], why: "Mouse changes to mice.", win: "Teeth, mice and men." },
    { say: "Drop in the plurals by yourself.", rows: [["one goose, two ___", "geese"], ["one woman, two ___", "women"], ["one fish, two ___", "fish"]], extra: "gooses fishes", trap: [0, "gooses"] },
  ],
}));
