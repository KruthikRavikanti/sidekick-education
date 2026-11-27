// Read, Then Tell. Skill RF.2.4-1.
// Reading grade-level text with purpose and understanding. Reading quickly without understanding is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read, Then Tell",
  emoji: "🦫",
  premise: "Reading fast is not the goal. Read so that you can tell what the text was mostly about.",
  outro: "Read to understand: what was this mostly about?",
  scene: "forest",
  kind: "pick",
  hint: "Think about all the sentences. What do they add up to?",
  tag: "reads_without_understanding",
  rounds: [
    { say: "Read the text. Tap what it is mostly about.", read: "Beavers cut down trees with their teeth. They pile up sticks and mud across a stream. The dam makes a pond where they build a home.", yes: "how beavers build a dam|", no: "what trees are made of|how to swim|why mud is brown", trap: "what trees are made of", why: "Trees are in it, but the whole text is about what beavers do.", win: "It is about how beavers build." },
    { say: "Read this text. Tap what it is mostly about.", read: "Jada was nervous on her first day. A boy showed her where to sit. By lunch they were laughing together.", yes: "Jada makes a friend at school|", no: "what Jada ate for lunch|a boy who is lost|how to find a seat", trap: "what Jada ate for lunch", why: "Lunch is one small part. Think about the whole story.", win: "Jada found a friend." },
    { say: "Tap what it is mostly about, by yourself.", read: "First the cocoa pods are picked. The beans inside are dried and roasted. Then they are ground up and mixed with sugar.", yes: "how chocolate is made|", no: "how sugar grows|why beans are brown|a trip to a farm|how to pick fruit|what pods are", trap: "how sugar grows" },
  ],
}));
