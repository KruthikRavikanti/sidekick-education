// Can, May, Must. Skill L.4.1-3.
// Using modal auxiliaries to convey various conditions. Using can to ask permission is the known slip.
Sidekick.game(Sidekick.play({
  title: "Can, May, Must",
  emoji: "🚦",
  premise: "Helper verbs change the meaning. Can is about ability. May is about permission. Must is about what is required.",
  outro: "Use can for ability, may for permission and must for a requirement.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is it about being able, being allowed, or having to?",
  tag: "can_for_permission",
  rounds: [
    { say: "Drop in the helper verb that fits.", rows: [["___ I go to the restroom? (asking permission)", "May"], ["I ___ swim across the pool. (able to)", "can"]], extra: "must", trap: [0, "can"], why: "You are asking to be allowed. That is may.", win: "May for permission, can for ability." },
    { say: "Drop in these helper verbs.", rows: [["You ___ wear a helmet. (it is required)", "must"], ["It ___ rain later. (it is possible)", "might"], ["She ___ lift fifty pounds. (able to)", "can"]], trap: [0, "can"], why: "A helmet is required. That is must.", win: "Must, might and can." },
    { say: "Drop these in by yourself.", rows: [["___ we stay up late? (asking permission)", "May"], ["Drivers ___ stop at a red light. (required)", "must"], ["A cheetah ___ run 60 miles an hour. (able to)", "can"]], extra: "might", trap: [0, "can"] },
  ],
}));
