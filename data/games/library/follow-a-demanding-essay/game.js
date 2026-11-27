// Follow a Demanding Essay. Skill RI.11-12.10-1.
// Reading and comprehending literary nonfiction at the high end of the grades 11 to college-ready band. Needing support and stopping at the first claim is the known slip.
Sidekick.game(Sidekick.play({
  title: "Follow a Demanding Essay",
  emoji: "🧗",
  premise: "Advanced essays rarely state one neat point. They qualify, concede and turn. Track the turns to find what the writer finally holds.",
  outro: "In complex nonfiction, follow concessions and turns to identify the central ideas.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Words like yet, but and still mark the turn toward the writer’s real position.",
  tag: "stops_at_first_claim",
  rounds: [
    { say: "Tap the ONE sentence that states where the writer ends up.", read: "It is tempting to call memory a record. Yet every recollection is a retelling, shaped by who we have become. We do not replay the past; we rewrite it.", mark: "Memory is an exact record.|Recalling is tempting.|*Remembering reshapes the past each time.|The past cannot be known at all.", trap: "Memory is an exact record.", why: "That is the tempting view the writer sets up, then turns from at Yet.", win: "After the turn comes the real claim." },
    { say: "Label each move in the passage.", read: "It is tempting to call memory a record. Yet every recollection is a retelling, shaped by who we have become. We do not replay the past; we rewrite it.", kind: "fill", fs: 4.4, cast: "", rows: [["It is tempting", "a view the writer will reject"], ["Yet", "the turn"], ["we rewrite it", "the writer’s own claim"]], trap: [0, "the writer’s own claim"], why: "Tempting signals a view about to be questioned.", win: "Set up, turn, claim." },
    { say: "Tap the ONE sentence that states where the writer ends up, by yourself.", read: "Solitude, we are told, is a luxury. Perhaps. But a mind never left alone learns nothing of itself, and a society of such minds learns less.", mark: "Solitude is only a luxury.|People tell us things.|Luxuries are pleasant.|*Time alone is necessary for self-knowledge.|Society is always harmful.|Minds are busy.", trap: "Solitude is only a luxury." },
  ],
}));
