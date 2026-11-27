// Count the Places. Skill 4.NBT.A.2-2.
// Comparing multi-digit numbers by place value: 98,765 is less than 123,456 because it has fewer digits. Comparing only the first digits is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Places",
  emoji: "🐋",
  premise: "Before comparing big numbers, count how many places each one has. More places means a bigger number.",
  outro: "A whole number with more digits is always greater. With the same number of digits, compare from the left.",
  scene: "ocean",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "How many digits does each number have? Check that first.",
  tag: "compares_first_digits_only",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["98,765 ___ 123,456", "<"], ["45,210 ___ 45,120", ">"]], extra: "=", trap: [0, ">"], why: "123,456 has six digits. It is in the hundred thousands.", win: "More digits, bigger number." },
    { say: "Three pairs. One pair is equal.", rows: [["706,000 ___ 706,000", "="], ["9,999 ___ 10,001", "<"], ["530,400 ___ 503,400", ">"]], trap: [1, ">"], why: "10,001 has five digits. 9,999 has only four.", win: "Equal, less than, greater than." },
    { say: "Place the signs by yourself.", rows: [["87,654 ___ 345,678", "<"], ["250,000 ___ 250,000", "="], ["61,900 ___ 61,090", ">"]], trap: [0, ">"] },
  ],
}));
