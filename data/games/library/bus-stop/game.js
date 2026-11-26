// Bus Stop. Skill K.OA.A.2-1.
// Add-to and take-from stories: the number line is the number of riders, so getting on moves up and getting off moves down. Adding in a take-away story overshoots.
Sidekick.game(Sidekick.play({
  title: "Bus Stop",
  emoji: "🚌",
  premise: "Riders get on the bus and riders get off. Slide the bus to show how many are riding now.",
  outro: "Getting on makes more riders. Getting off makes fewer.",
  scene: "city",
  kind: "line",
  cast: "🚏 🏢 🌳 🏬",
  hint: "Did riders get on or get off? Getting off makes the number go down.",
  tag: "adds_in_take_away_story",
  line: [0, 12, 1, 1],
  icon: "🚌",
  rounds: [
    { say: "4 riders are on the bus. 3 more get on. Slide the bus to how many ride now.", from: 4, ans: 7, trap: 1, why: "Riders got on, so the number goes up.", win: "4 and 3 more make 7 riders." },
    { say: "8 riders are on the bus. 3 get off. Slide the bus to how many ride now.", from: 8, ans: 5, trap: 11, why: "Riders got off, so the number goes down.", win: "8 take away 3 leaves 5 riders." },
    { say: "Slide the bus by yourself.", alt: [{ say: "7 riders are on the bus. 2 get off. Slide the bus to how many ride now.", from: 7, ans: 5, trap: 9 }, { say: "6 riders are on the bus. 4 get off. Slide the bus to how many ride now.", from: 6, ans: 2, trap: 10 }, { say: "9 riders are on the bus. 3 get off. Slide the bus to how many ride now.", from: 9, ans: 6, trap: 12 }] },
  ],
}));
