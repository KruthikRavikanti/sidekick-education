// Big Points in Two Articles. Skill RI.3.9-1.
// Comparing and contrasting the most important points and key details presented in two texts on the same topic. Comparing minor details is the known slip.
Sidekick.game(Sidekick.play({
  title: "Big Points in Two Articles",
  emoji: "🗞️",
  premise: "Two articles on one topic share big points. Compare the big points, not the tiny details.",
  outro: "Compare the most important points of two texts, not the small details.",
  scene: "desk",
  kind: "sort",
  hint: "Is that point made in both articles?",
  tag: "compares_minor_details",
  rounds: [
    { say: "Read about both articles. Sort the big points.", read: "Article 1: Sharks keep oceans healthy. Sharks are rarely a danger to people. / Article 2: Sharks keep oceans healthy. Too many sharks are being caught.", bins: "Both|Only article 1|Only article 2", items: ["Sharks keep oceans healthy.|", "Sharks rarely harm people.|", "Too many are being caught.|"], trap: ["Sharks keep oceans healthy.", 1], why: "Both articles make that point.", win: "One shared point, two different ones." },
    { say: "Sort the big points.", read: "Article 1: Solar power is clean. It costs a lot to set up. / Article 2: Solar power is clean. It does not work at night.", bins: "Both|Only article 1|Only article 2", items: ["Solar power is clean.|", "It costs a lot to set up.|", "It does not work at night.|"], trap: ["It does not work at night.", 0], why: "Only article 2 makes that point.", win: "You compared the big points." },
    { say: "Sort these by yourself.", read: "Article 1: Bikes are good exercise. Bikes cost less than cars. / Article 2: Bikes are good exercise. Bikes do not pollute.", bins: "Both|Only article 1|Only article 2", items: ["Bikes are good exercise.|", "Bikes cost less than cars.|", "Bikes do not pollute.|"], trap: ["Bikes are good exercise.", 1] },
  ],
}));
