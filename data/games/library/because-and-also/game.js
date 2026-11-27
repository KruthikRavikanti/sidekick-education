// Because and Also. Skill W.2.1-2.
// Supplying reasons that support the opinion and using linking words to connect opinion and reasons. Giving one reason or none is the known slip.
Sidekick.game(Sidekick.play({
  title: "Because and Also",
  emoji: "🔗",
  premise: "One reason is a start. Two reasons are stronger. Words like because and also link them together.",
  outro: "Give more than one reason and link them with because, and, and also.",
  scene: "desk",
  kind: "row",
  hint: "The opinion comes first. Because starts the first reason. Also adds another.",
  tag: "one_reason_or_none",
  rounds: [
    { say: "Put the parts in order to build an opinion with two reasons.", seq: "Kids need recess|because it helps them think.|It also keeps them healthy.", trap: "It also keeps them healthy.|Kids need recess|because it helps them think.", why: "Also adds a second reason, so it comes after the first.", win: "An opinion, a because, and an also." },
    { say: "Build this opinion with two reasons.", seq: "Dogs are great pets|because they are friendly.|They also protect your home.", trap: "because they are friendly.|Dogs are great pets|They also protect your home.", why: "Start with the opinion. Because comes after it.", win: "Two linked reasons." },
    { say: "Build this one by yourself.", alt: [{ seq: "We should plant more trees|because they clean the air.|They also give us shade.", trap: "They also give us shade.|We should plant more trees|because they clean the air." }, { seq: "Reading is the best hobby|because you learn new things.|It is also fun.", trap: "It is also fun.|Reading is the best hobby|because you learn new things." }] },
  ],
}));
