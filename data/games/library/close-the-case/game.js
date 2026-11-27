// Close the Case. Skill W.7.1-3.
// Providing a concluding statement that follows from and supports the argument. Just repeating the introduction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Close the Case",
  emoji: "🔨",
  premise: "A conclusion should grow out of the argument. Copying the first paragraph word for word adds nothing.",
  outro: "Conclude by drawing the reasons together and showing why the claim matters.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Does it pull the reasons together, or only say the claim again?",
  tag: "repeats_the_intro",
  rounds: [
    { say: "The essay argued that the town needs a youth center. Sort the endings.", bins: "Strong conclusion|Weak conclusion", items: ["With safe space, tutoring and sports in one place, a youth center is worth the cost.|A center would give teens somewhere to belong.", "The town needs a youth center.|Also, the pool is too cold."], trap: ["The town needs a youth center.", 0], why: "That only repeats the claim. A conclusion gathers the reasons.", win: "Strong endings sum up why." },
    { say: "The essay argued for longer library hours. Sort the endings.", bins: "Strong conclusion|Weak conclusion", items: ["Evening hours would serve students, workers and families alike.|Opening later costs little and helps many.", "Libraries should be open longer.|In conclusion, that is my essay."], trap: ["In conclusion, that is my essay.", 0], why: "It announces an ending without saying anything.", win: "Pull the reasons together." },
    { say: "The essay argued for a school garden. Sort by yourself.", bins: "Strong conclusion|Weak conclusion", items: ["A garden would teach science, feed the cafeteria and cut waste.|Few projects give so much for so little.", "We should have a garden.|Gardens have dirt."], trap: ["We should have a garden.", 0] },
  ],
}));
