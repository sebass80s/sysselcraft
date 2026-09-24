export type SolStoryLine = { speaker: "Sol" | "Barnet" | "Hunden" | "Henning" | "Mira" | "Linus"; text: string };

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

export type SolTourStop = "bakery" | "shop" | "linus" | "decision";

export const solTourDialogue: Readonly<Record<SolTourStop, readonly SolStoryLine[]>> = {
  bakery: [
    { speaker: "Henning", text: "Välkommen! Jag är Henning." },
    { speaker: "Sol", text: "Sol. Jag råkade hitta hit via en flaskpost." },
    { speaker: "Henning", text: "Det är ungefär så de bästa sakerna börjar här." },
    { speaker: "Sol", text: "Så bageriet är nytt?" },
    { speaker: "Henning", text: "Nytt och gammalt på samma gång. Byn vaknar igen." },
  ],
  shop: [
    { speaker: "Mira", text: "Så du hittade hit också!" },
    { speaker: "Sol", text: "Jag hittade en flaska först. Resten är en lång historia." },
    { speaker: "Mira", text: "Det brukar vara så här. Man tänker att man bara ska förbi..." },
    { speaker: "Mira", text: "...och plötsligt har man en butik." },
    { speaker: "Sol", text: "Det låter farligt." },
    { speaker: "Mira", text: "Väldigt. Vill du ha kaffe?" },
    { speaker: "Sol", text: "Först ett bageri. Nu en lanthandel. Det känns inte som en övergiven by längre." },
  ],
  linus: [
    { speaker: "Linus", text: "Så det är du som följde flaskan hit. Välkommen, Sol." },
    { speaker: "Sol", text: "Tack. Men du, hur är det med knät?" },
    { speaker: "Linus", text: "Det där? Äsch. Det har knarrat längre än brunnen." },
    { speaker: "Sol", text: "Knän ska helst inte konkurrera med brunnar." },
    { speaker: "Barnet", text: "Vi har ju ingen doktor här." },
    { speaker: "Linus", text: "Nej. Det är en av de saker byn fortfarande saknar." },
  ],
  decision: [
    { speaker: "Sol", text: "Jag skulle egentligen bara hälsa på." },
    { speaker: "Sol", text: "Men ni verkar bygga något fint här." },
    { speaker: "Sol", text: "Och om ni ändå inte har någon doktor..." },
    { speaker: "Barnet", text: "Tänker du stanna?" },
    { speaker: "Sol", text: "Jag tror faktiskt det." },
    { speaker: "Linus", text: "Då vet jag kanske ett gammalt hus som kan få ett nytt jobb." },
  ],
};


export type ClinicCompletionLine = SolStoryLine & { scene: "complete" | "treatment" };

export const clinicCompletionDialogue: readonly ClinicCompletionLine[] = [
  { scene: "complete", speaker: "Sol", text: "Den är klar!" },
  { scene: "complete", speaker: "Sol", text: "Min alldeles egna klinik!" },
  { scene: "complete", speaker: "Barnet", text: "Den blev jättefin." },
  { scene: "complete", speaker: "Sol", text: "Visst blev den? Jag har redan ordnat allt där inne." },
  { scene: "complete", speaker: "Sol", text: "Fast det saknas förstås en sak." },
  { scene: "complete", speaker: "Barnet", text: "Vadå?" },
  { scene: "complete", speaker: "Sol", text: "Patienter." },
  { scene: "complete", speaker: "Linus", text: "Jaha, fint. Jag skulle bara gå förbi." },
  { scene: "complete", speaker: "Sol", text: "Linus! Perfekt." },
  { scene: "complete", speaker: "Linus", text: "Nej." },
  { scene: "complete", speaker: "Sol", text: "Jag har inte ens sagt något än." },
  { scene: "complete", speaker: "Linus", text: "Du tittar på mitt knä." },
  { scene: "complete", speaker: "Sol", text: "Kom in." },
  { scene: "complete", speaker: "Linus", text: "Knät är bra." },
  { scene: "complete", speaker: "Sol", text: "Du haltar." },
  { scene: "complete", speaker: "Linus", text: "Jag går lite snett." },
  { scene: "complete", speaker: "Sol", text: "In." },
  { scene: "treatment", speaker: "Linus", text: "Det här var fullständigt onödigt." },
  { scene: "treatment", speaker: "Sol", text: "Mhm." },
  { scene: "treatment", speaker: "Linus", text: "Jag har haft det där knät i många år." },
  { scene: "treatment", speaker: "Sol", text: "Det märks." },
  { scene: "treatment", speaker: "Linus", text: "Det har fungerat utmärkt." },
  { scene: "treatment", speaker: "Sol", text: "Du haltade hela vägen hit." },
  { scene: "treatment", speaker: "Linus", text: "Jag gick lite snett hela vägen hit." },
  { scene: "treatment", speaker: "Sol", text: "Så. Prova." },
  { scene: "treatment", speaker: "Linus", text: "…" },
  { scene: "treatment", speaker: "Barnet", text: "Nå?" },
  { scene: "treatment", speaker: "Linus", text: "Det känns faktiskt bättre." },
  { scene: "treatment", speaker: "Sol", text: "Vad sa du?" },
  { scene: "treatment", speaker: "Linus", text: "Ingenting." },
  { scene: "treatment", speaker: "Barnet", text: "Jag hörde." },
  { scene: "treatment", speaker: "Sol", text: "Första patienten!" },
  { scene: "treatment", speaker: "Linus", text: "Jag var aldrig patient." },
  { scene: "treatment", speaker: "Sol", text: "Självklart inte." },
  { scene: "treatment", speaker: "Linus", text: "Bra." },
  { scene: "treatment", speaker: "Sol", text: "Jag skriver \"mystisk förbipasserande som går lite snett\" i journalen." },
  { scene: "treatment", speaker: "Linus", text: "…jag går hem nu." },
];
