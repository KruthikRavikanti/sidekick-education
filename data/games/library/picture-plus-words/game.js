// Picture Plus Words. Skill RL.1.7-1.
// Using illustrations and details in a story to describe its characters, setting or events. Using the pictures only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Picture Plus Words",
  emoji: "😢",
  premise: "Use the picture AND the words together. The two of them tell you how a character feels.",
  outro: "Use both the picture and the words to understand the story.",
  scene: "candy",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Look at the face. Then read what happened.",
  tag: "uses_pictures_only",
  rounds: [
    { say: "How does each character feel?", rows: [["😢 Ben dropped his ice cream.", "sad"], ["😀 Ana got a new bike.", "happy"], ["😨 Tim heard a loud bang.", "scared"]], extra: "sleepy", trap: [2, "sleepy"], why: "Look at his face, and read about the loud bang.", win: "Sad, happy and scared." },
    { say: "How does each character feel?", rows: [["😠 Someone took the toy from Max.", "angry"], ["😴 Lily stayed up too late.", "tired"], ["😲 A rabbit hopped out of the hat.", "surprised"]], extra: "hungry", trap: [0, "hungry"], why: "Look at his face, and read what happened to his toy.", win: "Angry, tired and surprised." },
    { say: "Work these out by yourself.", rows: [["🥶 Jo forgot her coat in the snow.", "cold"], ["🤩 Sam saw the fireworks.", "amazed"], ["😟 Pam cannot find her puppy.", "worried"]], extra: "proud bored", trap: [2, "bored"] },
  ],
}));
