// Sharpen the Storm. Skill W.6.3-3.
// Using precise words, descriptive details and sensory language to convey experiences. Generic wording is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sharpen the Storm",
  emoji: "⛈️",
  premise: "It was a bad storm tells the reader almost nothing. Precise words and sensory details let them feel it.",
  outro: "Use precise words and details of sight, sound, smell, taste and touch.",
  scene: "night",
  kind: "sort",
  fs: 4.6,
  hint: "Can you see, hear or feel it? Or is it just a label?",
  tag: "generic_wording",
  rounds: [
    { say: "Vivid detail, or generic?", bins: "Vivid|Generic", items: ["Hail rattled the roof like thrown gravel.|Wind tore the gate off its hinges.", "It was a bad storm.|The weather was not nice."], trap: ["It was a bad storm.", 0], why: "Bad is a label. What did the storm sound or look like?", win: "Vivid lines let you hear and see it." },
    { say: "Sort these.", bins: "Vivid|Generic", items: ["The soup burned my tongue and smelled of garlic.|Her wool scarf scratched my chin.", "The food was good.|She wore some clothes."], trap: ["The food was good.", 0], why: "Good does not tell the taste or the smell.", win: "Senses make it real." },
    { say: "Sort these by yourself.", bins: "Vivid|Generic", items: ["The gym echoed with squeaking shoes.|Cold rain dripped down my collar.", "The game was fun.|It was a nice place."], trap: ["It was a nice place.", 0] },
  ],
}));
