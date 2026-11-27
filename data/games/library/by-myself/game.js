// By Myself. Skill L.2.1-3.
// Using reflexive pronouns. Writing hisself or theirselves is the known slip.
Sidekick.game(Sidekick.play({
  title: "By Myself",
  emoji: "🪞",
  premise: "Words like myself and themselves point back to the person doing the action.",
  outro: "Reflexive pronouns end in -self or -selves: myself, himself, ourselves.",
  scene: "candy",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Who is doing the action? Pick the -self word that matches.",
  tag: "hisself_theirselves",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["I made it ___.", "myself"], ["He hurt ___.", "himself"]], extra: "hisself", trap: [1, "hisself"], why: "Hisself is not a word. The right word is himself.", win: "Myself and himself." },
    { say: "Drop in these words.", rows: [["We cooked dinner ___.", "ourselves"], ["She saw ___ in the mirror.", "herself"], ["They built it ___.", "themselves"]], extra: "theirselves", trap: [2, "theirselves"], why: "Theirselves is not a word. The right word is themselves.", win: "Ourselves, herself, themselves." },
    { say: "Drop in the words by yourself.", rows: [["The cat washed ___.", "itself"], ["You can do it ___.", "yourself"], ["He taught ___ to swim.", "himself"]], extra: "hisself", trap: [2, "hisself"] },
  ],
}));
