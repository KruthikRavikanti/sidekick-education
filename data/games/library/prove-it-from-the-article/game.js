// Prove It From the Article. Skill RI.3.1-1.
// Asking and answering questions referring explicitly to the text. Answering from memory instead of the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prove It From the Article",
  emoji: "🌍",
  premise: "When you answer a question about an article, find the exact sentence that gives the answer.",
  outro: "Point to the sentence in the text that answers the question.",
  scene: "space",
  kind: "pick",
  hint: "Which sentence in the article actually answers the question?",
  tag: "answers_from_memory",
  rounds: [
    { say: "What causes the seasons? Tap the sentence that answers it.", mark: ["Earth travels around the sun once a year.", "*Because Earth is tilted, each half gets more direct sunlight at different times.", "Summer is warmer than winter.", "Many people like spring best."], trap: "Summer is warmer than winter.", why: "That is true, but it does not say what CAUSES the seasons.", win: "The tilt is the cause." },
    { say: "Why do leaves change color? Tap the sentence that answers it.", mark: ["Leaves are green in summer.", "Fall days get shorter.", "*With less sunlight, leaves stop making the green stuff called chlorophyll.", "Children like to jump in leaf piles."], trap: "Leaves are green in summer.", why: "That tells what they look like before. Which sentence tells why they change?", win: "Less green lets other colors show." },
    { say: "How do sea otters stay warm? Tap the two sentences that answer it.", mark: ["Sea otters live in cold water.", "*They have the thickest fur of any animal.", "They eat clams and crabs.", "*They also trap air in their fur to hold in heat.", "Otters float on their backs."], trap: "Sea otters live in cold water." },
  ],
}));
