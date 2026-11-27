// Root Word Family. Skill L.1.4-3.
// Identifying frequently occurring root words and their inflectional forms. Thinking each form is a different word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root Word Family",
  emoji: "👀",
  premise: "Look, looks, looked and looking are one family. They all grow from the same root word.",
  outro: "A root word stays the same when endings like -s, -ed and -ing are added.",
  scene: "forest",
  kind: "pick",
  fs: 6,
  hint: "Cover the ending. Is the root word still there?",
  tag: "forms_are_new_words",
  rounds: [
    { say: "Tap every word that grows from the root look.", mark: "*looks lock *looked book *looking", trap: "lock", why: "Lock has a c in it. It is a different word.", win: "Looks, looked and looking share the root look." },
    { say: "Tap every word that grows from the root play.", mark: "*plays plan *played plate *playing", trap: "plan", why: "Plan is a different word. The root must be play.", win: "Plays, played and playing share the root play." },
    { say: "Find the root of each word by yourself.", kind: "fill", cast: "", rows: [["jumping", "jump"], ["helped", "help"], ["walks", "walk"]], extra: "jum hel", trap: [0, "jum"] },
  ],
}));
