// Set the Stage. Skill W.8.3-1.
// Engaging and orienting the reader by establishing a context and point of view. A flat opening is the known slip.
Sidekick.game(Sidekick.play({
  title: "Set the Stage",
  emoji: "🎭",
  premise: "The opening of a story should tell the reader where they are and through whose eyes they are looking, without a lecture.",
  outro: "Engage and orient the reader by establishing a context and point of view.",
  scene: "night",
  kind: "sort",
  fs: 4.4,
  hint: "Can you tell where you are, who is speaking, and that something is at stake?",
  tag: "flat_opening",
  rounds: [
    { say: "Which openings set a scene AND a point of view?", bins: "Orients the reader|Flat", items: ["From the flooded school roof, I saw no ferry would come.|Dara counted three candles and chose to lie.", "Stuff happened one time.|This story has people in it."], trap: ["Stuff happened one time.", 0], why: "No place, no narrator, nothing to picture.", win: "A place, a voice and a problem." },
    { say: "Sort these openings.", bins: "Orients the reader|Flat", items: ["Six hours into the desert stop, I heard knocking under the train.|In the Blue Heron kitchen, Mateo burned his first order.", "There was a train.|Once there was a kitchen."], trap: ["There was a train.", 0], why: "A train where? Who is telling it? What is the trouble?", win: "Specific context pulls the reader in." },
    { say: "Sort these by yourself.", bins: "Orients the reader|Flat", items: ["The night our dog learned to open doors, nobody slept.|On the last ferry, Ines found a suitcase with her name on it.", "It was a night.|A thing was found."], trap: ["A thing was found.", 0] },
  ],
}));
