// Yes, Friend, Right?. Skill L.5.2-3.
// Using commas to set off yes and no, tag questions and direct address. Leaving them out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Yes, Friend, Right?",
  emoji: "🙋",
  premise: "Commas set off yes and no, a name you are speaking to, and a little question tagged on the end.",
  outro: "Use commas after yes or no, around a name in direct address, and before a tag question.",
  scene: "candy",
  kind: "pick",
  hint: "Is there a yes or no, a name being spoken to, or a tag like isn’t it?",
  tag: "leaves_out_commas",
  rounds: [
    { say: "Tap the sentences with the commas in the right places.", yes: "Yes, I can come.|Sam, are you ready?", no: "Yes I can come.|Sam are you, ready?", trap: "Yes I can come.", why: "Yes at the start is set off with a comma.", win: "After yes, and after the name." },
    { say: "Tap the sentences with the commas in the right places.", yes: "It is cold, isn’t it?|No, thank you.", no: "It is cold isn’t it?|No thank, you.|It is, cold isn’t it?", trap: "It is cold isn’t it?", why: "A comma goes before the tag question isn’t it.", win: "Before the tag, and after no." },
    { say: "Tap the correct sentences by yourself.", yes: "Thank you, Maria, for your help.|You saw it too, didn’t you?", no: "Thank you Maria for your help.|You saw it too didn’t you?|Thank, you Maria for your help.", trap: "Thank you Maria for your help." },
  ],
}));
