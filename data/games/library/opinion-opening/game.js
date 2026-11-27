// Opinion Opening. Skill W.4.1-1.
// Introducing a topic clearly, stating an opinion and creating an organizational structure. Having no clear structure is the known slip.
Sidekick.game(Sidekick.play({
  title: "Opinion Opening",
  emoji: "👔",
  premise: "A strong introduction names the topic, states your opinion, and hints at the reasons to come.",
  outro: "Introduce the topic, state your opinion clearly, and preview your reasons.",
  scene: "city",
  kind: "row",
  hint: "Hook the reader, name the topic, say your opinion, then preview the reasons.",
  tag: "no_clear_structure",
  rounds: [
    { say: "Put this introduction about school uniforms in order.", seq: "What should students wear to school?|Many schools are debating uniforms.|I believe uniforms are a good idea.|They save time, money and arguments.", trap: "They save time, money and arguments.|What should students wear to school?|Many schools are debating uniforms.|I believe uniforms are a good idea.", why: "The preview of reasons comes after the opinion, not before the topic.", win: "Hook, topic, opinion, preview." },
    { say: "Put this introduction in order.", seq: "Imagine a week with no screens.|Screen time is a big question for families.|In my view, kids need daily limits.|Limits help sleep, health and focus.", trap: "In my view, kids need daily limits.|Imagine a week with no screens.|Screen time is a big question for families.|Limits help sleep, health and focus.", why: "Lead the reader in before you give your opinion.", win: "A clear, ordered opening." },
    { say: "Put this introduction in order by yourself.", seq: "Have you ever wished recess lasted longer?|Schools decide how long recess should be.|I think recess should be forty minutes.|Longer recess improves focus and friendships.", trap: "Longer recess improves focus and friendships.|Have you ever wished recess lasted longer?|Schools decide how long recess should be.|I think recess should be forty minutes." },
  ],
}));
