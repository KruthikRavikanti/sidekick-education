// Short Notes, Sorted. Skill W.3.8-1.
// Gathering information from sources, taking brief notes and sorting evidence into provided categories. Copying whole sentences as notes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Short Notes, Sorted",
  emoji: "🗒️",
  premise: "Notes are short. Write just the key words, then sort your notes into groups.",
  outro: "Take brief notes in your own words and sort them into categories.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Which group does this note belong to?",
  tag: "copies_whole_sentences",
  rounds: [
    { say: "Which of these is a good note? Tap the short notes.", kind: "pick", read: "Wolves live in groups called packs, and each pack has a leader.", yes: "live in packs|pack has a leader", no: "Wolves live in groups called packs, and each pack has a leader.|wolves are nice", trap: "Wolves live in groups called packs, and each pack has a leader.", why: "That copies the whole sentence. A note is just the key words.", win: "Short notes with the key words." },
    { say: "Sort these notes about wolves into groups.", bins: "Food|Home|Family", items: ["hunt deer|eat rabbits", "forests|cold plains", "live in packs|care for pups"], trap: ["cold plains", 0], why: "Plains are a place where they live.", win: "Three groups of notes." },
    { say: "Sort these notes about frogs by yourself.", bins: "Food|Home|Life cycle", items: ["flies|worms", "ponds|wet places", "eggs|tadpoles"], trap: ["tadpoles", 0] },
  ],
}));
