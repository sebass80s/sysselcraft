export type DogHomeLine = { speaker: "Barnet" | "Hunden"; text: string };

export const dogHomeDialogues: DogHomeLine[][] = [
  [{ speaker:"Barnet", text:"Hej kompis! Hur är läget här då?" },{ speaker:"Hunden", text:"*viftar så mycket på svansen att hela rumpan följer med*" },{ speaker:"Barnet", text:"Jag tolkar det som ganska bra." }],
  [{ speaker:"Barnet", text:"Vem är världens bästa hund?" },{ speaker:"Hunden", text:"*sätter sig blixtsnabbt och tittar förväntansfullt*" },{ speaker:"Barnet", text:"Du hade svaret klart, ser jag." }],
  [{ speaker:"Barnet", text:"Vad har du gjort idag?" },{ speaker:"Hunden", text:"*tittar på barnet, sedan på en misstänkt grop i marken*" },{ speaker:"Barnet", text:"Jag frågar inte mer." }],
  [{ speaker:"Barnet", text:"Ska vi klia lite bakom öronen?" },{ speaker:"Hunden", text:"*lägger huvudet på sned och börjar vifta på svansen*" },{ speaker:"Barnet", text:"Tänkte väl det." }],
  [{ speaker:"Barnet", text:"Har du varit en duktig hund?" },{ speaker:"Hunden", text:"*tittar bort*" },{ speaker:"Barnet", text:"...vad har du gjort?" }],
  [{ speaker:"Barnet", text:"Är det där verkligen din boll?" },{ speaker:"Hunden", text:"*lägger tassen bestämt på bollen*" },{ speaker:"Barnet", text:"Okej. Din boll." }],
  [{ speaker:"Barnet", text:"Du har det ganska mysigt här nu." },{ speaker:"Hunden", text:"*snurrar ett varv i bädden och lägger sig mitt i den*" },{ speaker:"Barnet", text:"Det där betyder ja." }],
  [{ speaker:"Barnet", text:"Vill du ha ett ben?" },{ speaker:"Hunden", text:"*öronen åker upp direkt*" },{ speaker:"Barnet", text:"Fascinerande hörsel du har när det passar." }],
  [{ speaker:"Barnet", text:"Vet du vad vi ska göra imorgon?" },{ speaker:"Hunden", text:"*kommer springande med leksaken i munnen*" },{ speaker:"Barnet", text:"Tydligen samma sak som idag." }],
  [{ speaker:"Barnet", text:"God natt, kompis." },{ speaker:"Hunden", text:"*lägger nosen mellan framtassarna och tittar upp*" },{ speaker:"Barnet", text:"Jag kommer tillbaka snart." }],
];

export type DogHomeStage = 0 | 1 | 2 | 3 | 4;

// Keep ambient dialogue consistent with what the child can actually see.
// Stage 1 adds the bed. Stage 3 adds toys/ball. The remaining lines are safe at every stage.
export function dogHomeDialogueIndicesForStage(stage: DogHomeStage): number[] {
  const safe = [0, 1, 2, 3, 4, 7, 9];
  if (stage >= 1) safe.push(6);
  if (stage >= 3) safe.push(5, 8);
  return safe;
}

export function chooseDogHomeDialogue(stage: DogHomeStage, lastDialogue?: number, random = Math.random): number {
  const eligible = dogHomeDialogueIndicesForStage(stage);
  const alternatives = eligible.filter((index) => index !== lastDialogue);
  const pool = alternatives.length > 0 ? alternatives : eligible;
  const position = Math.min(pool.length - 1, Math.floor(Math.max(0, Math.min(0.999999, random())) * pool.length));
  return pool[position];
}

export const dogHomeUpgradeDialogues: Record<1|2|3|4, DogHomeLine[]> = {
  1:[{speaker:"Barnet",text:"Titta! En alldeles egen säng!"},{speaker:"Hunden",text:"*kastar sig ner i bädden och börjar bädda runt med tassarna*"},{speaker:"Barnet",text:"Japp. Den är godkänd."}],
  2:[{speaker:"Barnet",text:"Nu har du fått egna skålar också."},{speaker:"Hunden",text:"*undersöker matskålen mycket noggrant*"},{speaker:"Barnet",text:"Vattnet var tydligen mindre spännande."}],
  3:[{speaker:"Barnet",text:"Jag köpte några leksaker till dig!"},{speaker:"Hunden",text:"*griper genast en leksak och rusar iväg*"},{speaker:"Barnet",text:"Varsågod, antar jag."}],
  4:[{speaker:"Barnet",text:"Kolla på ditt ställe nu!"},{speaker:"Hunden",text:"*kryper ner bland sina saker och suckar nöjt*"},{speaker:"Barnet",text:"Du har det nästan bättre än jag."}],
};
