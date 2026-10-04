import type { Act2PurchaseProject } from "./act2PurchaseHandoff";

type Act2PurchaseItem = {
  price: number;
  gate: {
    title: string;
    text: string;
    detail: string;
  };
  shop: {
    icon: string;
    title: string;
    description: string;
    requirement: string;
  };
};

const DOCK_PRICE = 200;
const BOATHOUSE_PRICE = 200;
const MOTORBOAT_PRICE = 200;

/**
 * Canonical Act 2 purchase presentation.
 *
 * This catalog owns client-side display copy and display prices only.
 * Backend Story Shop remains authoritative for purchase execution, wallet
 * mutation and owned world flags.
 */
export const ACT2_PURCHASE_CATALOG: Record<Act2PurchaseProject, Act2PurchaseItem> = {
  dock: {
    price: DOCK_PRICE,
    gate: {
      title: "Bryggan · nästa steg",
      text: "Sol vill att ni skaffar en riktig livboj innan arbetet fortsätter.",
      detail: `Mira kan ordna den i lanthandeln för ${DOCK_PRICE} SysselBux.`,
    },
    shop: {
      icon: "🛟",
      title: "Livboj till bryggan",
      description: "Sol vill att badplatsen har en riktig livboj innan ni fortsätter.",
      requirement: "⭐ Behövs till Bryggan",
    },
  },
  boathouse: {
    price: BOATHOUSE_PRICE,
    gate: {
      title: "Båthuset · nästa steg",
      text: "Lådbilen behöver en riktig ratt innan ni kan bygga vidare.",
      detail: `Mira har en som passar för ${BOATHOUSE_PRICE} SysselBux.`,
    },
    shop: {
      icon: "🛞",
      title: "Ratt till lådbilen",
      description: "Den sista delen Alve behöver för att kunna bygga lådbilen.",
      requirement: "⭐ Behövs till Båthuset",
    },
  },
  motorboat: {
    price: MOTORBOAT_PRICE,
    gate: {
      title: "Motorbåten · nästa steg",
      text: "Linus har konstaterat att några delar inte går att rädda.",
      detail: `Mira kan beställa reservdelspaketet för ${MOTORBOAT_PRICE} SysselBux.`,
    },
    shop: {
      icon: "📦",
      title: "Reservdelspaket till motorbåten",
      description: "Delarna Linus behöver för att arbetet ska kunna fortsätta.",
      requirement: "⭐ Behövs till Motorbåten",
    },
  },
};
