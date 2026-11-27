// Two Adventures. Skill RL.K.9-1.
// Comparing and contrasting the adventures of characters in familiar stories. Retelling each story without comparing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Adventures",
  emoji: "🦊",
  premise: "Two characters each go on an adventure. Some things are the same in both, and some are different.",
  outro: "To compare, find what is the same in both stories and what is different.",
  scene: "forest",
  kind: "sort",
  hint: "Did both of them do it, or only one?",
  tag: "retells_without_comparing",
  rounds: [
    { say: "Read both stories. Who did each thing?", read: "Fox went up a hill. He found a cave. / Bear went up a hill. He found a lake.", bins: "Both|Only Fox|Only Bear", items: ["went up a hill|", "found a cave|", "found a lake|"], trap: ["went up a hill", 1], why: "Read again. Bear went up a hill too.", win: "Same hill, different finds." },
    { say: "Read both stories. Sort what happened.", read: "Pig got lost in the rain. A hen led him home. / Duck got lost in the rain. A cow led her home.", bins: "Both|Only Pig|Only Duck", items: ["got lost in the rain|got home safe", "was led by a hen|", "was led by a cow|"], trap: ["got lost in the rain", 1], why: "Duck got lost in the rain too. That part is the same.", win: "You compared the two stories." },
    { say: "Sort these by yourself.", read: "Ant made a boat from a leaf. It sank. / Bee made a boat from a leaf. It sailed far.", bins: "Both|Only Ant|Only Bee", items: ["made a boat|used a leaf", "the boat sank|", "the boat sailed far|"], trap: ["made a boat", 1] },
  ],
}));
