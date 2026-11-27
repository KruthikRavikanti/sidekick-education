// Explain It With an Analogy. Skill W.11-12.2-3.
// Using precise language, domain-specific vocabulary and techniques such as metaphor, simile and analogy. Using vague wording is the known slip.
Sidekick.game(Sidekick.play({
  title: "Explain It With an Analogy",
  emoji: "🌉",
  premise: "When an idea is hard, compare it to something the reader already knows. A good analogy does the heavy lifting.",
  outro: "Use precise language, domain vocabulary, and techniques such as metaphor, simile and analogy to manage complexity.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Which everyday thing works the same way as the hard idea?",
  tag: "vague_wording",
  rounds: [
    { say: "Match each hard idea to an analogy that explains it.", rows: [["cell membrane", "a gate that checks who may enter"], ["computer memory", "a desk you clear every night"], ["inflation", "a ruler that shrinks a little each year"]], extra: "a thing that does stuff|", trap: [0, "a thing that does stuff"], why: "That explains nothing. A gate shows the membrane choosing what passes.", win: "Familiar thing, same behavior." },
    { say: "Match each idea to its analogy.", rows: [["the immune system", "guards who remember a face"], ["an electric circuit", "water flowing round a loop of pipe"], ["a first draft", "clay before it is shaped"]], extra: "something complicated|", trap: [1, "something complicated"], why: "Complicated is a label, not an explanation. Current flows as water does through pipes.", win: "Analogy makes it visible." },
    { say: "Match these by yourself.", rows: [["a firewall", "a doorman with a guest list"], ["natural selection", "a sieve that keeps what fits"], ["compound interest", "a snowball rolling downhill"]], extra: "a kind of thing|", trap: [2, "a kind of thing"] },
  ],
}));
