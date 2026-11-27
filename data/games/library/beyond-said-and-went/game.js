// Beyond Said and Went. Skill L.4.6-1.
// Using grade-appropriate words that signal precise actions, emotions or states of being. Using said and went for everything is the known slip.
Sidekick.game(Sidekick.play({
  title: "Beyond Said and Went",
  emoji: "🗯️",
  premise: "Said and went are plain. Words like quizzed, whined and stammered show exactly how someone spoke or felt.",
  outro: "Use precise words for actions, emotions and states of being.",
  scene: "candy",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "How was it said? Pick the verb that shows that.",
  tag: "said_and_went_for_everything",
  rounds: [
    { say: "Swap said for a more precise verb.", rows: [["\"But I do not want to go,\" he ___.", "whined"], ["\"What is the capital of Peru?\" she ___.", "quizzed"]], extra: "said", trap: [0, "said"], why: "Said is plain. Someone complaining like that is whining.", win: "Whined and quizzed." },
    { say: "Swap these for precise verbs.", rows: [["\"I, um, I forgot,\" he ___.", "stammered"], ["\"We won!\" they ___.", "cheered"], ["\"Not again,\" she ___.", "groaned"]], extra: "said", trap: [1, "said"], why: "Said hides the joy. They cheered.", win: "Stammered, cheered and groaned." },
    { say: "Swap these by yourself.", rows: [["\"Please, please, can I?\" she ___.", "begged"], ["\"Get out!\" he ___.", "roared"], ["\"It is a secret,\" she ___.", "whispered"]], extra: "said went", trap: [0, "said"] },
  ],
}));
