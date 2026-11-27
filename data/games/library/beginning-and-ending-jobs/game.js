// Beginning and Ending Jobs. Skill RL.2.5-1.
// Describing the overall structure of a story: how the beginning introduces the story and the ending concludes the action. Not being able to say what the beginning does is the known slip.
Sidekick.game(Sidekick.play({
  title: "Beginning and Ending Jobs",
  emoji: "🎬",
  premise: "A story has a shape. The beginning sets things up. The ending wraps things up.",
  outro: "The beginning introduces the characters and problem. The ending shows how it turns out.",
  scene: "city",
  kind: "sort",
  hint: "Does it set things up, or wrap things up?",
  tag: "cannot_name_the_jobs",
  rounds: [
    { say: "Is it a job of the beginning or the ending?", bins: "Beginning|Ending", items: ["tells who the story is about|shows the problem", "solves the problem|tells how things turned out"], trap: ["shows the problem", 1], why: "The problem is set up early, so we want to read on.", win: "Set up, then wrap up." },
    { say: "Sort these story sentences.", bins: "Beginning|Ending", items: ["Once there was a shy fox named Pip.|Pip had no friends in the woods.", "From that day on, Pip was never lonely.|At last, Pip had a friend."], trap: ["Pip had no friends in the woods.", 1], why: "That sets up the problem. It comes near the start.", win: "The start sets up Pip. The end shows the change." },
    { say: "Sort these by yourself.", bins: "Beginning|Ending", items: ["One morning, Ava found a tiny egg.|She did not know what was inside.", "And that is how Ava got a pet duck.|Ava and her duck lived happily."], trap: ["She did not know what was inside.", 1] },
  ],
}));
