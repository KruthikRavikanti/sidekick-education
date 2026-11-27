// Point and Evidence. Skill RI.4.8-1.
// Explaining how an author uses reasons and evidence to support particular points. Listing evidence without linking it to the point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Point and Evidence",
  emoji: "♻️",
  premise: "Authors back up each point with reasons and evidence. Link each piece of evidence to the point it supports.",
  outro: "Evidence only counts when it supports the particular point being made.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Which point does that evidence prove?",
  tag: "does_not_link_evidence",
  rounds: [
    { say: "Link each piece of evidence to the point it supports.", rows: [["Recycling one can saves enough energy to run a TV for three hours.", "Recycling saves energy."], ["Landfills in our state will be full in ten years.", "We are running out of space for trash."]], extra: "Cans are shiny.|", trap: [0, "We are running out of space for trash."], why: "That evidence is about energy, not space.", win: "Each fact backs its own point." },
    { say: "Link each piece of evidence to its point.", rows: [["Kids who eat breakfast score higher on tests.", "Breakfast helps learning."], ["Students who skip it feel tired by ten.", "Skipping breakfast drains energy."]], extra: "Breakfast is tasty.|", trap: [1, "Breakfast is tasty."], why: "Tasty is an opinion. Which point is about energy?", win: "Evidence linked to its point." },
    { say: "Link these by yourself.", rows: [["Trees lower street temperatures by up to ten degrees.", "Trees cool cities."], ["One tree absorbs 48 pounds of carbon a year.", "Trees clean the air."]], extra: "Trees are green.|Cities are big.", trap: [0, "Trees clean the air."] },
  ],
}));
