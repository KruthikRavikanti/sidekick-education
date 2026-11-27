// Look Back at the End. Skill W.7.3-4.
// Providing a conclusion that follows from and reflects on the narrated experiences. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Look Back at the End",
  emoji: "🪞",
  premise: "The best story endings do more than stop. The narrator looks back and shows what the events meant.",
  outro: "A narrative conclusion follows from the events and reflects on them.",
  scene: "ocean",
  kind: "sort",
  fs: 4.4,
  hint: "Does the ending show what the character learned or how they changed?",
  tag: "abrupt_ending",
  rounds: [
    { say: "The story: Sam is cut from the team and trains all winter. Sort the endings.", bins: "Reflects|Just stops", items: ["I did not make captain, but I no longer feared the list on the wall.|That winter taught me effort is its own answer.", "Then tryouts were over.|The end."], trap: ["Then tryouts were over.", 0], why: "It reports the last event but says nothing about what it meant.", win: "Reflection shows the meaning." },
    { say: "The story: Lin moves and hates her new town until she finds the river. Sort the endings.", bins: "Reflects|Just stops", items: ["The river did not replace home, but it gave me a place to start.|I learned a town becomes yours one path at a time.", "Then it was Tuesday.|So that happened."], trap: ["So that happened.", 0], why: "That shrugs off the whole story.", win: "Look back and say what changed." },
    { say: "The story: two cousins rebuild their grandfather’s boat. Sort by yourself.", bins: "Reflects|Just stops", items: ["We launched it crooked, and I have never been prouder.|Fixing the boat fixed something between us too.", "We finished the boat.|Then we went home."], trap: ["We finished the boat.", 0] },
  ],
}));
