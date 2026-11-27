// Which Depends on Which?. Skill 6.EE.C.9-1.
// Identifying the dependent and independent variables in a relationship. Reversing them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Depends on Which?",
  emoji: "⏱️",
  premise: "When two quantities are linked, one depends on the other. Pay depends on hours worked, not the other way around.",
  outro: "The dependent variable changes because of the independent variable.",
  scene: "city",
  kind: "sort",
  hint: "Which one do you choose or control? Which one results from it?",
  tag: "reverses_dependence",
  rounds: [
    { say: "You earn 9 dollars per hour. A taxi charges 2 dollars per mile. Sort the quantities.", bins: "Independent|Dependent", items: ["hours worked|miles ridden", "pay earned|taxi fare"], trap: ["pay earned", 0], why: "Pay results from the hours. It depends on them.", win: "Pay depends on hours. Fare depends on miles." },
    { say: "Sort the quantities in these two situations.", bins: "Independent|Dependent", items: ["number of tickets bought|days a plant has grown", "total cost of the tickets|height of the plant"], trap: ["height of the plant", 0], why: "The height results from how many days have passed.", win: "The result is the dependent one." },
    { say: "Sort these by yourself.", bins: "Independent|Dependent", items: ["miles driven|minutes of exercise", "gas used|calories burned"], trap: ["gas used", 0] },
  ],
}));
