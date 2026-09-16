export type StoryDialogueLine = {
  speaker: "Linus" | "Barnet";
  text: string;
  pauseAfter?: boolean;
};

/**
 * Locked completion scene for the first Recycling arc.
 * This scene names Henning but deliberately does not spawn him or reveal the Bakery.
 */
export const recyclingCompletionDialogue: readonly StoryDialogueLine[] = [
  { speaker: "Barnet", text: "Linus! Kom och titta!" },
  { speaker: "Linus", text: "Jag ser, jag ser. Mina ben är gamla, inte ögonen." },
  { speaker: "Linus", text: "Där har vi den." },
  { speaker: "Barnet", text: "Var den så här förut?" },
  { speaker: "Linus", text: "Nej.", pauseAfter: true },
  { speaker: "Linus", text: "Den är bättre nu." },
  { speaker: "Linus", text: "Det var länge sedan den här delen av byn såg ut att behövas igen." },
  { speaker: "Barnet", text: "Vad menar du?" },
  { speaker: "Linus", text: "Folk bygger inte saker på platser de tänker överge.", pauseAfter: true },
  { speaker: "Linus", text: "Vet du... jag har faktiskt en gammal vän som brukade säga att han skulle flytta hit den dag det började hända saker igen." },
  { speaker: "Barnet", text: "Vem då?" },
  { speaker: "Linus", text: "Henning." },
  { speaker: "Barnet", text: "Tror du han kommer?" },
  { speaker: "Linus", text: "Ingen aning." },
  { speaker: "Linus", text: "Men jag kanske råkar ringa honom." },
];

export type StoryState = {
  recyclingCompletionSeen: boolean;
};

export function initialStoryState(): StoryState {
  return { recyclingCompletionSeen: false };
}

export function normalizeStoryState(value: unknown): StoryState {
  if (!value || typeof value !== "object") return initialStoryState();
  const candidate = value as Partial<StoryState>;
  return { recyclingCompletionSeen: candidate.recyclingCompletionSeen === true };
}

export function shouldOfferRecyclingCompletion(
  revealedRecyclingStage: number,
  story: StoryState,
): boolean {
  return revealedRecyclingStage >= 4 && !story.recyclingCompletionSeen;
}

export function markRecyclingCompletionSeen(story: StoryState): StoryState {
  return story.recyclingCompletionSeen ? story : { ...story, recyclingCompletionSeen: true };
}
