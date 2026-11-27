// Central Idea and Its Helpers. Skill RI.6.2-1.
// Determining a central idea and how it is conveyed through particular details. Picking a detail as the central idea is the known slip.
Sidekick.game(Sidekick.play({
  title: "Central Idea and Its Helpers",
  emoji: "🎯",
  premise: "The central idea is the big point of an article. The details are the facts that hold it up.",
  outro: "A central idea covers the whole text. Details are specific facts that support it.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Which statement is big enough to cover all the others?",
  tag: "detail_as_central_idea",
  rounds: [
    { say: "Sort: the central idea, or a supporting detail?", bins: "Central idea|Detail", items: ["Octopuses are remarkably intelligent.|", "They can open jars.|They escape through tiny openings.|They use coconut shells as shelters."], trap: ["They can open jars.", 0], why: "Opening jars is one example. Which statement do all the examples prove?", win: "One big idea, three details." },
    { say: "Sort these.", bins: "Central idea|Detail", items: ["Deserts are full of life adapted to dryness.|", "Cactuses store water in their stems.|Many animals come out only at night.|Some seeds wait years for rain."], trap: ["Cactuses store water in their stems.", 0], why: "That is one adaptation. The central idea covers them all.", win: "The details show the adaptations." },
    { say: "Sort these by yourself.", bins: "Central idea|Detail", items: ["Bridges are built in different ways for different crossings.|", "Arch bridges push weight outward.|Suspension bridges hang from cables.|Beam bridges span short distances."], trap: ["Suspension bridges hang from cables.", 0] },
  ],
}));
