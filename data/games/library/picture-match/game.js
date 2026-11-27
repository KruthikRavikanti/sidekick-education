// Picture Match. Skill RL.K.7-1.
// Describing the relationship between illustrations and the story: each sentence is matched to the picture that shows it. Describing pictures without linking them to the words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Picture Match",
  emoji: "🖼️",
  premise: "The pictures in a book show what the words are telling. Match each picture to its part of the story.",
  outro: "A picture shows a moment from the story. Link it to the words.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Read the words. Which picture shows that?",
  tag: "does_not_link_picture_to_words",
  rounds: [
    { say: "Give each sentence its picture.", rows: [["Tim fed the ducks.", "🦆"], ["Mom drove the car.", "🚗"], ["Jo flew a kite.", "🪁"]], extra: "🐄", trap: [0, "🐄"], why: "The words say ducks. Find the duck.", win: "Each picture shows its words." },
    { say: "Match these.", rows: [["The king had a gold crown.", "👑"], ["It rained all day.", "🌧️"], ["The baby went to sleep.", "😴"]], extra: "☀️", trap: [1, "☀️"], why: "The words say it rained. Find the rain.", win: "Words and pictures go together." },
    { say: "Match these by yourself.", rows: [["A bee sat on a flower.", "🐝"], ["Dad made a hot pizza.", "🍕"], ["The moon came out.", "🌙"]], extra: "🦋 🍰", trap: [0, "🦋"] },
  ],
}));
