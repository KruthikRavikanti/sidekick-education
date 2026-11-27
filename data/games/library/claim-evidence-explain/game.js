// Claim, Evidence, Explain. Skill W.8.9-1.
// Drawing evidence from texts to support analysis, reflection and research. Giving no evidence, or no explanation, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Claim, Evidence, Explain",
  emoji: "🧱",
  premise: "An analysis paragraph has three parts: a claim, evidence from the text, and an explanation of how the evidence proves the claim.",
  outro: "Draw evidence from texts and explain how it supports your analysis.",
  scene: "desk",
  kind: "row",
  fs: 4.4,
  hint: "Which sentence is the point, which is the proof, and which connects them?",
  tag: "no_evidence",
  rounds: [
    { say: "Build the paragraph: claim, evidence, explanation.", seq: "The narrator feels like an outsider.|She says she watches the party “through glass.”|The image of glass shows she can see others but not join them.", trap: "She says she watches the party “through glass.”|The narrator feels like an outsider.|The image of glass shows she can see others but not join them.", why: "Start with the point you are making. Then give the proof.", win: "Claim, evidence, explanation." },
    { say: "Name each part of this paragraph.", kind: "fill", fs: 4.4, cast: "", rows: [["The author views the reform as weak.", "claim"], ["He calls it “a bandage on a broken leg.”", "evidence"], ["The comparison suggests it is far too small for the problem.", "explanation"]], trap: [2, "evidence"], why: "It tells how the quotation proves the claim. That is the explanation.", win: "Point, proof, link." },
    { say: "Build this paragraph by yourself.", seq: "The poem treats the sea as dangerous.|The speaker calls the waves “gray teeth.”|Teeth suggest the sea could bite and swallow.", trap: "The speaker calls the waves “gray teeth.”|The poem treats the sea as dangerous.|Teeth suggest the sea could bite and swallow." },
  ],
}));
