// He and I, Him and Me. Skill L.6.1-1.
// Ensuring that pronouns are in the proper case: subjective, objective, possessive. Writing me and him went is the known slip.
Sidekick.game(Sidekick.play({
  title: "He and I, Him and Me",
  emoji: "🧍",
  premise: "Pronouns change form with their job. The doer uses I, he, she, we, they. The receiver uses me, him, her, us, them.",
  outro: "Subject pronouns do the action. Object pronouns receive it. Test by dropping the other person.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Take the other person out. Would you say him went, or he went?",
  tag: "object_pronoun_as_subject",
  rounds: [
    { say: "Drop in the pronoun that fits.", rows: [["___ and I went to the store.", "He"], ["Mom drove ___ and me home.", "him"]], extra: "Him|", trap: [0, "Him"], why: "Try it alone: Him went to the store does not work. He went.", win: "He does the going. Him gets driven." },
    { say: "Drop in the pronoun that fits.", rows: [["___ and Tia won the relay.", "She"], ["The coach thanked Tia and ___.", "her"], ["The trophy is ___.", "theirs"]], extra: "Her|", trap: [0, "Her"], why: "Try it alone: Her won the relay does not work. She won.", win: "Subject, object, possessive." },
    { say: "Fill these by yourself.", rows: [["___ and Leo built the fort.", "We"], ["Dad helped Leo and ___.", "us"], ["The fort is ___.", "ours"]], extra: "Us|our", trap: [0, "Us"] },
  ],
}));
