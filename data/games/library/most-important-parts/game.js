// Most Important Parts. Skill RL.1.2-1.
// Retelling stories including key details. Retelling every detail with no focus is the known slip.
Sidekick.game(Sidekick.play({
  title: "Most Important Parts",
  emoji: "🐶",
  premise: "A retell is short. It tells only the most important parts of the story, not every little thing.",
  outro: "Retell the key parts: what happened at the beginning, in the middle and at the end.",
  scene: "city",
  kind: "pick",
  hint: "Would the story still make sense without it? Then leave it out.",
  tag: "retells_every_detail",
  rounds: [
    { say: "Read the story. Tap the parts you need for a short retell.", read: "Max the pup dug under the fence. He ran past a blue car. He got lost. A girl read his tag and took him home.", yes: "Max got out.|Max got lost.|A girl took him home.", no: "A car was blue.|The girl read a tag.", trap: "A car was blue.", why: "The blue car is a small detail. The story works without it.", win: "Got out, got lost, got home." },
    { say: "Read this story. Tap the parts for a short retell.", read: "Ana planted a tiny seed in a red pot. She gave it water every day. A tall sunflower grew.", yes: "Ana planted a seed.|She watered it.|A sunflower grew.", no: "The pot was red.|The seed was tiny.", trap: "The pot was red.", why: "The color of the pot is a small detail.", win: "Planted, watered, grew." },
    { say: "Tap the parts for a short retell, by yourself.", read: "Sam lost his green hat on the bus. He asked the driver. The driver found it under a seat.", yes: "Sam lost his hat.|He asked the driver.|The driver found it.", no: "The hat was green.|It was under a seat.", trap: "The hat was green." },
  ],
}));
