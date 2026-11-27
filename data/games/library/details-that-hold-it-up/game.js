// Details That Hold It Up. Skill RI.3.2-2.
// Recounting the key details and explaining how they support the main idea. Listing details unrelated to the main idea is the known slip.
Sidekick.game(Sidekick.play({
  title: "Details That Hold It Up",
  emoji: "🏛️",
  premise: "Key details are like pillars under a roof. Each one helps hold up the main idea.",
  outro: "Key details support the main idea. Other facts, even true ones, do not belong.",
  scene: "sand",
  kind: "pick",
  hint: "Does this detail help prove the main idea?",
  tag: "unrelated_details",
  rounds: [
    { say: "Main idea: Owls are built to hunt at night. Tap the details that support it.", yes: "Their big eyes see in dim light.|Their soft feathers make no sound.|Their ears can find a mouse in the dark.", no: "Owls live on every continent but one.|Some owls are white.", trap: "Some owls are white.", why: "Color does not show how they hunt at night.", win: "Three details that hold up the main idea." },
    { say: "Main idea: Exercise keeps you healthy. Tap the details that support it.", yes: "It makes your heart stronger.|It helps you sleep well.", no: "Soccer has eleven players.|Some gyms are open late.|Running shoes come in many colors.", trap: "Soccer has eleven players.", why: "That is a fact about soccer, not about health.", win: "Two supporting details." },
    { say: "Main idea: Rain forests are full of life. Tap the details by yourself.", yes: "Millions of kinds of insects live there.|Half of the world’s plant types grow there.", no: "Rain forests are far away.|It is hard to walk there.|Some trees are cut for wood.", trap: "Rain forests are far away." },
  ],
}));
