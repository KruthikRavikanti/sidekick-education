// Who Is Talking?. Skill RL.1.6-1.
// Identifying who is telling the story at various points in a text. Thinking the author is always the one talking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Is Talking?",
  emoji: "🗣️",
  premise: "In a story, different characters take turns telling what happens. The words said and asked show who is talking.",
  outro: "Look for said or asked and a name. That tells you who is talking.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Find the name next to the word said.",
  tag: "author_is_always_narrator",
  rounds: [
    { say: "Who is talking in each one?", rows: [["\"I ran to the door,\" said Sam.", "Sam"], ["\"I am so sleepy,\" said Mom.", "Mom"]], extra: "the author|", trap: [0, "the author"], why: "Look after the word said. It tells you Sam is talking.", win: "Sam, then Mom." },
    { say: "Who is talking in each one?", rows: [["\"Where is my ball?\" asked Tim.", "Tim"], ["Jan said, \"It is under the bed.\"", "Jan"], ["\"Thank you!\" said Tim.", "Tim"]], extra: "the ball|", trap: [1, "Tim"], why: "This time the name comes first: Jan said.", win: "Tim, Jan, then Tim again." },
    { say: "Who is talking? Work it out by yourself.", rows: [["\"Look at the moon,\" said Dad.", "Dad"], ["Ava asked, \"Can we touch it?\"", "Ava"], ["\"It is too far away,\" said Dad.", "Dad"]], extra: "the moon|the author", trap: [1, "Dad"] },
  ],
}));
