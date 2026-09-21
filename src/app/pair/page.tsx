"use client";

import { FormEvent, useEffect, useState } from "react";
import { ensureChildAnonymousSession } from "@/backend/auth";
import { getPairedChildId, setPairedChildId } from "@/backend/childDeviceBinding";
import {
  getChildGameState,
  isChildDeviceBound,
  redeemChildPairingCode,
} from "@/backend/familyRepository";

function normalizePairingCode(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").slice(0, 8);
}

export default function PairChildPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Förbereder säker barnsession…");
  const [busy, setBusy] = useState(true);
  const [paired, setPaired] = useState(false);
  const [rePairing, setRePairing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      try {
        await ensureChildAnonymousSession();
        const childId = await getPairedChildId();
        if (cancelled) return;

        if (!childId) {
          setPaired(false);
          setMessage("");
          return;
        }

        const bound = await isChildDeviceBound(childId);
        if (cancelled) return;

        if (!bound) {
          setPaired(false);
          setRePairing(true);
          setMessage(
            "Den sparade barnkopplingen finns kvar på enheten, men backend-bindningen saknas. Skapa en ny parningskod i föräldraläget och koppla om enheten.",
          );
          return;
        }

        const backendState = await getChildGameState(childId);
        if (cancelled) return;

        if (backendState) {
          setPaired(true);
          setMessage("Den här enheten är redan kopplad till Sysselcraft. ✅");
          return;
        }

        setPaired(false);
        setRePairing(true);
        setMessage(
          "Barnkopplingen är registrerad, men barnets spelstatus kunde inte läsas. Skapa en ny parningskod i föräldraläget och koppla om enheten.",
        );
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Kunde inte starta barnsessionen.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void prepare();
    return () => {
      cancelled = true;
    };
  }, []);

  async function pair(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const childId = await redeemChildPairingCode(code);
      const bound = await isChildDeviceBound(childId);
      if (!bound) {
        throw new Error("Parningen skapades, men enhetsbindningen kunde inte bekräftas. Försök igen.");
      }

      const backendState = await getChildGameState(childId);
      if (!backendState) {
        throw new Error("Kopplingen skapades, men barnets spelstatus kunde inte läsas. Försök igen.");
      }

      await setPairedChildId(childId);
      setPaired(true);
      setRePairing(false);
      setMessage("Enheten är kopplad! 🎉 Du kan gå tillbaka till Sysselcraft.");
      setCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Parningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  const showPairingForm = !paired || rePairing;

  return (
    <main className="parent-page">
      <section className="parent-login">
        <span className="parent-menu-kicker">📱 Barnets enhet</span>
        <h1>Koppla Sysselcraft</h1>
        <p>
          På förälderns enhet: öppna föräldraläget, välj barnet och tryck <b>Koppla barnets enhet</b>.
          Skriv sedan den 8-teckenskod som visas där nedan. Koden gäller i 15 minuter och kan bara
          användas en gång.
        </p>

        {showPairingForm && (
          <form onSubmit={pair}>
            <input
              aria-label="Parningskod"
              value={code}
              onChange={(event) => setCode(normalizePairingCode(event.target.value))}
              maxLength={8}
              autoCapitalize="characters"
              autoComplete="one-time-code"
              autoCorrect="off"
              spellCheck={false}
              placeholder="8 tecken"
              required
            />
            <button className="primary-button" disabled={busy || code.length !== 8}>
              {rePairing ? "Koppla om enheten" : "Koppla enheten"}
            </button>
          </form>
        )}

        {paired && !rePairing && (
          <button
            className="secondary-button"
            type="button"
            disabled={busy}
            onClick={() => {
              setCode("");
              setMessage(
                "Skriv den nya parningskoden. Den gamla kopplingen behålls tills en ny kod godkänns.",
              );
              setRePairing(true);
            }}
          >
            Koppla om till ett annat barn
          </button>
        )}

        {paired && rePairing && (
          <button
            className="secondary-button compact"
            type="button"
            disabled={busy}
            onClick={() => {
              setCode("");
              setRePairing(false);
              setMessage("Den befintliga kopplingen är kvar. ✅");
            }}
          >
            Avbryt omkoppling
          </button>
        )}

        {message && <p className="parent-status-message">{message}</p>}
        <a href="/">← Tillbaka till byn</a>
      </section>
    </main>
  );
}
