// What an Outlier Does. Skill S-ID.A.3-2.
// Accounting for possible effects of extreme data points. Removing outliers without reason is the known slip.
Sidekick.game(Sidekick.play({
  title: "What an Outlier Does",
  emoji: "🎈",
  premise: "One extreme value can yank the mean a long way while the median barely moves. Do not throw it out without a reason.",
  outro: "Outliers pull the mean strongly and the median hardly at all. Remove one only if it is an error.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Add the values and divide for the mean. Find the middle one for the median.",
  tag: "removes_outliers_freely",
  rounds: [
    { say: "Salaries: 40, 42, 45, 48, 300 (thousands). What does the 300 do?", rows: [["to the mean", "pulls it up to 95"], ["to the median", "leaves it at 45"]], extra: "cuts it in half|", trap: [1, "pulls it up to 95"], why: "The median is the middle value, 45. The 300 does not move it.", win: "The mean jumps. The median holds." },
    { say: "When is it fair to remove an outlier?", kind: "sort", fs: 4.8, bins: "Fair reason|Not a reason", items: ["the value was a typing error|the scale was broken that day", "it spoils the average|it is simply the largest value"], trap: ["it spoils the average", 0], why: "Not liking a value is no reason. It may be real and important.", win: "Remove errors, not surprises." },
    { say: "Ages at a party: 8, 9, 9, 10, 64. Match by yourself.", rows: [["the mean", "jumps to 20"], ["the median", "stays at 9"]], extra: "stays at 10|drops to 8", trap: [0, "stays at 10"] },
  ],
}));
