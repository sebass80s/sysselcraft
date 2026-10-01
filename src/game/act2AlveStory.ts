export type Act2AlveDialogueBeat = {
  speaker?: "child" | "unknown" | "alve";
  text: string;
  nameReveal?: boolean;
};

const MEETING_ALVE_BASE = "/assets/village/story-moments/act2/meeting-alve";

export function act2AlveImageForIndex(index: number) {
  if (index <= 8) return `${MEETING_ALVE_BASE}/first-hello.png`;
  if (index <= 28) return `${MEETING_ALVE_BASE}/a-lot-of-work.png`;
  if (index <= 38) return `${MEETING_ALVE_BASE}/new-friend.png`;
  if (index <= 50) return `${MEETING_ALVE_BASE}/alve-shows.png`;
  return `${MEETING_ALVE_BASE}/new-friend.png`;
}

export const ACT2_ALVE_DIALOGUE: Act2AlveDialogueBeat[] = [
  { speaker: "child", text: "Hej." },
  { text: "Pojken vid stugan rycker till och vänder sig om. Han håller fortfarande en lös bräda i handen." },
  { speaker: "child", text: "Är det din cykel där borta?" },
  { speaker: "unknown", text: "Ja." },
  { text: "Han tittar förbi dig mot Valpen." },
  { speaker: "unknown", text: "Kom du från byn?" },
  { speaker: "child", text: "Hunden sprang hit. Jag sprang efter." },
  { text: "Pojken nickar mot Valpen." },
  { speaker: "unknown", text: "Han hittade rätt väg i alla fall." },
  { text: "Du tittar på stugan. En del plankor har flyttats, några verktyg ligger utspridda på marken och det syns tydligt att någon har försökt börja laga den." },
  { speaker: "child", text: "Försöker du fixa den här själv?" },
  { speaker: "unknown", text: "Ja. Jag tänkte börja med väggen, sedan taket och sedan resten." },
  { text: "Du tittar på det trasiga räcket, den sneda dörren och brädorna som ligger bredvid." },
  { speaker: "child", text: "Det är ganska mycket ‘resten’." },
  { speaker: "unknown", text: "Jag har märkt det." },
  { text: "Han lägger ifrån sig brädan." },
  { speaker: "unknown", text: "Det här är min familjs ställe. Vi brukade vara här på somrarna." },
  { speaker: "child", text: "Brukar ni inte vara här längre?" },
  { speaker: "unknown", text: "Nej." },
  { text: "Han säger det kort och börjar samla ihop verktygen." },
  { speaker: "unknown", text: "Så jag tänkte laga det." },
  { speaker: "child", text: "Hela stället?" },
  { speaker: "unknown", text: "Det var planen." },
  { text: "Du ser bort mot sjön. Bryggan är trasig. Båthuset lutar och längre bort står den gamla motorbåten." },
  { speaker: "child", text: "Det är inte bara stugan som är trasig." },
  { speaker: "unknown", text: "Jag vet." },
  { text: "För första gången ser han lite mindre säker ut." },
  { speaker: "unknown", text: "Jag trodde faktiskt inte att det var så här mycket." },
  { speaker: "child", text: "Jag kan hjälpa dig." },
  { text: "Han tittar på dig som om du sagt något oväntat." },
  { speaker: "unknown", text: "Varför?" },
  { speaker: "child", text: "För att du aldrig kommer bli klar själv." },
  { text: "Pojken höjer ögonbrynen." },
  { speaker: "unknown", text: "Det där var väldigt snällt sagt." },
  { speaker: "child", text: "Jag menade det snällt." },
  { text: "Han försöker hålla sig allvarlig, men börjar le." },
  { speaker: "child", text: "Jag heter {childName}." },
  { speaker: "unknown", text: "Alve.", nameReveal: true },
  { speaker: "alve", text: "Okej, {childName}. Om du verkligen tänker hjälpa till så behöver du se resten." },
  { text: "Alve börjar gå mot sjön och du följer efter. Han pekar först mot stugan." },
  { speaker: "alve", text: "Stugan är värst inuti. Jag har knappt börjat där." },
  { text: "Sedan mot bryggan." },
  { speaker: "alve", text: "Bryggan går nästan inte att använda längre." },
  { text: "Och sist mot båthuset." },
  { speaker: "alve", text: "Och båthuset är fullt med gammalt skräp." },
  { text: "Du tittar mot motorbåten." },
  { speaker: "child", text: "Och den?" },
  { speaker: "alve", text: "Den får vänta." },
  { speaker: "child", text: "Varför?" },
  { speaker: "alve", text: "För att vi inte ens har någonstans att laga den än. Båthuset måste fungera. Bryggan måste gå att använda. Och jag vill få ordning på stugan." },
  { text: "Han ser över platsen en gång till." },
  { speaker: "alve", text: "Jag tänkte göra allt själv." },
  { speaker: "child", text: "Det hade tagit hundra år." },
  { speaker: "alve", text: "Femtio." },
  { speaker: "child", text: "Minst hundra." },
  { text: "Alve funderar." },
  { speaker: "alve", text: "Okej. Åttio." },
  { text: "Du skrattar. Alve pekar ut de tre platserna igen." },
  { speaker: "alve", text: "Stugan. Bryggan. Båthuset." },
  { speaker: "alve", text: "Om vi ska göra det här tillsammans så börjar vi med en av dem." },
  { speaker: "alve", text: "Vad börjar vi med?" },
];
