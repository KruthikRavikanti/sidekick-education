// Small Units, Big Numbers. Skill 2.MD.A.2-2.
// Why a smaller unit gives a bigger number: each card names the unit used instead of another, and the child sorts by which gives the bigger count. Thinking a bigger unit gives a bigger number is the known slip.
Sidekick.game(Sidekick.play({
  title: "Small Units, Big Numbers",
  emoji: "🔬",
  premise: "Measure the same rope with two different units. One unit will always give the bigger number. Which one?",
  outro: "The smaller the unit, the more of them you need, so the number is bigger.",
  scene: "paper",
  kind: "sort",
  hint: "Smaller units fit more times along the same length.",
  tag: "bigger_unit_bigger_number",
  rounds: [
    { say: "You measure the same rope. Which unit gives the bigger number?", bins: "Bigger number|Smaller number", items: ["inches (not feet)|centimeters (not meters)", "feet (not inches)|meters (not centimeters)"], trap: ["feet (not inches)", 0], why: "Feet are bigger units, so fewer of them fit. The number is smaller.", win: "Small units give big numbers." },
    { say: "Now measure a table with everyday things.", bins: "Bigger number|Smaller number", items: ["paper clips (not shoes)|pennies (not books)", "shoes (not paper clips)|books (not pennies)"], trap: ["shoes (not paper clips)", 0], why: "A shoe is longer than a paper clip, so fewer shoes fit.", win: "More small things fit along the table." },
    { say: "Sort these by yourself.", bins: "Bigger number|Smaller number", items: ["centimeters (not inches)|inches (not yards)|baby steps (not giant steps)", "yards (not inches)|meters (not centimeters)"], trap: ["yards (not inches)", 0] },
  ],
}));
