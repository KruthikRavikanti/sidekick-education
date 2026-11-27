// Dangling Modifier Rescue. Skill L.7.1-3.
// Placing phrases and clauses within a sentence, correcting misplaced and dangling modifiers. Writing dangling modifiers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dangling Modifier Rescue",
  emoji: "🪝",
  premise: "An opening phrase must describe the very next noun. If it does not, the sentence says something silly.",
  outro: "Put the person or thing being described right after the opening phrase.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Who is doing the action in the opening phrase? Is that who comes next?",
  tag: "dangling_modifier",
  rounds: [
    { say: "Clear, or dangling?", bins: "Clear|Dangling", items: ["Walking to school, I got soaked by the rain.|Covered in mud, the dog shook itself.", "Walking to school, the rain soaked me.|Covered in mud, I washed the dog."], trap: ["Walking to school, the rain soaked me.", 0], why: "It says the rain was walking to school.", win: "The doer must follow the comma." },
    { say: "Sort these.", bins: "Clear|Dangling", items: ["Running for the bus, Lena dropped her phone.|Tired from the hike, we slept early.", "Running for the bus, the phone fell.|Tired from the hike, the tent looked great."], trap: ["Running for the bus, the phone fell.", 0], why: "It says the phone was running for the bus.", win: "Name who did it right after the phrase." },
    { say: "Sort these by yourself.", bins: "Clear|Dangling", items: ["Looking up, Sam saw a hawk.|Baked for an hour, the bread turned golden.", "Looking up, a hawk appeared.|Baked for an hour, I ate the bread."], trap: ["Looking up, a hawk appeared.", 0] },
  ],
}));
