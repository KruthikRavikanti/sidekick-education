// Slow the Big Moment. Skill W.5.3-2.
// Using dialogue, description and pacing to develop experiences and events. Summarizing the key moment is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slow the Big Moment",
  emoji: "🎬",
  premise: "Pacing means how fast a story moves. Rush through the dull parts and slow down for the moment that matters.",
  outro: "Use dialogue, description and pacing: slow down the most important moment.",
  scene: "city",
  kind: "sort",
  hint: "Is this a moment worth stretching out, or one to move past quickly?",
  tag: "summarizes_key_moment",
  rounds: [
    { say: "In a story about a spelling bee, which moments should be slowed down?", bins: "Slow down|Move quickly", items: ["hearing the final word|the pause before she answers", "the drive to the school|finding a seat"], trap: ["the drive to the school", 0], why: "The drive is not where the tension is. Move past it quickly.", win: "Stretch the moments that matter." },
    { say: "Which version slows the big moment with dialogue and description?", kind: "pick", yes: "The judge leaned forward. \"Your word is rhythm.\" My mouth went dry. I could hear the clock tick.|", no: "I got a hard word and spelled it.|The bee was long and then I won.|They gave me a word. I said it. The end.", trap: "I got a hard word and spelled it.", why: "That rushes past the most important moment in one sentence.", win: "Dialogue and detail stretch the moment." },
    { say: "In a story about a rescue at sea, sort by yourself.", bins: "Slow down|Move quickly", items: ["reaching for the swimmer’s hand|the wave that almost tips the boat", "packing lunch that morning|walking to the dock"], trap: ["packing lunch that morning", 0] },
  ],
}));
