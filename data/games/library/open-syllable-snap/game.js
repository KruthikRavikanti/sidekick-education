// Open Syllable Snap. Skill RF.2.3-3.
// Decoding regularly spelled two-syllable words with long vowels. Breaking the word in the place that makes the vowel short is the known slip.
Sidekick.game(Sidekick.play({
  title: "Open Syllable Snap",
  emoji: "🐯",
  premise: "In words like tiger, the first part ends with a vowel that says its name. Snap the two parts together.",
  outro: "When a syllable ends in a vowel, the vowel is usually long: ti-ger, pa-per.",
  scene: "forest",
  kind: "row",
  fs: 7,
  hint: "Try the first part ending in the vowel. Say that vowel as its name.",
  tag: "breaks_in_the_other_place",
  rounds: [
    { say: "Snap two parts together to make the word for the picture.", pic: "🐯", seq: "ti ger", extra: "tig er", trap: "tig er", why: "Tig-er would say tigger. The first part is ti, with a long i.", win: "Ti and ger make tiger." },
    { say: "Make the word for this picture.", pic: "🎵", seq: "mu sic", extra: "mus ic", trap: "mus ic", why: "Mus-ic would say muss-ic. The first part is mu, with a long u.", win: "Mu and sic make music." },
    { say: "Make the word by yourself.", alt: [{ pic: "📄", seq: "pa per", extra: "pap er", trap: "pap er" }, { pic: "🤖", seq: "ro bot", extra: "rob ot", trap: "rob ot" }, { pic: "🕷️", seq: "spi der", extra: "spid er", trap: "spid er" }] },
  ],
}));
