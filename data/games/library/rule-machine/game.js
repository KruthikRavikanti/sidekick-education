// Rule Machine. Skill 4.OA.C.5-1.
// Generating a number pattern from a rule: the rule is applied to the starting number, then to each new term. Ignoring the starting number is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rule Machine",
  emoji: "⚙️",
  premise: "Feed the machine a starting number and a rule. It prints the pattern one number at a time.",
  outro: "A rule and a starting number make the whole pattern.",
  scene: "desk",
  kind: "row",
  fs: 5,
  cast: "",
  hint: "Apply the rule to the starting number. Then apply it to each new number.",
  tag: "ignores_the_start",
  rounds: [
    { say: "Build the next four numbers.", q: "Rule: start at 3, add 4.", seq: "7 11 15 19", extra: "4 8 12 16", trap: "4 8 12 16", why: "The pattern starts at 3. Add 4 to 3 to get the first new number.", win: "7, 11, 15, 19." },
    { say: "Build the next four numbers.", q: "Rule: start at 50, subtract 6.", seq: "44 38 32 26", extra: "56 62 68 74", trap: "56 62 68 74", why: "The rule says subtract. The numbers should get smaller.", win: "44, 38, 32, 26." },
    { say: "Build the pattern by yourself.", alt: [{ q: "Rule: start at 2, multiply by 3.", seq: "6 18 54 162", extra: "5 8 11 14", trap: "5 8 11 14" }, { q: "Rule: start at 5, add 9.", seq: "14 23 32 41", extra: "9 18 27 36", trap: "9 18 27 36" }] },
  ],
}));
