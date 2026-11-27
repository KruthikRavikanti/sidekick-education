// Novel Chapter. Skill RL.4.10-1.
// Reading and comprehending literature in the grades 4-5 complexity band. Struggling with longer texts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Novel Chapter",
  emoji: "📘",
  premise: "A chapter from a novel has more going on. Track who wants what and what changes by the end.",
  outro: "In longer fiction, follow the character, the problem and what changes.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Go back to the passage for each answer.",
  tag: "loses_track_in_longer_text",
  rounds: [
    { say: "Read the passage. Answer each question.", read: "The lantern flickered as Tomas edged along the tunnel. Somewhere ahead, his brother was calling. He had promised their mother he would not come down here, but a promise meant little if Luis was hurt.", rows: [["What does Tomas want?", "to reach his brother"], ["What rule is he breaking?", "a promise to his mother"]], extra: "to find treasure|", trap: [0, "to find treasure"], why: "Nothing mentions treasure. Who is calling?", win: "A goal and a broken promise." },
    { say: "Read this passage. Answer each question.", read: "For weeks Priya had dreaded the science fair. Now, standing beside her volcano, she heard herself explaining it clearly. A judge nodded. Maybe she had been afraid of the least frightening thing in the world.", rows: [["How did she feel before?", "full of dread"], ["What changed?", "she found she could do it"]], extra: "she won first prize|", trap: [1, "she won first prize"], why: "The passage never says she won. What did she discover?", win: "Dread turned into confidence." },
    { say: "Read and answer by yourself.", read: "Gran’s farm had no screens and, Eli was sure, nothing to do. By day three he could milk a goat and name six stars.", rows: [["Eli expected", "to be bored"], ["Instead", "he learned a lot"]], extra: "he left early|", trap: [1, "he left early"] },
  ],
}));
