// Will the Answers Vary?. Skill 6.SP.A.1-2.
// Understanding that statistical questions anticipate variability in the data. Expecting all answers to be the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "Will the Answers Vary?",
  emoji: "📋",
  premise: "A statistical question expects many different answers. You need data to answer it, because the answers vary.",
  outro: "A statistical question is one whose answers are expected to vary.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "If you asked 20 people, would you hear different answers?",
  tag: "expects_no_variability",
  rounds: [
    { say: "Would the answers vary, or is there one answer?", bins: "Answers vary|One answer", items: ["How many pets does each classmate have?|How long do students sleep?", "How many days are in June?|How tall is the flagpole?"], trap: ["How many pets does each classmate have?", 1], why: "Different classmates have different numbers of pets.", win: "Questions about a group give answers that vary." },
    { say: "Sort these questions.", bins: "Answers vary|One answer", items: ["What shoe sizes are in our class?|How far do students live from school?", "How many legs does a spider have?|What is 6 × 7?"], trap: ["What shoe sizes are in our class?", 1], why: "A class has many shoe sizes. You would need to collect data.", win: "Two statistical questions, two with one answer." },
    { say: "Sort these by yourself.", bins: "Answers vary|One answer", items: ["How many books did each student read?|What do sixth graders weigh?", "How many sides does a hexagon have?|How many students are in room 12 today?"], trap: ["How many books did each student read?", 1] },
  ],
}));
