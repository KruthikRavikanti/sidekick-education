// Quote It Exactly. Skill RL.5.1-1.
// Quoting accurately from a text when explaining what it says and when drawing inferences. Paraphrasing loosely or misquoting is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quote It Exactly",
  emoji: "❝",
  premise: "A quote uses the exact words from the text, inside quotation marks. Changing a word makes it a misquote.",
  outro: "Quote accurately: copy the exact words, and choose the part that proves your point.",
  scene: "paper",
  kind: "pick",
  hint: "Does it match the story word for word?",
  tag: "misquotes",
  rounds: [
    { say: "Why does Dev lie? Tap the accurate quote that shows it.", read: "Dev stared at the broken vase. \"I was afraid Mom would be angry,\" he admitted later, \"so I said the cat did it.\"", yes: "\"I was afraid Mom would be angry\"|", no: "\"I was scared Mom would yell\"|\"The cat did it because it was angry\"|\"Dev stared at the broken vase\"", trap: "\"I was scared Mom would yell\"", why: "Close, but those are not his exact words. A quote must match word for word.", win: "His exact words, and they answer the question." },
    { say: "How does Lena feel about the move? Tap the accurate quote that shows it.", read: "Lena pressed her face to the car window. \"Every tree here knows my name,\" she said softly.", yes: "\"Every tree here knows my name\"|", no: "\"All the trees know who I am\"|\"Lena pressed her face to the car window\"|\"I never liked those trees\"", trap: "\"All the trees know who I am\"", why: "That changes her words. Quote exactly.", win: "An exact quote that shows her feeling." },
    { say: "What shows the captain is worried? Tap the two accurate quotes by yourself.", read: "The captain studied the clouds. \"I have not seen a sky like that in thirty years,\" he muttered, and ordered the sails down.", yes: "\"I have not seen a sky like that in thirty years\"|\"ordered the sails down\"", no: "\"I have never seen a sky like this\"|\"The sails should stay up\"|\"That sky looks fine\"", trap: "\"I have never seen a sky like this\"" },
  ],
}));
