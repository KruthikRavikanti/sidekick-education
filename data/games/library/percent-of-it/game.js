// Percent of It. Skill 6.RP.A.3-4.
// Finding a percent of a quantity as a rate per 100. Thinking 30% of 50 is 30 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Percent of It",
  emoji: "💯",
  premise: "Percent means per hundred. 30% of 50 is 30 for every 100, so it is less than 30.",
  outro: "To find a percent of a number, multiply by the percent written over 100.",
  scene: "city",
  kind: "type",
  icon: "💯",
  hint: "10% is one tenth. Find 10% first, then build up.",
  tag: "percent_is_the_number",
  rounds: [
    { say: "Key in the answer.", q: "What is 30% of 50?", ans: 15, trap: 30, why: "30 would be 30% of 100. Half of that amount is 50, so take half of 30.", win: "10% of 50 is 5, so 30% is 15." },
    { say: "Key in this one.", q: "What is 25% of 80?", ans: 20, trap: 25, why: "25% is one quarter. One quarter of 80 is 20.", win: "80 ÷ 4 = 20." },
    { say: "Key in the answer by yourself.", alt: [{ q: "What is 40% of 60?", ans: 24, trap: 40 }, { q: "What is 15% of 200?", ans: 30, trap: 15 }, { q: "What is 75% of 40?", ans: 30, trap: 75 }] },
  ],
}));
