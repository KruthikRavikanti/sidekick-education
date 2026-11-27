// Cool the Tone. Skill W.9-10.1-4.
// Establishing and maintaining a formal style and objective tone. Using an emotional tone is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cool the Tone",
  emoji: "🧊",
  premise: "An argument persuades with evidence, not with heat. Formal, objective wording keeps readers listening.",
  outro: "Keep a formal style and objective tone: no insults, no slang, no exaggeration.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Would this sentence sound fair to someone who disagrees?",
  tag: "emotional_tone",
  rounds: [
    { say: "Objective or emotional?", bins: "Objective|Emotional", items: ["Some disagree, but the evidence supports the change.|The data suggest a modest benefit.", "Anyone who disagrees is clueless.|This is the worst idea in the world."], trap: ["Anyone who disagrees is clueless.", 0], why: "Clueless insults the reader instead of persuading them.", win: "Evidence, not insults." },
    { say: "Replace each heated sentence with its objective version.", kind: "fill", fs: 4.4, cast: "", rows: [["The mayor’s plan is garbage.", "The plan has two weaknesses."], ["Everybody hates the new rule.", "A survey found most students oppose it."]], extra: "The rule is super dumb, honestly.|", trap: [1, "The rule is super dumb, honestly."], why: "That is still an insult. Report what a survey found instead.", win: "Specific and calm." },
    { say: "Sort these by yourself.", bins: "Objective|Emotional", items: ["Opponents raise two concerns about cost.|The study has limits, as its authors note.", "Only a monster would cut this program.|The other plan is a total joke."], trap: ["The other plan is a total joke.", 0] },
  ],
}));
