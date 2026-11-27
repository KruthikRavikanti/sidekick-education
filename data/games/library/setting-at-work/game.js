// Setting at Work. Skill RL.7.3-1.
// Analyzing how particular elements of a story interact, such as how setting shapes characters or plot. Describing the setting separately is the known slip.
Sidekick.game(Sidekick.play({
  title: "Setting at Work",
  emoji: "🏔️",
  premise: "A setting is more than a backdrop. It can trap characters, tempt them, or force their choices.",
  outro: "Analyze how the time and place shape what characters do and what happens.",
  scene: "snow",
  kind: "sort",
  fs: 4.4,
  hint: "Does this detail change what a character can do or must do?",
  tag: "setting_as_backdrop",
  rounds: [
    { say: "A blizzard closes the mountain pass. Which details shape the plot?", bins: "Shapes the plot|Just scenery", items: ["The snowed-in road forces rivals to share one cabin.|With no phone signal, they must solve it themselves.", "The cabin has blue curtains.|Pine trees stand outside."], trap: ["The cabin has blue curtains.", 0], why: "Curtains do not change what anyone does.", win: "The storm traps them together." },
    { say: "A drought hits a farming town in the 1930s. Sort the details.", bins: "Shapes the plot|Just scenery", items: ["Dry wells push the family to leave their land.|Dust storms keep the children home from school.", "The barn is painted red.|A rooster sits on the fence."], trap: ["The barn is painted red.", 0], why: "The color of the barn changes nothing in the story.", win: "The drought drives the choices." },
    { say: "A story is set on a tiny island with one ferry a week. Sort by yourself.", bins: "Shapes the plot|Just scenery", items: ["Missing the ferry strands the hero for seven days.|Everyone knows everyone, so the secret spreads fast.", "The lighthouse is striped.|Shells cover the beach."], trap: ["Shells cover the beach.", 0] },
  ],
}));
