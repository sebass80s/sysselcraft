export type IntroDialogueStep =
  | { kind: "line"; speaker: "Linus" | "Barnet"; text: string }
  | { kind: "name-child" }
  | { kind: "reveal-dog" }
  | { kind: "name-dog" };

export const linusIntroDialogue: IntroDialogueStep[] = [
  { kind: "line", speaker: "Linus", text: "Så det är ni som har flyttat in i gamla huset! Det var minsann på tiden att det lyste i fönstren där igen." },
  { kind: "name-child" },
  { kind: "line", speaker: "Barnet", text: "Bor det inte så många här?" },
  { kind: "line", speaker: "Linus", text: "Inte längre. Förr bodde det folk överallt här. Det var liv och rörelse från morgon till kväll." },
  { kind: "line", speaker: "Linus", text: "Nu är det mest jag kvar. Så du anar inte hur glad jag är att se er." },
  { kind: "line", speaker: "Barnet", text: "Kanske flyttar det hit fler?" },
  { kind: "line", speaker: "Linus", text: "Det hoppas jag. Jag saknar tiden när det bodde mycket folk här. Det skulle vara fint att få lite liv i byn igen." },
  { kind: "line", speaker: "Linus", text: "Förresten... det är någon mer som har väntat på att ni skulle komma." },
  { kind: "reveal-dog" },
  { kind: "line", speaker: "Barnet", text: "En hund!" },
  { kind: "line", speaker: "Linus", text: "Jag har haft den här lilla rackaren hos mig ett tag. Men de där benen behöver betydligt fler promenader än mitt knä uppskattar." },
  { kind: "line", speaker: "Linus", text: "Jag tänkte att valpen kanske skulle trivas hos er." },
  { kind: "name-dog" },
  { kind: "line", speaker: "Linus", text: "Då så! Nu tycker jag att du ska gå bort till ert hus. Där väntar ditt första quest på dig." },
];


export type StoryMomentDialogueLine = {
  speaker: "Linus" | "Henning" | "Barnet";
  text: string;
};

export const henningArrivalDialogue: StoryMomentDialogueLine[] = [
  { speaker: "Henning", text: "Du ringde." },
  { speaker: "Linus", text: "Det händer ibland." },
  { speaker: "Henning", text: "Du sa att det började hända saker här igen." },
  { speaker: "Linus", text: "Jag överdrev tydligen inte." },
  { speaker: "Henning", text: "Nej. Det gjorde du faktiskt inte." },
  { speaker: "Linus", text: "Säg inte det för högt." },
  { speaker: "Henning", text: "Det är fint att se dig igen, gamle vän." },
  { speaker: "Linus", text: "Detsamma, Henning." },
  { speaker: "Henning", text: "Och det här måste vara den som satt fart på hela byn." },
  { speaker: "Barnet", text: "Jag?" },
  { speaker: "Linus", text: "Det har hänt mer här sedan du kom än på väldigt länge." },
  { speaker: "Henning", text: "Linus berättade om allt som börjat hända. Jag trodde först att han kryddade historien." },
  { speaker: "Linus", text: "Det gör jag aldrig." },
  { speaker: "Henning", text: "Precis därför var jag tvungen att komma och se själv." },
  { speaker: "Henning", text: "Och vet du vad? Jag tror faktiskt att jag stannar." },
];
