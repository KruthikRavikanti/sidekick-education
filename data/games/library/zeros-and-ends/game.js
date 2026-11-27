// Zeros and Ends. Skill F-IF.C.7-3.
// Graphing polynomial functions, identifying zeros and end behavior. Ignoring multiplicity is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zeros and Ends",
  emoji: "〽️",
  premise: "A factored polynomial shows its zeros directly. A repeated factor makes the graph touch the axis and turn back.",
  outro: "Each factor gives a zero. A squared factor touches without crossing. The leading term sets the end behavior.",
  scene: "paper",
  kind: "pick",
  fs: 6.4,
  hint: "Set each factor to zero. Is any factor squared?",
  tag: "ignores_multiplicity",
  rounds: [
    { say: "f(x) = x(x − 2)(x + 3). Tap its three zeros.", yes: "0 2 −3", no: "−2 3 6", trap: "−2", why: "x − 2 is zero when x is 2.", win: "Zeros at −3, 0 and 2." },
    { say: "For f(x) = (x − 1)^2 (x + 2), what does the graph do at each zero?", kind: "fill", fs: 5.2, cast: "", rows: [["at x = 1, from the squared factor", "touches and turns back"], ["at x = −2", "crosses the axis"]], extra: "never reaches the axis|", trap: [0, "crosses the axis"], why: "A squared factor keeps its sign on both sides, so the graph bounces off.", win: "A double zero bounces." },
    { say: "f(x) = x(x − 2)(x + 3) starts with x^3. Match its ends.", kind: "fill", fs: 5.6, cast: "", rows: [["far to the left", "falls"], ["far to the right", "rises"]], extra: "levels off|", trap: [0, "rises"], why: "A positive x^3 is very negative when x is very negative.", win: "Down on the left, up on the right." },
    { say: "f(x) = (x + 1)(x − 4)(x − 5). Tap its three zeros by yourself.", yes: "−1 4 5", no: "1 −4 −5 20", trap: "1" },
  ],
}));
