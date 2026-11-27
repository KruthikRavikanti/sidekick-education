// Reader Knows Best. Skill RL.8.6-1.
// Analyzing how differences in the points of view of characters and the reader create suspense or humor. Missing the dramatic irony is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reader Knows Best",
  emoji: "🙈",
  premise: "Sometimes the reader knows something a character does not. That creates suspense or humor, and it is called dramatic irony.",
  outro: "Dramatic irony: the audience knows more than the character, creating suspense or humor.",
  scene: "night",
  kind: "sort",
  fs: 4.4,
  hint: "What have we been told that the character has not?",
  tag: "misses_dramatic_irony",
  rounds: [
    { say: "Read the scene. Who knows each fact?", read: "We watched the fox slip into the henhouse. Farmer Bo strolled across the yard, humming. “Quiet night,” he said, and reached for the latch.", bins: "Reader knows|Bo knows", items: ["a fox is inside|", "the night seems quiet|he is about to open the door"], trap: ["a fox is inside", 1], why: "Bo is humming and calm. He has no idea about the fox.", win: "We know more than Bo. That builds suspense." },
    { say: "What effect does the difference create?", kind: "fill", fs: 4.6, cast: "", rows: [["We know the fox is there. Bo does not.", "suspense"], ["We know the cake is salt, not sugar. The proud cook does not.", "humor"]], extra: "sadness|", trap: [0, "humor"], why: "A hidden danger makes us tense, not amused.", win: "Danger brings suspense. A harmless mix-up brings humor." },
    { say: "Read the scene. Sort by yourself.", read: "Mia hid the puppy in the garage for her brother’s birthday. He trudged in, sighing, “Nobody even remembered.”", bins: "Reader knows|Brother knows", items: ["a puppy is hidden in the garage|", "he feels forgotten|he just walked in"], trap: ["a puppy is hidden in the garage", 1] },
  ],
}));
