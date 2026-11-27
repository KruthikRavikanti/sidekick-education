// What Matters in the Model. Skill N-Q.A.2-1.
// Defining appropriate quantities for the purpose of descriptive modeling. Modeling irrelevant quantities is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Matters in the Model",
  emoji: "🚗",
  premise: "Modeling starts by choosing which quantities matter for the question. Leave out the ones that do not affect the answer.",
  outro: "Define the quantities that actually affect what you are trying to find.",
  scene: "city",
  kind: "sort",
  fs: 5,
  hint: "Would changing this quantity change the answer?",
  tag: "irrelevant_quantities",
  rounds: [
    { say: "Goal: compare the yearly fuel cost of two cars. What matters?", bins: "Matters|Does not matter", items: ["miles per gallon|price of fuel|miles driven per year", "paint color|number of cup holders"], trap: ["paint color", 0], why: "Paint does not change how much fuel a car burns.", win: "Three quantities drive the cost." },
    { say: "Goal: decide how many buses a field trip needs. Sort the quantities.", bins: "Matters|Does not matter", items: ["number of students|seats per bus|number of adults", "color of the buses|the driver’s name"], trap: ["the driver’s name", 0], why: "A name does not change how many seats are needed.", win: "People and seats." },
    { say: "Goal: model how long a phone battery lasts. Sort by yourself.", bins: "Matters|Does not matter", items: ["battery capacity|screen brightness|hours of video", "case color|ringtone"], trap: ["case color", 0] },
  ],
}));
