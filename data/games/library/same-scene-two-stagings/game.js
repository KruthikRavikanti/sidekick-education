// Same Scene, Two Stagings. Skill RL.11-12.7-1.
// Analyzing multiple interpretations of a story, drama or poem, evaluating how each version interprets the source text. Picking one version without comparing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Scene, Two Stagings",
  emoji: "🎟️",
  premise: "Every production of a play is an interpretation. The script is the same. The meaning the audience takes home is not.",
  outro: "Compare interpretations of a work and evaluate how each one reads the source text.",
  scene: "night",
  kind: "sort",
  fs: 4.2,
  hint: "What does each staging choose to stress? Can the script support it?",
  tag: "picks_one_version",
  rounds: [
    { say: "Two stagings of Hamlet’s most famous speech. Which reading does each choice support?", read: "Production A: Hamlet whispers the speech alone in the dark. Production B: he shouts it at the court, sword in hand.", bins: "A: private despair|B: public defiance", items: ["the whisper|the empty, dark stage", "the shouting|the drawn sword"], trap: ["the drawn sword", 0], why: "A weapon aimed at the court reads as defiance, not quiet despair.", win: "Staging is interpretation." },
    { say: "Evaluate a staging. Which reasons are sound?", kind: "sort", fs: 4.2, bins: "Sound reason|Weak reason", items: ["The script has Hamlet alone, so the whisper fits.|The shouted version changes who hears him.", "I liked the costumes better.|The first one I saw must be correct."], trap: ["The first one I saw must be correct.", 0], why: "Seeing it first proves nothing. Go back to what the script supports.", win: "Judge by the text." },
    { say: "Two films of the same balcony scene. Sort the choices by yourself.", read: "Film A: soft light, slow music, the lovers barely touch. Film B: sirens outside, quick cuts, they keep glancing at the gate.", bins: "A: tender romance|B: love under threat", items: ["the slow music|the soft light", "the sirens|the glances at the gate"], trap: ["the sirens", 0] },
  ],
}));
