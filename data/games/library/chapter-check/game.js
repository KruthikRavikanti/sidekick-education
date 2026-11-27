// Chapter Check. Skill RL.6.10-1.
// Reading and comprehending literature in the grades 6 to 8 complexity band. Avoiding complex texts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chapter Check",
  emoji: "📖",
  premise: "Strong readers keep track of a longer passage as they go: who, what they want, what stands in the way.",
  outro: "After reading, retell the key events in order in your own words.",
  scene: "forest",
  kind: "row",
  fs: 4.6,
  hint: "Go back to the passage. What happened first, next and last?",
  tag: "avoids_complex_text",
  rounds: [
    { say: "Read the passage. Put the summary in order.", read: "The compass had belonged to Wren’s great-aunt, a mapmaker who vanished in the northern hills. When its needle began to spin on its own, Wren followed it past the last farm. At dusk she reached a cabin with her great-aunt’s initials carved above the door.", seq: "The compass starts spinning.|Wren follows it into the hills.|She finds a cabin with the initials.", trap: "Wren follows it into the hills.|The compass starts spinning.|She finds a cabin with the initials.", why: "She only sets out after the needle begins to spin.", win: "Spin, follow, find." },
    { say: "Tap what Wren is trying to find out.", kind: "pick", read: "The compass had belonged to Wren’s great-aunt, a mapmaker who vanished in the northern hills. When its needle began to spin on its own, Wren followed it past the last farm.", yes: "what happened to her great-aunt|", no: "how to draw a map|where the last farm is|who sold the compass", trap: "how to draw a map", why: "The great-aunt drew maps. Wren is following the compass toward her.", win: "She is searching for her great-aunt." },
    { say: "Read this passage. Put the summary in order by yourself.", read: "Rain had fallen for six days when the levee cracked. Amaru woke the neighbors by beating a pot with a spoon. Together they stacked sandbags until sunrise, and the water stopped an arm’s length from the first house.", seq: "The levee cracks.|Amaru wakes the neighbors.|They stack sandbags and save the houses.", trap: "Amaru wakes the neighbors.|The levee cracks.|They stack sandbags and save the houses." },
  ],
}));
