// Message and Proof. Skill RL.3.2-2.
// Determining the central message and explaining how it is conveyed through key details. Stating the message without supporting details is the known slip.
Sidekick.game(Sidekick.play({
  title: "Message and Proof",
  emoji: "🐢",
  premise: "The central message is the big idea of a story. The key details in the story are what prove it.",
  outro: "State the central message, then point to details that show it.",
  scene: "field",
  kind: "pick",
  hint: "Which details show that message happening?",
  tag: "message_without_details",
  rounds: [
    { say: "The message: slow and steady wins. Tap the details that show it.", read: "Hare dashed ahead, then stopped for a nap. Tortoise kept walking without a rest. Tortoise crossed the line while Hare was still asleep.", yes: "Tortoise kept walking without a rest.|Tortoise crossed the line first.", no: "Hare has long ears.|The race was on a road.", trap: "Hare has long ears.", why: "That detail does not show the message.", win: "Those details prove the message." },
    { say: "The message: sharing makes everyone richer. Tap the details that show it.", read: "Each villager dropped one small thing into the pot. Alone, no one had enough for a meal. Together, they made soup for the whole village.", yes: "Each villager added one small thing.|Together they made soup for all.", no: "The pot was made of iron.|It was a cold day.|The village had a well.", trap: "The pot was made of iron.", why: "The pot itself does not show the message.", win: "Small gifts, big result." },
    { say: "The message: honesty is rewarded. Tap the details by yourself.", read: "A woodcutter dropped his old axe in the river. A spirit offered him a gold one, but he said it was not his. For telling the truth, he was given all three axes.", yes: "He said the gold axe was not his.|He was given all three axes.", no: "The axe was old.|The river was deep.|He was a woodcutter.", trap: "The axe was old." },
  ],
}));
