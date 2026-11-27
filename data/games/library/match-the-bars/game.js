// Match the Bars. Skill 2.OA.A.1-3.
// Drawing a bar model for a story: the child sizes the unknown part so the two parts match the whole bar. A bar that does not match the quantities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Match the Bars",
  emoji: "🟦",
  premise: "A bar model shows a whole and its parts. Stretch the missing part until the parts match the whole.",
  outro: "In a bar model, the parts together are as long as the whole.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "The bottom row must end exactly where the whole bar ends.",
  tag: "bars_do_not_match",
  rounds: [
    { say: "62 kids in all. 35 are girls and the rest are boys. Stretch the boys bar to fit.", dials: [["Boys", 0, 60, 1, 20]], view: { type: "tape", top: [62], bottom: [35, "x"], names: ["all the kids", "girls and boys"] }, ans: [27], trap: [35], why: "The parts are longer than the whole now. Girls and boys together must match 62.", win: "35 and 27 make 62." },
    { say: "48 marbles in all. 30 are red and the rest are blue. Stretch the blue bar to fit.", dials: [["Blue", 0, 60, 1, 10]], view: { type: "tape", top: [48], bottom: [30, "x"], names: ["all the marbles", "red and blue"] }, ans: [18], trap: [30], why: "Red and blue together must be as long as the whole bar, 48.", win: "30 and 18 make 48." },
    { say: "Fit the bar by yourself.", alt: [{ say: "75 pages in all. 40 are read and the rest are not. Stretch the bar for the rest.", dials: [["The rest", 0, 60, 1, 25]], view: { type: "tape", top: [75], bottom: [40, "x"], names: ["all the pages", "read and the rest"] }, ans: [35], trap: [40] }, { say: "54 fish in all. 22 are gold and the rest are blue. Stretch the blue bar to fit.", dials: [["Blue", 0, 60, 1, 20]], view: { type: "tape", top: [54], bottom: [22, "x"], names: ["all the fish", "gold and blue"] }, ans: [32], trap: [22] }] },
  ],
}));
