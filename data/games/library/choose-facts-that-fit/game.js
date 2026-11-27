// Choose Facts That Fit. Skill W.9-10.2-2.
// Developing a topic with well-chosen, relevant and sufficient facts and examples. Thin development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Choose Facts That Fit",
  emoji: "🧲",
  premise: "An explanation is only as good as its details. Pick facts that are specific, on topic, and enough to make the idea clear.",
  outro: "Develop a topic with well-chosen, relevant and sufficient facts, definitions and examples.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it explain this topic with something specific?",
  tag: "thin_development",
  rounds: [
    { say: "Topic: how suspension bridges carry weight. Which details belong?", bins: "Use it|Leave it out", items: ["Main cables pass the load to the towers.|The towers push the weight down into the ground.", "Bridges are really cool.|My uncle once drove over one."], trap: ["Bridges are really cool.", 0], why: "Cool gives the reader nothing to learn. Choose a fact about cables or towers.", win: "Specific and on topic." },
    { say: "Topic: why leaves change color in fall. Sort the details.", bins: "Use it|Leave it out", items: ["Shorter days slow the making of green chlorophyll.|Yellow pigments were in the leaf all along.", "Fall is my favorite season.|Leaves are found on most trees."], trap: ["Leaves are found on most trees.", 0], why: "True, but it explains nothing about color.", win: "Facts that explain." },
    { say: "Topic: how vaccines train the body. Sort these by yourself.", bins: "Use it|Leave it out", items: ["A vaccine shows the body a harmless piece of a germ.|Memory cells then recognize the real germ faster.", "Nobody likes getting a shot.|Doctors work in clinics."], trap: ["Doctors work in clinics.", 0] },
  ],
}));
