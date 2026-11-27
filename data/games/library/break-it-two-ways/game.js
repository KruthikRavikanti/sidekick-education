// Break It Two Ways. Skill 4.NF.B.3-2.
// Decomposing a fraction into a sum of fractions with the same denominator in more than one way. Believing there is only one way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Break It Two Ways",
  emoji: "🍫",
  premise: "A fraction can be broken into smaller parts in many different ways. Find every way that works.",
  outro: "One fraction can be split into a sum in more than one way.",
  scene: "candy",
  kind: "pick",
  fs: 6,
  hint: "Add the top numbers of each one. Do they make the target?",
  tag: "only_one_way",
  rounds: [
    { say: "Tap every sum that makes {5/6}.", yes: "{1/6} + {4/6}|{2/6} + {3/6}|{1/6} + {1/6} + {3/6}", no: "{2/6} + {2/6}|{3/6} + {3/6}|{5/6} + {1/6}", trap: "-{2/6} + {3/6}", why: "There is more than one way. Check this one too: 2 sixths and 3 sixths.", win: "Three different ways to make five sixths." },
    { say: "Tap every sum that makes {7/8}.", yes: "{3/8} + {4/8}|{1/8} + {6/8}|{2/8} + {2/8} + {3/8}", no: "{4/8} + {4/8}|{2/8} + {4/8}|{7/8} + {1/8}", trap: "{4/8} + {4/8}", why: "4 eighths and 4 eighths make 8 eighths. That is one whole.", win: "Three ways to make seven eighths." },
    { say: "Tap every sum that makes {4/5}.", yes: "{1/5} + {3/5}|{2/5} + {2/5}|{1/5} + {1/5} + {2/5}", no: "{3/5} + {2/5}|{4/5} + {1/5}|{1/5} + {2/5}", trap: "-{2/5} + {2/5}" },
  ],
}));
