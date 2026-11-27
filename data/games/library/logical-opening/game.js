// Logical Opening. Skill W.5.1-1.
// Introducing a topic clearly, stating an opinion and creating an organizational structure in which ideas are logically grouped. Disorganized reasons is the known slip.
Sidekick.game(Sidekick.play({
  title: "Logical Opening",
  emoji: "⏰",
  premise: "An opinion essay opens by leading the reader in, stating a clear opinion, and laying out a logical plan.",
  outro: "Introduce the topic, state the opinion, and set up a logical order for your reasons.",
  scene: "city",
  kind: "row",
  hint: "Lead in, name the issue, state your opinion, then preview the reasons.",
  tag: "disorganized_structure",
  rounds: [
    { say: "Put this introduction about later school start times in order.", seq: "Imagine starting class fully awake.|Many districts are debating start times.|I believe school should begin at nine.|Students would be healthier, safer and more alert.", trap: "I believe school should begin at nine.|Imagine starting class fully awake.|Many districts are debating start times.|Students would be healthier, safer and more alert.", why: "Lead the reader in and name the issue before giving your opinion.", win: "Hook, issue, opinion, preview." },
    { say: "Put this introduction in order.", seq: "Every lunch, bins overflow with plastic.|Our cafeteria uses throwaway trays.|We should switch to washable ones.|It would cut trash, save money and set an example.", trap: "It would cut trash, save money and set an example.|Every lunch, bins overflow with plastic.|Our cafeteria uses throwaway trays.|We should switch to washable ones.", why: "The reasons are previewed after the opinion they support.", win: "A logical opening." },
    { say: "Put this introduction in order by yourself.", seq: "Picture a library with no books to borrow.|Our town plans to cut library hours.|The library should stay open every day.|It serves students, job seekers and families.", trap: "The library should stay open every day.|Picture a library with no books to borrow.|Our town plans to cut library hours.|It serves students, job seekers and families." },
  ],
}));
