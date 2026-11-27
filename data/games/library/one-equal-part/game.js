// One Equal Part. Skill 3.NF.A.1-1.
// A unit fraction is one of b equal parts: pictures with the right number of parts but unequal sizes are the known slip.
Sidekick.game(Sidekick.play({
  title: "One Equal Part",
  emoji: "🧀",
  premise: "A fraction only counts when all the parts are the same size. Find the pictures that really show the fraction.",
  outro: "One half, one third and one fourth each mean one of that many EQUAL parts.",
  scene: "kitchen",
  kind: "pick",
  cast: "",
  hint: "Count the parts, then check that every part is the same size.",
  tag: "counts_unequal_parts",
  rounds: [
    { say: "Tap every picture with exactly one half shaded.", yes: "~pie:1/2 ~bar:1/2 ~sqcut:d:1", no: "~sqcut:u:1 ~barU:2:1 ~pie:1/3", trap: "~sqcut:u:1", why: "The two parts are not equal, so the shaded part is not one half.", win: "One of two equal parts." },
    { say: "Tap every picture with exactly one fourth shaded.", yes: "~pie:1/4 ~bar:1/4 ~sq4:1/4 ~sqcut:x:1", no: "~barU:4:1 ~pie:1/3 ~bar:2/4", trap: "~barU:4:1", why: "It has 4 parts, but they are not the same size.", win: "One of four equal parts." },
    { say: "Tap every picture with exactly one third shaded.", yes: "~pie:1/3 ~bar:1/3 ~sqcut:t:1 ~sqcut:w:1", no: "~barU:3:1 ~pie:1/4 ~bar:2/3", trap: "~barU:3:1" },
  ],
}));
