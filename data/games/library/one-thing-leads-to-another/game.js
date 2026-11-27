// One Thing Leads to Another. Skill W.9-10.3-3.
// Using a variety of techniques to sequence events so that they build on one another. Writing a disjointed sequence is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Thing Leads to Another",
  emoji: "🧵",
  premise: "In a well-built story each event grows from the one before it, so the whole thing holds together.",
  outro: "Sequence events so they build on one another into a coherent whole.",
  scene: "night",
  kind: "row",
  fs: 4.4,
  hint: "Which event makes the next one possible?",
  tag: "disjointed",
  rounds: [
    { say: "Put the story in an order where each event causes the next.", seq: "Kai finds a cracked phone on the bus.|He charges it and sees a photo of a dog.|He posts the photo at the bus stop.|The owner calls that night.", trap: "Kai finds a cracked phone on the bus.|He posts the photo at the bus stop.|He charges it and sees a photo of a dog.|The owner calls that night.", why: "He cannot post a photo he has not seen yet. Charging comes first.", win: "Each step sets up the next." },
    { say: "Put this story in order.", seq: "The power goes out during the storm.|Rosa lights her grandmother’s old lamp.|By its light she notices a loose floorboard.|Under it lies a tin of letters.", trap: "Rosa lights her grandmother’s old lamp.|The power goes out during the storm.|By its light she notices a loose floorboard.|Under it lies a tin of letters.", why: "The lamp is lit because the power went out.", win: "Cause, then effect." },
    { say: "Put this story in order by yourself.", seq: "Amara oversleeps on race day.|She sprints to the track without her spikes.|A rival lends her a spare pair.|They cross the line side by side.", trap: "She sprints to the track without her spikes.|Amara oversleeps on race day.|A rival lends her a spare pair.|They cross the line side by side." },
  ],
}));
