// Asymptote Finder. Skill F-IF.C.7-4.
// Graphing rational functions, identifying zeros and asymptotes. Drawing the graph across a vertical asymptote is the known slip.
Sidekick.game(Sidekick.play({
  title: "Asymptote Finder",
  emoji: "🚧",
  premise: "A rational function has lines it approaches and never crosses where its denominator would be zero.",
  outro: "Vertical asymptote: where the denominator is 0. Horizontal asymptote: the value y approaches far out.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "What x makes the bottom zero? What does y approach when x is huge?",
  tag: "crosses_vertical_asymptote",
  rounds: [
    { say: "For f(x) = {1/x − 2}, find the asymptotes.", rows: [["vertical asymptote", "x = 2"], ["horizontal asymptote", "y = 0"]], extra: "x = −2|y = 2", trap: [0, "x = −2"], why: "x − 2 is zero when x is 2.", win: "x = 2 and y = 0." },
    { say: "True or not true about f(x) = {1/x − 2}?", kind: "sort", fs: 5, bins: "True|Not true", items: ["The graph never touches x = 2.|f(2) is undefined.|Near x = 2 the graph shoots up or down.", "The graph crosses x = 2.|f(2) = 0."], trap: ["The graph crosses x = 2.", 0], why: "At x = 2 you would divide by zero. There is no point there to cross.", win: "A vertical asymptote is a wall." },
    { say: "For f(x) = {3/x + 1} + 2, match by yourself.", rows: [["vertical asymptote", "x = −1"], ["horizontal asymptote", "y = 2"]], extra: "x = 1|y = 3", trap: [0, "x = 1"] },
  ],
}));
