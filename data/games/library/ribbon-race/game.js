// Ribbon Race. Skill 2.MD.A.4-1.
// Finding how much longer one object is than another: the difference is the missing part of the bar. Adding the two lengths is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ribbon Race",
  emoji: "🎀",
  premise: "Two ribbons lie side by side. Key in how much longer one is than the other.",
  outro: "How much longer is the difference between the two lengths.",
  scene: "candy",
  kind: "type",
  hint: "Line them up at one end. How far does the longer one stick out?",
  tag: "adds_the_lengths",
  rounds: [
    { say: "How much longer is the red ribbon? Key it in.", q: "The red ribbon is 15 inches. The blue ribbon is 9 inches.", view: { type: "tape", top: [15], bottom: [9, "x"], names: ["red", "blue"] }, ans: 6, trap: 24, why: "That is both ribbons added. How much longer is only the extra part.", win: "Red is 6 inches longer." },
    { say: "How much longer is the green rope?", q: "The green rope is 20 feet. The yellow rope is 12 feet.", view: { type: "tape", top: [20], bottom: [12, "x"], names: ["green", "yellow"] }, ans: 8, trap: 32, why: "That is both ropes added. Find only the extra part.", win: "Green is 8 feet longer." },
    { say: "Find the difference by yourself.", alt: [{ q: "A snake is 18 inches. A lizard is 11 inches. How much longer is the snake?", view: { type: "tape", top: [18], bottom: [11, "x"], names: ["snake", "lizard"] }, ans: 7, trap: 29 }, { q: "A bus is 25 feet. A van is 16 feet. How much longer is the bus?", view: { type: "tape", top: [25], bottom: [16, "x"], names: ["bus", "van"] }, ans: 9, trap: 41 }] },
  ],
}));
