// Say It in Context. Skill S-ID.A.3-1.
// Interpreting differences in shape, center and spread in the context of the data sets. Stating numbers without meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say It in Context",
  emoji: "💬",
  premise: "A difference in statistics should be put into words about the real situation, without claiming more than it shows.",
  outro: "Interpret differences in center and spread in terms of what was measured.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "A median describes a typical member, not every member.",
  tag: "numbers_without_meaning",
  rounds: [
    { say: "Put each difference into words.", rows: [["Class A median 85, Class B median 70", "a typical A student scored 15 points higher"], ["Class A IQR 5, Class B IQR 20", "B scores vary much more"]], extra: "every A student beat every B student|", trap: [0, "every A student beat every B student"], why: "A median compares typical students. Some B students may still score higher.", win: "Typical, not every." },
    { say: "Put each difference into words.", rows: [["Brand X mean life 40 h, Brand Y 30 h", "X lasts about 10 h longer on average"], ["X range 5 h, Y range 25 h", "Y is much less predictable"]], extra: "X always lasts longer|", trap: [0, "X always lasts longer"], why: "On average is not always. Y’s wide range means some Y batteries outlast X.", win: "Average and consistency." },
    { say: "Match these by yourself.", rows: [["City A median rent $900, City B $1,200", "typical rent is $300 higher in B"], ["A IQR $100, B IQR $600", "rents in B are far more varied"]], extra: "all rents in B are higher|B costs $300 in total", trap: [0, "all rents in B are higher"] },
  ],
}));
