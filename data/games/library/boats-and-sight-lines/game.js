// Boats and Sight Lines. Skill G-SRT.D.11-2.
// Applying the Law of Sines and the Law of Cosines in surveying and force problems. Using an angle that is not the included one is the known slip.
Sidekick.game(Sidekick.play({
  title: "Boats and Sight Lines",
  emoji: "🚤",
  premise: "Surveyors and sailors measure two distances and the angle between them. The Law of Cosines gives the distance they cannot reach.",
  outro: "Draw the triangle, mark the included angle, then use c^2 = a^2 + b^2 − 2ab cos C.",
  scene: "ocean",
  kind: "type",
  icon: "🚤",
  hint: "The angle you need is the one between the two known distances.",
  tag: "uses_other_angle",
  rounds: [
    { say: "Two boats leave a dock at a 60° angle and travel 5 miles and 8 miles. Key in how far apart they are.", q: "c^2 = 25 + 64 − 2(5)(8)(0.5)", ans: 7, trap: 13, why: "They did not sail in opposite directions. Use the Law of Cosines: 89 − 40.", win: "√49 = 7 miles." },
    { say: "Set up the triangle before you compute.", kind: "fill", fs: 5, cast: "", rows: [["the angle to use is", "between the two known sides"], ["the side you find is", "opposite that angle"]], extra: "any angle in the triangle|", trap: [0, "any angle in the triangle"], why: "The formula needs the angle formed by the two sides you know.", win: "Two sides and the angle they make." },
    { say: "Find the distance by yourself. cos 60° = 0.5 and cos 120° = −0.5.", alt: [{ q: "Two planes leave an airport 60° apart and fly 7 and 15 miles. How far apart are they?", ans: 13, trap: 22 }, { q: "A surveyor is 6 km and 16 km from two towers, with 60° between the sight lines. How far apart are the towers?", ans: 14, trap: 22 }, { q: "Two ships leave port 120° apart and sail 3 and 5 miles. How far apart are they?", ans: 7, trap: 8 }] },
  ],
}));
