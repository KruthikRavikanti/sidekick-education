// Just What Happened. Skill RL.9-10.2-2.
// Providing an objective summary of a literary text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Just What Happened",
  emoji: "🧊",
  premise: "An objective summary gives the main events and the central idea. It leaves out your verdicts and the tiny details.",
  outro: "A summary keeps main events and ideas. It drops opinions and minor details.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Is it a main event, a small detail, or a judgment?",
  tag: "includes_opinions",
  rounds: [
    { say: "Which sentences belong in an objective summary?", fs: 4.2, read: "A young cook enters a contest with her grandmother’s plain recipe. A judge mocks it. She serves it anyway and wins second place.", bins: "Keep|Leave out", items: ["A cook enters a contest.|She serves her dish anyway.", "The judge is awful.|Her apron is yellow."], trap: ["The judge is awful.", 0], why: "Awful is a verdict. A summary reports what the judge did, not what you think of him.", win: "Events in, verdicts out." },
    { say: "Sort these.", fs: 4.2, read: "Two brothers inherit a bookshop. One wants to sell. Their mother’s notes in the margins make them stay.", bins: "Keep|Leave out", items: ["Brothers inherit a shop.|Old notes change their minds.", "Selling was clearly smarter.|The shop door is red."], trap: ["Selling was clearly smarter.", 0], why: "Clearly smarter is your opinion of the choice.", win: "Only what the story tells." },
    { say: "Sort these by yourself.", read: "A runner loses sight in one eye. She trains with a guide and learns to trust his voice. She finishes her first race since the injury.", bins: "Keep|Leave out", items: ["A runner trains with a guide.|She completes a race again.", "It is the most inspiring story ever.|Her shoes are size eight."], trap: ["It is the most inspiring story ever.", 0] },
  ],
}));
