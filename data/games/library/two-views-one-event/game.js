// Two Views, One Event. Skill RL.7.6-1.
// Analyzing how an author develops and contrasts the points of view of different characters. Identifying only one view is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Views, One Event",
  emoji: "🪟",
  premise: "Two characters can see the same event completely differently. Authors show each view through thoughts and words.",
  outro: "Contrast points of view by matching each thought or line to the character who holds it.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Who would think this: the one who wants it, or the one who fears it?",
  tag: "identifies_one_view",
  rounds: [
    { say: "Jay wants to bike to the city alone. His mother worries. Whose view is each line?", bins: "Jay|His mother", items: ["Twelve miles is nothing. I am not a kid.|Finally, a whole day that is mine.", "He has never ridden in traffic.|What if the chain breaks far from home?"], trap: ["He has never ridden in traffic.", 0], why: "That is a worry about him, from someone watching.", win: "Freedom on one side, worry on the other." },
    { say: "A new student joins the team. Whose view is each line?", bins: "The captain|The new student", items: ["We already have our lineup.|She will change how we play.", "I only want one chance to try out.|Nobody here knows what I can do."], trap: ["She will change how we play.", 1], why: "She refers to the new student. The captain is the one thinking it.", win: "One guards the team. One wants in." },
    { say: "A family moves to the country. Sort by yourself.", bins: "The father|The daughter", items: ["Fresh air and space at last.|The kids will thank me one day.", "My friends are three hours away.|There is nothing to do out here."], trap: ["The kids will thank me one day.", 1] },
  ],
}));
