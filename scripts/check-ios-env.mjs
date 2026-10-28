import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), false);

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length > 0) {
  console.error("[ios:sync] Stopped: missing Supabase public build configuration: " + missing.join(", "));
  console.error("[ios:sync] Add the values to .env.local (not to Git), then rerun npm run ios:sync.");
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
} catch {
  console.error("[ios:sync] Stopped: NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  process.exit(1);
}
if (parsed.protocol !== "https:" || !parsed.hostname) {
  console.error("[ios:sync] Stopped: NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.");
  process.exit(1);
}

console.log("[ios:sync] Supabase public configuration present. Values not printed.");
