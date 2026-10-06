import type { Act2PurchaseProject } from "./act2PurchaseHandoff";
import type { StoryPurchaseDefinition } from "../runtime/purchase/storyPurchaseFlow";

export type Act2StoryPurchaseId =
  | "act2_jetty_lifebuoy"
  | "act2_boathouse_steering_wheel"
  | "act2_motorboat_parts";

type Act2PurchaseItem = StoryPurchaseDefinition<Act2PurchaseProject, Act2StoryPurchaseId>;

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
    id: "act2_jetty_lifebuoy",
    target: "dock",
    currency: "sysselbux",
    price: DOCK_PRICE,
    presentation: {
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
  },
  boathouse: {
    id: "act2_boathouse_steering_wheel",
    target: "boathouse",
    currency: "sysselbux",
    price: BOATHOUSE_PRICE,
    presentation: {
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
  },
  motorboat: {
    id: "act2_motorboat_parts",
    target: "motorboat",
    currency: "sysselbux",
    price: MOTORBOAT_PRICE,
    presentation: {
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
  },
};
