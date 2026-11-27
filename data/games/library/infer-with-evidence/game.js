// Infer With Evidence. Skill RI.4.1-1.
// Referring to details and examples when drawing inferences from an informational text. Inferring without evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Infer With Evidence",
  emoji: "🏘️",
  premise: "In nonfiction too, some conclusions are not stated. Draw them from details in the text.",
  outro: "An inference about an article needs details from the article to back it up.",
  scene: "sand",
  kind: "pick",
  hint: "Which details make that conclusion likely?",
  tag: "infers_without_evidence",
  rounds: [
    { say: "Inference: The town moved because of flooding. Tap the details that support it.", read: "The old town sat beside the river. Water filled the streets three springs in a row. In 1937 every building was hauled to the hilltop.", yes: "Water filled the streets three springs in a row.|Every building was moved to the hilltop.", no: "The year was 1937.|The town was old.", trap: "The year was 1937.", why: "A date is not a reason. Which details point to flooding?", win: "Those two details support the inference." },
    { say: "Inference: The inventor did not give up easily. Tap the details that support it.", read: "Her first forty designs did not work. She kept a notebook of every one. The forty-first design flew for twelve seconds.", yes: "Her first forty designs did not work.|She kept going to a forty-first design.", no: "The flight lasted twelve seconds.|She had a notebook.", trap: "She had a notebook.", why: "Owning a notebook does not show persistence by itself.", win: "Forty tries, and then one more." },
    { say: "Inference: Bees are in trouble. Tap the supporting details by yourself.", read: "Beekeepers lost a third of their hives last year. Fields that once hummed are now quiet. Honey is sold in glass jars.", yes: "Beekeepers lost a third of their hives.|Fields that once hummed are quiet.", no: "Honey is sold in glass jars.|Beekeepers keep hives.|Bees can hum.", trap: "Honey is sold in glass jars." },
  ],
}));
