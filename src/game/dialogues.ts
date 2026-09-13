export type IntroDialogueStep =
  | { kind: "line"; speaker: "Linus" | "Barnet"; text: string }
  | { kind: "reveal-dog" }
  | { kind: "name-dog" };

export const linusIntroDialogue: IntroDialogueStep[] = [
  { kind: "line", speaker: "Linus", text: "Så det är ni som har flyttat in i gamla huset! Det var minsann på tiden att det lyste i fönstren där igen." },
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
];
