// Choose the Best Support. Skill W.8.2-2.
// Developing a topic with relevant, well-chosen facts, definitions, concrete details and quotations. Thin development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Choose the Best Support",
  emoji: "💎",
  premise: "Well-chosen support is specific and on topic. A vague or loosely related fact weakens the explanation.",
  outro: "Develop a topic with relevant, well-chosen facts, definitions, details and quotations.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Is it specific? Is it about this exact point?",
  tag: "thin_development",
  rounds: [
    { say: "Point: coral reefs protect coastlines. Which support is well chosen?", bins: "Well chosen|Weak", items: ["Reefs absorb up to 97 percent of wave energy.|“The reef is our sea wall,” says one island engineer.", "Reefs are nice.|Fish have fins."], trap: ["Reefs are nice.", 0], why: "Nice is vague. It explains nothing about protection.", win: "Specific and on point." },
    { say: "Point: the printing press spread literacy. Sort the support.", bins: "Well chosen|Weak", items: ["Book prices fell by about two thirds within fifty years.|A press could print 3,000 pages a day.", "Books are good to read.|Paper comes from trees."], trap: ["Paper comes from trees.", 0], why: "True, but it does not show literacy spreading.", win: "Numbers that fit the point." },
    { say: "Point: exercise improves mood. Sort by yourself.", bins: "Well chosen|Weak", items: ["A 20-minute walk raised mood scores in one trial.|Exercise releases endorphins, chemicals that ease stress.", "Exercise is a thing people do.|Shoes come in pairs."], trap: ["Exercise is a thing people do.", 0] },
  ],
}));
