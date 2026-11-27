// Set the Scene. Skill W.3.3-1.
// Establishing a situation and introducing a narrator or characters in a narrative. Starting in the middle with no setup is the known slip.
Sidekick.game(Sidekick.play({
  title: "Set the Scene",
  emoji: "🎭",
  premise: "A story should not start in the middle. First tell the reader who is there, where they are, and what is going on.",
  outro: "A story opening introduces the characters, the setting and the situation.",
  scene: "night",
  kind: "pick",
  hint: "Does it tell who and where before things happen?",
  tag: "starts_in_the_middle",
  rounds: [
    { say: "Tap the openings that set the scene.", yes: "On a foggy morning, Mia and her dog set out along the beach.|Deep in the forest, a young owl was learning to fly.", no: "Then it exploded.|And he ran after it.", trap: "Then it exploded.", why: "What exploded? Who is there? The reader has no setup yet.", win: "Who, where and what is going on." },
    { say: "Tap the openings that set the scene.", yes: "Ben had lived on the farm all his life, but today felt different.|It was the last day of summer, and Jo sat alone on the dock.", no: "So they grabbed it.|After that she left.|It was gone.", trap: "So they grabbed it.", why: "Grabbed what? Start by telling who and where.", win: "Good openings set things up." },
    { say: "Tap the scene-setting openings by yourself.", yes: "In a tiny shop at the edge of town, an old clockmaker was hard at work.|Rain tapped on the bus window as Sam rode to his new school.", no: "Suddenly it broke.|He said no again.|They finally got there.", trap: "Suddenly it broke." },
  ],
}));
