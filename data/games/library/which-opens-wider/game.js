// Which Opens Wider?. Skill 4.MD.C.5-1.
// An angle is formed by two rays with a common endpoint and is measured by its opening. Thinking longer rays make a bigger angle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Opens Wider?",
  emoji: "🐊",
  premise: "An angle is two rays that share an endpoint. Its size is how wide it opens, not how long its sides are.",
  outro: "The size of an angle is the opening between the rays. Longer rays do not make a bigger angle.",
  scene: "forest",
  kind: "row",
  figW: 17,
  hint: "Look only at how wide the mouth opens, not at how long the jaws are.",
  tag: "longer_rays_bigger_angle",
  rounds: [
    { say: "Put the angles in order from the smallest opening to the widest.", seq: "~ang:25 ~ang:70:s ~ang:120:s", trap: "~ang:70:s ~ang:120:s ~ang:25", why: "The long one has long sides, but its opening is the narrowest.", win: "Narrow, wider, widest." },
    { say: "Order four angles from the smallest opening to the widest.", seq: "~ang:20 ~ang:50:s ~ang:90 ~ang:140:s", trap: "~ang:50:s ~ang:140:s ~ang:20 ~ang:90", why: "Short sides can still open wide. Compare the openings only.", win: "You looked at the opening." },
    { say: "Order these by yourself.", alt: [{ seq: "~ang:15 ~ang:60:s ~ang:100 ~ang:150:s", trap: "~ang:60:s ~ang:150:s ~ang:15 ~ang:100" }, { seq: "~ang:30 ~ang:45:s ~ang:80 ~ang:130:s", trap: "~ang:45:s ~ang:130:s ~ang:30 ~ang:80" }] },
  ],
}));
