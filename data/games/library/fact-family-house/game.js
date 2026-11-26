// Fact Family House. Skill 1.OA.B.4-2.
// Fact families: the child picks the four true facts for three numbers. Facts with the whole in the place of a part are the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Family House",
  emoji: "🏡",
  premise: "Three numbers live together in a fact family. Tap every fact that truly belongs in their house.",
  outro: "A fact family uses the same three numbers, and the biggest one is always the whole.",
  scene: "meadow",
  kind: "pick",
  hint: "The biggest number is the whole. The two smaller ones add up to it.",
  tag: "whole_in_the_wrong_place",
  rounds: [
    { say: "Tap every true fact for this family.", q: "The family: 6, 7 and 13", yes: "6 + 7 = 13|7 + 6 = 13|13 − 6 = 7|13 − 7 = 6", no: "7 − 6 = 13|13 + 6 = 7", trap: "7 − 6 = 13", why: "13 is the whole. Taking 6 from 7 cannot make 13.", win: "Four facts, one family." },
    { say: "Tap every true fact for this family.", q: "The family: 5, 9 and 14", yes: "5 + 9 = 14|9 + 5 = 14|14 − 5 = 9|14 − 9 = 5", no: "9 − 5 = 14|14 + 5 = 9", trap: "9 − 5 = 14", why: "14 is the whole. It is what the two parts make together.", win: "All four facts found." },
    { say: "Tap every true fact for this family.", q: "The family: 8, 4 and 12", yes: "8 + 4 = 12|4 + 8 = 12|12 − 8 = 4|12 − 4 = 8", no: "8 − 4 = 12|12 + 4 = 8|4 − 8 = 12", trap: "8 − 4 = 12" },
  ],
}));
