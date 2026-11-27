// Idea Web. Skill RI.8.2-1.
// Determining a central idea and analyzing its development, including its relationship to supporting ideas. Just listing ideas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Idea Web",
  emoji: "🕷️",
  premise: "A central idea is held up by supporting ideas, and those are held up by details. See how the levels connect.",
  outro: "Analyze how supporting ideas develop the central idea.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Which is the biggest point? Which points explain it?",
  tag: "lists_ideas",
  rounds: [
    { say: "Sort the statements from one article into levels.", bins: "Central idea|Supporting idea", items: ["Cities are redesigning streets for people, not just cars.|", "Wider sidewalks invite walking.|Protected lanes make cycling safer.|Slower traffic cuts crashes."], trap: ["Slower traffic cuts crashes.", 0], why: "That is one way streets are changing. The central idea covers all three.", win: "Three ideas hold up the main one." },
    { say: "Sort these.", bins: "Central idea|Supporting idea", items: ["Sleep is essential to learning.|", "Memories are sorted during deep sleep.|Tired brains focus poorly.|Sleep clears waste from brain cells."], trap: ["Tired brains focus poorly.", 0], why: "It is one reason. Which statement do all the reasons support?", win: "Reasons build the central idea." },
    { say: "Sort these by yourself.", bins: "Central idea|Supporting idea", items: ["The printing press transformed Europe.|", "Books became affordable.|Ideas spread across borders.|More people learned to read."], trap: ["Ideas spread across borders.", 0] },
  ],
}));
