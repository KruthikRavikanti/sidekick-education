// Mouse and Bird Trips. Skill RL.1.9-1.
// Comparing and contrasting the adventures and experiences of characters in stories. Only listing similarities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mouse and Bird Trips",
  emoji: "🐭",
  premise: "Two characters go on trips. Find what is alike about their trips, and what is different.",
  outro: "To compare two stories, tell how they are alike AND how they are different.",
  scene: "forest",
  kind: "sort",
  hint: "Is it true for both, or for just one?",
  tag: "only_lists_similarities",
  rounds: [
    { say: "Read both stories. Who did each thing?", read: "Mouse went to the city. He rode a bus and got lost. / Bird went to the city. She flew and found a park.", bins: "Both|Only Mouse|Only Bird", items: ["went to the city|", "rode a bus|got lost", "found a park|"], trap: ["got lost", 0], why: "Only Mouse got lost. Bird found a park.", win: "One thing alike, three things different." },
    { say: "Read both stories. Sort what happened.", read: "Cat looked for food. She found fish by the dock. / Dog looked for food. He found a bone in the yard.", bins: "Both|Only Cat|Only Dog", items: ["looked for food|", "found fish|went to the dock", "found a bone|"], trap: ["found fish", 0], why: "Only Cat found fish. Dog found a bone.", win: "You found what was alike and different." },
    { say: "Sort these by yourself.", read: "Ben camped in the woods. It rained and he went home. / Lee camped in the woods. It was sunny and she stayed.", bins: "Both|Only Ben|Only Lee", items: ["camped in the woods|", "went home|", "had sun|"], trap: ["went home", 0] },
  ],
}));
