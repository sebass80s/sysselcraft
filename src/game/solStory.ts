export type SolStoryLine = { speaker: "Sol" | "Barnet" | "Hunden"; text: string };

export const bottleMessageDialogue: readonly SolStoryLine[] = [
  { speaker: "Barnet", text: "Tror du någon kommer hitta brevet, {dogName}?" },
  { speaker: "Hunden", text: "Voff!" },
];

export const solArrivalDialogue: readonly SolStoryLine[] = [
  { speaker: "Sol", text: "Hej! Är det du som skickade det här?" },
  { speaker: "Barnet", text: "Flaskan?" },
  { speaker: "Sol", text: "Japp. Jag hittade den när jag försökte hitta tillbaka till vägen." },
  { speaker: "Sol", text: "Det gick sådär med vägen. Men brevet verkade veta vart jag skulle." },
  { speaker: "Barnet", text: "Är du doktor?" },
  { speaker: "Sol", text: "Japp. Alldeles ny faktiskt." },
  { speaker: "Barnet", text: "Vi har ingen doktor här." },
  { speaker: "Sol", text: "Ingen alls?" },
  { speaker: "Sol", text: "Jag skulle egentligen någon annanstans." },
  { speaker: "Sol", text: "Men jag tror att jag vill se mig omkring först." },
];
