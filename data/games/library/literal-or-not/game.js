// Literal or Not?. Skill L.3.5-1.
// Distinguishing the literal and nonliteral meanings of words and phrases in context. Reading idioms literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Literal or Not?",
  emoji: "🪜",
  premise: "Literal words mean exactly what they say. Nonliteral words mean something else. Take steps can mean climb, or it can mean act.",
  outro: "Decide from the sentence whether words are meant literally or not.",
  scene: "desk",
  kind: "sort",
  hint: "Could it really happen just as the words say?",
  tag: "reads_idioms_literally",
  rounds: [
    { say: "Is the phrase meant literally?", bins: "Literal|Nonliteral", items: ["She took three steps up the ladder.|He broke a plate.", "We must take steps to solve it.|He broke the ice with a joke."], trap: ["We must take steps to solve it.", 0], why: "No one is walking. Take steps here means to act.", win: "Literal and nonliteral." },
    { say: "Sort these.", bins: "Literal|Nonliteral", items: ["The cat is in the bag.|I am under the bed.", "He let the cat out of the bag.|I am under the weather."], trap: ["I am under the weather.", 0], why: "You cannot be under weather. It means feeling sick.", win: "You told them apart." },
    { say: "Sort these by yourself.", bins: "Literal|Nonliteral", items: ["She hit the ball.|The pot is on the stove.", "She hit the books all night.|Keep an eye on the baby."], trap: ["She hit the books all night.", 0] },
  ],
}));
