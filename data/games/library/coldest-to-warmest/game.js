// Coldest to Warmest. Skill 6.NS.C.7-2.
// Writing, interpreting and explaining statements of order for rational numbers in real-world contexts. Saying −3 degrees is colder than −7 degrees is the known slip.
Sidekick.game(Sidekick.play({
  title: "Coldest to Warmest",
  emoji: "🥶",
  premise: "The lower the temperature, the colder it is. A bigger number after the minus sign means colder.",
  outro: "In context, a more negative number means lower: −7 degrees is colder than −3 degrees.",
  scene: "snow",
  kind: "row",
  fs: 6,
  hint: "Picture a thermometer. Which reading is lowest?",
  tag: "reverses_negative_order",
  rounds: [
    { say: "Put the temperatures in order from coldest to warmest.", seq: "−7° −3° 0° 4°", trap: "−3° −7° 0° 4°", why: "−7 is farther below zero than −3, so it is colder.", win: "−7, −3, 0, 4." },
    { say: "Put the elevations in order from lowest to highest.", seq: "−50 −20 0 30", trap: "−20 −50 0 30", why: "50 feet below sea level is deeper than 20 feet below.", win: "The deepest comes first." },
    { say: "Order these by yourself, from least to greatest.", alt: [{ seq: "−12 −8 −1 5", trap: "−1 −8 −12 5" }, { seq: "−6.5 −6 −2 0", trap: "−6 −6.5 −2 0" }, { seq: "−30 −15 −10 20", trap: "−10 −15 −30 20" }] },
  ],
}));
