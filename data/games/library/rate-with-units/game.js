// Rate With Units. Skill 7.RP.A.1-2.
// Interpreting the unit rate in context with correct units. Giving the rate with the units reversed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rate With Units",
  emoji: "🚿",
  premise: "A rate is not finished until it has units. Say what is being counted per one of what.",
  outro: "A unit rate names both units: tanks per hour, not hours per tank.",
  scene: "kitchen",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "What happens in ONE hour or ONE minute? Name that amount first.",
  tag: "reversed_units",
  rounds: [
    { say: "Match each situation to its unit rate.", rows: [["{2/3} tank in {1/6} hour", "4 tanks per hour"], ["{1/2} mile in {1/4} hour", "2 miles per hour"]], extra: "4 hours per tank|", trap: [0, "4 hours per tank"], why: "In one hour the hose fills 4 tanks. The tanks come first.", win: "Tanks per hour, miles per hour." },
    { say: "Match these.", rows: [["{3/4} page in {1/4} minute", "3 pages per minute"], ["{1/2} gallon in {1/8} hour", "4 gallons per hour"]], extra: "3 minutes per page|", trap: [0, "3 minutes per page"], why: "In one minute, 3 pages are printed.", win: "Pages per minute, gallons per hour." },
    { say: "Match these by yourself.", rows: [["{2/5} mile in {1/10} hour", "4 miles per hour"], ["{5/6} cup in {1/6} minute", "5 cups per minute"]], extra: "4 hours per mile|5 minutes per cup", trap: [0, "4 hours per mile"] },
  ],
}));
