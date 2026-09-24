export type SolStoryLine = { speaker: "Sol" | "Barnet"; text: string };

export const bottleMessageDialogue: readonly SolStoryLine[] = [
  { speaker: "Barnet", text: "Hej! Vi bor i en liten by. Här finns Linus, Henning, Mira och jag." },
  { speaker: "Barnet", text: "Det börjar bli fint här igen. Du får gärna komma och hälsa på!" },
  { speaker: "Barnet", text: "Undrar vem som hittar den." },
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
