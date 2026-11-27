// Unit Fraction Tags. Skill 3.G.A.2-2.
// Naming each equal part as a unit fraction of the whole: one of eight equal parts is 1/8. Naming the part by the count of parts (8) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Unit Fraction Tags",
  emoji: "🎫",
  premise: "One equal part of each shape is shaded. Give the shaded part its fraction name.",
  outro: "One of b equal parts is the fraction 1 over b.",
  scene: "candy",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Count all the equal parts. The shaded one is 1 out of that many.",
  tag: "names_the_count_not_the_fraction",
  rounds: [
    { say: "Drag the fraction for the shaded part.", rows: [["~bar:1/3", "{1/3}"], ["~pie:1/6", "{1/6}"]], extra: "3 6", trap: [0, "3"], why: "The shape has 3 equal parts. One part is one third.", win: "One third and one sixth." },
    { say: "Three shapes to tag.", rows: [["~pie:1/8", "{1/8}"], ["~bar:1/6", "{1/6}"], ["~sqcut:x:1", "{1/4}"]], extra: "8", trap: [0, "8"], why: "There are 8 equal parts. One of them is one eighth.", win: "One eighth, one sixth, one fourth." },
    { say: "Tag these by yourself.", rows: [["~pie:1/8", "{1/8}"], ["~sqcut:q:1", "{1/4}"], ["~bar:1/2", "{1/2}"]], extra: "8 4", trap: [0, "8"] },
  ],
}));
