// Who Did You Ask?. Skill 7.SP.A.1-1.
// Understanding that a sample can represent a population only if it is representative. Thinking bigger samples are always representative is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Did You Ask?",
  emoji: "🗳️",
  premise: "A sample stands in for a whole population only if it looks like that population. Who you ask matters more than how many.",
  outro: "A sample represents a population when everyone had a fair chance to be in it.",
  scene: "city",
  kind: "sort",
  fs: 4.8,
  hint: "Does this group lean one way before you even ask?",
  tag: "bigger_is_always_fair",
  rounds: [
    { say: "The question: what is the favorite sport at our school? Sort the samples.", bins: "Fair sample|Leans one way", items: ["Every 10th name on the school list|Names drawn from a hat of all students", "Only the soccer team|Only your friends"], trap: ["Only the soccer team", 0], why: "Soccer players will mostly say soccer. They do not stand for the whole school.", win: "Fair samples give everyone a chance." },
    { say: "Same question. Sort these samples.", bins: "Fair sample|Leans one way", items: ["30 students picked at random|Every 5th person in the lunch line", "300 fans at a soccer game|Everyone in the chess club"], trap: ["300 fans at a soccer game", 0], why: "A big sample from one kind of group still leans one way.", win: "Size cannot fix a lopsided sample." },
    { say: "The question: how much do students at our school read? Sort these by yourself.", bins: "Fair sample|Leans one way", items: ["Every 8th name on the roll|50 students from a random draw", "200 people at the library|Only the book club"], trap: ["200 people at the library", 0] },
  ],
}));
