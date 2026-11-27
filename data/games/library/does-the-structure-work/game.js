// Does the Structure Work?. Skill RI.11-12.5-1.
// Analyzing and evaluating the effectiveness of the structure an author uses in an exposition or argument. Describing the structure only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Does the Structure Work?",
  emoji: "🏛️",
  premise: "It is not enough to describe how an argument is built. Judge it: does the structure make the points clear and convincing?",
  outro: "Evaluate the effectiveness of an argument’s structure: does it make the points clear, convincing and engaging?",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Does this choice help the reader follow and believe the argument?",
  tag: "describes_structure_only",
  rounds: [
    { say: "Which structural choices strengthen an argument?", bins: "Strengthens it|Weakens it", items: ["stating the claim early|answering the strongest objection", "burying the claim in the last line|listing evidence in no clear order"], trap: ["burying the claim in the last line", 0], why: "Readers cannot weigh evidence for a claim they have not seen yet.", win: "Clear claim, ordered proof, objections met." },
    { say: "Evaluate, do not just describe. Which comments judge effectiveness?", bins: "Evaluates|Only describes", items: ["Opening with a story makes the data matter to readers.|Saving the cost for last leaves it unanswered.", "The essay has five paragraphs.|It starts with a story."], trap: ["It starts with a story.", 0], why: "That names a feature. Evaluation says whether the story helps.", win: "Say what works and why." },
    { say: "Sort these choices by yourself.", bins: "Strengthens it|Weakens it", items: ["moving from the weakest point to the strongest|defining key terms before using them", "changing topics mid-paragraph|ending on an unrelated anecdote"], trap: ["ending on an unrelated anecdote", 0] },
  ],
}));
