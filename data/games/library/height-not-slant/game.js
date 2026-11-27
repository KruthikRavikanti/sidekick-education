// Height Not Slant. Skill 6.G.A.1-2.
// Finding the area of any triangle with base and height. Using a slanted side as the height is the known slip.
Sidekick.game(Sidekick.play({
  title: "Height Not Slant",
  emoji: "🔺",
  premise: "A triangle is half of a rectangle with the same base and height. The height goes straight up, never along a slanted side.",
  outro: "Area of a triangle = half × base × height. The height meets the base at a right angle.",
  scene: "paper",
  kind: "type",
  hint: "Find the dashed line. That is the height.",
  tag: "slanted_side_as_height",
  rounds: [
    { say: "Key in the area of the triangle.", fig: { type: "poly", pts: [[8, 88], [92, 88], [38, 22]], sides: ["10", null, "5"], dash: [[38, 22, 38, 88, "4"]], v: [] }, ans: "20", trap: "25", trap2: "40", why: "5 is a slanted side. The height is the dashed line: 4.", why2: "That is the whole rectangle. A triangle is half of it.", win: "Half of 10 × 4 = 20 square units." },
    { say: "Key in the area of this one.", fig: { type: "poly", pts: [[8, 88], [92, 88], [38, 22]], sides: ["8", null, "7.5"], dash: [[38, 22, 38, 88, "6"]], v: [] }, ans: "24", trap: "30", why: "7.5 is a slanted side. Use the dashed height, 6.", win: "Half of 8 × 6 = 24 square units." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "poly", pts: [[8, 88], [92, 88], [38, 22]], sides: ["12", null, "6.5"], dash: [[38, 22, 38, 88, "5"]], v: [] }, ans: "30", trap: "39" }, { fig: { type: "poly", pts: [[8, 88], [92, 88], [38, 22]], sides: ["6", null, "10"], dash: [[38, 22, 38, 88, "9"]], v: [] }, ans: "27", trap: "30" }, { fig: { type: "poly", pts: [[8, 88], [92, 88], [38, 22]], sides: ["14", null, "7"], dash: [[38, 22, 38, 88, "4"]], v: [] }, ans: "28", trap: "49" }] },
  ],
}));
