// Opinion Blueprint. Skill W.3.1-1.
// Introducing a topic, stating an opinion and creating an organizational structure that lists reasons. Giving reasons in no order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Opinion Blueprint",
  emoji: "📐",
  premise: "An opinion paragraph has a plan: say your opinion, give your reasons in order, then close.",
  outro: "Organize opinion writing: opinion first, then reasons, then a conclusion.",
  scene: "paper",
  kind: "row",
  hint: "What does the reader need to know first? What comes last?",
  tag: "reasons_in_no_order",
  rounds: [
    { say: "Put the parts of this opinion paragraph in order.", seq: "Students should have less homework.|First, kids need time to play.|Second, families need time together.|For these reasons, homework should be cut.", trap: "First, kids need time to play.|Students should have less homework.|Second, families need time together.|For these reasons, homework should be cut.", why: "Say your opinion before you give reasons for it.", win: "Opinion, two reasons, conclusion." },
    { say: "Put this paragraph in order.", seq: "Our town needs a new park.|One reason is that kids have nowhere to play.|Another reason is that trees clean the air.|That is why we need a park.", trap: "That is why we need a park.|Our town needs a new park.|One reason is that kids have nowhere to play.|Another reason is that trees clean the air.", why: "That is why sums up, so it belongs at the end.", win: "A clear structure." },
    { say: "Put this paragraph in order by yourself.", seq: "Dogs are the best pets.|To begin, they are loyal.|Also, they keep you active.|In short, a dog is a great friend.", trap: "To begin, they are loyal.|Dogs are the best pets.|Also, they keep you active.|In short, a dog is a great friend." },
  ],
}));
