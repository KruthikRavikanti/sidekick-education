// Say What You Think. Skill W.2.1-1.
// Introducing the topic and stating an opinion in opinion writing. Not stating an opinion clearly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say What You Think",
  emoji: "📣",
  premise: "Opinion writing starts by naming the topic and saying clearly what you think about it.",
  outro: "A strong opening names the topic and states your opinion.",
  scene: "field",
  kind: "pick",
  hint: "Which sentence tells what the writer THINKS?",
  tag: "no_clear_opinion",
  rounds: [
    { say: "The question: Should kids have recess every day? Tap the openings that state an opinion.", yes: "I think kids should have recess every day.|Kids need recess every single day.", no: "Recess is when kids go outside.|Our school has a playground.", trap: "Recess is when kids go outside.", why: "That tells what recess is. It does not say what the writer thinks.", win: "Both openings take a side." },
    { say: "The question: Are cats or dogs better pets? Tap the openings that state an opinion.", yes: "Dogs make the best pets.|In my opinion, cats are better than dogs.", no: "Cats and dogs are both animals.|Some people have pets.|A dog has four legs.", trap: "Cats and dogs are both animals.", why: "That is a fact. An opinion picks a side.", win: "Each opening picks a side." },
    { say: "The question: Should school start later? Tap the opinion openings by yourself.", yes: "School should start one hour later.|I believe school starts at the right time.", no: "School starts in the morning.|There are many schools.|Kids ride buses.", trap: "School starts in the morning." },
  ],
}));
