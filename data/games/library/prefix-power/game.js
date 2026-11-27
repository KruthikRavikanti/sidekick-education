// Prefix Power. Skill L.2.4-2.
// Determining the meaning of a new word formed when a known prefix is added to a known word. Ignoring the prefix is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prefix Power",
  emoji: "🔋",
  premise: "A prefix is a small part at the front of a word. It changes the meaning in the same way every time.",
  outro: "Un- means not. Re- means again. Pre- means before. Mis- means badly.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Cover the prefix and read the base word. Then add the prefix meaning.",
  tag: "ignores_prefix",
  rounds: [
    { say: "Match each word to its meaning.", rows: [["unhappy", "not happy"], ["retell", "tell again"]], extra: "happy|", trap: [0, "happy"], why: "That is the base word alone. Un adds not.", win: "Not happy, and tell again." },
    { say: "Match these words.", rows: [["preheat", "heat before"], ["misspell", "spell badly"], ["unsafe", "not safe"]], extra: "heat a lot|", trap: [0, "heat a lot"], why: "Pre means before. You preheat an oven before you bake.", win: "Before, badly and not." },
    { say: "Match these by yourself.", rows: [["rewrite", "write again"], ["unkind", "not kind"], ["preschool", "before school age"]], extra: "very kind|write fast", trap: [1, "very kind"] },
  ],
}));
