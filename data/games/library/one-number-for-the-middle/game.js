// One Number for the Middle. Skill 6.SP.A.3-1.
// Recognizing that a measure of center summarizes all values with a single number. Thinking the mean is the most common value is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Number for the Middle",
  emoji: "🎯",
  premise: "A measure of center sums up a whole data set with one number. The mean is the fair share, not the most common value.",
  outro: "The mean is the fair-share value. It does not have to be the most common value, or even in the data.",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "Mean is what each would get if everything were shared out evenly.",
  tag: "mean_is_most_common",
  rounds: [
    { say: "Read the note. True or not true?", q: "Scores: 6, 7, 8, 9, 10 · mean 8", bins: "True|Not true", items: ["One number sums up all 5 scores|Shared out evenly, each gets 8", "Most scores were exactly 8|The mean is the most common score"], trap: ["Most scores were exactly 8", 0], why: "Only one score is 8. The mean is the fair share, not the most common.", win: "The mean is a fair share." },
    { say: "True or not true?", q: "Pets: 0, 1, 1, 2, 6 · mean 2 · median 1", bins: "True|Not true", items: ["The median 1 is the middle value|The mean 2 is the fair share", "Every home has 2 pets|The mean is the value seen most"], trap: ["The mean is the value seen most", 0], why: "The value seen most is 1. The mean is 2.", win: "Mean and median are both measures of center." },
    { say: "Sort these by yourself.", q: "Goals: 1, 1, 2, 4, 7 · mean 3", bins: "True|Not true", items: ["Shared evenly, each game gets 3|One number describes the center", "The team scored 3 most often|3 must be one of the data values"], trap: ["The team scored 3 most often", 0] },
  ],
}));
