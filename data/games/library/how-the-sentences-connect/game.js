// How the Sentences Connect. Skill RI.3.8-1.
// Describing the logical connection between sentences and paragraphs (comparison, cause/effect, first/second/third). Seeing paragraphs as unrelated is the known slip.
Sidekick.game(Sidekick.play({
  title: "How the Sentences Connect",
  emoji: "🔗",
  premise: "Sentences in a text are linked. Signal words tell you how: in order, by cause, or by comparing.",
  outro: "Signal words show how sentences connect: sequence, cause and effect, or comparison.",
  scene: "desk",
  kind: "sort",
  hint: "Look for the signal word. What kind of link does it make?",
  tag: "sees_sentences_as_unrelated",
  rounds: [
    { say: "What kind of connection does each signal word make?", bins: "Order|Cause|Compare", items: ["first|next|finally", "because|so", "but|like"], trap: ["so", 0], why: "So tells what happened as a result. That is cause and effect.", win: "Order, cause and compare." },
    { say: "How are the two sentences in each pair connected?", bins: "Order|Cause|Compare", items: ["First mix the flour. Then add eggs.|", "It rained hard. As a result, the game was off.|", "Frogs have smooth skin. Toads, however, are bumpy.|"], trap: ["It rained hard. As a result, the game was off.", 0], why: "As a result shows that the rain CAUSED it.", win: "Three kinds of connection." },
    { say: "Sort these by yourself.", bins: "Order|Cause|Compare", items: ["After lunch we rested. Later we swam.|", "The ice melted since it was warm.|", "Cats purr. Dogs, on the other hand, bark.|"], trap: ["The ice melted since it was warm.", 0] },
  ],
}));
