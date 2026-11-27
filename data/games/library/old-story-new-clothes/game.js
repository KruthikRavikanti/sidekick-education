// Old Story, New Clothes. Skill RL.9-10.9-1.
// Analyzing how an author draws on and transforms source material in a specific work. Missing the source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Old Story, New Clothes",
  emoji: "🪽",
  premise: "Writers borrow old stories and remake them. The interesting part is what they keep and what they change.",
  outro: "Name the source, what the new work keeps, and what it transforms.",
  scene: "sky",
  kind: "sort",
  fs: 4.4,
  hint: "Line the two stories up. What stayed? What is new?",
  tag: "misses_the_source",
  rounds: [
    { say: "A new story retells the myth of Icarus. Sort what it keeps and what it changes.", read: "Myth: Icarus ignores his father, flies too near the sun on wax wings, and falls. New story: Ika ignores her coach, pushes a racing drone past its limit, and it burns out over the lake.", bins: "Kept from the myth|Changed", items: ["a warning is ignored|ambition leads to a fall", "wax wings become a drone|the father becomes a coach"], trap: ["wax wings become a drone", 0], why: "The drone is the update. What carries over is the ignored warning and the fall.", win: "Same bones, new skin." },
    { say: "Shakespeare’s Romeo and Juliet draws on the old tale of Pyramus and Thisbe. Match each part.", kind: "fill", fs: 4.6, cast: "", rows: [["kept from the old tale", "lovers kept apart by their families"], ["kept from the old tale ", "a mistaken belief that the other has died"], ["added by Shakespeare", "a feud that fills a whole city"]], extra: "a happy ending|", trap: [2, "a happy ending"], why: "Neither version ends happily. Shakespeare widens the quarrel into a city-wide feud.", win: "He keeps the tragedy and enlarges the world." },
    { say: "A new story retells the tortoise and the hare. Sort these by yourself.", read: "Fable: a boastful hare naps and loses a race to a steady tortoise. New story: a star coder skips testing, and a careful beginner’s app launches first.", bins: "Kept from the fable|Changed", items: ["overconfidence loses|steady work wins", "a race becomes an app launch|animals become coders"], trap: ["a race becomes an app launch", 0] },
  ],
}));
