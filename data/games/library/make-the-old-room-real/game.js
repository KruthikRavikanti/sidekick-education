// Make the Old Room Real. Skill W.5.3-4.
// Using concrete words and phrases and sensory details. Generic description is the known slip.
Sidekick.game(Sidekick.play({
  title: "Make the Old Room Real",
  emoji: "🕰️",
  premise: "The room was old tells almost nothing. Dust, creaks and a musty smell let the reader stand inside it.",
  outro: "Use concrete words and sensory details to convey experiences precisely.",
  scene: "night",
  kind: "sort",
  hint: "Can you see, hear, smell or touch it?",
  tag: "generic_description",
  rounds: [
    { say: "Which details make the old room real?", bins: "Concrete detail|Generic", items: ["Dust lay thick on the piano keys.|The floorboards groaned at every step.", "The room was old.|It was not very nice."], trap: ["The room was old.", 0], why: "Old is a label. What does old look, sound or smell like?", win: "Concrete details you can sense." },
    { say: "Which details make the storm real?", bins: "Concrete detail|Generic", items: ["Rain hammered the tin roof.|Lightning lit the yard white.", "The storm was bad.|There was weather."], trap: ["The storm was bad.", 0], why: "Bad gives the reader nothing to hear or see.", win: "Sound and sight details." },
    { say: "Sort these details about a market by yourself.", bins: "Concrete detail|Generic", items: ["Cinnamon and frying dough scented the air.|Vendors shouted prices over the crowd.", "The market was busy.|It had things."], trap: ["The market was busy.", 0] },
  ],
}));
