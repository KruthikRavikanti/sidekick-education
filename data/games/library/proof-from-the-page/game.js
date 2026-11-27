// Proof From the Page. Skill W.6.9-1.
// Drawing evidence from literary or informational texts to support analysis. Writing without evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Proof From the Page",
  emoji: "📌",
  premise: "When you write about a text, your points need proof from the text. Your own feelings are not evidence.",
  outro: "Support analysis with evidence drawn from the text itself.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Did this come from the story, or from the writer’s own opinion?",
  tag: "writes_without_evidence",
  rounds: [
    { say: "A student claims: Ravi is brave. Tap the two sentences that use text evidence.", mark: "*Ravi walks into the dark barn alone to find the calf.|I think Ravi is really cool.|*He says, “Someone has to go,” and takes the lantern.|Brave people are the best.", trap: "I think Ravi is really cool.", why: "That is the student’s feeling. It does not come from the story.", win: "An action and a quotation from the text." },
    { say: "Claim: the article shows that recycling saves energy. Tap the two with text evidence.", mark: "Recycling just seems smart.|*The article states that recycled cans use far less energy to make.|*It gives the example of a plant that cut its power use in half.|Everyone should recycle.", trap: "Everyone should recycle.", why: "That is an opinion. Which sentences point to the article?", win: "Both point to what the article says." },
    { say: "Claim: Nell is stubborn. Tap the two with text evidence by yourself.", mark: "*Nell refuses three offers of help with the heavy crate.|Stubborn people annoy me.|*She mutters, “I said I can do it.”|I would have asked for help.|Nell is my favorite.", trap: "I would have asked for help." },
  ],
}));
