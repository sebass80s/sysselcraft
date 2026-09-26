export type IntroDialogueStep =
  | { kind: "line"; speaker: "Gubbe" | "Linus" | "Barnet"; text: string }
  | { kind: "name-child" }
  | { kind: "reveal-dog" }
  | { kind: "name-dog" };

export const linusIntroDialogue: IntroDialogueStep[] = [
  { kind: "line", speaker: "Gubbe", text: "Så det är ni som har flyttat in i gamla huset!" },
  { kind: "line", speaker: "Gubbe", text: "Det var minsann på tiden att det lyste i fönstren där igen." },
  { kind: "line", speaker: "Barnet", text: "Vem är du?" },
  { kind: "line", speaker: "Gubbe", text: "Linus heter jag. Jag har bott här så länge jag kan minnas." },
  { kind: "line", speaker: "Linus", text: "Och du då? Vad heter du?" },
  { kind: "name-child" },
  { kind: "line", speaker: "Linus", text: "{childName}. Det var ett bra namn. Välkommen till byn." },
  { kind: "line", speaker: "Barnet", text: "Bor det inte så många här?" },
  { kind: "line", speaker: "Linus", text: "Nej. Inte längre." },
  { kind: "line", speaker: "Linus", text: "Men förr... då var det annorlunda." },
  { kind: "line", speaker: "Linus", text: "Det luktade nybakat bröd om morgnarna. Folk stannade och pratade mitt på vägen. Och det var alltid någon som behövde hjälp med något." },
  { kind: "line", speaker: "Barnet", text: "Vad hände?" },
  { kind: "line", speaker: "Linus", text: "Tja. Folk flyttade. Hus blev tomma. En dag märkte man att det hade blivit väldigt tyst." },
  { kind: "line", speaker: "Linus", text: "Sådant händer långsamt. Man märker det nästan inte förrän det redan har hänt." },
  { kind: "line", speaker: "Barnet", text: "Är du ensam här?" },
  { kind: "line", speaker: "Linus", text: "Ensam? Nej då." },
  { kind: "line", speaker: "Linus", text: "Fast... det beror förstås på hur man räknar." },
  { kind: "line", speaker: "Linus", text: "Jag har faktiskt haft sällskap av någon som är betydligt bättre på att springa än jag är." },
  { kind: "reveal-dog" },
  { kind: "line", speaker: "Barnet", text: "En hund!" },
  { kind: "line", speaker: "Linus", text: "Jajamän. Den här lilla rackaren dök upp för ett tag sedan och bestämde tydligen att jag behövde sällskap." },
  { kind: "line", speaker: "Linus", text: "Problemet är att de där benen vill springa från morgon till kväll." },
  { kind: "line", speaker: "Linus", text: "Mina ben har andra åsikter." },
  { kind: "line", speaker: "Barnet", text: "Är den din?" },
  { kind: "line", speaker: "Linus", text: "Nja. Jag tror inte den har bestämt sig för vem den hör ihop med än." },
  { kind: "line", speaker: "Linus", text: "Men den har varit väldigt nyfiken på gamla huset sedan ni kom." },
  { kind: "line", speaker: "Linus", text: "Vill du hälsa?" },
  { kind: "name-dog" },
  { kind: "line", speaker: "Linus", text: "{dogName}." },
  { kind: "line", speaker: "Linus", text: "Ja... det tror jag den gillar." },
  { kind: "line", speaker: "Barnet", text: "Får den följa med mig?" },
  { kind: "line", speaker: "Linus", text: "Det var nog precis det den tänkte göra, oavsett vad jag svarade." },
  { kind: "line", speaker: "Linus", text: "Ta hand om varandra, ni två." },
  { kind: "line", speaker: "Barnet", text: "Tror du det kommer flytta hit fler någon gång?" },
  { kind: "line", speaker: "Linus", text: "Det vet jag inte, {childName}." },
  { kind: "line", speaker: "Linus", text: "Men i morse lyste det i ett fönster som varit mörkt väldigt länge." },
  { kind: "line", speaker: "Linus", text: "Det är en början." },
  { kind: "line", speaker: "Linus", text: "Gå hem och se hur ni har fått det nu. Jag tror det finns något där som behöver din hjälp." },
];


export type StoryMomentDialogueLine = {
  speaker: "Linus" | "Henning" | "Barnet";
  text: string;
};

export const henningArrivalDialogue: StoryMomentDialogueLine[] = [
  { speaker: "Henning", text: "Du ringde." },
  { speaker: "Linus", text: "Och du kom! Det var på tiden." },
  { speaker: "Henning", text: "Du sa att det började hända saker här igen." },
  { speaker: "Linus", text: "Det gör det. Du skulle sett byn för bara ett tag sedan." },
  { speaker: "Henning", text: "Jag måste erkänna att jag trodde du överdrev lite." },
  { speaker: "Linus", text: "Ha! Då känner du mig sämre än jag trodde." },
  { speaker: "Henning", text: "Det är verkligen fint att se dig igen, gamle vän." },
  { speaker: "Linus", text: "Detsamma, Henning. Verkligen." },
  { speaker: "Henning", text: "Och det här måste vara den som satt fart på hela byn." },
  { speaker: "Barnet", text: "Jag?" },
  { speaker: "Linus", text: "Jajamän. Det har hänt mer här sedan du kom än på väldigt länge." },
  { speaker: "Henning", text: "Linus berättade om allt som börjat hända här. Till slut blev jag för nyfiken för att stanna hemma." },
  { speaker: "Linus", text: "Jag sa ju att du borde komma!" },
  { speaker: "Henning", text: "Och vet du vad? Jag tror faktiskt att jag stannar." },
];
