// Science Book Section. Skill RI.2.10-1.
// Reading and comprehending informational texts in the grades 2-3 complexity band. Avoiding longer nonfiction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Science Book Section",
  emoji: "🌋",
  premise: "A section of a science book packs in a lot. Read it with care, then check what it really said.",
  outro: "Read longer nonfiction slowly and check your understanding against the text.",
  scene: "sand",
  kind: "sort",
  hint: "Go back to the section. Does it say that?",
  tag: "does_not_check_text",
  rounds: [
    { say: "Read the section. Which things does it say?", read: "Deep under the ground, rock gets so hot that it melts. This melted rock is called magma. When it pushes out of a volcano, it is called lava.", bins: "The text says it|It does not", items: ["Melted rock is called magma.|Lava comes out of a volcano.", "Lava is made of water.|Magma is cold."], trap: ["Magma is cold.", 0], why: "The text says the rock is so hot it melts.", win: "You checked the text." },
    { say: "Read this section. Which things does it say?", read: "The moon does not make its own light. It shines because sunlight bounces off it. That is why we see different shapes as it moves.", bins: "The text says it|It does not", items: ["The moon reflects sunlight.|We see different shapes.", "The moon makes its own light.|The moon never moves."], trap: ["The moon makes its own light.", 0], why: "The first sentence says it does NOT make its own light.", win: "You read with care." },
    { say: "Read and sort by yourself.", read: "A magnet pulls on things made of iron. It does not pull on wood or plastic. Every magnet has two ends called poles.", bins: "The text says it|It does not", items: ["Magnets pull on iron.|A magnet has two poles.", "Magnets pull on wood.|A magnet has one pole."], trap: ["Magnets pull on wood.", 0] },
  ],
}));
