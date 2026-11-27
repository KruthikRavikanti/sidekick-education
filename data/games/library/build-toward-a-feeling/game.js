// Build Toward a Feeling. Skill W.11-12.3-3.
// Using a variety of techniques to sequence events so that they build toward a particular tone and outcome. Writing a disjointed sequence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build Toward a Feeling",
  emoji: "📈",
  premise: "Order creates mood. Arrange events so each one tightens the feeling you want: mystery, suspense, growth or relief.",
  outro: "Sequence events so they build on one another toward a particular tone and outcome.",
  scene: "night",
  kind: "row",
  fs: 4.4,
  hint: "Start with the smallest unease. Save the biggest moment for last.",
  tag: "disjointed",
  rounds: [
    { say: "Order these to build suspense, from faint unease to the peak.", seq: "The porch light is off, which is odd.|The front door stands open an inch.|Inside, a drawer has been pulled out.|Upstairs, a floorboard creaks.", trap: "Upstairs, a floorboard creaks.|The porch light is off, which is odd.|The front door stands open an inch.|Inside, a drawer has been pulled out.", why: "Starting with the creak spends the biggest scare first. Let the dread climb.", win: "Small sign to large." },
    { say: "Order these to build toward relief.", seq: "The search party finds a single glove.|Dogs pick up a trail by the creek.|A faint voice answers from the ravine.|She is carried out, cold but smiling.", trap: "She is carried out, cold but smiling.|The search party finds a single glove.|Dogs pick up a trail by the creek.|A faint voice answers from the ravine.", why: "Relief only lands after the worry has had time to grow.", win: "Hope rises step by step." },
    { say: "Order these to build a sense of growth by yourself.", seq: "He cannot hold the chisel steady.|His first joint splits.|A drawer finally slides true.|He signs the underside of the finished desk.", trap: "He signs the underside of the finished desk.|He cannot hold the chisel steady.|His first joint splits.|A drawer finally slides true." },
  ],
}));
