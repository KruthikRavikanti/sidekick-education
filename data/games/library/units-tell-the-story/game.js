// Units Tell the Story. Skill N-Q.A.1-1.
// Using units as a way to understand problems and guide the solution. Dropping the units partway through is the known slip.
Sidekick.game(Sidekick.play({
  title: "Units Tell the Story",
  emoji: "⛽",
  premise: "Carry the units through a calculation the way you carry numbers. They tell you whether the answer makes sense.",
  outro: "Units multiply and divide like numbers: miles ÷ gallons gives miles per gallon.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Do the same operation to the units as to the numbers.",
  tag: "drops_units",
  rounds: [
    { say: "Work out each one with its units.", rows: [["96 miles ÷ 3 gallons", "32 miles per gallon"], ["60 miles ÷ 2 hours", "30 miles per hour"]], extra: "32 gallons per mile|", trap: [0, "32 gallons per mile"], why: "Miles were divided by gallons, so it is miles per gallon.", win: "The units follow the division." },
    { say: "Work out each one with its units.", rows: [["5 m/s × 10 s", "50 m"], ["$12 per hour × 3 hours", "$36"]], extra: "50 m/s|", trap: [0, "50 m/s"], why: "The seconds cancel: meters per second times seconds leaves meters.", win: "Seconds cancel. Hours cancel." },
    { say: "Work these out by yourself.", rows: [["150 words ÷ 3 minutes", "50 words per minute"], ["4 ft × 3 ft", "12 square feet"], ["$20 ÷ 4 tickets", "$5 per ticket"]], extra: "12 feet|", trap: [1, "12 feet"] },
  ],
}));
