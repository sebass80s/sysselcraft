export type MiraStoryLine = { speaker: "Mira" | "Henning" | "Linus" | "Barnet"; text: string };

export const MIRA_ARRIVAL_SCENE_2_START = 11;

export const miraArrivalDialogue: readonly MiraStoryLine[] = [
  { speaker: "Mira", text: "Okej. Vem är ansvarig för det här?" },
  { speaker: "Henning", text: "För vad?" },
  { speaker: "Mira", text: "Jag var på väg någon helt annanstans. Sedan började det lukta nybakat bröd." },
  { speaker: "Henning", text: "Då verkar bageriet fungera precis som det ska." },
  { speaker: "Mira", text: "Det fungerade. Jag köpte tre bullar." },
  { speaker: "Henning", text: "Bara tre? Då får jag tydligen anstränga mig lite mer." },
  { speaker: "Barnet", text: "Jag heter [barnets namn]." },
  { speaker: "Mira", text: "Mira. Trevligt att träffas." },
  { speaker: "Henning", text: "Det är faktiskt [barnets namn] du borde tacka." },
  { speaker: "Mira", text: "För bullarna?" },
  { speaker: "Henning", text: "För bageriet." },

  { speaker: "Mira", text: "Vänta lite. Vad är det här?" },
  { speaker: "Barnet", text: "Den gamla lanthandeln." },
  { speaker: "Mira", text: "Är den tom?" },
  { speaker: "Barnet", text: "Sedan flera år." },
  { speaker: "Mira", text: "Jag behöver en kofot." },
  { speaker: "Barnet", text: "En kofot?" },
  { speaker: "Mira", text: "Och virke. Färg. Några nya fönster. Takpannor." },
  { speaker: "Barnet", text: "Det där huset håller på att falla ihop." },
  { speaker: "Mira", text: "Nej. Delar av det håller på att falla ihop. Det är en viktig skillnad." },
  { speaker: "Barnet", text: "Kan du laga det?" },
  { speaker: "Mira", text: "Japp." },
  { speaker: "Barnet", text: "Ska du stanna här?" },
  { speaker: "Mira", text: "Jag tänkte faktiskt bara köpa bullar." },
  { speaker: "Mira", text: "Men nu har jag hittat något som behöver lagas." },
  { speaker: "Mira", text: "Nästa gång du ser den här gamla ruckelhögen tänker jag att den ska vara en affär igen." },
];
