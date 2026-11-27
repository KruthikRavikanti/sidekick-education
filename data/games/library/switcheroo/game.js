// Switcheroo. Skill 1.OA.B.3-3.
// Subtraction is not commutative: the child sorts facts by whether switching the numbers keeps the answer. Treating 8 − 3 like 3 − 8 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Switcheroo",
  emoji: "🔀",
  premise: "Some facts work in any order and some do not. Sort the ones you can switch from the ones you cannot.",
  outro: "Adding works in any order. Taking away does not.",
  scene: "candy",
  kind: "sort",
  cast: "",
  hint: "Try it. 3 + 8 and 8 + 3 match. Can you take 8 away from 3?",
  tag: "switches_subtraction",
  rounds: [
    { say: "Can you switch the two numbers and get the same answer?", bins: "Can switch|Cannot switch", items: ["4 + 7|9 + 2|6 + 5", "8 − 3|9 − 4"], trap: ["8 − 3", 0], why: "8 take away 3 is 5. You cannot take 8 away from 3 the same way.", win: "Plus facts can switch. Minus facts cannot." },
    { say: "Are the two sides the same amount?", bins: "Same amount|Not the same", items: ["3 + 8 and 8 + 3|5 + 2 and 2 + 5", "8 − 3 and 3 − 8|9 − 1 and 1 − 9"], trap: ["8 − 3 and 3 − 8", 0], why: "8 − 3 is 5. But 3 − 8 is not 5.", win: "Only the plus pairs match." },
    { say: "Sort these by yourself.", bins: "Can switch|Cannot switch", items: ["2 + 9|7 + 6", "10 − 4|6 − 1|12 − 5"], trap: ["10 − 4", 0] },
  ],
}));
