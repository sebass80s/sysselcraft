export type BakeryStoryDialogueLine = {
  speaker: "Henning" | "Linus" | "Barnet";
  text: string;
  pauseAfter?: boolean;
};

/**
 * Locked emotional payoff for the Bakery restoration.
 * The child is a co-author of the change, not an audience member.
 */
export const bakeryCompletionDialogue: readonly BakeryStoryDialogueLine[] = [
  { speaker: "Henning", text: "Nå? Vad tycker du?" },
  { speaker: "Barnet", text: "Vi gjorde det!" },
  { speaker: "Henning", text: "Ja. Det gjorde vi faktiskt.", pauseAfter: true },
  { speaker: "Linus", text: "Först återvinningscentralen. Sedan fick du hit den där gamle bagaren. Och nu det här." },
  { speaker: "Henning", text: "Gamle?" },
  { speaker: "Linus", text: "Jag sa bagaren." },
  { speaker: "Henning", text: "Det gjorde du inte alls." },
  { speaker: "Henning", text: "När jag kom hit fanns det inget bageri. Jag hade faktiskt inte tänkt börja om heller." },
  { speaker: "Henning", text: "Men du fick den här platsen att kännas levande igen." },
  { speaker: "Henning", text: "Så det här bageriet finns här tack vare dig." },
  { speaker: "Barnet", text: "Vad ska vi baka först?" },
  { speaker: "Henning", text: "Nu börjar du låta som en riktig bybo." },
];
