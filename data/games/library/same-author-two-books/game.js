// Same Author, Two Books. Skill RL.3.9-1.
// Comparing and contrasting the themes, settings and plots of stories by the same author about the same characters. Summarizing each story separately is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Author, Two Books",
  emoji: "🕵️",
  premise: "An author may write many books about the same characters. The stories share some things and change others.",
  outro: "Compare books in a series by their themes, settings and plots.",
  scene: "city",
  kind: "sort",
  hint: "Is it true in both books, or only one?",
  tag: "summarizes_separately",
  rounds: [
    { say: "Read about both books. Sort the details.", read: "Book 1: Detective Dot solves a case at school. She finds a stolen trophy. / Book 2: Detective Dot solves a case at the zoo. She finds a missing parrot.", bins: "Both|Only book 1|Only book 2", items: ["Dot solves a case|", "at school|a stolen trophy", "at the zoo|"], trap: ["Dot solves a case", 1], why: "Dot solves a case in both books.", win: "Same detective, different settings." },
    { say: "Read about both books. Sort the details.", read: "Book 1: Pip and Max camp in the woods and learn to trust each other. / Book 2: Pip and Max sail a lake and learn to trust each other.", bins: "Both|Only book 1|Only book 2", items: ["Pip and Max|learning to trust", "the woods|", "a lake|"], trap: ["learning to trust", 1], why: "That theme is in both books.", win: "Same theme, different places." },
    { say: "Sort these by yourself.", read: "Book 1: Luna the cat saves a kitten from a storm. / Book 2: Luna the cat saves a bird from a fox.", bins: "Both|Only book 1|Only book 2", items: ["Luna saves someone|", "a storm|", "a fox|"], trap: ["Luna saves someone", 1] },
  ],
}));
