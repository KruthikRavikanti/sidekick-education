// Show Me Where It Says. Skill RL.3.1-1.
// Asking and answering questions referring explicitly to the text as the basis for the answers. Answering without pointing to where the text says so is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show Me Where It Says",
  emoji: "👉",
  premise: "A good answer comes with proof. Point to the sentence in the story that shows your answer is right.",
  outro: "Refer to the text: find the sentence that proves your answer.",
  scene: "paper",
  kind: "pick",
  hint: "Which sentence would you point to as your proof?",
  tag: "no_text_reference",
  rounds: [
    { say: "Why was Maya upset? Tap the sentence that proves it.", mark: ["Maya walked home slowly.", "*Her best friend had moved away that morning.", "It was a sunny day.", "She kicked a stone down the path."], trap: "She kicked a stone down the path.", why: "That shows she was upset. Which sentence tells WHY?", win: "That sentence is the proof." },
    { say: "How do we know Leo was brave? Tap the proof.", mark: ["Leo was nine years old.", "The dog was stuck on the ice.", "*Leo crawled out on the ice and pulled the dog back.", "His mom made hot cocoa."], trap: "The dog was stuck on the ice.", why: "That is the problem. Which sentence shows what Leo DID?", win: "His action is the proof." },
    { say: "What did the storm do to the town? Tap the two sentences that prove it.", mark: ["The storm came at night.", "*Wind tore the roof off the old barn.", "People stayed inside.", "*By morning the main street was under water.", "The sky was gray."], trap: "The sky was gray." },
  ],
}));
