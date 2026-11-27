// Who Is the Reader?. Skill W.4.4-1.
// Producing clear and coherent writing appropriate to task, purpose and audience. Ignoring the audience is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Is the Reader?",
  emoji: "📨",
  premise: "How you write depends on who will read it. A note to a friend and a letter to the principal sound different.",
  outro: "Match your style to your task, purpose and audience.",
  scene: "paper",
  kind: "sort",
  hint: "Who is going to read this?",
  tag: "ignores_audience",
  rounds: [
    { say: "Who is each sentence right for?", bins: "The principal|A friend", items: ["I am writing to request a longer recess.|Thank you for considering my idea.", "Recess is way too short, right?|Wanna trade snacks?"], trap: ["Recess is way too short, right?", 0], why: "That is how you chat with a friend, not write to the principal.", win: "Formal for one, casual for the other." },
    { say: "Who is each sentence right for?", bins: "A museum director|Your little sister", items: ["We would be grateful for a tour of the exhibit.|Our class has studied dinosaurs for a month.", "Dinos are SO big!|Guess what we get to see!"], trap: ["Dinos are SO big!", 0], why: "That excited, simple tone is for a little sister.", win: "The audience shapes the writing." },
    { say: "Sort these by yourself.", bins: "The mayor|A classmate", items: ["Our town would benefit from a new crosswalk.|I respectfully ask for your support.", "That street is super scary, huh?|See you at the bus stop."], trap: ["That street is super scary, huh?", 0] },
  ],
}));
